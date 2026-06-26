(function () {
  "use strict";

  var carouselImages = [
    "images/given/banner (1).png",
    "images/given/banner (2).png",
    "images/given/banner (3).png",
    "images/given/banner (4).png",
    "images/given/banner (5).png",
    "images/given/banner (6).png"
  ];

  document.addEventListener("DOMContentLoaded", function () {
    initCarousel();
    initProjectFilters();
    initForms();
    initFaq();
    initDonate();
  });

  function initCarousel() {
    var image = document.getElementById("hero-carousel");
    var controls = document.getElementById("carousel-controls");
    var activeIndex = 0;

    if (!image) {
      return;
    }

    carouselImages.forEach(function (src, index) {
      var preload = new Image();
      preload.src = src;

      if (controls) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot" + (index === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Show community image " + (index + 1));
        dot.addEventListener("click", function () {
          activeIndex = index;
          setCarouselImage(image, controls, activeIndex);
        });
        controls.appendChild(dot);
      }
    });

    window.setInterval(function () {
      activeIndex = (activeIndex + 1) % carouselImages.length;
      setCarouselImage(image, controls, activeIndex);
    }, 4500);
  }

  function setCarouselImage(image, controls, index) {
    image.classList.add("is-changing");

    window.setTimeout(function () {
      image.src = carouselImages[index];
      image.classList.remove("is-changing");
    }, 180);

    if (controls) {
      controls.querySelectorAll(".carousel-dot").forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }
  }

  function initProjectFilters() {
    var buttons = document.querySelectorAll("[data-project-filter]");
    var cards = document.querySelectorAll("[data-project-type]");

    if (!buttons.length || !cards.length) {
      return;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.dataset.projectFilter;

        buttons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });

        cards.forEach(function (card) {
          card.hidden = filter !== "all" && card.dataset.projectType !== filter;
        });
      });
    });
  }

  function initForms() {
    document.querySelectorAll("[data-contact-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var message = form.querySelector("[data-form-message]");

        event.preventDefault();
        form.reset();

        if (message) {
          message.textContent = "Thanks. Your message is ready for foundation staff.";
        }
      });
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      item.addEventListener("click", function () {
        item.classList.toggle("open");
      });
    });
  }

  function initDonate() {
    var button = document.querySelector("[data-donate-button]");
    var message = document.querySelector("[data-donate-message]");

    if (!button || !message) {
      return;
    }

    button.addEventListener("click", function () {
      message.textContent = "Donation flow placeholder: connect this button to your payment provider when ready.";
    });
  }
})();
