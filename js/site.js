// Lachgas Rotterdam — shared site behaviour (sticky header, mobile menu, image lightbox)
(function () {
  "use strict";

  // Sticky header background swap
  var nav = document.getElementById("site-nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add("bg-white/95", "backdrop-blur-md", "shadow-sm", "border-b", "border-gray-100");
      nav.classList.remove("bg-white/80", "backdrop-blur-sm");
    } else {
      nav.classList.remove("bg-white/95", "backdrop-blur-md", "shadow-sm", "border-b", "border-gray-100");
      nav.classList.add("bg-white/80", "backdrop-blur-sm");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.getElementById("mobile-menu-btn");
  var closeBtn = document.getElementById("mobile-menu-close");
  var overlay = document.getElementById("mobile-overlay");
  var panel = document.getElementById("mobile-panel");

  function openMenu() {
    if (!overlay || !panel) return;
    overlay.classList.remove("hidden");
    panel.classList.remove("hidden");
    document.body.classList.add("no-scroll");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    if (closeBtn) closeBtn.focus();
  }
  function closeMenu() {
    if (!overlay || !panel) return;
    overlay.classList.add("hidden");
    panel.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    if (menuBtn) { menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); }
  }
  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel && !panel.classList.contains("hidden")) closeMenu();
  });

  // Image lightbox — any element with [data-lightbox-src] opens #image-lightbox at full size
  var lightbox = document.getElementById("image-lightbox");
  var lightboxImg = document.getElementById("image-lightbox-img");
  var lightboxClose = document.getElementById("image-lightbox-close");
  if (lightbox && lightboxImg) {
    var openLightbox = function (src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
      document.body.classList.add("no-scroll");
    };
    var closeLightbox = function () {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
      document.body.classList.remove("no-scroll");
    };
    var triggers = document.querySelectorAll("[data-lightbox-src]");
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(this.getAttribute("data-lightbox-src"), this.getAttribute("data-lightbox-alt"));
      });
    }
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.classList.contains("hidden")) closeLightbox();
    });
  }
})();
