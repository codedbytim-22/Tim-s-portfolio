/**
 * TIM MACHARIA PORTFOLIO - MAIN JAVASCRIPT FILE
 * A professional, modular JavaScript implementation for portfolio functionality
 * Author: Tim Macharia
 * Version: 1.0.0
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Portfolio loaded successfully!");

  // Initialize all modules
  initNavigation();
  initAnimations();
  initContactForm(); // This will now work with Formspree
  initProjectCards();
  initScrollEffects();
  initDynamicStats();
  initTooltips();
  initPerformanceOptimizations();
});

/**
 * NAVIGATION MODULE
 * Handles mobile menu, smooth scrolling, and active link highlighting
 */
function initNavigation() {
  // Mobile menu toggle functionality
  const menuToggle = document.querySelector(".menu-toggle-checkbox");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (menuToggle && navMenu) {
    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnToggle =
        event.target.closest(".menu-toggle-label") ||
        event.target.closest(".menu-toggle-checkbox");

      if (!isClickInsideMenu && !isClickOnToggle && menuToggle.checked) {
        menuToggle.checked = false;
        navMenu.classList.remove("active");
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuToggle.checked) {
        menuToggle.checked = false;
        navMenu.classList.remove("active");
      }
    });

    // Add keyboard navigation support
    navLinks.forEach((link) => {
      link.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.click();
        }
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      // Don't interfere with external links
      if (
        this.getAttribute("href").startsWith("#") &&
        this.getAttribute("href") !== "#"
      ) {
        event.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Close mobile menu if open
          if (menuToggle && menuToggle.checked) {
            menuToggle.checked = false;
            if (navMenu) navMenu.classList.remove("active");
          }

          // Smooth scroll to target
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });

          // Update URL without page jump
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // Active link highlighting based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // Throttle scroll events for performance
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(updateActiveNavLink);
  });

  // Initial call
  updateActiveNavLink();
}

/**
 * ANIMATIONS MODULE
 * Handles scroll-triggered animations and entrance effects
 */
function initAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");

        // Add sequential animation delay for grid items
        if (
          entry.target.classList.contains("bio-card") ||
          entry.target.classList.contains("stack-card") ||
          entry.target.classList.contains("project-card")
        ) {
          const index = Array.from(entry.target.parentElement.children).indexOf(
            entry.target,
          );
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".hero-title, .hero-subtitle, .hero-stats, " +
      ".section-header, .bio-card, .stack-card, " +
      ".project-card, .contact-form-section, .contact-info-section",
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Parallax effect for hero section
  function updateParallax() {
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      const scrollPosition = window.pageYOffset;
      heroSection.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
  }

  window.addEventListener("scroll", updateParallax);

  // Glow effect animation
  const glowEffects = document.querySelectorAll(".glow-effect");
  glowEffects.forEach((effect) => {
    effect.style.animation = "pulse 4s ease-in-out infinite";
  });
}

/**
 * CONTACT FORM MODULE - UPDATED FOR FORMSPREE
 * Handles form validation and user feedback
 * Formspree will handle the actual submission
 */
