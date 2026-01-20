/**
 * Modernizr-like feature detection for portfolio
 * Lightweight version for essential features
 */
(function () {
  "use strict";

  const PortfolioDetect = {
    // Check for CSS Grid support
    cssGrid: function () {
      return CSS.supports("display", "grid");
    },

    // Check for Flexbox support
    flexbox: function () {
      return CSS.supports("display", "flex");
    },

    // Check for Intersection Observer support
    intersectionObserver: function () {
      return "IntersectionObserver" in window;
    },

    // Check for smooth scroll support
    smoothScroll: function () {
      return "scrollBehavior" in document.documentElement.style;
    },

    // Check for touch device
    touchDevice: function () {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    },

    // Check for reduced motion preference
    prefersReducedMotion: function () {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },

    // Check for dark mode preference
    prefersDarkMode: function () {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    },

    // Add feature classes to HTML element
    init: function () {
      const html = document.documentElement;

      // Add feature detection classes
      if (this.cssGrid()) html.classList.add("cssgrid");
      if (this.flexbox()) html.classList.add("flexbox");
      if (this.intersectionObserver())
        html.classList.add("intersection-observer");
      if (this.smoothScroll()) html.classList.add("smooth-scroll");
      if (this.touchDevice()) html.classList.add("touch-device");
      if (this.prefersReducedMotion()) html.classList.add("reduced-motion");
      if (this.prefersDarkMode()) html.classList.add("dark-mode");

      // Log detected features
      console.log("Feature detection complete:", {
        cssGrid: this.cssGrid(),
        flexbox: this.flexbox(),
        intersectionObserver: this.intersectionObserver(),
        smoothScroll: this.smoothScroll(),
        touchDevice: this.touchDevice(),
        reducedMotion: this.prefersReducedMotion(),
        darkMode: this.prefersDarkMode(),
      });
    },
  };

  // Initialize feature detection
  document.addEventListener("DOMContentLoaded", function () {
    PortfolioDetect.init();
  });

  // Make available globally
  window.PortfolioDetect = PortfolioDetect;
})();
