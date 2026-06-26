(function () {
  "use strict";

  var config = window.PORTFOLIO_CONFIG || {};
  var contact = config.contact || {};
  var clips = config.clips || [];
  var spotify = config.spotify || {};

  document.addEventListener("DOMContentLoaded", function () {
    hydrateLinks();
    hydrateContactText();
    hydrateContactForm();
    hydrateClips();
    hydrateSpotify();
    initProjectFilters();
    initCopyButtons();
    initTimelinePics();
  });

  function hydrateLinks() {
    setHref("email", "mailto:" + (contact.email || "eolozaga@calpoly.edu"));
    setHref("github", contact.github || "#");
    setHref("linkedin", contact.linkedin || "#");
    setHref("resume", contact.resume || "#");
  }

  function hydrateContactText() {
    setText("email", contact.email || "eolozaga@calpoly.edu");
    setText("github", cleanUrl(contact.github || "https://github.com/eolozagaste"));
    setText("linkedin", cleanUrl(contact.linkedin || "https://www.linkedin.com/in/eolozagaste"));
  }

  function hydrateContactForm() {
    var form = document.querySelector("[data-contact-form]");
    var message = document.querySelector("[data-form-message]");
    if (!form) return;
    if (contact.formAction) {
      form.action = contact.formAction;
      return;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var formData = new FormData(form);
      var name = String(formData.get("name") || "Portfolio visitor");
      var fromEmail = String(formData.get("email") || "");
      var body = String(formData.get("message") || "");
      var mailto = [
        "mailto:",
        contact.email || "eolozaga@calpoly.edu",
        "?subject=",
        encodeURIComponent("Portfolio message from " + name),
        "&body=",
        encodeURIComponent("Name: " + name + "\nEmail: " + fromEmail + "\n\n" + body),
      ].join("");
      if (message) message.textContent = "Opening your email app...";
      window.location.href = mailto;
    });
  }

  function hydrateClips() {
    document.querySelectorAll("[data-clip-list]").forEach(function (container) {
      container.innerHTML = clips.map(renderClip).join("");
      container.addEventListener("click", handleClipClick);
    });
  }

  function renderClip(clip, index) {
    var hasSource = Boolean(clip.src);
    return [
      '<article class="card clip-card">',
      '<button class="clip-play" type="button" data-clip-index="' + index + '"' + (hasSource ? "" : " disabled") + '>',
      hasSource ? "Play" : "Add clip",
      '</button>',
      '<div class="clip-copy"><h3>' + escapeHtml(clip.title || "Guitar Clip") + '</h3><p>' + escapeHtml(clip.description || "Add a clip description.") + '</p></div>',
      '<span class="clip-duration">' + escapeHtml(clip.duration || "--:--") + '</span>',
      '</article>'
    ].join("");
  }

  function handleClipClick(event) {
    var button = event.target.closest("[data-clip-index]");
    if (!button) return;
    var clip = clips[Number(button.dataset.clipIndex)];
    if (!clip || !clip.src) return;
    new Audio(clip.src).play();
  }

  function hydrateSpotify() {
    setText("spotify-track", spotify.placeholderTrack || "Spotify API placeholder");
    setText("spotify-artist", spotify.placeholderArtist || "Add Spotify integration later");
    setText("spotify-status", spotify.enabled ? "live" : "manual");
  }

  function initProjectFilters() {
    var buttons = document.querySelectorAll("[data-project-filter]");
    var cards = document.querySelectorAll("[data-project-type]");
    if (!buttons.length || !cards.length) return;
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.dataset.projectFilter;
        buttons.forEach(function (item) { item.classList.toggle("active", item === button); });
        cards.forEach(function (card) {
          var types = String(card.dataset.projectType || "").split(/[\s,]+/);
          card.hidden = filter !== "all" && types.indexOf(filter) === -1;
        });
      });
    });
  }

  function initCopyButtons() {
    document.querySelectorAll("[data-copy-email]").forEach(function (button) {
      button.addEventListener("click", function () {
        var email = contact.email || "eolozaga@calpoly.edu";
        if (!navigator.clipboard) {
          button.textContent = email;
          return;
        }
        navigator.clipboard.writeText(email).then(function () {
          button.textContent = "Copied";
          setTimeout(function () { button.textContent = "Copy email"; }, 1200);
        });
      });
    });
  }

  function initTimelinePics() {
    var timeline = document.querySelector(".timeline");
    var desktopPhoto = document.querySelector(".timeline-stage > .timeline-photo");
    if (!timeline || !desktopPhoto) return;

    var dots = Array.prototype.slice.call(timeline.querySelectorAll(".tl-dot"));
    var activeItem = null;
    var activeIndex = null;

    function readPhoto(index, item) {
      var title = textFrom(item, ".tl-title", "Timeline pic");
      var sub = textFrom(item, ".tl-sub", "");
      return {
        title: item.dataset.timelineTitle || title,
        subtitle: item.dataset.timelineSubtitle || sub,
        image: item.dataset.timelineImage || "",
        alt: item.dataset.timelineAlt || title,
        color: item.dataset.timelineColor || gradients[index % gradients.length],
      };
    }

    function setPhotoContent(container, data) {
      var title = container.querySelector(".timeline-photo-title");
      var sub = container.querySelector(".timeline-photo-sub");
      var placeholder = container.querySelector(".timeline-photo-placeholder");
      if (title) title.textContent = data.title;
      if (sub) sub.textContent = data.subtitle;
      if (!placeholder) return;

      placeholder.innerHTML = "";
      placeholder.style.background = data.color;
      placeholder.classList.toggle("has-image", Boolean(data.image));

      if (data.image) {
        var img = document.createElement("img");
        img.className = "timeline-photo-img";
        img.src = data.image;
        img.alt = data.alt;
        placeholder.appendChild(img);
      }
    }

    function removeInlinePhoto() {
      var inlinePhoto = timeline.querySelector(".timeline-photo--inline");
      if (inlinePhoto) inlinePhoto.remove();
    }

    function syncDots() {
      dots.forEach(function (dot, index) {
        var isActive = index === activeIndex;
        var tooltip = dot.querySelector(".tl-tooltip");
        dot.setAttribute("aria-expanded", isActive ? "true" : "false");
        if (tooltip) tooltip.textContent = isActive ? "click to hide" : "click for pic";
      });
    }

    function hidePhoto() {
      if (activeItem) activeItem.classList.remove("is-active");
      activeItem = null;
      activeIndex = null;
      desktopPhoto.setAttribute("aria-hidden", "true");
      desktopPhoto.classList.remove("is-visible");
      removeInlinePhoto();
      syncDots();
    }

    function showPhoto(index, item) {
      var photo = readPhoto(index, item);

      if (activeItem) activeItem.classList.remove("is-active");
      activeItem = item;
      activeIndex = index;
      activeItem.classList.add("is-active");

      setPhotoContent(desktopPhoto, photo);
      desktopPhoto.setAttribute("aria-hidden", "false");
      desktopPhoto.classList.add("is-visible");

      removeInlinePhoto();

      var inlinePhoto = desktopPhoto.cloneNode(true);
      inlinePhoto.classList.add("timeline-photo--inline", "is-visible");
      inlinePhoto.setAttribute("aria-hidden", "false");
      item.appendChild(inlinePhoto);
      syncDots();
    }

    dots.forEach(function (dot, index) {
      var item = dot.closest(".tl-item");
      if (!item) return;
      var title = textFrom(item, ".tl-title", "timeline picture");
      var tooltip = dot.querySelector(".tl-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("span");
        tooltip.className = "tl-tooltip";
        dot.appendChild(tooltip);
      }

      dot.setAttribute("role", "button");
      dot.setAttribute("tabindex", "0");
      dot.setAttribute("aria-label", "Show " + title + " timeline picture");
      dot.setAttribute("aria-controls", "timeline-photo");

      function handlePick() {
        if (activeIndex === index) {
          hidePhoto();
          return;
        }
        showPhoto(index, item);
      }

      dot.addEventListener("click", handlePick);
      dot.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handlePick();
        }
        if (event.key === "Escape") hidePhoto();
      });
    });

    syncDots();
  }

  function textFrom(root, selector, fallback) {
    var node = root.querySelector(selector);
    return node ? node.textContent.trim() : fallback;
  }

  var gradients = [
    "linear-gradient(135deg, #5c0a1e, #ef4371)",
    "linear-gradient(135deg, #1e1040, #a78bfa)",
    "linear-gradient(135deg, #1e3a5f, #60a5fa)",
    "linear-gradient(135deg, #0d2b1a, #1db954)"
  ];

  function setHref(key, value) {
    document.querySelectorAll('[data-config-href="' + key + '"]').forEach(function (link) {
      link.href = value;
      if (key === "resume" && value && value !== "#") {
        link.setAttribute("download", value.split("/").pop());
      }
    });
  }

  function setText(key, value) {
    document.querySelectorAll('[data-config-text="' + key + '"], [data-' + key + ']').forEach(function (node) { node.textContent = value; });
  }

  function cleanUrl(value) {
    return String(value).replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
})();
