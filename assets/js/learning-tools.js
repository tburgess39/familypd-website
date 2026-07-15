(() => {
  'use strict';
  const grid = document.getElementById('learning-tool-grid');
  if (!grid) return;

  const state = {
    resources: [],
    language: localStorage.getItem('familypd:learning-tool-language') || 'en',
    category: 'all',
    audience: 'all',
    search: ''
  };

  const t = {
    en: {open:'Open official resource', useFor:'How this can help a FamilyPD project', note:'Account or support note', age:'Age / access', all:'All', noResults:'No learning tools match the current filters.'},
    es: {open:'Abrir recurso oficial', useFor:'Cómo puede ayudar con un proyecto de FamilyPD', note:'Nota de cuenta o apoyo', age:'Edad / acceso', all:'Todos', noResults:'Ninguna herramienta coincide con los filtros actuales.'}
  };

  const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
  const local = value => typeof value === 'string' ? value : value?.[state.language] || value?.en || '';

  function renderLanguage() {
    document.documentElement.lang = state.language;
    document.querySelectorAll('[data-learning-copy]').forEach(el => {
      const copy = el.dataset[state.language];
      if (copy) el.textContent = copy;
    });
    document.querySelectorAll('[data-learning-language]').forEach(button => {
      const active = button.dataset.learningLanguage === state.language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function populateFilters() {
    const category = document.getElementById('learning-category');
    const audience = document.getElementById('learning-audience');
    const categories = [...new Set(state.resources.map(item => item.category))].sort();
    const audiences = [...new Set(state.resources.flatMap(item => item.audiences || []))].sort();

    category.innerHTML = `<option value="all">${t[state.language].all}</option>` +
      categories.map(item => `<option value="${esc(item)}">${esc(item)}</option>`).join('');
    audience.innerHTML = `<option value="all">${t[state.language].all}</option>` +
      audiences.map(item => `<option value="${esc(item)}">${esc(item)}</option>`).join('');

    category.value = categories.includes(state.category) ? state.category : 'all';
    audience.value = audiences.includes(state.audience) ? state.audience : 'all';
  }

  function matches(resource) {
    if (state.category !== 'all' && resource.category !== state.category) return false;
    if (state.audience !== 'all' && !(resource.audiences || []).includes(state.audience)) return false;
    const text = [resource.name, resource.category, ...(resource.audiences || []), local(resource.description), local(resource.use_for)].join(' ').toLowerCase();
    return !state.search || text.includes(state.search.toLowerCase());
  }

  function card(resource) {
    const article = document.createElement('article');
    article.className = 'learning-tool-card';
    article.innerHTML = `
      <div class="learning-tool-top"><span>${esc(resource.category)}</span><small>${esc((resource.audiences || []).join(' · '))}</small></div>
      <h2>${esc(resource.name)}</h2>
      <p>${esc(local(resource.description))}</p>
      <div class="learning-tool-detail"><strong>${t[state.language].useFor}</strong><p>${esc(local(resource.use_for))}</p></div>
      <div class="learning-tool-detail"><strong>${t[state.language].age}</strong><p>${esc(local(resource.age_note))}</p></div>
      <div class="learning-tool-note"><strong>${t[state.language].note}</strong><p>${esc(local(resource.support_note))}</p></div>
      <a class="button" href="${esc(resource.url)}" target="_blank" rel="noopener noreferrer">${t[state.language].open} ↗</a>`;
    return article;
  }

  function render() {
    renderLanguage();
    populateFilters();
    const results = state.resources.filter(matches);
    document.getElementById('learning-result-count').textContent = String(results.length);
    grid.innerHTML = '';
    if (!results.length) {
      grid.innerHTML = `<div class="resource-empty-state">${t[state.language].noResults}</div>`;
      return;
    }
    results.forEach(item => grid.appendChild(card(item)));
  }

  async function load() {
    try {
      const response = await fetch('../../assets/data/learning-resources.json', {cache:'no-store'});
      if (!response.ok) throw new Error();
      state.resources = (await response.json()).resources || [];
      render();
    } catch {
      grid.innerHTML = '<div class="resource-empty-state">The learning tool directory could not load. Please refresh the page.</div>';
    }
  }

  document.querySelectorAll('[data-learning-language]').forEach(button => button.addEventListener('click', () => {
    state.language = button.dataset.learningLanguage;
    localStorage.setItem('familypd:learning-tool-language', state.language);
    render();
  }));
  document.getElementById('learning-search').addEventListener('input', e => { state.search = e.target.value.trim(); render(); });
  document.getElementById('learning-category').addEventListener('change', e => { state.category = e.target.value; render(); });
  document.getElementById('learning-audience').addEventListener('change', e => { state.audience = e.target.value; render(); });
  load();
})();