function initContactForm() {
  const contactForm = document.querySelector(".contact-form");

  if (!contactForm) return;

  // Real-time validation - but don't prevent Formspree submission
  const formInputs = contactForm.querySelectorAll(
    ".form-input, .form-textarea",
  );

  formInputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearFieldError(input));
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    switch (field.id) {
      case "name":
        if (!value) {
          isValid = false;
          errorMessage = "Name is required";
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = "Name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value) {
          isValid = false;
          errorMessage = "Email is required";
        } else if (!isValidEmail(value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "subject":
        if (!value) {
          isValid = false;
          errorMessage = "Subject is required";
        }
        break;
      case "message":
        if (!value) {
          isValid = false;
          errorMessage = "Message is required";
        } else if (value.length < 10) {
          isValid = false;
          errorMessage = "Message must be at least 10 characters";
        }
        break;
    }

    if (!isValid) showFieldError(field, errorMessage);
    return isValid;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showFieldError(field, message) {
    field.classList.add("error");
    let errorElement = field.parentElement.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  function clearFieldError(field) {
    field.classList.remove("error");
    const errorElement = field.parentElement.querySelector(".error-message");
    if (errorElement) errorElement.remove();
  }

  // Form submission handler - UPDATED FOR FORMSPREE
  contactForm.addEventListener("submit", function (event) {
    // Validate all fields
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    let hasErrors = false;

    // Clear previous errors
    formInputs.forEach(clearFieldError);

    // Validate each field
    if (!name || name.length < 2) {
      showFieldError(
        document.getElementById("name"),
        "Name is required and must be at least 2 characters",
      );
      hasErrors = true;
    }

    if (!email || !isValidEmail(email)) {
      showFieldError(
        document.getElementById("email"),
        "Please enter a valid email address",
      );
      hasErrors = true;
    }

    if (!subject) {
      showFieldError(document.getElementById("subject"), "Subject is required");
      hasErrors = true;
    }

    if (!message || message.length < 10) {
      showFieldError(
        document.getElementById("message"),
        "Message must be at least 10 characters",
      );
      hasErrors = true;
    }

    // If there are errors, prevent Formspree submission
    if (hasErrors) {
      event.preventDefault();
      showFormMessage("Please fix the errors above.", "error");
      return;
    }

    // If validation passes, allow Formspree to submit
    // Add loading state to button
    const submitBtn = contactForm.querySelector(".form-submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Reset button after form submission (Formspree will redirect)
    // If Formspree redirect fails, reset button after 5 seconds
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 5000);

    /* 
    // OPTIONAL: If you want to also save to Firebase (without interfering with Formspree)
    // You can add this, but it's commented out for now
    try {
      if (window.FirebaseDB && window.FirebaseDB.addDoc) {
        window.FirebaseDB.addDoc(
          window.FirebaseDB.collection(window.FirebaseDB.db, "contactMessages"),
          {
            name,
            email,
            subject,
            message,
            createdAt: window.FirebaseDB.serverTimestamp(),
          },
        ).then(() => {
          console.log("Message also saved to Firebase");
        }).catch(error => {
          console.error("Firebase backup save failed:", error);
        });
      }
    } catch (error) {
      console.error("Firebase error:", error);
    }
    */
  });

  function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) existingMessage.remove();

    // Create new message
    const messageElement = document.createElement("div");
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;

    // Insert after form
    contactForm.parentNode.insertBefore(
      messageElement,
      contactForm.nextSibling,
    );

    // Remove after 5 seconds
    setTimeout(() => messageElement.remove(), 5000);
  }

  // Error CSS
  const errorStyles = document.createElement("style");
  errorStyles.textContent = `
        .form-input.error,
        .form-textarea.error {
            border-color: #ff4444 !important;
            box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.1) !important;
        }
        .error-message {
            color: #ff4444;
            font-size: 0.85rem;
            margin-top: 5px;
            font-weight: 500;
        }
        .form-message {
            padding: 15px 20px;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
            text-align: center;
            animation: slideIn 0.3s ease-out;
        }
        .form-message.success {
            background: rgba(76, 175, 80, 0.1);
            color: #4CAF50;
            border: 1px solid rgba(76, 175, 80, 0.3);
        }
        .form-message.error {
            background: rgba(244, 67, 54, 0.1);
            color: #f44336;
            border: 1px solid rgba(244, 67, 54, 0.3);
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
  document.head.appendChild(errorStyles);
}

/**
 * PROJECT CARDS MODULE
 * Handles project card interactions and animations
 */
function initProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    // Add click tracking for analytics
    card.addEventListener("click", function () {
      const projectTitle = this.querySelector("h3").textContent;
      console.log(`Project clicked: ${projectTitle}`);

      // You can integrate with Google Analytics here
      // gtag('event', 'project_click', { 'project_name': projectTitle });
    });

    // Keyboard navigation support
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const link = this.querySelector("a.btn");
        if (link) link.click();
      }
    });

    // Hover effect enhancement
    card.addEventListener("mouseenter", function () {
      this.style.zIndex = "10";
    });

    card.addEventListener("mouseleave", function () {
      this.style.zIndex = "1";
    });
  });
}

/**
 * SCROLL EFFECTS MODULE
 * Handles scroll-based visual effects
 */
function initScrollEffects() {
  // Back to top button
  const backToTopButton = document.createElement("button");
  backToTopButton.className = "back-to-top";
  backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTopButton.setAttribute("aria-label", "Back to top");
  document.body.appendChild(backToTopButton);

  // Show/hide back to top button
  function toggleBackToTop() {
    if (window.scrollY > 500) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", toggleBackToTop);

  // Back to top functionality
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Add CSS for back to top button
  const backToTopStyles = document.createElement("style");
  backToTopStyles.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--accent-red);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
        }
        
        .back-to-top.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            background: #cc0000;
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(255, 0, 0, 0.4);
        }
        
        @media (max-width: 768px) {
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 1rem;
            }
        }
    `;
  document.head.appendChild(backToTopStyles);

  // Initial check
  toggleBackToTop();
}

/**
 * DYNAMIC STATS MODULE
 * Animates statistic counters
 */
