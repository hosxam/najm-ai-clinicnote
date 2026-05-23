/**
 * SEO page mobile nav.
 * Injects a hamburger toggle into the existing .top .nav header on SEO pages
 * and turns the existing .nav-links into a drawer panel on small screens.
 *
 * Pure vanilla JS. No dependencies. Idempotent: safe to load more than once.
 * Visual styles live in seo-page.css.
 */
(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__seoMobileNavReady) return;
  window.__seoMobileNavReady = true;

  var TOGGLE_CLASS = "seo-mobile-nav-toggle";
  var LINKS_ID = "seo-mobile-nav-links";
  var OPEN_CLASS = "open";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function init() {
    var nav = document.querySelector(".top .nav");
    if (!nav) return;
    var brand = nav.querySelector(".brand");
    var links = nav.querySelector(".nav-links");
    if (!brand || !links) return;
    if (nav.querySelector("." + TOGGLE_CLASS)) return; // already injected

    if (!links.id) links.id = LINKS_ID;

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = TOGGLE_CLASS;
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", links.id);
    toggle.innerHTML =
      '<span class="' + TOGGLE_CLASS + '-bar"></span>' +
      '<span class="' + TOGGLE_CLASS + '-bar"></span>' +
      '<span class="' + TOGGLE_CLASS + '-bar"></span>';

    // Insert after the brand so flex layout keeps brand on the left, button on the right.
    if (brand.nextSibling) {
      nav.insertBefore(toggle, brand.nextSibling);
    } else {
      nav.appendChild(toggle);
    }

    function setOpen(open) {
      if (open) {
        links.classList.add(OPEN_CLASS);
        toggle.classList.add(OPEN_CLASS);
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation menu");
      } else {
        links.classList.remove(OPEN_CLASS);
        toggle.classList.remove(OPEN_CLASS);
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");
      }
    }

    function isOpen() {
      return links.classList.contains(OPEN_CLASS);
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!isOpen());
    });

    // Close when a link inside the drawer is tapped.
    links.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t !== links) {
        if (t.tagName === "A") {
          setOpen(false);
          break;
        }
        t = t.parentNode;
      }
    });

    // Close on outside click.
    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (toggle.contains(e.target) || links.contains(e.target)) return;
      setOpen(false);
    });

    // Close on Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) setOpen(false);
    });

    // Close if the viewport grows past the mobile breakpoint.
    var mql = window.matchMedia ? window.matchMedia("(min-width: 721px)") : null;
    if (mql) {
      var onChange = function (ev) { if (ev.matches) setOpen(false); };
      if (mql.addEventListener) mql.addEventListener("change", onChange);
      else if (mql.addListener) mql.addListener(onChange);
    }
  }

  ready(init);
})();
