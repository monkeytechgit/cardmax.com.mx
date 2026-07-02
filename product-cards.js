(() => {
  const interactiveSelector = "a, button, input, textarea, select, summary";
  const supabaseConfig = {
    endpoint: "https://jdclxczkvffwwleppbbu.supabase.co/rest/v1/solicitudes_cotizacion",
    anonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkY2x4Y3prdmZmd3dsZXBwYmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTc2OTcsImV4cCI6MjA2NzU5MzY5N30.ixG7x4nOLn7VkgKdjORh_tVA9M7qhUvobBQYhvbw168",
  };
  const emailJsConfig = {
    sdkUrl: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
    serviceId: "service_y17nwsa",
    templateId: "template_y4y0gl8",
    publicKey: "5vTFdcXJ0G3y7ZaPs",
  };
  const quoteProducts = [
    "Ayúdame a elegir",
    "Tarjetas PVC personalizadas",
    "Credenciales empresariales",
    "Credenciales escolares",
    "Tarjeta de presentación digital NFC personalizada",
    "Tarjeta de presentación NFC metálica",
    "Tarjeta NFC para recibir reseñas de Google",
    "Tarjetas con chip NFC",
    "Tarjetas PVC para empresas, escuelas y proyectos",
  ];
  const pageProductMap = {
    "tarjeta-pvc-personalizada.html": "Tarjetas PVC personalizadas",
    "credenciales-empresariales.html": "Credenciales empresariales",
    "credenciales-escolares.html": "Credenciales escolares",
    "tarjeta-presentacion-digital-nfc.html": "Tarjeta de presentación digital NFC personalizada",
    "tarjeta-nfc-metalica.html": "Tarjeta de presentación NFC metálica",
    "tarjeta-social-nfc.html": "Tarjeta NFC para recibir reseñas de Google",
    "tarjetas-chip-nfc.html": "Tarjetas con chip NFC",
    "tarjetas-pvc.html": "Tarjetas PVC personalizadas",
    "tarjetas-para-empresas.html": "Tarjetas PVC para empresas, escuelas y proyectos",
  };
  const whatsappPageMessages = {
    "tarjeta-pvc-personalizada.html":
      "Hola CardMax, me interesa recibir una cotización de tarjetas PVC personalizadas.",
    "credenciales-empresariales.html":
      "Hola CardMax, me interesa recibir una cotización de credenciales empresariales.",
    "credenciales-escolares.html":
      "Hola CardMax, me interesa recibir una cotización de credenciales escolares.",
    "tarjeta-presentacion-digital-nfc.html":
      "Hola CardMax, me interesa recibir una cotización de tarjetas de presentación digital NFC.",
    "tarjeta-nfc-metalica.html":
      "Hola CardMax, me interesa recibir una cotización de tarjetas de presentación NFC metálicas.",
    "tarjeta-social-nfc.html":
      "Hola CardMax, me interesa recibir una cotización de tarjetas NFC para reseñas de Google.",
    "tarjetas-chip-nfc.html":
      "Hola CardMax, me interesa recibir una cotización de tarjetas con chip NFC.",
    "tarjetas-pvc.html": "Hola CardMax, me interesa recibir una cotización de tarjetas PVC.",
    "tarjetas-para-empresas.html":
      "Hola CardMax, me interesa recibir una cotización de tarjetas para empresas y equipos.",
  };
  const defaultWhatsappMessage = "Hola CardMax, me interesa recibir una cotización.";

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });

  document
    .querySelectorAll(".product-card[data-href], .related-product-card[data-href]")
    .forEach((card) => {
      const href = card.dataset.href;

      if (!href) {
        return;
      }

      card.addEventListener("click", (event) => {
        if (event.target.closest(interactiveSelector)) {
          return;
        }

        window.location.href = href;
      });

      card.addEventListener("keydown", (event) => {
        if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) {
          return;
        }

        event.preventDefault();
        window.location.href = href;
      });
    });

  const buildQuoteModal = () => {
    const productOptions = quoteProducts
      .map((product) => `<option value="${escapeHtml(product)}">${escapeHtml(product)}</option>`)
      .join("");

    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="quote-modal" hidden>
        <div class="quote-modal-backdrop" data-quote-close></div>
        <section class="quote-modal-panel" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
          <button class="quote-modal-close" type="button" data-quote-close aria-label="Cerrar formulario">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
          <img class="quote-modal-logo" src="img/cardmax-logo.webp" alt="CardMax">
          <h2 id="quote-modal-title">Solicita tu cotización</h2>
          <p>Cuéntanos qué necesitas y prepararemos una opción personalizada.</p>
          <form class="quote-form">
            <div class="quote-form-grid">
              <label>
                <span>Tipo de producto <b>*</b></span>
                <select name="product" required>
                  ${productOptions}
                </select>
              </label>
              <label>
                <span>Cantidad aproximada <b>*</b></span>
                <input name="quantity" type="number" min="1" value="1" required>
              </label>
              <label>
                <span>Nombre completo <b>*</b></span>
                <input name="name" type="text" autocomplete="name" required>
              </label>
              <label>
                <span>Empresa <small>opcional</small></span>
                <input name="company" type="text" autocomplete="organization">
              </label>
              <label>
                <span>Teléfono <small>opcional</small></span>
                <input name="phone" type="tel" autocomplete="tel">
              </label>
              <label>
                <span>Correo electrónico <b>*</b></span>
                <input name="email" type="email" autocomplete="email" required>
              </label>
              <label class="quote-form-full">
                <span>Cuéntanos brevemente qué tienes en mente <small>opcional</small></span>
                <textarea name="message" rows="4" placeholder="Ejemplo: Necesitamos 15 tarjetas para el equipo comercial, personalizadas con el logo y los datos de cada asesor."></textarea>
              </label>
            </div>
            <button class="primary-button quote-submit" type="submit">
              <i class="fa fa-paper-plane" aria-hidden="true"></i>
              Recibir mi cotización
            </button>
            <p class="quote-form-status" role="status" aria-live="polite"></p>
            <p class="quote-modal-note">Te contactaremos para confirmar los detalles y preparar tu cotización. Sin compromiso.</p>
          </form>
          <div class="quote-loading-overlay" hidden aria-hidden="true">
            <span class="quote-loading-spinner"></span>
            <p>Enviando tu solicitud...</p>
          </div>
        </section>
      </div>`,
    );
  };

  buildQuoteModal();

  const quoteModal = document.querySelector(".quote-modal");
  const quotePanel = quoteModal?.querySelector(".quote-modal-panel");
  const quoteForm = quoteModal?.querySelector(".quote-form");
  const productSelect = quoteModal?.querySelector('select[name="product"]');
  const quoteSubmit = quoteModal?.querySelector(".quote-submit");
  const quoteStatus = quoteModal?.querySelector(".quote-form-status");
  const quoteLoadingOverlay = quoteModal?.querySelector(".quote-loading-overlay");
  const quoteCloseButtons = quoteModal?.querySelectorAll("[data-quote-close]");
  let emailJsLoader = null;
  let quoteIsLoading = false;
  let lastFocusedElement = null;

  const getCurrentPageProduct = () => {
    const pageName = window.location.pathname.split("/").pop() || "index.html";

    return pageProductMap[pageName] || "Ayúdame a elegir";
  };

  const getCurrentWhatsappMessage = () => {
    const pageName = window.location.pathname.split("/").pop() || "index.html";

    return whatsappPageMessages[pageName] || defaultWhatsappMessage;
  };

  document.querySelectorAll('a[href*="wa.me/526643053834"]').forEach((link) => {
    link.href = `https://wa.me/526643053834?text=${encodeURIComponent(getCurrentWhatsappMessage())}`;
  });

  const openQuoteModal = () => {
    lastFocusedElement = document.activeElement;

    if (productSelect) {
      productSelect.value = getCurrentPageProduct();
    }

    quoteModal.hidden = false;
    document.body.classList.add("quote-modal-open");
    window.setTimeout(() => {
      quoteForm?.querySelector("select, input, textarea, button")?.focus();
    }, 0);
  };

  const closeQuoteModal = () => {
    if (quoteIsLoading) {
      return;
    }

    quoteModal.hidden = true;
    document.body.classList.remove("quote-modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  document.querySelectorAll('a[href="#cotizacion"]').forEach((trigger) => {
    const href = trigger.getAttribute("href") || "";
    const label = trigger.textContent.toLowerCase();
    const isQuoteTrigger =
      href === "#cotizacion" ||
      href.toLowerCase().includes("cotizaci") ||
      label.includes("solicitar cotización");

    if (isQuoteTrigger) {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openQuoteModal();
      });
    }
  });

  quoteCloseButtons?.forEach((closeButton) => {
    closeButton.addEventListener("click", closeQuoteModal);
  });

  quoteModal?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeQuoteModal();
      return;
    }

    if (event.key !== "Tab" || !quotePanel) {
      return;
    }

    const focusable = quotePanel.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  const setQuoteStatus = (message, type = "") => {
    if (!quoteStatus) {
      return;
    }

    quoteStatus.textContent = message;
    quoteStatus.dataset.status = type;
  };

  const resetQuoteForm = () => {
    quoteForm?.reset();

    if (productSelect) {
      productSelect.value = getCurrentPageProduct();
    }
  };

  const getFormValue = (formData, fieldName, fallback = "") => {
    const value = formData.get(fieldName);
    const text = String(value || "").trim();

    return text || fallback;
  };

  const setQuoteLoading = (isLoading, message = "Enviando tu solicitud...") => {
    quoteIsLoading = isLoading;
    quotePanel?.classList.toggle("is-loading", isLoading);
    quotePanel?.setAttribute("aria-busy", isLoading ? "true" : "false");

    if (quoteLoadingOverlay) {
      quoteLoadingOverlay.hidden = !isLoading;
      quoteLoadingOverlay.setAttribute("aria-hidden", isLoading ? "false" : "true");
      quoteLoadingOverlay.querySelector("p").textContent = message;
    }

    quoteForm?.querySelectorAll("input, select, textarea, button").forEach((control) => {
      control.disabled = isLoading;
    });

    quoteCloseButtons?.forEach((closeButton) => {
      closeButton.disabled = isLoading;
    });
  };

  const loadEmailJs = () => {
    if (window.emailjs?.send) {
      return Promise.resolve(window.emailjs);
    }

    if (emailJsLoader) {
      return emailJsLoader;
    }

    emailJsLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = emailJsConfig.sdkUrl;
      script.async = true;
      script.onload = () => {
        if (window.emailjs?.send) {
          resolve(window.emailjs);
          return;
        }

        reject(new Error("No se pudo inicializar EmailJS"));
      };
      script.onerror = () => reject(new Error("No se pudo cargar EmailJS"));
      document.head.appendChild(script);
    });

    return emailJsLoader;
  };

  const sendQuoteEmail = async (payload) => {
    const emailjs = await loadEmailJs();

    await emailjs.send(
      emailJsConfig.serviceId,
      emailJsConfig.templateId,
      {
        nombre: payload.nombre_completo,
        empresa: payload.empresa || "No especificada",
        correo: payload.correo_electronico,
        telefono: payload.telefono || "No especificado",
        producto: payload.tipo_producto,
        cantidad: payload.cantidad_aproximada || "No especificada",
        entrega: "Por confirmar",
        descripcion: payload.mensaje || "No especificada",
      },
      {
        publicKey: emailJsConfig.publicKey,
      },
    );
  };

  quoteForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const quantity = Number.parseInt(formData.get("quantity"), 10);
    const payload = {
      tipo_producto: getFormValue(formData, "product", "Ayúdame a elegir"),
      cantidad_aproximada: Number.isNaN(quantity) ? null : quantity,
      nombre_completo: getFormValue(formData, "name"),
      empresa: getFormValue(formData, "company") || null,
      telefono: getFormValue(formData, "phone") || null,
      correo_electronico: getFormValue(formData, "email"),
      mensaje: getFormValue(formData, "message") || null,
    };
    let quoteStored = false;

    setQuoteLoading(true, "Guardando tu solicitud...");
    setQuoteStatus("Guardando tu solicitud...", "loading");

    try {
      const response = await fetch(supabaseConfig.endpoint, {
        method: "POST",
        headers: {
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Supabase respondió con estado ${response.status}`);
      }

      quoteStored = true;
      setQuoteLoading(true, "Enviando confirmación...");
      setQuoteStatus("Solicitud guardada. Preparando confirmación...", "loading");
      await sendQuoteEmail(payload);

      resetQuoteForm();
      setQuoteStatus(
        "Listo, recibimos tu solicitud. Te responderemos en un lapso aproximado de 10 minutos.",
        "success",
      );
    } catch (error) {
      if (quoteStored) {
        resetQuoteForm();
        setQuoteStatus(
          "Recibimos tu solicitud. Te responderemos en un lapso aproximado de 10 minutos.",
          "success",
        );
        console.error("Error al enviar el aviso de cotización por EmailJS:", error);
      } else {
        setQuoteStatus(
          "No pudimos enviar la solicitud. Inténtalo nuevamente o escríbenos por WhatsApp.",
          "error",
        );
        console.error("Error al guardar la solicitud de cotización:", error);
      }
    } finally {
      setQuoteLoading(false);
    }
  });

  document.querySelectorAll(".product-gallery").forEach((gallery) => {
    const videos = gallery.querySelectorAll("video");

    gallery.querySelectorAll('input[name="product-gallery"]').forEach((input) => {
      input.addEventListener("change", () => {
        videos.forEach((video) => {
          video.pause();
        });
      });
    });
  });

  document.querySelectorAll("[data-business-carousel]").forEach((carousel) => {
    const wrapper = carousel.closest(".business-products-carousel");
    const buttons = wrapper?.querySelectorAll("[data-carousel-direction]");
    let autoplay;

    const getStep = () => {
      const firstCard = carousel.querySelector(".product-card");
      const styles = window.getComputedStyle(carousel);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;

      return firstCard ? firstCard.getBoundingClientRect().width + gap : carousel.clientWidth;
    };

    const moveCarousel = (direction = 1) => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const atStart = carousel.scrollLeft <= 2;
      const atEnd = carousel.scrollLeft >= maxScroll - 2;

      if (direction > 0 && atEnd) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      if (direction < 0 && atStart) {
        carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
        return;
      }

      carousel.scrollBy({
        left: direction * getStep(),
        behavior: "smooth",
      });
    };

    const startAutoplay = () => {
      window.clearInterval(autoplay);
      autoplay = window.setInterval(() => moveCarousel(1), 4800);
    };

    buttons?.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = Number(button.dataset.carouselDirection) || 1;
        moveCarousel(direction);
        startAutoplay();
      });
    });

    wrapper?.addEventListener("mouseenter", () => window.clearInterval(autoplay));
    wrapper?.addEventListener("mouseleave", startAutoplay);
    wrapper?.addEventListener("focusin", () => window.clearInterval(autoplay));
    wrapper?.addEventListener("focusout", startAutoplay);

    startAutoplay();
  });
})();
