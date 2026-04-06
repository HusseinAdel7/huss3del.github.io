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
        threshold: 0.16,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Keep motion subtle and professional; avoid aggressive mouse-parallax.
});
