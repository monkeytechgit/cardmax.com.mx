// Formulario de Contacto con Supabase
(function initContactoForm() {
  const SUPABASE_URL = 'https://jdclxczkvffwwleppbbu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkY2x4Y3prdmZmd3dsZXBwYmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTc2OTcsImV4cCI6MjA2NzU5MzY5N30.ixG7x4nOLn7VkgKdjORh_tVA9M7qhUvobBQYhvbw168';

  // EmailJS (GitHub Pages compatible, envío desde el navegador)
  // Script SDK recomendado: https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js
  const EMAILJS_PUBLIC_KEY = '5vTFdcXJ0G3y7ZaPs';
  const EMAILJS_SERVICE_ID = 'service_y17nwsa';
  const EMAILJS_TEMPLATE_ID = 'template_y4y0gl8';

  let emailJsInitPromise = null;

  function ensureEmailJsLoadedAndInit() {
    if (emailJsInitPromise) return emailJsInitPromise;

    emailJsInitPromise = new Promise((resolve, reject) => {
      const init = () => {
        try {
          if (!window.emailjs || typeof window.emailjs.send !== 'function') {
            throw new Error('EmailJS SDK no disponible');
          }
          window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
          resolve();
        } catch (e) {
          reject(e);
        }
      };

      if (window.emailjs && typeof window.emailjs.send === 'function') {
        init();
        return;
      }

      const existing = document.querySelector('script[data-emailjs-sdk="true"]');
      if (existing) {
        existing.addEventListener('load', init, { once: true });
        existing.addEventListener('error', () => reject(new Error('No se pudo cargar EmailJS')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.async = true;
      script.setAttribute('data-emailjs-sdk', 'true');
      script.onload = init;
      script.onerror = () => reject(new Error('No se pudo cargar EmailJS'));
      document.head.appendChild(script);
    });

    return emailJsInitPromise;
  }

  const form = document.getElementById('contacto-form');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');
  const errorText = document.getElementById('error-text');

  if (!form) return;

  // Validación en tiempo real
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  // Función de validación de campo
  function validateField(field) {
    const errorSpan = field.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMsg = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMsg = 'Este campo es obligatorio';
    } else if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMsg = 'Introduce un correo válido';
      }
    } else if (field.type === 'tel' && field.value) {
      const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(field.value)) {
        isValid = false;
        errorMsg = 'Introduce un teléfono válido (mín. 10 dígitos)';
      }
    } else if (field.type === 'number' && field.value) {
      if (parseInt(field.value, 10) < 1) {
        isValid = false;
        errorMsg = 'La cantidad debe ser mayor a 0';
      }
    }

    if (!isValid) {
      field.classList.add('error');
      if (errorSpan) errorSpan.textContent = errorMsg;
    } else {
      field.classList.remove('error');
      if (errorSpan) errorSpan.textContent = '';
    }

    return isValid;
  }

  // Función para limpiar errores
  function clearErrors() {
    inputs.forEach(input => {
      input.classList.remove('error');
      const errorSpan = input.parentElement.querySelector('.form-error');
      if (errorSpan) errorSpan.textContent = '';
    });
  }

  // Función para validar todo el formulario
  function validateForm() {
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    return isValid;
  }

  // Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      // Scroll al primer error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Obtener datos del formulario
    const formData = new FormData(form);
    
    // Obtener el nombre del archivo actual (ej: contacto.html)
    const currentPage = window.location.pathname.split('/').pop() || 'contacto.html';
    
    const entregaISO = formData.get('entrega') ? new Date(formData.get('entrega')).toISOString() : null;
    const entregaLocal = formData.get('entrega') ? new Date(formData.get('entrega')).toLocaleDateString('es-MX') : '';

    const data = {
      nombre_completo: formData.get('nombre_completo'),
      correo: formData.get('correo'),
      telefono: formData.get('telefono'),
      empresa: formData.get('empresa') || null,
      tipo_tarjeta: formData.get('tipo_producto'),
      cantidad: formData.get('cantidad') || null,
      descripcion: formData.get('descripcion'),
      entrega: entregaISO,
      presupuesto: null
    };

    // Mostrar spinner
    const btnText = form.querySelector('.btn-text');
    const btnSpinner = form.querySelector('.btn-spinner');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (btnText) btnText.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline';
    if (submitBtn) submitBtn.disabled = true;

    try {
      // 1) Enviar correo por EmailJS
      // Variables del template:
      // {{nombre}} {{empresa}} {{correo}} {{telefono}} {{producto}} {{cantidad}} {{entrega}} {{descripcion}} {{title}} {{name}}
      await ensureEmailJsLoadedAndInit();

      const templateParams = {
        nombre: data.nombre_completo,
        empresa: data.empresa || '',
        correo: data.correo,
        telefono: data.telefono,
        producto: data.tipo_tarjeta || '',
        cantidad: data.cantidad || '',
        entrega: entregaLocal,
        descripcion: data.descripcion,
        title: `Cotización: ${data.tipo_tarjeta || 'Producto'} (${currentPage})`,
        name: data.nombre_completo
      };

      const emailResp = await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log('✅ EmailJS enviado (contacto):', emailResp);

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
        const supabaseErrorText = await response.text();
        console.error('❌ Error de Supabase:', supabaseErrorText);
        throw new Error(`Error HTTP: ${response.status} - ${supabaseErrorText}`);
      }

      // Éxito
      form.style.display = 'none';
      successMessage.style.display = 'block';
      
      // Scroll suave al mensaje de éxito
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Google Analytics event (si está configurado)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'cotizacion',
          event_label: data.tipo_tarjeta,
          value: data.cantidad
        });
      }

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      
      // Mostrar mensaje de error
      form.style.display = 'none';
      errorMessage.style.display = 'block';
      
      if (errorText) {
        errorText.textContent = 'No pudimos enviar tu cotización. Por favor, inténtalo de nuevo o contáctanos directamente por teléfono o WhatsApp.';
      }
      
      // Scroll al mensaje de error
      errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } finally {
      // Restaurar botón
      if (btnText) btnText.style.display = 'inline';
      if (btnSpinner) btnSpinner.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  // Prevenir envío con Enter en campos de texto (excepto textarea)
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const nextInput = getNextInput(input);
        if (nextInput) {
          nextInput.focus();
        }
      }
    });
  });

  // Función para obtener el siguiente input
  function getNextInput(currentInput) {
    const formElements = Array.from(form.elements);
    const currentIndex = formElements.indexOf(currentInput);
    for (let i = currentIndex + 1; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        return element;
      }
    }
    return null;
  }
})();