function initDynamicStats() {
  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length === 0) return;

  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Animate counter
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const originalText = element.textContent;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = originalText.includes("+")
          ? target + "+"
          : target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  }

  // Check and animate stats
  let animated = false;

  function checkStats() {
    if (!animated && isInViewport(statNumbers[0])) {
      animated = true;

      statNumbers.forEach((stat) => {
        const text = stat.textContent;

        // Check if it's a number to animate
        if (text.match(/^\d+/)) {
          const target = parseInt(text);
          animateCounter(stat, target);
        }
        // For text stats, just add a subtle animation
        else {
          stat.style.animation = "fadeInUp 0.8s ease-out";
        }
      });
    }
  }

  // Listen for scroll
  window.addEventListener("scroll", checkStats);

  // Initial check
  checkStats();

  // Add animation CSS
  const animationStyles = document.createElement("style");
  animationStyles.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animated {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
        }
        
        .stat-number {
            transition: all 0.3s ease;
        }
    `;
  document.head.appendChild(animationStyles);
}

/**
 * TOOLTIPS MODULE
 * Adds informative tooltips to elements
 */
function initTooltips() {
  // Add tooltips to tech tags
  const techTags = document.querySelectorAll(".tech-tag");

  techTags.forEach((tag) => {
    const technology = tag.textContent;

    // Create tooltip
    const tooltip = document.createElement("span");
    tooltip.className = "tech-tooltip";
    tooltip.textContent = getTechDescription(technology);
    tag.appendChild(tooltip);

    // Position tooltip on hover
    tag.addEventListener("mouseenter", function () {
      const rect = this.getBoundingClientRect();
      const tooltip = this.querySelector(".tech-tooltip");

      // Position tooltip above the element
      tooltip.style.left = "50%";
      tooltip.style.transform = "translateX(-50%)";
      tooltip.style.bottom = "100%";
      tooltip.style.marginBottom = "8px";

      // Show tooltip
      tooltip.classList.add("visible");
    });

    tag.addEventListener("mouseleave", function () {
      const tooltip = this.querySelector(".tech-tooltip");
      tooltip.classList.remove("visible");
    });
  });

  function getTechDescription(tech) {
    const descriptions = {
      HTML5: "Markup language for creating web pages",
      CSS3: "Styling language for web design",
      JavaScript: "Programming language for web interactivity",
      React: "JavaScript library for building user interfaces",
      "Vue.js": "Progressive JavaScript framework",
      Python: "High-level programming language",
      "Node.js": "JavaScript runtime for server-side programming",
      Django: "High-level Python web framework",
      Firebase: "Google's mobile and web app development platform",
      MySQL: "Relational database management system",
      PostgreSQL: "Advanced open-source relational database",
      MongoDB: "NoSQL document-oriented database",
      Kotlin: "Modern programming language for Android",
      "React Native": "Framework for building native apps with React",
      Flutter: "UI toolkit for building natively compiled applications",
    };

    return descriptions[tech] || `Expertise in ${tech}`;
  }

  // Add CSS for tooltips
  const tooltipStyles = document.createElement("style");
  tooltipStyles.textContent = `
        .tech-tag {
            position: relative;
            cursor: help;
        }
        
        .tech-tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: var(--text-white);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 1000;
            pointer-events: none;
            border: 1px solid var(--border-dark);
        }
        
        .tech-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
        }
        
        .tech-tooltip.visible {
            opacity: 1;
            visibility: visible;
        }
    `;
  document.head.appendChild(tooltipStyles);
}

/**
 * PERFORMANCE OPTIMIZATIONS MODULE
 * Implements performance enhancements
 */
function initPerformanceOptimizations() {
  // Lazy loading for images
  const lazyImages = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
    });
  }

  // Preload critical resources
  function preloadResources() {
    const links = [
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap",
    ];

    links.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = href;
      document.head.appendChild(link);
    });
  }

  // Initialize performance monitoring
  function monitorPerformance() {
    if ("performance" in window) {
      // Measure page load time
      window.addEventListener("load", () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;

        console.log(`Page loaded in ${loadTime}ms`);

        // You can send this to analytics
        // gtag('event', 'timing_complete', {
        //     'name': 'page_load',
        //     'value': loadTime,
        //     'event_category': 'Performance'
        // });
      });
    }
  }

  // Initialize performance features
  preloadResources();
  monitorPerformance();
}

/**
 * UTILITY FUNCTIONS
 * Reusable helper functions
 */
const PortfolioUtils = {
  // Debounce function for performance
  debounce: function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for performance
  throttle: function (func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Format phone number
  formatPhoneNumber: function (phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  },

  // Get current year for footer
  getCurrentYear: function () {
    return new Date().getFullYear();
  },

  // Copy to clipboard
  copyToClipboard: function (text) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
  },
};

// Update footer year dynamically
function updateFooterYear() {
  const yearElements = document.querySelectorAll(
    ".footer-text, .footer-bottom p",
  );
  const currentYear = PortfolioUtils.getCurrentYear();

  yearElements.forEach((element) => {
    if (element.textContent.includes("2026")) {
      element.textContent = element.textContent.replace("2026", currentYear);
    }
  });
}

// Initialize utility functions
updateFooterYear();

// Make utilities available globally
window.PortfolioUtils = PortfolioUtils;

// Export for module support (if using ES6 modules)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PortfolioUtils,
    initNavigation,
    initAnimations,
    initContactForm,
    initProjectCards,
  };
}
