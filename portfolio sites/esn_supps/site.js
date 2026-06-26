(function () {
  "use strict";

  var CART_STORAGE_KEY = "esnCartQuantity";
  var LEGACY_CART_STORAGE_KEY = "cartQuantity";
  var UNIT_PRICE = 42;
  var fallbackCartQuantity = 0;
  var promoTimerId;
  var bannerTimerId;
  var promoIndex = 0;
  var bannerIndex = 0;

  var PROMO_MESSAGES = [
    "Buy one, get one (BOGO) SALE now LIVE on select products!",
    "Use Code: ESN2023 at checkout for 5% off ALL products!",
    "New Location now OPEN in Santa Maria, CA",
    "All ingredients FDA Approved!",
    "Paypal, Klarna, Visa, Cashapp, Zelle, & Body Parts are all accepted as payment!",
    "Didn't like a product? Too bad NO returns!"
  ];

  var BANNER_IMAGES = [
    "images/tester-banner.jpg",
    "images/tester-banner2.jpg",
    "images/tester-banner3.jpg",
    "images/tester-banner4.jpg",
    "images/tester-banner5.jpg",
    "images/tester-banner6.jpg"
  ];

  if (!window.$) {
    window.$ = function (selector) {
      return makeCollection(Array.prototype.slice.call(document.querySelectorAll(selector)));
    };
  }

  function makeCollection(nodes) {
    return {
      on: function (eventName, handler) {
        nodes.forEach(function (node) {
          node.addEventListener(eventName, function (event) {
            handler.call(node, event);
          });
        });

        return this;
      },

      not: function (excludedNode) {
        return makeCollection(nodes.filter(function (node) {
          return node !== excludedNode;
        }));
      },

      prop: function (name, value) {
        nodes.forEach(function (node) {
          node[name] = value;

          if (typeof value === "boolean") {
            if (value) {
              node.setAttribute(name, name);
            } else {
              node.removeAttribute(name);
            }
          } else {
            node.setAttribute(name, value);
          }
        });

        return this;
      }
    };
  }

  function safeGetStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch (error) {
      fallbackCartQuantity = value;
    }
  }

  function parseQuantity(rawValue) {
    var quantity;

    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return 0;
    }

    quantity = Number(rawValue);

    if (!Number.isFinite(quantity)) {
      try {
        quantity = Number(JSON.parse(rawValue));
      } catch (error) {
        quantity = 0;
      }
    }

    return Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 0;
  }

  function readCartQuantity() {
    var currentValue = safeGetStorage(CART_STORAGE_KEY);
    var currentQuantity = parseQuantity(currentValue);

    if (currentValue !== null) {
      fallbackCartQuantity = currentQuantity;
      return currentQuantity;
    }

    currentQuantity = parseQuantity(safeGetStorage(LEGACY_CART_STORAGE_KEY));

    if (currentQuantity > 0) {
      writeCartQuantity(currentQuantity);
    }

    fallbackCartQuantity = currentQuantity || fallbackCartQuantity;
    return fallbackCartQuantity;
  }

  function writeCartQuantity(quantity) {
    var cleanQuantity = Math.max(0, Math.floor(Number(quantity) || 0));

    fallbackCartQuantity = cleanQuantity;
    safeSetStorage(CART_STORAGE_KEY, cleanQuantity);
    safeSetStorage(LEGACY_CART_STORAGE_KEY, cleanQuantity);
  }

  function updateCartQuantityDisplay() {
    var quantity = readCartQuantity();
    var badges = document.querySelectorAll("#cart-quantity");

    badges.forEach(function (badge) {
      badge.textContent = String(quantity);
      badge.classList.toggle("is-empty", quantity === 0);
      badge.setAttribute("aria-label", quantity + " item" + (quantity === 1 ? "" : "s") + " in cart");
    });

    updateCartSummary(quantity);
  }

  function changeQuantity(event) {
    var newQuantity;

    if (event && event.preventDefault) {
      event.preventDefault();
    }

    newQuantity = readCartQuantity() + 1;
    writeCartQuantity(newQuantity);
    updateCartQuantityDisplay();

    return newQuantity;
  }

  function handleAddToCartClick(event) {
    var button = event.target.closest ? event.target.closest(".addto-button") : null;

    if (!button) {
      return;
    }

    event.preventDefault();
    changeQuantity();
    showButtonFeedback(button);
  }

  function showButtonFeedback(button) {
    var label = button.getAttribute("data-default-label") || button.textContent.trim() || "ADD TO CART";

    button.setAttribute("data-default-label", label);
    button.textContent = "ADDED";
    button.classList.add("added");

    window.clearTimeout(button.esnFeedbackTimer);
    button.esnFeedbackTimer = window.setTimeout(function () {
      button.textContent = label;
      button.classList.remove("added");
    }, 900);
  }

  function updateCartSummary(quantity) {
    var productQuantity = document.querySelector(".product-quantity");
    var productPrice = document.querySelector(".product-price");
    var itemLabel = document.querySelector(".subtotal-sec .sec1 .subtotal-names");
    var subtotal = quantity * UNIT_PRICE;
    var tax = subtotal * 0.1;

    if (productQuantity) {
      productQuantity.textContent = "Quantity: " + quantity;
    }

    if (productPrice) {
      productPrice.textContent = formatMoney(subtotal);
    }

    if (itemLabel) {
      itemLabel.textContent = "Items (" + quantity + "):";
    }

    setSummaryValue(".sec1", subtotal);
    setSummaryValue(".sec4", subtotal);
    setSummaryValue(".sec5", tax);
    setSummaryValue(".sec6", subtotal + tax);
  }

  function setSummaryValue(sectionSelector, value) {
    var fields = document.querySelectorAll(sectionSelector + " .subtotal-names");

    if (fields.length > 1) {
      fields[1].textContent = formatMoney(value);
    }
  }

  function formatMoney(value) {
    return "$" + value.toFixed(2);
  }

  function placeOrder() {
    if (readCartQuantity() === 0) {
      window.alert("Your cart is empty.");
      return;
    }

    window.alert("Order placed!");
    writeCartQuantity(0);
    updateCartQuantityDisplay();
  }

  function textCycle() {
    var textElement = document.getElementById("text-array");

    if (!textElement) {
      return;
    }

    promoIndex = (promoIndex + 1) % PROMO_MESSAGES.length;
    textElement.textContent = PROMO_MESSAGES[promoIndex];
  }

  function textStartUp() {
    var textElement = document.getElementById("text-array");

    if (!textElement) {
      return;
    }

    window.clearInterval(promoTimerId);
    promoIndex = 0;
    textElement.textContent = PROMO_MESSAGES[promoIndex];
    promoTimerId = window.setInterval(textCycle, 4000);
  }

  function bannerStartUp() {
    var banner = document.getElementById("array-img");

    if (!banner) {
      return;
    }

    preloadBannerImages();
    window.clearInterval(bannerTimerId);
    bannerIndex = 0;
    setBannerImage(banner, bannerIndex, true);

    bannerTimerId = window.setInterval(function () {
      bannerIndex = (bannerIndex + 1) % BANNER_IMAGES.length;
      setBannerImage(banner, bannerIndex, false);
    }, 4000);
  }

  function setBannerImage(banner, index, immediate) {
    var nextImage = BANNER_IMAGES[index];

    if (immediate) {
      banner.src = nextImage;
      banner.alt = "ESN promotional banner " + (index + 1);
      return;
    }

    banner.classList.add("is-fading");

    window.setTimeout(function () {
      banner.src = nextImage;
      banner.alt = "ESN promotional banner " + (index + 1);
      banner.classList.remove("is-fading");
    }, 180);
  }

  function preloadBannerImages() {
    BANNER_IMAGES.forEach(function (src) {
      var image = new Image();
      image.src = src;
    });
  }

  function removeLegacyInlineCartHandlers() {
    document.querySelectorAll(".addto-button, .addto-button *").forEach(function (node) {
      node.removeAttribute("onclick");
    });

    document.querySelectorAll(".addto-button").forEach(function (button) {
      button.type = "button";
    });
  }

  function initSite() {
    window.textCycle = textCycle;
    window.textStartUp = textStartUp;
    window.bannerStartUp = bannerStartUp;
    window.changeQuantity = changeQuantity;
    window.decalreAmount = updateCartQuantityDisplay;
    window.orderPlaced = placeOrder;

    removeLegacyInlineCartHandlers();
    document.addEventListener("click", handleAddToCartClick);
    updateCartQuantityDisplay();
    textStartUp();
    bannerStartUp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSite);
  } else {
    initSite();
  }
})();
