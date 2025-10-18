(function handleNavigation(){
  const toggle = document.getElementById('nav-toggle');
  const toggleLabel = document.querySelector('label[for="nav-toggle"]');
  const links = document.querySelectorAll('.menu a');

  function syncAria(){
    if (!toggleLabel || !toggle) return;
    toggleLabel.setAttribute('aria-expanded', toggle.checked ? 'true' : 'false');
  }

  if (toggle) {
    toggle.addEventListener('change', syncAria);
    syncAria();
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (toggle && toggle.checked) {
        toggle.checked = false;
        syncAria();
      }
    });
  });
})();

(function handleTabs(){
  const tabs = document.querySelectorAll('.tabs .tab[data-tab-target]');
  if (!tabs.length) return;

  const panels = Array.from(tabs)
    .map(tab => ({ tab, panel: document.querySelector(tab.dataset.tabTarget) }))
    .filter(item => item.panel);

  function activate(target){
    panels.forEach(({ panel, tab }) => {
      const isActive = tab.dataset.tabTarget === target;
  tab.classList.toggle('active', isActive);
  tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  tab.setAttribute('tabindex', '0');

      if (isActive) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        panel.setAttribute('hidden', '');
      }
    });
  }

  let stored = null;
  try {
    stored = sessionStorage.getItem('cardmax-active-tab');
  } catch (error) {
    stored = null;
  }
  const defaultTarget = stored || panels.find(({ tab }) => tab.classList.contains('active'))?.tab.dataset.tabTarget || panels[0]?.tab.dataset.tabTarget;
  if (defaultTarget) activate(defaultTarget);

  panels.forEach(({ tab }) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tabTarget;
      try {
        sessionStorage.setItem('cardmax-active-tab', target);
      } catch (error) {
        /* ignore */
      }
      activate(target);
      tab.focus();
    });
  });
})();

(function updateYear(){
  const yearEl = document.getElementById('y');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
