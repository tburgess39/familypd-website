(() => {
  'use strict';
  const grid = document.getElementById('learning-resource-grid');
  if (!grid) return;

  const state = {
    resources: [],
    language: localStorage.getItem('familypd:learning-tool-language') || 'en',
    category: '',
    audience: '',
    pillar: '',
    search: ''
  };

  const words = {
    en: { allCategories:'All categories', allAudiences:'All audiences', allPillars:'All pillars', open:'Open official resource', use:'Project ideas', age:'Age / access', note:'Account or support note', results:'resources shown', none:'No resources match these filters.' },
    es: { allCategories:'Todas las categorías', allAudiences:'Todos los públicos', allPillars:'Todos los pilares', open:'Abrir recurso oficial', use:'Ideas para proyectos', age:'Edad / acceso', note:'Nota de cuenta o apoyo', results:'recursos mostrados', none:'Ningún recurso coincide con estos filtros.' }
  };

  const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const local = value => typeof value === 'string' ? value : value?.[state.language] || value?.en || '';

  function options(select, values, first, selected) {
    select.innerHTML = `<option value="">${first}</option>` + values.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('');
    select.value = values.includes(selected) ? selected : '';
  }

  function updateFilters() {
    const categories = [...new Set(state.resources.map(item => item.category))].sort();
    const audiences = [...new Set(state.resources.flatMap(item => item.audiences || []))].sort();
    const pillars = [...new Set(state.resources.flatMap(item => item.pillars || []))].sort();
    options(document.getElementById('resource-category'), categories, words[state.language].allCategories, state.category);
    options(document.getElementById('resource-audience'), audiences, words[state.language].allAudiences, state.audience);
    options(document.getElementById('resource-pillar'), pillars, words[state.language].allPillars, state.pillar);
  }

  function matches(item) {
    if (state.category && item.category !== state.category) return false;
    if (state.audience && !(item.audiences || []).includes(state.audience)) return false;
    if (state.pillar && !(item.pillars || []).includes(state.pillar)) return false;
    const haystack = [item.name, item.category, ...(item.audiences || []), ...(item.pillars || []), local(item.description), local(item.use_for), local(item.age_note)].join(' ').toLowerCase();
    return !state.search || haystack.includes(state.search.toLowerCase());
  }

  function card(item) {
    return `<article class="learning-tool-card">
      <div class="learning-tool-top"><span>${esc(item.category)}</span><small>${esc((item.audiences || []).join(' · '))}</small></div>
      <h2>${esc(item.name)}</h2>
      <p>${esc(local(item.description))}</p>
      <div class="resource-pillar-tags">${(item.pillars || []).map(p => `<span>${esc(p)}</span>`).join('')}</div>
      <div class="learning-tool-detail"><strong>${words[state.language].use}</strong><p>${esc(local(item.use_for))}</p></div>
      <div class="learning-tool-detail"><strong>${words[state.language].age}</strong><p>${esc(local(item.age_note))}</p></div>
      <div class="learning-tool-note"><strong>${words[state.language].note}</strong><p>${esc(local(item.support_note))}</p></div>
      <a class="button" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${words[state.language].open} ↗</a>
    </article>`;
  }

  function render() {
    document.documentElement.lang = state.language;
    document.querySelectorAll('[data-resource-language]').forEach(button => {
      const active = button.dataset.resourceLanguage === state.language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateFilters();
    const results = state.resources.filter(matches);
    const count = document.getElementById('resource-result-count');
    if (count) count.textContent = `${results.length} ${words[state.language].results}`;
    grid.innerHTML = results.length ? results.map(card).join('') : `<div class="resource-empty-state">${words[state.language].none}</div>`;
  }

  async function load() {
    try {
      const response = await fetch('/assets/data/learning-resources.json', {cache:'no-store'});
      if (!response.ok) throw new Error('Resource catalog failed to load');
      const data = await response.json();
      state.resources = data.resources || [];
      document.getElementById('resource-notice').textContent = local(data.notice);
      render();
    } catch (error) {
      grid.innerHTML = '<div class="resource-empty-state">The learning directory could not load. Refresh the page and try again.</div>';
      console.error(error);
    }
  }

  document.querySelectorAll('[data-resource-language]').forEach(button => button.addEventListener('click', () => {
    state.language = button.dataset.resourceLanguage;
    localStorage.setItem('familypd:learning-tool-language', state.language);
    render();
  }));
  document.getElementById('resource-search').addEventListener('input', event => { state.search = event.target.value.trim(); render(); });
  document.getElementById('resource-category').addEventListener('change', event => { state.category = event.target.value; render(); });
  document.getElementById('resource-audience').addEventListener('change', event => { state.audience = event.target.value; render(); });
  document.getElementById('resource-pillar').addEventListener('change', event => { state.pillar = event.target.value; render(); });
  load();
})();
