/* ===============================================
   GLOBAL.JS - JavaScript compartido
   Navbar, scroll, interacciones globales
   =============================================== */

// Configuración de Supabase
const SUPABASE_URL = 'https://jdclxczkvffwwleppbbu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkY2x4Y3prdmZmd3dsZXBwYmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTc2OTcsImV4cCI6MjA2NzU5MzY5N30.ixG7x4nOLn7VkgKdjORh_tVA9M7qhUvobBQYhvbw168';

// Función para enviar cotización a Supabase
async function submitQuoteToSupabase(form, submitButton) {
    try {
        // Recopilar datos del formulario
        const formData = new FormData(form);
        const data = {
            nombre_completo: formData.get('fullName'),
            correo: formData.get('email'),
            telefono: formData.get('phone') || null,
            empresa: formData.get('company') || null,
            tipo_tarjeta: formData.get('productType'),
            cantidad: formData.get('quantity'),
            descripcion: formData.get('projectDescription'),
            entrega: formData.get('timeline') ? new Date(formData.get('timeline')).toISOString() : null,
            presupuesto: formData.get('budget') || null
        };

        console.log('Enviando datos a Supabase:', data);

        // Hacer la petición a Supabase
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

        if (response.ok) {
            // Éxito - mostrar mensaje y cerrar modal
            showSuccessMessage();
            setTimeout(() => {
                closeQuoteModal();
            }, 2000);
        } else {
            // Error de servidor
            const errorData = await response.text();
            console.error('Error del servidor:', response.status, errorData);
            showErrorMessage('Error del servidor. Por favor, inténtalo de nuevo más tarde.');
        }

    } catch (error) {
        // Error de conexión
        console.error('Error al enviar cotización:', error);
        showErrorMessage('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
    } finally {
        // Restaurar estado del botón
        if (submitButton) {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h4>¡Cotización enviada exitosamente!</h4>
            <p>Hemos recibido tu solicitud. Nos pondremos en contacto contigo en menos de 24 horas para proporcionarte una cotización personalizada.</p>
            <p><strong>¿Necesitas respuesta más rápida?</strong><br>
            Llámanos al <a href="tel:+526643053834">(664) 305-3834</a> o <a href="https://wa.me/526643053834?text=Hola!%20Acabo%20de%20enviar%20mi%20cotización%20por%20el%20sitio%20web." target="_blank">escríbenos por WhatsApp</a>.</p>
        `;
        
        modalBody.innerHTML = '';
        modalBody.appendChild(successMessage);
    }
}

// Función para mostrar mensaje de error
function showErrorMessage(message) {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h4>Error al enviar cotización</h4>
            <p>${message}</p>
            <div class="error-actions">
                <button type="button" class="btn-retry" onclick="location.reload()">Reintentar</button>
                <button type="button" class="btn-contact">
                    <i class="fab fa-whatsapp"></i>
                    Contactar por WhatsApp
                </button>
            </div>
        `;
        
        modalBody.innerHTML = '';
        modalBody.appendChild(errorMessage);
        
        // Agregar evento al botón de WhatsApp
        const whatsappBtn = errorMessage.querySelector('.btn-contact');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                const message = encodeURIComponent('Hola! Tuve problemas para enviar mi cotización por el sitio web. ¿Podrían ayudarme?');
                window.open(`https://wa.me/526643053834?text=${message}`, '_blank');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Navbar Mobile Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevenir scroll cuando el menu está abierto
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Cerrar menu al hacer click en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Cerrar menu al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Agregar sombra al navbar cuando se hace scroll
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // Ocultar/mostrar navbar en mobile al hacer scroll
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    /* ===============================================
       MODAL DE COTIZACIÓN - FUNCIONALIDAD
       =============================================== */
    
    // Variables del Modal
    const quoteModalOverlay = document.getElementById('quote-modal');
    const quoteForm = document.getElementById('quote-form');
    const modalClose = document.querySelector('.modal-close');
    const btnCancel = document.querySelector('.btn-cancel');
    const btnSubmit = document.querySelector('.btn-submit');
    
    // Elementos que abren el modal
    const quoteButtons = document.querySelectorAll('[data-quote-trigger]');
    
    // Verificar que se encuentran los elementos críticos
    if (!quoteModalOverlay) {
        console.error('CardMax: Modal overlay no encontrado');
    } else if (quoteButtons.length === 0) {
        console.warn('CardMax: No se encontraron botones de cotización');
    } else {
        console.log(`CardMax: ${quoteButtons.length} botones de cotización encontrados`);
    }

    // Función para abrir el modal
    function openQuoteModal(triggeredButton = null) {
        console.log('Intentando abrir modal...');
        if (quoteModalOverlay) {
            console.log('Modal encontrado, agregando clase active');
            quoteModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Auto-detectar tipo de tarjeta basado en la página actual o botón
            const productSelect = document.getElementById('product-type');
            if (productSelect) {
                autoDetectProductType(productSelect, triggeredButton);
            }
            
            console.log('Modal debería estar visible ahora');
        } else {
            console.error('Modal overlay no encontrado al intentar abrir');
        }
    }
    
    // Función para cerrar el modal
    function closeQuoteModal() {
        if (quoteModalOverlay) {
            quoteModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset del formulario después de un pequeño delay
            setTimeout(() => {
                if (quoteForm) {
                    quoteForm.reset();
                    if (btnSubmit) {
                        btnSubmit.classList.remove('loading');
                        btnSubmit.disabled = false;
                    }
                }
            }, 300);
        }
    }
    
    // Auto-detectar el tipo de producto basado en la URL o el botón clickeado
    function autoDetectProductType(selectElement, triggeredButton = null) {
        let selectedProduct = null;
        
        // Primero, intentar detectar por atributo data-service del botón
        if (triggeredButton && triggeredButton.hasAttribute('data-service')) {
            const serviceMap = {
                'Credenciales Escolares': 'credenciales-escolares',
                'Gafetes Empresariales': 'gafetes-empresariales',
                'Tarjetas de Identificación': 'tarjetas-identificacion',
                'Tarjetas de Membresía': 'tarjetas-membresia',
                'Tarjetas de Regalo': 'tarjetas-regalo',
                'Tarjetas de Lealtad': 'tarjetas-lealtad',
                'Tarjetas para Eventos': 'tarjetas-eventos',
                'Tarjetas de Presentación': 'tarjetas-presentacion',
                'Tarjetas RFID y QR': 'tarjetas-rfid-qr'
            };
            
            const serviceName = triggeredButton.getAttribute('data-service');
            selectedProduct = serviceMap[serviceName];
        }
        
        // Si no se detectó por botón, detectar por URL
        if (!selectedProduct) {
            const currentPath = window.location.pathname;
            const filename = currentPath.split('/').pop();
            
            const productMap = {
                'credenciales-escolares.html': 'credenciales-escolares',
                'gafetes-empresariales.html': 'gafetes-empresariales',
                'tarjetas-identificacion.html': 'tarjetas-identificacion',
                'tarjetas-membresia.html': 'tarjetas-membresia',
                'tarjetas-regalo.html': 'tarjetas-regalo',
                'tarjetas-lealtad.html': 'tarjetas-lealtad',
                'tarjetas-eventos.html': 'tarjetas-eventos',
                'tarjetas-presentacion.html': 'tarjetas-presentacion',
                'tarjetas-rfid-qr.html': 'tarjetas-rfid-qr'
            };
            
            selectedProduct = productMap[filename];
        }
        
        // Aplicar la selección
        if (selectedProduct && selectElement) {
            selectElement.value = selectedProduct;
            
            // Agregar un efecto visual para indicar que se autoseleccionó
            selectElement.style.borderColor = '#10b981';
            selectElement.style.backgroundColor = '#f0fdf4';
            
            // Restaurar estilos después de 2 segundos
            setTimeout(() => {
                selectElement.style.borderColor = '';
                selectElement.style.backgroundColor = '';
            }, 2000);
            
            console.log('Producto autoseleccionado:', selectedProduct);
        }
    }
    
    // Función de test global (disponible en console)
    window.testModal = function() {
        console.log('Test manual del modal');
        openQuoteModal();
    };
    
    // Event Listeners para abrir el modal
    if (quoteModalOverlay && quoteButtons.length > 0) {
        quoteButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Botón de cotización clickeado:', index + 1);
                openQuoteModal(this); // Pasar el botón clickeado
            });
        });
        console.log(`Event listeners agregados a ${quoteButtons.length} botones`);
    } else {
        console.error('No se pudieron agregar event listeners:', {
            modalExists: !!quoteModalOverlay,
            buttonsCount: quoteButtons.length
        });
    }
    
    // Event Listeners para cerrar el modal
    if (modalClose) {
        modalClose.addEventListener('click', closeQuoteModal);
    }
    
    if (btnCancel) {
        btnCancel.addEventListener('click', closeQuoteModal);
    }
    
    // Cerrar modal al hacer click en el overlay
    if (quoteModalOverlay) {
        quoteModalOverlay.addEventListener('click', function(e) {
            if (e.target === quoteModalOverlay) {
                closeQuoteModal();
            }
        });
    }
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && quoteModalOverlay?.classList.contains('active')) {
            closeQuoteModal();
        }
    });
    
    // Validación y envío del formulario
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const requiredFields = quoteForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }
            
            // Validación de email
            const emailField = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField && !emailRegex.test(emailField.value)) {
                emailField.style.borderColor = '#ef4444';
                alert('Por favor, ingrese un email válido.');
                return;
            }
            
            // Loading state
            if (btnSubmit) {
                btnSubmit.classList.add('loading');
                btnSubmit.disabled = true;
            }
            
            // Enviar datos a Supabase
            submitQuoteToSupabase(quoteForm, btnSubmit);
        });
    }
});

// Utility functions
window.CardMaxUtils = {
    // Scroll to element
    scrollToElement: function(elementId, offset = 80) {
        const element = document.getElementById(elementId);
        if (element) {
            const top = element.offsetTop - offset;
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    },
    
    // Format phone number for WhatsApp
    formatWhatsAppNumber: function(number) {
        return number.replace(/\D/g, '');
    },
    
    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
};
