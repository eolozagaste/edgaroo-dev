(function () {
  "use strict";

  var heroImages = [
    "images/banners/banner (1).jpg",
    "images/banners/banner (2).jpg",
    "images/banners/banner (3).jpg",
    "images/banners/banner (4).jpg",
    "images/banners/banner (5).jpg",
    "images/banners/banner (6).jpg",
    "images/banners/banner (7).jpg",
    "images/banners/banner (8).jpg"
  ];

  var menuItems = [
    { id: "classic", category: "burgers", name: "McEdgar Classic", price: 14.99, image: "images/burgers/mcedgars-classic.jpg", note: "Double stack, house sauce, pickles, toasted bun." },
    { id: "clucker", category: "burgers", name: "Crispy Clucker", price: 14.99, image: "images/burgers/chicken-sandwhich.jpg", note: "Crunchy chicken, slaw, and pepper sauce." },
    { id: "grilled-clucker", category: "burgers", name: "Grilled Clucker", price: 14.99, image: "images/burgers/grilled-chicken.jpg", note: "Char-grilled chicken with lemon herb spread." },
    { id: "bacon", category: "burgers", name: "Bacon Lovers Delight", price: 15.99, image: "images/burgers/bacon-lovers.jpg", note: "Smoky bacon, cheddar, and extra napkins." },
    { id: "protein", category: "burgers", name: "Ro'Tein Burger", price: 16.49, image: "images/burgers/protein-burger.jpg", note: "Big protein build with sweet potato wedge energy." },
    { id: "veggie", category: "burgers", name: "Veggie Burger", price: 13.99, image: "images/burgers/veggie-burger.jpg", note: "Plant-based patty, lettuce, tomato, and crunch." },
    { id: "cajun-fries", category: "sides", name: "Cajun Style Fries", price: 5.49, image: "images/sides/cajun-fries.jpg", note: "Seasoned hot and served crisp." },
    { id: "curly-fries", category: "sides", name: "Crispy Curly Fries", price: 5.99, image: "images/sides/curly-fries.jpg", note: "Curled, crunchy, and ready for sauce." },
    { id: "fries", category: "sides", name: "Classic French Fries", price: 4.99, image: "images/sides/french-fries.jpg", note: "Add to any burger for $2." },
    { id: "mac", category: "sides", name: "Homestyle Mac'N'Cheese", price: 6.99, image: "images/sides/mac.jpg", note: "Creamy, baked, and not shy." },
    { id: "onion-rings", category: "sides", name: "Onion Rings", price: 5.99, image: "images/sides/onion-rings.jpg", note: "Golden rings with ranch on standby." },
    { id: "wedges", category: "sides", name: "Sweet Potato Wedges", price: 5.49, image: "images/sides/sp-wedges.jpg", note: "Crisp edges, soft centers, smoky dip." },
    { id: "cocktails", category: "drinks", name: "House Cocktails", price: 9.99, image: "images/drinks/cocktails.jpg", note: "For guests 21 and older." },
    { id: "lemonades", category: "drinks", name: "Refreshing Lemonades", price: 3.99, image: "images/drinks/lemonades.jpg", note: "Bright, cold, and refill-worthy." },
    { id: "sodas", category: "drinks", name: "Sodas", price: 2.49, image: "images/drinks/sodas.jpg", note: "Add to any burger for $1.49." },
    { id: "kid-burger", category: "kids", name: "Kid's Burger Meal", price: 8.99, image: "images/kids/burger-kid.jpg", note: "Burger, small fries, and a drink." },
    { id: "kid-clucker", category: "kids", name: "Kid's Clucker Meal", price: 8.99, image: "images/kids/fried-chicken-kids.jpg", note: "Crispy chicken, fries, and a drink." },
    { id: "kid-grilled", category: "kids", name: "Kid's Grilled Clucker Meal", price: 8.99, image: "images/kids/grilled-chicken-kids.jpg", note: "Grilled chicken with a softer landing." },
    { id: "kid-mac", category: "kids", name: "Kid's Mac Meal", price: 7.99, image: "images/kids/mac-kids.webp", note: "Spoons are strongly encouraged." },
    { id: "kid-nuggets", category: "kids", name: "Kid's Nugget Meal", price: 7.99, image: "images/kids/nuggets-kids.jpg", note: "Nuggets, fries, and a small drink." },
    { id: "kid-tenders", category: "kids", name: "Kid's Tender Meal", price: 8.49, image: "images/kids/tenders-kids.jpg", note: "Tenders with dipping sauce." },
    { id: "caramel-shake", category: "desserts", name: "Caramel Frappe Shake", price: 6.99, image: "images/deserts/caramel-shake.jpg", note: "Cold caramel, whipped top, dessert energy." },
    { id: "choco-cake", category: "desserts", name: "Choco-Coco Cake", price: 5.99, image: "images/deserts/choco-cake.jpg", note: "Chocolate cake with coconut attitude." },
    { id: "cookies", category: "desserts", name: "McGrandma's Cookies", price: 3.99, image: "images/deserts/homemade-cookies.jpg", note: "Warm cookies, allegedly homemade." },
    { id: "oreo-shake", category: "desserts", name: "McOreo Shake", price: 6.49, image: "images/deserts/oreo-shake.jpg", note: "Cookie shake with serious crunch." },
    { id: "straw-cake", category: "desserts", name: "StrawVERY Cake", price: 5.99, image: "images/deserts/straw-cake.jpg", note: "Berry cake with extra berry confidence." },
    { id: "strawnana", category: "desserts", name: "StrawNana Shake", price: 6.49, image: "images/deserts/straw-nana-shake.jpg", note: "Strawberry and banana in shake form." }
  ];

  var state = {
    category: "all",
    search: "",
    tray: loadTray()
  };

  document.addEventListener("DOMContentLoaded", function () {
    initHero();
    initMenu();
    initForms();
    updateTray();
  });

  function initHero() {
    var heroImage = document.getElementById("hero-image");
    var dots = document.getElementById("hero-dots");
    var activeIndex = 0;

    if (!heroImage) {
      return;
    }

    heroImages.forEach(function (src, index) {
      var image = new Image();
      image.src = src;

      if (dots) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "hero-dot" + (index === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Show featured item " + (index + 1));
        dot.addEventListener("click", function () {
          activeIndex = index;
          setHeroImage(heroImage, dots, activeIndex);
        });
        dots.appendChild(dot);
      }
    });

    window.setInterval(function () {
      activeIndex = (activeIndex + 1) % heroImages.length;
      setHeroImage(heroImage, dots, activeIndex);
    }, 4000);
  }

  function setHeroImage(heroImage, dots, index) {
    heroImage.classList.add("is-changing");

    window.setTimeout(function () {
      heroImage.src = heroImages[index];
      heroImage.classList.remove("is-changing");
    }, 180);

    if (dots) {
      dots.querySelectorAll(".hero-dot").forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }
  }

  function initMenu() {
    var grid = document.getElementById("menu-grid");
    var searchInput = document.getElementById("menu-search");
    var clearTrayButton = document.getElementById("clear-tray");

    if (!grid) {
      return;
    }

    document.querySelectorAll("[data-category]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.category = button.dataset.category;
        document.querySelectorAll("[data-category]").forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        renderMenu();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = searchInput.value.trim().toLowerCase();
        renderMenu();
      });
    }

    grid.addEventListener("click", function (event) {
      var button = event.target.closest("[data-add-item]");

      if (!button) {
        return;
      }

      addToTray(button.dataset.addItem);
      button.textContent = "Added";
      window.setTimeout(function () {
        button.textContent = "Add to tray";
      }, 900);
    });

    if (clearTrayButton) {
      clearTrayButton.addEventListener("click", function () {
        state.tray = {};
        saveTray();
        updateTray();
      });
    }

    renderMenu();
  }

  function renderMenu() {
    var grid = document.getElementById("menu-grid");
    var filteredItems;

    if (!grid) {
      return;
    }

    filteredItems = menuItems.filter(function (item) {
      var matchesCategory = state.category === "all" || item.category === state.category;
      var haystack = (item.name + " " + item.note + " " + item.category).toLowerCase();
      var matchesSearch = !state.search || haystack.indexOf(state.search) !== -1;

      return matchesCategory && matchesSearch;
    });

    if (filteredItems.length === 0) {
      grid.innerHTML = '<p class="empty-state wide">No menu items matched.</p>';
      return;
    }

    grid.innerHTML = filteredItems.map(renderMenuCard).join("");
  }

  function renderMenuCard(item) {
    return [
      '<article class="menu-card">',
      '  <img src="' + item.image + '" alt="' + item.name + '">',
      '  <div class="menu-card-body">',
      '    <span class="menu-category">' + categoryLabel(item.category) + '</span>',
      '    <div class="menu-card-title">',
      '      <h3>' + item.name + '</h3>',
      '      <strong>' + formatMoney(item.price) + '</strong>',
      '    </div>',
      '    <p>' + item.note + '</p>',
      '    <button class="secondary-button compact" type="button" data-add-item="' + item.id + '">Add to tray</button>',
      '  </div>',
      '</article>'
    ].join("");
  }

  function addToTray(itemId) {
    state.tray[itemId] = (state.tray[itemId] || 0) + 1;
    saveTray();
    updateTray();
  }

  function updateTray() {
    var trayCount = document.getElementById("tray-count");
    var trayItems = document.getElementById("tray-items");
    var trayTotal = document.getElementById("tray-total");
    var itemIds = Object.keys(state.tray);
    var count = itemIds.reduce(function (total, id) {
      return total + state.tray[id];
    }, 0);
    var total = itemIds.reduce(function (sum, id) {
      var item = findItem(id);
      return item ? sum + item.price * state.tray[id] : sum;
    }, 0);

    if (trayCount) {
      trayCount.textContent = String(count);
    }

    if (trayTotal) {
      trayTotal.textContent = formatMoney(total);
    }

    if (!trayItems) {
      return;
    }

    if (count === 0) {
      trayItems.innerHTML = '<p class="empty-state">No items yet.</p>';
      return;
    }

    trayItems.innerHTML = itemIds.map(function (id) {
      var item = findItem(id);

      if (!item) {
        return "";
      }

      return '<div class="tray-item"><span>' + item.name + '</span><strong>x' + state.tray[id] + '</strong></div>';
    }).join("");
  }

  function initForms() {
    document.querySelectorAll("[data-feedback-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var message = form.querySelector("[data-form-message]");

        event.preventDefault();
        form.reset();

        if (message) {
          message.textContent = "Thanks. Your note is on the counter.";
        }
      });
    });
  }

  function findItem(id) {
    return menuItems.find(function (item) {
      return item.id === id;
    });
  }

  function categoryLabel(category) {
    return {
      burgers: "Burger",
      sides: "Side",
      drinks: "Drink",
      kids: "Kids",
      desserts: "Dessert"
    }[category] || "Item";
  }

  function formatMoney(value) {
    return "$" + value.toFixed(2);
  }

  function loadTray() {
    var storedTray;

    try {
      storedTray = JSON.parse(window.localStorage.getItem("mcEdgarsTray")) || {};
      return storedTray && typeof storedTray === "object" && !Array.isArray(storedTray) ? storedTray : {};
    } catch (error) {
      return {};
    }
  }

  function saveTray() {
    try {
      window.localStorage.setItem("mcEdgarsTray", JSON.stringify(state.tray));
    } catch (error) {
      return;
    }
  }
})();
