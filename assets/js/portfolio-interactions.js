document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = Array.from(document.querySelectorAll(".project-filter"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));

  function normalizeCategory(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function filterProjects(category) {
    const normalizedCategory = normalizeCategory(category);

    projectCards.forEach((card) => {
      const cardCategory = normalizeCategory(card.getAttribute("data-category"));
      const shouldShow = normalizedCategory === "all" || normalizedCategory === cardCategory;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      filterProjects(button.getAttribute("data-filter") || "all");
    });
  });

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && revealElements.length) {
    Array.from(revealElements).forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i * 42, 360)}ms`);
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -12px 0px",
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  let floatingButton = document.querySelector(".floating-back-to-top");
  if (!floatingButton) {
    floatingButton = document.createElement("button");
    floatingButton.type = "button";
    floatingButton.className = "floating-back-to-top";
    floatingButton.setAttribute("aria-label", "Back to top");
    floatingButton.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(floatingButton);
  }

  const toggleFloatingButton = () => {
    const showAfter = Math.max(120, window.innerHeight * 0.25);
    const shouldShow = window.scrollY > showAfter;
    floatingButton.classList.toggle("is-visible", shouldShow);
  };

  const onScroll = () => {
    toggleFloatingButton();
    document.documentElement.classList.toggle("site-nav-scrolled", window.scrollY > 18);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  floatingButton.addEventListener("click", () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  });

  // Keep motion subtle and professional; avoid aggressive mouse-parallax.
});
