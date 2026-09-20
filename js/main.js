/* Lachgas Service Rotterdam: lichtgewicht interactie, zonder externe bibliotheken */
(function () {
  "use strict";
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header wordt vast en donker zodra je scrolt
  var header = doc.querySelector(".js-header");
  if (header) {
    var sync = function () { header.classList.toggle("is-scrolled", window.scrollY > 40); };
    window.addEventListener("scroll", sync, { passive: true });
    sync();
  }

  // Mobiel menu
  var toggle = doc.querySelector(".menu-toggle");
  var overlay = doc.querySelector(".mobile-menu-overlay");
  var menu = doc.querySelector(".mobile-menu");
  var closeBtn = doc.querySelector(".mobile-menu-close");
  if (toggle && overlay && menu) {
    var openMenu = function () {
      overlay.classList.add("open");
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      doc.documentElement.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    };
    var closeMenu = function () {
      overlay.classList.remove("open");
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      doc.documentElement.style.overflow = "";
    };
    toggle.addEventListener("click", function () { menu.classList.contains("open") ? closeMenu() : openMenu(); });
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { closeMenu(); toggle.focus(); }
    });
  }

  // Onthullen bij scrollen: alleen elementen onder de vouw, inhoud blijft zonder JS gewoon zichtbaar
  if (!reduce && "IntersectionObserver" in window) {
    var targets = doc.querySelectorAll(
      ".section-header, .prose, .facts, .feature-card, .area-card, .step, .criteria li, .faq-acc, .contact-card, .cta-box, .showcase, .rel-card, .district-cta, .legal-content > section"
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    var fold = window.innerHeight * 0.92;
    targets.forEach(function (el, i) {
      if (el.getBoundingClientRect().top < fold) return;
      el.classList.add("reveal");
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el) % 4;
      if (sib) el.style.transitionDelay = sib * 70 + "ms";
      io.observe(el);
    });
  }

  // Contactformulier (Formspree), zonder de pagina te verlaten
  var form = doc.getElementById("contact-form");
  if (form && window.fetch && window.FormData) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      status.className = "form-status";
      status.textContent = "Bezig met versturen…";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("http " + r.status);
          form.reset();
          status.className = "form-status ok";
          status.textContent = "Bedankt! Je bericht is verstuurd. We reageren zo snel mogelijk.";
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = "Versturen is niet gelukt. Stuur ons een WhatsApp-bericht of probeer het later opnieuw.";
        })
        .then(function () { btn.disabled = false; });
    });
  }
})();
