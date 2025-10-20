// Helper function to process markdown bold syntax (**text** → <strong>text</strong>)
// and convert URLs to hyperlinks
window.processMarkdown = function(text) {
  if (!text) return '';
  // Convert **text** to <strong>text</strong>
  let processed = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Convert URLs to hyperlinks
  processed = processed.replace(/\((https?:\/\/[^\s)]+)\)/g, '(<a href="$1" target="_blank" rel="noopener">$1</a>)');
  return processed;
};

(function renderProductDetail(){
  if (!window.cardmaxProducts) return;
  const detailRoot = document.querySelector('[data-product-detail]');
  if (!detailRoot) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = window.cardmaxProducts.find(item => item.id === productId);

  const fallbackMarkup = `
    <div class="accent-note">
      <h2 class="h4">Producto no disponible</h2>
      <p class="muted">El producto que intentas consultar no existe o fue actualizado. Escríbenos a <a href="mailto:cardmaxmx@gmail.com">cardmaxmx@gmail.com</a> y con gusto te ayudamos.</p>
    </div>
  `;

  if (!product) {
    detailRoot.querySelector('.product-detail-layout').innerHTML = fallbackMarkup;
    document.title = 'Producto no disponible | CardMax';
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const breadcrumbName = document.getElementById('breadcrumb-name');
    if (breadcrumbCategory) breadcrumbCategory.textContent = 'Producto';
    if (breadcrumbName) breadcrumbName.textContent = 'No disponible';
    return;
  }

  const categoryLabels = {
    pvc: 'Tarjetas en PVC',
    nfc: 'Tarjetas NFC',
    etiquetas: 'Etiquetas adhesivas'
  };

  document.title = `${product.name} | CardMax`;

  const mainImage = detailRoot.querySelector('[data-product-main]');
  const thumbsWrapper = detailRoot.querySelector('[data-product-thumbs]');
  const nameEl = detailRoot.querySelector('[data-product-name]');
  const categoryBadge = detailRoot.querySelector('[data-product-category]');
  const descriptionEl = detailRoot.querySelector('[data-product-description]');
  const featureList = detailRoot.querySelector('[data-product-features]');
  const specsEl = detailRoot.querySelector('[data-product-specs]');
  const quoteNowBtn = detailRoot.querySelector('[data-product-quote-now]');
  const breadcrumbCategory = document.getElementById('breadcrumb-category');
  const breadcrumbName = document.getElementById('breadcrumb-name');

  const primaryImage = product.gallery?.[0] || 'img/hero-placeholder.png';
  if (mainImage) {
    mainImage.src = primaryImage;
    mainImage.alt = product.name;
  }

  if (nameEl) nameEl.textContent = product.name;
  if (categoryBadge) categoryBadge.textContent = categoryLabels[product.category] || 'Producto CardMax';
  if (breadcrumbCategory) breadcrumbCategory.textContent = categoryLabels[product.category] || 'Productos';
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  // Update badges with product info
  const modelBadge = detailRoot.querySelector('[data-product-model]');
  if (modelBadge && product.sku) {
    modelBadge.innerHTML = `Modelo: <strong>${product.sku}</strong>`;
  }

  // Description
  if (descriptionEl) {
    // Process markdown bold formatting
    const processedDescription = window.processMarkdown ? window.processMarkdown(product.description) : product.description;
    descriptionEl.innerHTML = processedDescription;
  }

  // Features List
  if (featureList) {
    featureList.innerHTML = '';
    (product.features || []).forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featureList.appendChild(li);
    });
  }

  // Specifications
  if (specsEl) {
    const specs = product.highlights || [];
    if (specs.length) {
      specsEl.innerHTML = '<ul>' + specs.map(item => `<li><strong>${item.label}:</strong> ${item.value}</li>`).join('') + '</ul>';
    } else {
      specsEl.innerHTML = '<p>Especificaciones técnicas disponibles bajo consulta.</p>';
    }
  }

  // Applications - con markup SEO mejorado
  const applicationsGrid = detailRoot.querySelector('[data-product-applications]');
  if (applicationsGrid && product.applications) {
    const apps = product.applications;
    if (apps.length) {
      applicationsGrid.innerHTML = apps.map((app, index) => `
        <article class="application-card" itemscope itemtype="https://schema.org/HowTo" itemprop="itemListElement" role="listitem">
          <meta itemprop="position" content="${index + 1}">
          <span class="application-icon" aria-hidden="true">${app.icon}</span>
          <h3 itemprop="name">${app.title}</h3>
          <p itemprop="description">${app.description}</p>
          ${app.industries ? `<div class="industry-tags" itemprop="keywords">${app.industries.map(industry => `<span class="industry-tag">${industry}</span>`).join('')}</div>` : ''}
        </article>
      `).join('');
    } else {
      applicationsGrid.innerHTML = '<p class="muted">Aplicaciones disponibles bajo consulta.</p>';
    }
  }

  // Quote button - El modal de cotización lo interceptará automáticamente
  // No necesitamos agregar ningún listener aquí, el modal lo maneja

  // Gallery thumbs - always show 4 images (or repeat if less)
  if (thumbsWrapper && product.gallery?.length) {
    thumbsWrapper.innerHTML = '';
    const images = product.gallery;
    
    // Create 4 thumbnails (repeat images if necessary)
    for (let i = 0; i < 4; i++) {
      const src = images[i % images.length];
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = `${product.name} vista ${i + 1}`;
      thumb.loading = 'lazy';
      if (i === 0) thumb.classList.add('active');
      thumb.addEventListener('click', () => {
        if (mainImage) {
          mainImage.src = src;
          mainImage.alt = `${product.name} vista ${i + 1}`;
          // Reset zoom when changing image
          const zoomContainer = detailRoot.querySelector('[data-zoom-container]');
          if (zoomContainer) {
            zoomContainer.classList.remove('zoomed');
            if (mainImage) mainImage.style.transform = 'scale(1)';
          }
        }
        thumbsWrapper.querySelectorAll('img').forEach(img => img.classList.remove('active'));
        thumb.classList.add('active');
      });
      thumbsWrapper.appendChild(thumb);
    }
  }

  // Zoom controls
  const zoomContainer = detailRoot.querySelector('[data-zoom-container]');
  const zoomInBtn = detailRoot.querySelector('[data-zoom-in]');
  const zoomOutBtn = detailRoot.querySelector('[data-zoom-out]');
  const zoomResetBtn = detailRoot.querySelector('[data-zoom-reset]');
  let zoomLevel = 1;

  if (zoomInBtn && mainImage) {
    zoomInBtn.addEventListener('click', () => {
      zoomLevel = Math.min(zoomLevel + 0.5, 3);
      mainImage.style.transform = `scale(${zoomLevel})`;
      if (zoomLevel > 1) zoomContainer?.classList.add('zoomed');
    });
  }

  if (zoomOutBtn && mainImage) {
    zoomOutBtn.addEventListener('click', () => {
      zoomLevel = Math.max(zoomLevel - 0.5, 1);
      mainImage.style.transform = `scale(${zoomLevel})`;
      if (zoomLevel === 1) zoomContainer?.classList.remove('zoomed');
    });
  }

  if (zoomResetBtn && mainImage) {
    zoomResetBtn.addEventListener('click', () => {
      zoomLevel = 1;
      mainImage.style.transform = 'scale(1)';
      zoomContainer?.classList.remove('zoomed');
    });
  }

  // Click on image to toggle zoom
  if (zoomContainer && mainImage) {
    mainImage.addEventListener('click', () => {
      if (zoomLevel === 1) {
        zoomLevel = 2;
        mainImage.style.transform = 'scale(2)';
        zoomContainer.classList.add('zoomed');
      } else {
        zoomLevel = 1;
        mainImage.style.transform = 'scale(1)';
        zoomContainer.classList.remove('zoomed');
      }
    });
  }

  // Product tabs - Sistema simple y directo
  const tabs = document.querySelectorAll('.product-tab[data-tab-target]');
  const panels = document.querySelectorAll('.product-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSelector = tab.dataset.tabTarget;
      
      // Remover active de todas las tabs y panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // Activar la tab seleccionada y su panel correspondiente
      tab.classList.add('active');
      const targetPanel = document.querySelector(targetSelector);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Customize WhatsApp button with product name
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn && product) {
    const message = `Hola, estoy interesado en el producto: ${product.name}`;
    const whatsappUrl = `https://wa.me/5216643053834?text=${encodeURIComponent(message)}`;
    whatsappBtn.href = whatsappUrl;
  }
})();
