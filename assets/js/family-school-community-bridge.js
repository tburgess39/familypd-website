(() => {
  'use strict';

  const root = document.getElementById('bridge-center');
  if (!root) return;

  const state = {
    language: localStorage.getItem('familypd:bridge-language') || 'en',
    data: null,
    resources: [],
    selected: null
  };

  const ui = {
    en: {
      chooseRole: 'Choose your role',
      chooseNeed: 'Choose a household need or pillar',
      selectRole: 'Select a role',
      selectNeed: 'Select a need',
      generate: 'Build Connection Plan',
      signals: 'What may be happening',
      home: 'Start at home',
      school: 'School connections',
      community: 'Community connections',
      questions: 'Questions to ask',
      lens: 'Recommended actions for your role',
      projects: 'Household project ideas',
      learn: 'Learning resources',
      open: 'Open official resource',
      copy: 'Copy Connection Plan',
      print: 'Print Plan',
      copied: 'Connection plan copied.',
      noPlan: 'Choose a role and need to build a public practice plan.',
      practice: 'Public practice only. Do not enter names, student records, medical information, financial account details, addresses, passwords, or other private information.',
      app: 'When the family is ready to implement and save real records, continue in the FamilyPD App.'
    },
    es: {
      chooseRole: 'Elija su función',
      chooseNeed: 'Elija una necesidad o pilar del hogar',
      selectRole: 'Seleccione una función',
      selectNeed: 'Seleccione una necesidad',
      generate: 'Crear plan de conexión',
      signals: 'Lo que puede estar ocurriendo',
      home: 'Comience en el hogar',
      school: 'Conexiones escolares',
      community: 'Conexiones comunitarias',
      questions: 'Preguntas para hacer',
      lens: 'Acciones recomendadas para su función',
      projects: 'Ideas de proyectos para el hogar',
      learn: 'Recursos de aprendizaje',
      open: 'Abrir recurso oficial',
      copy: 'Copiar plan de conexión',
      print: 'Imprimir plan',
      copied: 'Plan de conexión copiado.',
      noPlan: 'Elija una función y necesidad para crear un plan público de práctica.',
      practice: 'Solo práctica pública. No introduzca nombres, registros estudiantiles, información médica, cuentas financieras, direcciones, contraseñas ni otra información privada.',
      app: 'Cuando la familia esté lista para implementar y guardar registros reales, continúe en la aplicación FamilyPD.'
    }
  };

  const t = () => ui[state.language];
  const local = value => typeof value === 'string' ? value : value?.[state.language] || value?.en || '';
  const esc = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function resourceById(id) {
    return state.resources.find(resource => resource.id === id);
  }

  function updateLanguage() {
    document.documentElement.lang = state.language;

    document.querySelectorAll('[data-bridge-copy]').forEach(element => {
      const copy = element.dataset[state.language];
      if (copy) element.textContent = copy;
    });

    document.querySelectorAll('[data-bridge-language]').forEach(button => {
      const active = button.dataset.bridgeLanguage === state.language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    populateControls();
    document.getElementById('build-bridge-plan').textContent = t().generate;
    document.getElementById('copy-bridge-plan').textContent = t().copy;
    document.getElementById('print-bridge-plan').textContent = t().print;
    renderPlan();
  }

  function populateControls() {
    if (!state.data) return;

    const role = document.getElementById('bridge-role');
    const need = document.getElementById('bridge-need');
    const roleValue = role.value;
    const needValue = need.value;

    role.innerHTML = `<option value="">${t().selectRole}</option>` +
      Object.entries(state.data.roles)
        .map(([key, label]) => `<option value="${key}">${esc(local(label))}</option>`)
        .join('');

    need.innerHTML = `<option value="">${t().selectNeed}</option>` +
      state.data.pathways
        .map(pathway => `<option value="${pathway.id}">${esc(local(pathway.title))}</option>`)
        .join('');

    role.value = roleValue;
    need.value = needValue;
  }

  function selectedPathway() {
    const id = document.getElementById('bridge-need').value;
    return state.data?.pathways?.find(pathway => pathway.id === id) || null;
  }

  function selectedRole() {
    return document.getElementById('bridge-role').value;
  }

  function list(items, ordered = false) {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag}>${(items || []).map(item => `<li>${esc(item)}</li>`).join('')}</${tag}>`;
  }

  function resourceCard(resource) {
    return `<article class="bridge-resource-card">
      <span>${esc(resource.category)}</span>
      <h4>${esc(resource.name)}</h4>
      <p>${esc(local(resource.use_for))}</p>
      <small>${esc(local(resource.support_note))}</small>
      <a href="${esc(resource.url)}" target="_blank" rel="noopener noreferrer">${t().open} ↗</a>
    </article>`;
  }

  function renderPlan() {
    const output = document.getElementById('bridge-plan-output');
    const pathway = state.selected || selectedPathway();
    const role = selectedRole();

    if (!pathway || !role) {
      output.innerHTML = `<div class="bridge-empty-state"><strong>${t().noPlan}</strong><p>${t().practice}</p></div>`;
      return;
    }

    const lens = pathway[`${role}_lens`]?.[state.language] || pathway[`${role}_lens`]?.en || [];
    const resources = (pathway.resource_ids || []).map(resourceById).filter(Boolean);

    output.innerHTML = `<article class="bridge-plan-document">
      <div class="bridge-plan-heading">
        <div>
          <span class="bridge-pillar-badge">${esc(pathway.pillar)}</span>
          <h2>${esc(local(pathway.title))}</h2>
          <p>${esc(local(pathway.summary))}</p>
        </div>
        <span class="bridge-role-badge">${esc(local(state.data.roles[role]))}</span>
      </div>

      <div class="bridge-plan-grid">
        <section><h3>${t().signals}</h3>${list(pathway.household_signals[state.language] || pathway.household_signals.en)}</section>
        <section><h3>${t().home}</h3>${list(pathway.household_actions[state.language] || pathway.household_actions.en, true)}</section>
        <section><h3>${t().school}</h3>${list(pathway.school_support[state.language] || pathway.school_support.en)}</section>
        <section><h3>${t().community}</h3>${list(pathway.community_support[state.language] || pathway.community_support.en)}</section>
        <section><h3>${t().questions}</h3>${list(pathway.questions[state.language] || pathway.questions.en, true)}</section>
        <section class="bridge-role-lens"><h3>${t().lens}</h3>${list(lens, true)}</section>
      </div>

      <section class="bridge-project-ideas">
        <h3>${t().projects}</h3>
        ${list(pathway.project_ideas[state.language] || pathway.project_ideas.en)}
      </section>

      <section class="bridge-learning-resources">
        <h3>${t().learn}</h3>
        <div class="bridge-resource-grid">${resources.map(resourceCard).join('')}</div>
      </section>

      <aside class="bridge-practice-note">
        <strong>${t().practice}</strong>
        <p>${t().app}</p>
        <a href="../../app/">${state.language === 'es' ? 'Conozca la aplicación FamilyPD' : 'Learn about the FamilyPD App'} →</a>
      </aside>
    </article>`;
  }

  function buildPlan() {
    state.selected = selectedPathway();
    renderPlan();
    document.getElementById('bridge-plan-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function plainText() {
    const pathway = state.selected || selectedPathway();
    const role = selectedRole();
    if (!pathway || !role) return t().noPlan;

    const lines = [
      state.language === 'es'
        ? 'PLAN DE CONEXIÓN — FAMILIA, ESCUELA Y COMUNIDAD'
        : 'FAMILY–SCHOOL–COMMUNITY CONNECTION PLAN',
      '',
      `${state.language === 'es' ? 'Función' : 'Role'}: ${local(state.data.roles[role])}`,
      `${state.language === 'es' ? 'Área' : 'Area'}: ${local(pathway.title)}`,
      '',
      t().home + ':',
      ...(pathway.household_actions[state.language] || pathway.household_actions.en).map((item, index) => `${index + 1}. ${item}`),
      '',
      t().school + ':',
      ...(pathway.school_support[state.language] || pathway.school_support.en).map(item => `- ${item}`),
      '',
      t().community + ':',
      ...(pathway.community_support[state.language] || pathway.community_support.en).map(item => `- ${item}`),
      '',
      t().questions + ':',
      ...(pathway.questions[state.language] || pathway.questions.en).map((item, index) => `${index + 1}. ${item}`),
      '',
      t().practice,
      t().app
    ];
    return lines.join('\n');
  }

  async function copyPlan() {
    const content = plainText();
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

    const status = document.getElementById('bridge-action-status');
    status.textContent = t().copied;
    window.setTimeout(() => status.textContent = '', 3500);
  }

  async function load() {
    try {
      const [bridgeResponse, resourceResponse] = await Promise.all([
        fetch('../../assets/data/family-school-community-bridge.json', { cache: 'no-store' }),
        fetch('../../assets/data/learning-resources.json', { cache: 'no-store' })
      ]);
      if (!bridgeResponse.ok || !resourceResponse.ok) throw new Error('Data unavailable.');

      state.data = await bridgeResponse.json();
      state.resources = (await resourceResponse.json()).resources || [];
      updateLanguage();
    } catch {
      document.getElementById('bridge-plan-output').innerHTML =
        '<div class="bridge-empty-state">The Bridge Center could not load. Please refresh the page.</div>';
    }
  }

  document.querySelectorAll('[data-bridge-language]').forEach(button => {
    button.addEventListener('click', () => {
      state.language = button.dataset.bridgeLanguage;
      localStorage.setItem('familypd:bridge-language', state.language);
      updateLanguage();
    });
  });

  document.getElementById('build-bridge-plan').addEventListener('click', buildPlan);
  document.getElementById('copy-bridge-plan').addEventListener('click', copyPlan);
  document.getElementById('print-bridge-plan').addEventListener('click', () => window.print());
  document.getElementById('bridge-role').addEventListener('change', () => {
    state.selected = null;
    renderPlan();
  });
  document.getElementById('bridge-need').addEventListener('change', () => {
    state.selected = null;
    renderPlan();
  });

  load();
})();