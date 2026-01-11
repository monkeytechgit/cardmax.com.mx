// Modal de Cotización con Supabase
(function initCotizacionModal() {
  const SUPABASE_URL = 'https://jdclxczkvffwwleppbbu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkY2x4Y3prdmZmd3dsZXBwYmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTc2OTcsImV4cCI6MjA2NzU5MzY5N30.ixG7x4nOLn7VkgKdjORh_tVA9M7qhUvobBQYhvbw168';

  // Crear el HTML del modal
  const modalHTML = `
    <div id="cotizacion-modal" class="modal-overlay" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-container">
        <div class="modal-header">
          <h2 id="modal-title" class="h3">Solicitar Cotización</h2>
          <button type="button" class="modal-close" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="cotizacion-form" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="nombre_completo">Nombre Completo *</label>
                <input type="text" id="nombre_completo" name="nombre_completo" required placeholder="Ej: Juan Pérez González" />
                <span class="form-error"></span>
              </div>

              <div class="form-group">
                <label for="correo">Correo Electrónico *</label>
                <input type="email" id="correo" name="correo" required placeholder="Ej. tu@empresa.com" />
                <span class="form-error"></span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="telefono">Teléfono *</label>
                <input type="tel" id="telefono" name="telefono" required placeholder="Ej. 664 123 4567" />
                <span class="form-error"></span>
              </div>

              <div class="form-group">
                <label for="empresa">Empresa / Institución</label>
                <input type="text" id="empresa" name="empresa" placeholder="Nombre de tu empresa" />
              </div>
            </div>

            <div class="form-group">
              <label for="tipo_producto">Tipo de Producto *</label>
              <select id="tipo_producto" name="tipo_producto" required>
                <option value="">Selecciona un tipo</option>
                <option value="Tarjetas PVC">Tarjetas PVC</option>
                <option value="Tarjetas NFC">Tarjetas NFC</option>
                <option value="Etiquetas Adhesivas">Etiquetas Adhesivas</option>
                <option value="Otro">Otro producto</option>
              </select>
              <span class="form-error"></span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cantidad">Cantidad Estimada *</label>
                <input type="number" id="cantidad" name="cantidad" required min="1" placeholder="Ej: 100" />
                <span class="form-error"></span>
              </div>

              <div class="form-group">
                <label for="entrega">Fecha de Entrega Deseada</label>
                <input type="date" id="entrega" name="entrega" />
              </div>
            </div>

            <div class="form-group">
              <label for="descripcion">Descripción del Proyecto *</label>
              <textarea id="descripcion" name="descripcion" required rows="4" placeholder="Describe tu proyecto: materiales, acabados, colores, características especiales..."></textarea>
              <span class="form-error"></span>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-soft modal-cancel">Cancelar</button>
              <button type="submit" class="btn btn-primary">
                <span class="btn-text">Enviar Cotización</span>
                <span class="btn-spinner" style="display:none;">⏳ Enviando...</span>
              </button>
            </div>
          </form>

          <div id="form-success" class="form-message form-success" style="display:none;">
            <div class="success-icon">✅</div>
            <h3>¡Cotización Enviada!</h3>
            <p>Hemos recibido tu solicitud correctamente. Nuestro equipo te contactará en menos de 24 horas.</p>
            <button type="button" class="btn btn-primary modal-close-success">Cerrar</button>
          </div>

          <div id="form-error" class="form-message form-error-message" style="display:none;">
            <div class="error-icon">❌</div>
            <h3>Error al Enviar</h3>
            <p>Hubo un problema al enviar tu cotización. Por favor intenta nuevamente o contáctanos directamente.</p>
            <button type="button" class="btn btn-soft modal-retry">Reintentar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insertar el modal en el body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('cotizacion-modal');
  const form = document.getElementById('cotizacion-form');
  const closeButtons = modal.querySelectorAll('.modal-close, .modal-cancel, .modal-close-success');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');
  const retryButton = modal.querySelector('.modal-retry');

  let currentProductInfo = null;

  // Función para abrir el modal
  window.openCotizacionModal = function(productInfo = null) {
    currentProductInfo = productInfo;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Si hay info del producto, pre-llenar el campo tipo_producto
    if (productInfo && productInfo.tipo) {
      const tipoSelect = form.querySelector('#tipo_producto');
      tipoSelect.value = productInfo.tipo;
    }

    // Focus en el primer campo
    setTimeout(() => {
      form.querySelector('#nombre_completo').focus();
    }, 100);
  };

  // Alias para compatibilidad con botones del navbar
  window.openQuoteModal = window.openCotizacionModal;

  // Función para cerrar el modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    form.style.display = 'block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    form.reset();
    clearErrors();
    currentProductInfo = null;
  }

  // Event listeners para cerrar
  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Validación en tiempo real
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  function validateField(field) {
    const errorSpan = field.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Ingresa un correo válido';
      }
    } else if (field.type === 'tel' && field.value) {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Ingresa un teléfono válido (mínimo 10 dígitos)';
      }
    } else if (field.type === 'number' && field.value) {
      if (parseInt(field.value) < 1) {
        isValid = false;
        errorMessage = 'La cantidad debe ser mayor a 0';
      }
    }

    if (!isValid) {
      field.classList.add('invalid');
      if (errorSpan) errorSpan.textContent = errorMessage;
    } else {
      field.classList.remove('invalid');
      if (errorSpan) errorSpan.textContent = '';
    }

    return isValid;
  }

  function clearErrors() {
    inputs.forEach(input => {
      input.classList.remove('invalid');
      const errorSpan = input.parentElement.querySelector('.form-error');
      if (errorSpan) errorSpan.textContent = '';
    });
  }

  // Retry button
  retryButton.addEventListener('click', () => {
    errorMessage.style.display = 'none';
    form.style.display = 'block';
  });

  // Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar todos los campos
    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Deshabilitar botón y mostrar spinner
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline';

    try {
      // Recopilar datos del formulario
      const formData = new FormData(form);
      
      // Obtener el nombre del archivo actual (ej: pvc.html, index.html)
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      
      const data = {
        nombre_completo: formData.get('nombre_completo'),
        correo: formData.get('correo'),
        telefono: formData.get('telefono'),
        empresa: formData.get('empresa') || null,
        tipo_tarjeta: formData.get('tipo_producto'),
        cantidad: formData.get('cantidad') || null,
        descripcion: formData.get('descripcion'),
        entrega: formData.get('entrega') ? new Date(formData.get('entrega')).toISOString() : null,
        presupuesto: null
      };

      console.log('📤 Enviando cotización:', data);

      // Enviar a Supabase
      const response = await fetch(`${SUPABASE_URL}/rest/v1/contacto_webpage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error de Supabase:', errorText);
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }

      console.log('✅ Cotización enviada exitosamente');

      // Mostrar mensaje de éxito
      form.style.display = 'none';
      successMessage.style.display = 'block';

      // Enviar evento a Google Analytics (si está configurado)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'cotizacion',
          event_label: data.tipo_producto,
          value: data.cantidad
        });
      }

    } catch (error) {
      console.error('❌ Error al enviar cotización:', error);
      
      // Mostrar mensaje de error
      form.style.display = 'none';
      errorMessage.style.display = 'block';

    } finally {
      // Restaurar botón
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnSpinner.style.display = 'none';
    }
  });

  // Interceptar todos los botones de cotización en la página
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href*="mailto:"], button[data-product-quote-now], .btn-quote-now');
    
    if (target) {
      // Ignorar si es el botón de WhatsApp
      if (target.classList.contains('whatsapp-float')) {
        return;
      }
      
      // Solo interceptar botones y enlaces de cotización (no WhatsApp)
      const href = target.getAttribute('href') || '';
      
      // Si es un botón (sin href) con data-product-quote-now o btn-quote-now
      if (target.hasAttribute('data-product-quote-now') || target.classList.contains('btn-quote-now')) {
        e.preventDefault();
        e.stopPropagation();
        
        // Intentar obtener info del producto desde data attributes o el documento
        let productInfo = null;
        const productName = document.querySelector('[data-product-name]')?.textContent || 
                           document.querySelector('h1')?.textContent || null;
        const productType = document.querySelector('[data-product-category]')?.textContent || null;
        
        if (productName) {
          productInfo = {
            nombre: productName,
            tipo: productType || 'Producto'
          };
        }
        
        openCotizacionModal(productInfo);
      } 
      // Si es un enlace mailto con cotización
      else if (href.includes('mailto:') && (href.toLowerCase().includes('cotizaci') || href.toLowerCase().includes('subject='))) {
        e.preventDefault();
        e.stopPropagation();
        
        // Intentar obtener info del producto desde el documento
        let productInfo = null;
        const productName = document.querySelector('[data-product-name]')?.textContent || 
                           document.querySelector('h1')?.textContent || null;
        const productType = document.querySelector('[data-product-category]')?.textContent || null;
        
        if (productName) {
          productInfo = {
            nombre: productName,
            tipo: productType || 'Producto'
          };
        }
        
        openCotizacionModal(productInfo);
      }
    }
  });

  console.log('✅ Modal de cotización inicializado');
})();
