/* ===============================================
   GLOBAL.JS - JavaScript compartido
   Navbar, scroll, interacciones globales
   =============================================== */

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
    function openQuoteModal() {
        console.log('Intentando abrir modal...');
        if (quoteModalOverlay) {
            console.log('Modal encontrado, agregando clase active');
            quoteModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Auto-detectar tipo de tarjeta basado en la página actual
            const productSelect = document.getElementById('product-type');
            if (productSelect) {
                autoDetectProductType(productSelect);
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
    
    // Auto-detectar el tipo de producto basado en la URL
    function autoDetectProductType(selectElement) {
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
        
        if (productMap[filename]) {
            selectElement.value = productMap[filename];
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
                openQuoteModal();
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
            
            // Simular envío (aquí iría la integración real)
            setTimeout(() => {
                // Recopilar datos del formulario
                const formData = new FormData(quoteForm);
                const data = Object.fromEntries(formData);
                
                // Mensaje de confirmación
                alert('¡Cotización enviada correctamente! Nos pondremos en contacto contigo pronto.');
                
                // Cerrar modal
                closeQuoteModal();
                
            }, 2000);
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
