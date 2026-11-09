/* ==========================================================================
   CardMax · Interacciones y animaciones del sitio
   - Animaciones de aparición al hacer scroll
   - Header dinámico, barra de progreso y botón "volver arriba"
   - Contadores animados, slider del hero, pestañas y filtros
   - Acordeones suaves y transiciones entre páginas
   Respeta "prefers-reduced-motion".
   ========================================================================== */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const raf = window.requestAnimationFrame.bind(window);

  root.classList.add("js");

  /* ------------------------------------------------------------------------
     1. Aparición progresiva de elementos al hacer scroll
     ------------------------------------------------------------------------ */
  const revealSelectors = [
    ".section-heading",
    ".product-section-heading",
    ".catalog-heading",
    ".process-page-heading",
    ".reviews-page-heading",
    ".product-card",
    ".application-item",
    ".process-step",
    ".review-item",
    ".faq-list > details",
    ".product-faq-list > details",
    ".product-benefit-card",
    ".product-process-step",
    ".business-check-grid > span",
    ".business-volume-list > article",
    ".business-role-list > a",
    ".web-service-card",
    ".web-plan",
    ".web-partner-points > li",
    ".web-tech-list > li",
    ".workflow-row",
    ".related-product-card",
    ".taploop-step",
    ".taploop-video",
    ".final-cta-inner > *",
    ".product-final-cta-inner > *",
    ".split-feature > *",
    ".value-item",
    ".stat-item",
    ".teaser-card",
    ".footer-brand",
    ".footer-column",
    ".business-split > *",
    ".web-partner > div",
    ".reviews-filter",
  ];

  const revealTargets = document.querySelectorAll(revealSelectors.join(","));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    revealTargets.forEach((el) => {
      // Escalonado según la posición del elemento entre sus hermanos
      const siblings = Array.from(el.parentElement?.children || []);
      const index = Math.max(0, siblings.indexOf(el)) % 6;
      el.style.setProperty("--reveal-delay", `${index * 80}ms`);
      el.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     2. Header dinámico + barra de progreso + volver arriba
     ------------------------------------------------------------------------ */
  const header = document.querySelector(".site-header");
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "back-to-top";
  toTop.setAttribute("aria-label", "Volver al inicio de la página");
  toTop.innerHTML = '<i class="fa fa-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(toTop);
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const menuOpen = document.querySelector(".mobile-menu[open]");

    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    header?.classList.toggle("is-scrolled", y > 12);

    // Oculta el header al bajar y lo muestra al subir
    if (header && !menuOpen && !header.matches(":focus-within")) {
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;

      if (goingDown && y > 420) {
        header.classList.add("is-hidden");
      } else if (goingUp || y < 420) {
        header.classList.remove("is-hidden");
      }
    }

    toTop.classList.toggle("is-visible", y > 700);
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        raf(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  /* ------------------------------------------------------------------------
     3. Contadores animados (+2,000 · 4.9 · 120+ ...)
     ------------------------------------------------------------------------ */
  const counterTargets = document.querySelectorAll(
    ".hero-proof strong, .business-hero-stats strong, .web-partner-points strong, .stat-item strong, [data-count]",
  );

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/^([^\d]*)([\d.,]+)([^\d–-]*)$/);

    if (!match) {
      return;
    }

    const [, prefix, numberText, suffix] = match;
    const decimals = numberText.includes(".") ? numberText.split(".")[1].length : 0;
    const target = Number.parseFloat(numberText.replace(/,/g, ""));

    if (!Number.isFinite(target) || target === 0) {
      return;
    }

    const format = (value) =>
      value.toLocaleString("es-MX", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    const duration = 1400;
    const start = performance.now();

    el.textContent = `${prefix}${format(0)}${suffix}`;

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = `${prefix}${format(target * eased)}${suffix}`;

      if (t < 1) {
        raf(step);
      } else {
        el.textContent = text;
      }
    };

    raf(step);
  };

  if (!reduceMotion && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );

    counterTargets.forEach((el) => counterObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     4. Slider del hero (inicio): autoplay, indicadores y pausa
     ------------------------------------------------------------------------ */
  const hero = document.querySelector(".hero");
  const heroInputs = hero ? Array.from(hero.querySelectorAll(':scope > input[name="hero-slide"]')) : [];

  if (hero && heroInputs.length > 1) {
    const dots = document.createElement("div");
    dots.className = "hero-dots";
    dots.setAttribute("role", "tablist");
    dots.setAttribute("aria-label", "Seleccionar producto destacado");

    heroInputs.forEach((input, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Ver destacado ${i + 1}`);
      dot.addEventListener("click", () => {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        restart();
      });
      dots.appendChild(dot);
    });

    hero.appendChild(dots);

    const syncDots = () => {
      const active = heroInputs.findIndex((input) => input.checked);
      Array.from(dots.children).forEach((dot, i) => {
        dot.classList.toggle("is-active", i === active);
        dot.setAttribute("aria-selected", i === active ? "true" : "false");
      });
      hero.style.setProperty("--hero-active", active);
    };

    heroInputs.forEach((input) => input.addEventListener("change", syncDots));
    hero.addEventListener("click", (event) => {
      if (event.target.closest("label[for^='hero-slide']")) {
        window.setTimeout(() => {
          syncDots();
          restart();
        }, 0);
      }
    });
    syncDots();

    let timer = null;
    const next = () => {
      const active = heroInputs.findIndex((input) => input.checked);
      const target = heroInputs[(active + 1) % heroInputs.length];
      target.checked = true;
      syncDots();
    };
    const stop = () => {
      window.clearInterval(timer);
      hero.classList.remove("is-playing");
    };
    const restart = () => {
      stop();

      if (reduceMotion) {
        return;
      }

      // Reinicia la barra de tiempo del indicador activo
      void hero.offsetWidth;
      hero.classList.add("is-playing");
      timer = window.setInterval(next, 6500);
    };

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", restart);
    hero.addEventListener("focusin", stop);
    hero.addEventListener("focusout", restart);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : restart()));
    restart();
  }

  /* ------------------------------------------------------------------------
     5. Acordeones con animación de altura
     ------------------------------------------------------------------------ */
  document
    .querySelectorAll(".faq-list details, .product-faq-list details, .product-accordions details")
    .forEach((details) => {
      const summary = details.querySelector("summary");
      const content = Array.from(details.children).find((child) => child !== summary);

      if (!summary || !content || reduceMotion || !content.animate) {
        return;
      }

      let animation = null;

      summary.addEventListener("click", (event) => {
        event.preventDefault();
        animation?.cancel();

        if (details.open) {
          const height = content.offsetHeight;
          details.classList.add("is-closing");
          animation = content.animate(
            [
              { height: `${height}px`, opacity: 1 },
              { height: "0px", opacity: 0 },
            ],
            { duration: 260, easing: "cubic-bezier(.4,0,.2,1)" },
          );
          animation.onfinish = () => {
            details.open = false;
            details.classList.remove("is-closing");
          };
        } else {
          details.open = true;
          const height = content.offsetHeight;
          animation = content.animate(
            [
              { height: "0px", opacity: 0 },
              { height: `${height}px`, opacity: 1 },
            ],
            { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" },
          );
        }
      });
    });

  /* ------------------------------------------------------------------------
     6. Menú móvil: cierre al navegar, al tocar fuera o con Escape
     ------------------------------------------------------------------------ */
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenu) {
    const syncBodyLock = () => {
      document.body.classList.toggle("menu-open", mobileMenu.open);
      const icon = mobileMenu.querySelector("summary .fa");
      icon?.classList.toggle("fa-bars", !mobileMenu.open);
      icon?.classList.toggle("fa-times", mobileMenu.open);
    };

    mobileMenu.addEventListener("toggle", syncBodyLock);
    mobileMenu.querySelectorAll("nav a").forEach((link) =>
      link.addEventListener("click", () => {
        mobileMenu.open = false;
      }),
    );
    document.addEventListener("click", (event) => {
      if (mobileMenu.open && !mobileMenu.contains(event.target)) {
        mobileMenu.open = false;
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileMenu.open) {
        mobileMenu.open = false;
        mobileMenu.querySelector("summary")?.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. Pestañas accesibles ([data-tabs])
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));
    const panels = buttons.map((button) => document.getElementById(button.getAttribute("aria-controls")));
    const indicator = tabs.querySelector(".tabs-indicator");

    const moveIndicator = (button) => {
      if (!indicator || !button) {
        return;
      }

      indicator.style.width = `${button.offsetWidth}px`;
      indicator.style.transform = `translateX(${button.offsetLeft}px)`;
    };

    const select = (index, focus = false) => {
      buttons.forEach((button, i) => {
        const active = i === index;
        button.setAttribute("aria-selected", active ? "true" : "false");
        button.tabIndex = active ? 0 : -1;

        if (panels[i]) {
          panels[i].hidden = !active;
          panels[i].classList.toggle("is-active", active);
        }
      });

      moveIndicator(buttons[index]);

      if (focus) {
        buttons[index].focus();
      }
    };

    buttons.forEach((button, i) => {
      button.addEventListener("click", () => select(i));
      button.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const dir = event.key === "ArrowRight" ? 1 : -1;
          select((i + dir + buttons.length) % buttons.length, true);
        }
      });
    });

    tabs.classList.add("tabs-ready");
    select(Math.max(0, buttons.findIndex((b) => b.getAttribute("aria-selected") === "true")));
    window.addEventListener("resize", () =>
      moveIndicator(buttons.find((b) => b.getAttribute("aria-selected") === "true")),
    );
  });

  /* ------------------------------------------------------------------------
     8. Filtros de reseñas y catálogos ([data-filter])
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".reviews-filter, .catalog-filter").forEach((group) => {
    const scope = group.closest("[data-filter-scope]") || group.parentElement;
    const items = Array.from(scope.querySelectorAll("[data-category]"));
    const buttons = Array.from(group.querySelectorAll("[data-filter]"));
    const counter = group.querySelector(".reviews-filter-count") || scope.querySelector(".catalog-count");
    const singular = group.dataset.singular || "proyecto";
    const plural = group.dataset.plural || "proyectos";

    const apply = (filter) => {
      let visible = 0;

      buttons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });

      items.forEach((item) => {
        const show = filter === "todos" || item.dataset.category.split(" ").includes(filter);
        visible += show ? 1 : 0;

        if (show) {
          item.hidden = false;
          item.classList.add("is-visible");
          if (!reduceMotion && item.animate) {
            item.animate(
              [
                { opacity: 0, transform: "translateY(14px) scale(.98)" },
                { opacity: 1, transform: "none" },
              ],
              { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" },
            );
          }
        } else {
          item.hidden = true;
        }
      });

      if (counter) {
        counter.textContent = `${visible} ${visible === 1 ? singular : plural}`;
      }
    };

    buttons.forEach((button) => button.addEventListener("click", () => apply(button.dataset.filter)));
    apply("todos");
  });

  /* ------------------------------------------------------------------------
     9. Efecto de luz que sigue al cursor en tarjetas
     ------------------------------------------------------------------------ */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document
      .querySelectorAll(".product-card, .web-service-card, .product-benefit-card, .web-plan, .value-item, .teaser-card")
      .forEach((card) => {
        card.classList.add("has-spotlight");
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          card.style.setProperty("--my", `${event.clientY - rect.top}px`);
        });
      });
  }

  /* ------------------------------------------------------------------------
     10. Parallax suave en imágenes principales
     ------------------------------------------------------------------------ */
  const parallaxImages = reduceMotion
    ? []
    : Array.from(document.querySelectorAll(".business-hero-media img, .hero-media img"));

  if (parallaxImages.length) {
    let parallaxTicking = false;
    const updateParallax = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        parallaxImages.forEach((img) => {
          img.style.transform = `translate3d(0, ${y * 0.08}px, 0) scale(1.04)`;
        });
      }
      parallaxTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!parallaxTicking) {
          parallaxTicking = true;
          raf(updateParallax);
        }
      },
      { passive: true },
    );
    updateParallax();
  }

  /* ------------------------------------------------------------------------
     11. Transición entre páginas
     Los navegadores con View Transitions entre documentos usan CSS
     (@view-transition). El resto recibe un fundido de salida corto.
     ------------------------------------------------------------------------ */
  const supportsCrossDocTransitions = "onpagereveal" in window;

  if (!reduceMotion && !supportsCrossDocTransitions) {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");

      if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      const samePage = url.pathname === window.location.pathname && url.hash;

      if (url.origin !== window.location.origin || samePage || url.protocol.indexOf("http") !== 0) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(() => {
        window.location.href = url.href;
      }, 200);
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        document.body.classList.remove("is-leaving");
      }
    });
  }
})();
