(() => {
  'use strict';

  const root = document.getElementById('youth-creator-lab');
  if (!root) return;

  const STORAGE_KEY = 'familypd:youth-creator-plan:v1';
  const state = {
    language: localStorage.getItem('familypd:youth-creator-language') || 'en',
    ideas: [],
    selectedIdea: null
  };

  const labels = {
    en: {
      noMatch: 'No exact match was found. Try a different project type or age group.',
      mission: 'Project mission',
      skills: 'Skills you will practice',
      steps: 'Build steps',
      test: 'Family test questions',
      planTitle: 'My project plan',
      role: 'My creator role',
      materials: 'Tools or materials',
      firstStep: 'My first step',
      support: 'Adult support I need',
      review: 'Who will test or review it?',
      safety: 'Public-safe reminder',
      safetyText: 'Use fictional examples. Do not include private names, school records, addresses, account information, health details, passwords, or private links.',
      saved: 'Project plan saved in this browser.',
      copied: 'Project plan copied.',
      downloaded: 'Project plan downloaded.',
      choose: 'Generate a project idea first.'
    },
    es: {
      noMatch: 'No se encontró una coincidencia exacta. Prueba otro tipo de proyecto o grupo de edad.',
      mission: 'Misión del proyecto',
      skills: 'Habilidades que practicarás',
      steps: 'Pasos para crear',
      test: 'Preguntas para probar con la familia',
      planTitle: 'Mi plan del proyecto',
      role: 'Mi rol de creador',
      materials: 'Herramientas o materiales',
      firstStep: 'Mi primer paso',
      support: 'Apoyo adulto que necesito',
      review: '¿Quién lo probará o revisará?',
      safety: 'Recordatorio para compartir con seguridad',
      safetyText: 'Usa ejemplos ficticios. No incluyas nombres privados, registros escolares, direcciones, información de cuentas, detalles de salud, contraseñas ni enlaces privados.',
      saved: 'El plan se guardó en este navegador.',
      copied: 'Plan copiado.',
      downloaded: 'Plan descargado.',
      choose: 'Primero genera una idea de proyecto.'
    }
  };

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function text(value) {
    if (typeof value === 'string') return value;
    return value?.[state.language] || value?.en || '';
  }

  function updateLanguage() {
    document.documentElement.lang = state.language;
    document.querySelectorAll('[data-creator-copy]').forEach(element => {
      const next = element.dataset[state.language];
      if (next) element.textContent = next;
    });
    document.querySelectorAll('[data-creator-language]').forEach(button => {
      const active = button.dataset.creatorLanguage === state.language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    populateSelectLabels();
    renderIdea();
  }

  function populateSelectLabels() {
    const ageSelect = document.getElementById('creator-age');
    if (!ageSelect || !window.__FPD_YOUTH_DATA__) return;

    [...ageSelect.options].forEach(option => {
      if (!option.value) return;
      const label = window.__FPD_YOUTH_DATA__.age_bands?.[option.value];
      if (label) option.textContent = text(label);
    });
  }

  function filters() {
    return {
      age: document.getElementById('creator-age').value,
      pillar: document.getElementById('creator-pillar').value,
      type: document.getElementById('creator-type').value,
      time: document.getElementById('creator-time').value
    };
  }

  function matchIdeas() {
    const current = filters();
    return state.ideas.filter(idea => {
      if (current.age && !(idea.ages || []).includes(current.age)) return false;
      if (current.pillar && idea.pillar !== current.pillar) return false;
      if (current.type && idea.project_type !== current.type) return false;
      if (current.time && idea.time !== current.time) return false;
      return true;
    });
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function generateIdea() {
    const exact = matchIdeas();
    let candidates = exact;

    if (!candidates.length) {
      const current = filters();
      candidates = state.ideas.filter(idea => {
        if (current.age && !(idea.ages || []).includes(current.age)) return false;
        if (current.pillar && idea.pillar !== current.pillar) return false;
        return true;
      });
    }

    if (!candidates.length) {
      candidates = state.ideas.filter(idea => {
        const age = filters().age;
        return !age || (idea.ages || []).includes(age);
      });
    }

    if (!candidates.length) {
      document.getElementById('creator-idea-output').innerHTML =
        `<div class="creator-empty-state">${labels[state.language].noMatch}</div>`;
      return;
    }

    state.selectedIdea = randomItem(candidates);
    saveSelection();
    renderIdea();
  }

  function renderIdea() {
    const output = document.getElementById('creator-idea-output');
    if (!output) return;

    const idea = state.selectedIdea;
    if (!idea) {
      output.innerHTML = `
        <div class="creator-empty-state">
          <strong>${state.language === 'es' ? 'Tu reto aparecerá aquí.' : 'Your creator challenge will appear here.'}</strong>
          <span>${state.language === 'es' ? 'Elige tus opciones y selecciona Generar idea.' : 'Choose your options and select Generate Idea.'}</span>
        </div>
      `;
      return;
    }

    const skills = (idea.skills || []).map(item => `<span>${escapeHtml(item)}</span>`).join('');
    const steps = (idea.steps?.[state.language] || idea.steps?.en || [])
      .map(item => `<li>${escapeHtml(item)}</li>`).join('');
    const tests = (idea.test_questions?.[state.language] || idea.test_questions?.en || [])
      .map(item => `<li>${escapeHtml(item)}</li>`).join('');

    output.innerHTML = `
      <article class="creator-challenge-card">
        <div class="creator-challenge-meta">
          <span>${escapeHtml(idea.pillar)}</span>
          <span>${escapeHtml(idea.project_type)}</span>
          <span>${escapeHtml(idea.time)}</span>
        </div>
        <h2>${escapeHtml(text(idea.title))}</h2>
        <div class="creator-mission">
          <strong>${labels[state.language].mission}</strong>
          <p>${escapeHtml(text(idea.mission))}</p>
        </div>
        <div class="creator-skills">
          <strong>${labels[state.language].skills}</strong>
          <div>${skills}</div>
        </div>
        <div class="creator-output-grid">
          <section>
            <h3>${labels[state.language].steps}</h3>
            <ol>${steps}</ol>
          </section>
          <section>
            <h3>${labels[state.language].test}</h3>
            <ul>${tests}</ul>
          </section>
        </div>
        <aside class="creator-safety-reminder">
          <strong>${labels[state.language].safety}</strong>
          <p>${labels[state.language].safetyText}</p>
        </aside>
      </article>
    `;

    document.getElementById('creator-project-title').value = text(idea.title);
    document.getElementById('creator-project-purpose').value = text(idea.mission);
  }

  function planData() {
    const idea = state.selectedIdea;
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      language: state.language,
      ideaId: idea?.id || '',
      idea,
      plan: {
        title: document.getElementById('creator-project-title').value.trim(),
        purpose: document.getElementById('creator-project-purpose').value.trim(),
        role: document.getElementById('creator-role').value.trim(),
        materials: document.getElementById('creator-materials').value.trim(),
        firstStep: document.getElementById('creator-first-step').value.trim(),
        adultSupport: document.getElementById('creator-adult-support').value.trim(),
        reviewer: document.getElementById('creator-reviewer').value.trim(),
        targetDate: document.getElementById('creator-target-date').value
      }
    };
  }

  function applyPlan(data) {
    state.language = data.language || state.language;
    state.selectedIdea = data.idea || state.ideas.find(item => item.id === data.ideaId) || null;
    const plan = data.plan || {};
    document.getElementById('creator-project-title').value = plan.title || '';
    document.getElementById('creator-project-purpose').value = plan.purpose || '';
    document.getElementById('creator-role').value = plan.role || '';
    document.getElementById('creator-materials').value = plan.materials || '';
    document.getElementById('creator-first-step').value = plan.firstStep || '';
    document.getElementById('creator-adult-support').value = plan.adultSupport || '';
    document.getElementById('creator-reviewer').value = plan.reviewer || '';
    document.getElementById('creator-target-date').value = plan.targetDate || '';
    updateLanguage();
  }

  function saveSelection() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planData()));
  }

  function restorePlan() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      applyPlan(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function status(message) {
    const element = document.getElementById('creator-action-status');
    element.textContent = message;
    window.setTimeout(() => element.textContent = '', 3500);
  }

  function planText() {
    if (!state.selectedIdea) return labels[state.language].choose;
    const data = planData();
    const idea = data.idea;
    const es = state.language === 'es';

    return [
      es ? 'PLAN DE PROYECTO — FAMILY PERSONAL DEVELOPMENT' : 'FAMILY PERSONAL DEVELOPMENT PROJECT PLAN',
      '',
      `${es ? 'Proyecto' : 'Project'}: ${data.plan.title || text(idea.title)}`,
      `${es ? 'Pilar' : 'Pillar'}: ${idea.pillar}`,
      `${es ? 'Tipo' : 'Type'}: ${idea.project_type}`,
      `${es ? 'Tiempo estimado' : 'Estimated time'}: ${idea.time}`,
      '',
      `${labels[state.language].mission}:`,
      data.plan.purpose || text(idea.mission),
      '',
      `${labels[state.language].skills}:`,
      (idea.skills || []).map(item => `- ${item}`).join('\n'),
      '',
      `${labels[state.language].steps}:`,
      (idea.steps?.[state.language] || idea.steps?.en || []).map((item, index) => `${index + 1}. ${item}`).join('\n'),
      '',
      `${labels[state.language].test}:`,
      (idea.test_questions?.[state.language] || idea.test_questions?.en || []).map(item => `- ${item}`).join('\n'),
      '',
      `${labels[state.language].role}: ${data.plan.role || '—'}`,
      `${labels[state.language].materials}: ${data.plan.materials || '—'}`,
      `${labels[state.language].firstStep}: ${data.plan.firstStep || '—'}`,
      `${labels[state.language].support}: ${data.plan.adultSupport || '—'}`,
      `${labels[state.language].review}: ${data.plan.reviewer || '—'}`,
      `${es ? 'Fecha objetivo' : 'Target date'}: ${data.plan.targetDate || '—'}`,
      '',
      `${labels[state.language].safety}:`,
      labels[state.language].safetyText
    ].join('\n');
  }

  async function copyPlan() {
    const content = planText();
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const area = document.createElement('textarea');
      area.value = content;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    status(labels[state.language].copied);
  }

  function downloadPlan() {
    const content = planText();
    const slug = (document.getElementById('creator-project-title').value || 'family-pd-youth-project')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slug}-plan.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
    status(labels[state.language].downloaded);
  }

  function clearPlan() {
    if (!window.confirm(state.language === 'es'
      ? '¿Borrar el plan guardado en este navegador?'
      : 'Clear the project plan saved in this browser?')) return;

    localStorage.removeItem(STORAGE_KEY);
    state.selectedIdea = null;
    root.querySelectorAll('input[type="text"], input[type="date"], textarea').forEach(input => input.value = '');
    renderIdea();
  }

  async function loadIdeas() {
    try {
      const response = await fetch('../../assets/data/youth-project-ideas.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Ideas unavailable.');
      window.__FPD_YOUTH_DATA__ = await response.json();
      state.ideas = window.__FPD_YOUTH_DATA__.ideas || [];
      restorePlan();

      const requestedAge = new URLSearchParams(window.location.search).get('age');
      if (requestedAge && ['4-7', '8-12', '13-18'].includes(requestedAge)) {
        document.getElementById('creator-age').value = requestedAge;
      }

      updateLanguage();
    } catch {
      document.getElementById('creator-idea-output').innerHTML =
        '<div class="creator-empty-state">The project idea library could not load. Please refresh the page.</div>';
    }
  }

  document.querySelectorAll('[data-creator-language]').forEach(button => {
    button.addEventListener('click', () => {
      state.language = button.dataset.creatorLanguage;
      localStorage.setItem('familypd:youth-creator-language', state.language);
      updateLanguage();
    });
  });

  document.getElementById('generate-creator-idea').addEventListener('click', generateIdea);
  document.getElementById('save-creator-plan').addEventListener('click', () => {
    saveSelection();
    status(labels[state.language].saved);
  });
  document.getElementById('copy-creator-plan').addEventListener('click', copyPlan);
  document.getElementById('download-creator-plan').addEventListener('click', downloadPlan);
  document.getElementById('print-creator-plan').addEventListener('click', () => {
    saveSelection();
    window.print();
  });
  document.getElementById('clear-creator-plan').addEventListener('click', clearPlan);

  root.addEventListener('input', () => {
    if (state.selectedIdea) saveSelection();
  });

  loadIdeas();
})();
