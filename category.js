(function renderCategoryPages(){
  if (!window.cardmaxProducts) return;
  const grids = document.querySelectorAll('[data-category-grid]');
  if (!grids.length) return;

  grids.forEach(grid => {
    const category = grid.dataset.category;
    if (!category) return;

    const products = window.cardmaxProducts.filter(product => product.category === category);
    if (!products.length) {
      grid.innerHTML = '<p class="muted">Pronto actualizaremos esta categoría con nuevos productos.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach(product => {
      const article = document.createElement('article');
      article.className = 'card product';

      const imageSrc = product.gallery?.[0] || 'img/hero-placeholder.png';
      const contactHref = product.contactHref || 'mailto:cardmaxmx@gmail.com';

      article.innerHTML = `
        <div class="card-media ratio-4x3">
          <img src="${imageSrc}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="card-body">
          <h3 class="h4">${product.name}</h3>
          <p class="muted">${product.tagline || ''}</p>
          <div class="btn-group">
            <a class="btn btn-soft" href="product.html?id=${product.id}">Ver producto</a>
            <a class="btn btn-primary" href="${contactHref}">Solicitar cotización</a>
          </div>
        </div>
      `;

      fragment.appendChild(article);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
  });
})();
