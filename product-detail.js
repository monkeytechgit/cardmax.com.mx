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
  const quantityInput = detailRoot.querySelector('[data-quantity-input]');
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
    descriptionEl.innerHTML = product.description ? `<p>${product.description}</p>` : '<p>Descripción no disponible.</p>';
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

  // Quote button
  const contactHref = product.contactHref || 'mailto:cardmaxmx@gmail.com';
  if (quoteNowBtn) {
    quoteNowBtn.addEventListener('click', () => {
      const qty = quantityInput?.value || 1;
      window.location.href = `${contactHref}?subject=Cotización: ${product.name} (Cantidad: ${qty})`;
    });
  }

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

  // Quantity controls
  const qtyMinus = detailRoot.querySelector('.qty-minus');
  const qtyPlus = detailRoot.querySelector('.qty-plus');
  
  // Validate and format quantity input
  if (quantityInput) {
    // Allow only numbers, max 999999 (6 digits)
    quantityInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value === '' || value === '0') {
        e.target.value = '1';
      } else {
        const numValue = parseInt(value);
        if (numValue > 999999) {
          e.target.value = '999999';
        } else {
          e.target.value = value;
        }
      }
    });

    // Select all text on focus for easy editing
    quantityInput.addEventListener('focus', (e) => {
      e.target.select();
    });

    // Validate on blur
    quantityInput.addEventListener('blur', (e) => {
      let value = parseInt(e.target.value) || 1;
      if (value < 1) value = 1;
      if (value > 999999) value = 999999;
      e.target.value = value;
    });
  }

  if (qtyMinus && quantityInput) {
    qtyMinus.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  }

  if (qtyPlus && quantityInput) {
    qtyPlus.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue < 999999) {
        quantityInput.value = currentValue + 1;
      }
    });
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

  // Product tabs
  const tabs = detailRoot.querySelectorAll('.product-tab');
  const panels = detailRoot.querySelectorAll('.product-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const targetPanel = detailRoot.querySelector(`[data-tab-panel="${targetTab}"]`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
})();
