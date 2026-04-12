function initPortfolioInteractions() {
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

  (function initRecentMarqueeScroll() {
    const viewport = document.querySelector("[data-recent-marquee-scroll]");
    if (!viewport) {
      return;
    }
    const track = viewport.querySelector(".recent-marquee__track");
    const groups = track ? Array.from(track.querySelectorAll(".recent-marquee__group")) : [];
    const root = viewport.closest(".recent-marquee");
    const prevBtn = root && root.querySelector("[data-recent-marquee-prev]");
    const nextBtn = root && root.querySelector("[data-recent-marquee-next]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let programmaticScrollDepth = 0;
    let userPauseUntil = 0;
    let rafId = 0;
    let lastMarqueeTs = 0;
    const USER_PAUSE_MS = 3200;
    /* Pixels per second (time-based so speed is stable on 60Hz vs 120Hz displays) */
    const AUTO_SCROLL_PX_PER_SEC = 82;

    function bumpUserPause() {
      userPauseUntil = Date.now() + USER_PAUSE_MS;
    }

    function runProgrammaticScroll(setter) {
      programmaticScrollDepth += 1;
      try {
        setter();
      } finally {
        window.requestAnimationFrame(() => {
          programmaticScrollDepth -= 1;
        });
      }
    }

    function flexGapPx(el) {
      if (!el) {
        return 0;
      }
      const g = getComputedStyle(el).gap || "0";
      const x = parseFloat(String(g).split(/\s+/)[0], 10);
      return Number.isFinite(x) ? x : 0;
    }

    function getLoopWidth() {
      if (reduceMotion || groups.length < 2 || !track) {
        return 0;
      }
      const g0 = groups[0];
      const g1 = groups[1];
      if (!g0 || !g1) {
        return 0;
      }
      let w = Math.abs(g1.getBoundingClientRect().left - g0.getBoundingClientRect().left);
      if (!Number.isFinite(w) || w < 8) {
        w = g0.offsetWidth + flexGapPx(track);
      }
      if (!Number.isFinite(w) || w < 8) {
        w = g0.scrollWidth;
      }
      return w > 8 ? w : 0;
    }

    function normalizeLoopPosition() {
      const lw = getLoopWidth();
      if (lw < 8) {
        return;
      }
      let sl = viewport.scrollLeft;
      const eps = 1.5;
      while (sl >= lw - eps) {
        sl -= lw;
      }
      while (sl < 0) {
        sl += lw;
      }
      if (Math.abs(sl - viewport.scrollLeft) > 0.75) {
        runProgrammaticScroll(() => {
          viewport.scrollLeft = sl;
        });
      }
    }

    function scrollMarqueeStep(direction) {
      bumpUserPause();
      const step = Math.min(480, Math.round(viewport.clientWidth * 0.78));
      const lw = getLoopWidth();

      if (lw >= 8) {
        viewport.scrollBy({ left: direction * step, behavior: "auto" });
        window.requestAnimationFrame(() => {
          normalizeLoopPosition();
          if (direction < 0 && viewport.scrollLeft < 1) {
            runProgrammaticScroll(() => {
              viewport.scrollLeft = Math.max(0, lw - Math.min(step, lw * 0.35));
            });
          }
          normalizeLoopPosition();
          updateMarqueeNav();
        });
        return;
      }

      viewport.scrollBy({
        left: direction * step,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      window.setTimeout(updateMarqueeNav, reduceMotion ? 0 : 300);
    }

    function updateMarqueeNav() {
      if (!prevBtn || !nextBtn) {
        return;
      }
      const lw = getLoopWidth();
      const { scrollLeft, scrollWidth, clientWidth } = viewport;
      const maxScroll = scrollWidth - clientWidth;
      const eps = 3;

      if (maxScroll <= eps) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }

      if (lw >= 8) {
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        return;
      }

      prevBtn.disabled = scrollLeft <= eps;
      nextBtn.disabled = scrollLeft >= maxScroll - eps;
    }

    function autoTick(ts) {
      rafId = window.requestAnimationFrame(autoTick);
      if (reduceMotion || document.hidden) {
        lastMarqueeTs = 0;
        return;
      }
      const lw = getLoopWidth();
      if (lw < 8 || Date.now() < userPauseUntil) {
        lastMarqueeTs = 0;
        return;
      }

      const now = typeof ts === "number" && !Number.isNaN(ts) ? ts : performance.now();
      if (!lastMarqueeTs) {
        lastMarqueeTs = now;
        return;
      }
      const rawDt = (now - lastMarqueeTs) / 1000;
      lastMarqueeTs = now;
      const dt = Math.min(0.05, Math.max(0, rawDt));

      let sl = viewport.scrollLeft;
      sl += AUTO_SCROLL_PX_PER_SEC * dt;
      if (sl >= lw - 0.5) {
        sl -= lw;
      }
      runProgrammaticScroll(() => {
        viewport.scrollLeft = sl;
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => scrollMarqueeStep(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => scrollMarqueeStep(1));
    }

    viewport.addEventListener("scroll", () => {
      if (programmaticScrollDepth <= 0) {
        bumpUserPause();
      }
      normalizeLoopPosition();
      updateMarqueeNav();
    }, { passive: true });

    window.addEventListener("resize", () => {
      normalizeLoopPosition();
      updateMarqueeNav();
    });

    if (typeof ResizeObserver !== "undefined" && track) {
      const ro = new ResizeObserver(() => {
        normalizeLoopPosition();
        updateMarqueeNav();
      });
      ro.observe(track);
    }

    viewport.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          bumpUserPause();
        }
      },
      { passive: true }
    );
    viewport.addEventListener("touchstart", bumpUserPause, { passive: true });
    viewport.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) {
        return;
      }
      bumpUserPause();
    });

    viewport.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
          return;
        }
        bumpUserPause();
        scrollMarqueeStep(e.key === "ArrowRight" ? 1 : -1);
        e.preventDefault();
      },
      { passive: false }
    );

    updateMarqueeNav();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        normalizeLoopPosition();
        updateMarqueeNav();
      });
    });

    if (!reduceMotion) {
      rafId = window.requestAnimationFrame(autoTick);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        lastMarqueeTs = 0;
      }
    });
  })();

  // Keep motion subtle and professional; avoid aggressive mouse-parallax.
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolioInteractions);
} else {
  initPortfolioInteractions();
}
