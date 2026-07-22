(() => {
  'use strict';
  const root = document.getElementById('youth-creator-lab');
  if (!root) return;

  const state = {
    language: localStorage.getItem('familypd:youth-creator-language') || 'en',
    ideas: [], resources: [], ageBands: {}, selectedIdea: null
  };

  const copy = {
    en: {
      anyAge:'Any age', anyPillar:'Any pillar', anyType:'Any project type', anyTime:'Any amount of time', anyNeed:'Any need',
      generate:'Generate a Project Idea', household:'Household need this project can help', school:'Skills practiced', community:'School or community connection',
      mission:'Project mission', skills:'Skills practiced', steps:'Build steps', test:'Family test questions', learn:'Learn before you build', open:'Open official resource',
      copy:'Copy Practice Blueprint', copied:'Practice blueprint copied.', notSaved:'This public generator does not save or publish the project.', app:'Continue implementation in FamilyPD OS.',
      noIdea:'Choose options and generate a family project idea.', noMatch:'No exact match was found, so a related idea was selected.',
      project:'Project', role:'Role', materials:'Materials or tools', first:'First step', adult:'Adult support', reviewer:'Reviewer',
      pillars:{Health:'Health',Relationships:'Relationships','Education & Skills':'Education & Skills',Finances:'Finances',Goals:'Goals'},
      needs:{health:'Health, safety, stress, sleep, or routines',connection:'Arguing, disconnection, respect, or communication',organization:'Chores, clutter, time, or organization',school:'School, studying, reading, or missing work',career:'Career, coding, robotics, or job skills',money:'Budgeting, debt, saving, or spending',goals:'Goal setting, motivation, or follow-through'},
      roles:{Researcher:'Researcher',Writer:'Writer',Artist:'Artist',Coder:'Coder',Tester:'Tester',Editor:'Editor',Narrator:'Narrator','Family feedback lead':'Family feedback lead',Designer:'Designer',Builder:'Builder',Presenter:'Presenter','Project manager':'Project manager'}
    },
    es: {
      anyAge:'Cualquier edad', anyPillar:'Cualquier pilar', anyType:'Cualquier tipo de proyecto', anyTime:'Cualquier cantidad de tiempo', anyNeed:'Cualquier necesidad',
      generate:'Generar idea de proyecto', household:'Necesidad del hogar que puede ayudar', school:'Habilidades que se practican', community:'Conexión con la escuela o comunidad',
      mission:'Misión del proyecto', skills:'Habilidades', steps:'Pasos para crear', test:'Preguntas para probar', learn:'Aprenda antes de crear', open:'Abrir recurso oficial',
      copy:'Copiar plan de práctica', copied:'Plan copiado.', notSaved:'Este generador público no guarda ni publica el proyecto.', app:'Continúe la implementación en FamilyPD OS.',
      noIdea:'Elija opciones y genere una idea familiar.', noMatch:'No hubo coincidencia exacta; se seleccionó una idea relacionada.',
      project:'Proyecto', role:'Rol', materials:'Materiales o herramientas', first:'Primer paso', adult:'Apoyo adulto', reviewer:'Revisor',
      pillars:{Health:'Salud',Relationships:'Relaciones','Education & Skills':'Educación y habilidades',Finances:'Finanzas',Goals:'Metas'},
      needs:{health:'Salud, seguridad, estrés, sueño o rutinas',connection:'Discusiones, desconexión, respeto o comunicación',organization:'Tareas, desorden, tiempo u organización',school:'Escuela, estudio, lectura o trabajo pendiente',career:'Carrera, programación, robótica o empleo',money:'Presupuesto, deuda, ahorro o gastos',goals:'Metas, motivación o seguimiento'},
      roles:{Researcher:'Investigador',Writer:'Escritor',Artist:'Artista',Coder:'Programador',Tester:'Probador',Editor:'Editor',Narrator:'Narrador','Family feedback lead':'Líder de comentarios familiares',Designer:'Diseñador',Builder:'Constructor',Presenter:'Presentador','Project manager':'Gerente de proyecto'}
    }
  };
  const d = () => copy[state.language];
  const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const local = value => typeof value === 'string' ? value : value?.[state.language] || value?.en || '';

  function setSelect(id, values, first, labels = {}) {
    const select = document.getElementById(id);
    const current = select.value;
    select.innerHTML = `<option value="">${esc(first)}</option>` + values.map(value => `<option value="${esc(value)}">${esc(labels[value] || value)}</option>`).join('');
    if (values.includes(current)) select.value = current;
  }

  function configureControls() {
    setSelect('creator-age', Object.keys(state.ageBands), d().anyAge, Object.fromEntries(Object.entries(state.ageBands).map(([key,value]) => [key,local(value)])));
    const pillars = [...new Set(state.ideas.map(i => i.pillar))];
    setSelect('creator-pillar', pillars, d().anyPillar, d().pillars);
    setSelect('creator-type', [...new Set(state.ideas.map(i => i.project_type))].sort(), d().anyType);
    setSelect('creator-time', [...new Set(state.ideas.map(i => i.time))].sort(), d().anyTime);
    setSelect('creator-need', Object.keys(d().needs), d().anyNeed, d().needs);
    const role = document.getElementById('creator-role');
    const currentRole = role.value;
    const roles = Object.keys(d().roles);
    role.innerHTML = `<option value="">${state.language === 'es' ? 'Elija un rol' : 'Choose a role'}</option>` + roles.map(value => `<option value="${esc(value)}">${esc(d().roles[value])}</option>`).join('');
    if (roles.includes(currentRole)) role.value = currentRole;
  }

  function updateLanguage() {
    document.documentElement.lang = state.language;
    document.querySelectorAll('[data-creator-copy]').forEach(el => {
      const value = el.dataset[state.language];
      if (value) el.textContent = value;
    });
    document.querySelectorAll('[data-creator-language]').forEach(button => {
      const active = button.dataset.creatorLanguage === state.language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('generate-creator-idea').textContent = d().generate;
    document.getElementById('copy-creator-blueprint').textContent = d().copy;
    configureControls();
    renderIdea();
  }

  function chooseIdea() {
    const filters = {
      age: document.getElementById('creator-age').value,
      pillar: document.getElementById('creator-pillar').value,
      type: document.getElementById('creator-type').value,
      time: document.getElementById('creator-time').value,
      need: document.getElementById('creator-need').value
    };
    let candidates = state.ideas.filter(idea =>
      (!filters.age || idea.ages.includes(filters.age)) &&
      (!filters.pillar || idea.pillar === filters.pillar) &&
      (!filters.type || idea.project_type === filters.type) &&
      (!filters.time || idea.time === filters.time) &&
      (!filters.need || (idea.need_tags || []).includes(filters.need))
    );
    let fallback = false;
    if (!candidates.length) {
      fallback = true;
      candidates = state.ideas.filter(idea =>
        (!filters.age || idea.ages.includes(filters.age)) &&
        (!filters.pillar || idea.pillar === filters.pillar) &&
        (!filters.need || (idea.need_tags || []).includes(filters.need))
      );
    }
    if (!candidates.length) candidates = state.ideas;
    state.selectedIdea = candidates[Math.floor(Math.random() * candidates.length)];
    document.getElementById('creator-match-note').textContent = fallback ? d().noMatch : '';
    renderIdea();
  }

  function resourceById(id) { return state.resources.find(item => item.id === id); }
  function resourceCard(item) {
    return `<article class="creator-learning-card"><span>${esc(item.category)}</span><h4>${esc(item.name)}</h4><p>${esc(local(item.use_for))}</p><small>${esc(local(item.support_note))}</small><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${d().open} ↗</a></article>`;
  }

  function renderIdea() {
    const output = document.getElementById('creator-idea-output');
    if (!state.selectedIdea) {
      output.innerHTML = `<div class="creator-empty-state"><strong>${d().noIdea}</strong><span>${d().notSaved}</span></div>`;
      return;
    }
    const idea = state.selectedIdea;
    const steps = (idea.steps?.[state.language] || idea.steps?.en || []).map(x => `<li>${esc(x)}</li>`).join('');
    const tests = (idea.test_questions?.[state.language] || idea.test_questions?.en || []).map(x => `<li>${esc(x)}</li>`).join('');
    const resources = (idea.resource_ids || []).map(resourceById).filter(Boolean);
    output.innerHTML = `<article class="creator-challenge-card">
      <div class="creator-challenge-meta"><span>${esc(d().pillars[idea.pillar] || idea.pillar)}</span><span>${esc(idea.project_type)}</span><span>${esc(idea.time)}</span></div>
      <h2>${esc(local(idea.title))}</h2>
      <div class="creator-bridge-sections"><section><strong>${d().household}</strong><p>${esc(local(idea.household_need))}</p></section><section><strong>${d().school}</strong><p>${esc(local(idea.school_connection))}</p></section><section><strong>${d().community}</strong><p>${esc(local(idea.community_connection))}</p></section></div>
      <div class="creator-mission"><strong>${d().mission}</strong><p>${esc(local(idea.mission))}</p></div>
      <div class="creator-skills"><strong>${d().skills}</strong><div>${(idea.skills || []).map(x => `<span>${esc(x)}</span>`).join('')}</div></div>
      <div class="creator-output-grid"><section><h3>${d().steps}</h3><ol>${steps}</ol></section><section><h3>${d().test}</h3><ul>${tests}</ul></section></div>
      <section class="creator-learning-section"><h3>${d().learn}</h3><div class="creator-learning-grid">${resources.map(resourceCard).join('')}</div><a class="inline-link" href="/resources/learning-tools/">${state.language === 'es' ? 'Ver todas las herramientas' : 'View all learning tools'} →</a></section>
    </article>`;
    document.getElementById('creator-project-title').value = local(idea.title);
    document.getElementById('creator-project-purpose').value = local(idea.mission);
  }

  function blueprintText() {
    const idea = state.selectedIdea;
    if (!idea) return d().noIdea;
    const role = document.getElementById('creator-role').value;
    return [
      state.language === 'es' ? 'PLAN DE PRÁCTICA — FAMILY PERSONAL DEVELOPMENT' : 'FAMILY PERSONAL DEVELOPMENT PRACTICE BLUEPRINT', '',
      `${d().project}: ${document.getElementById('creator-project-title').value.trim() || local(idea.title)}`,
      `${d().household}: ${local(idea.household_need)}`,
      `${d().mission}: ${document.getElementById('creator-project-purpose').value.trim() || local(idea.mission)}`,
      `${d().role}: ${d().roles[role] || role || '—'}`,
      `${d().materials}: ${document.getElementById('creator-materials').value.trim() || '—'}`,
      `${d().first}: ${document.getElementById('creator-first-step').value.trim() || '—'}`,
      `${d().adult}: ${document.getElementById('creator-adult-support').value.trim() || '—'}`,
      `${d().reviewer}: ${document.getElementById('creator-reviewer').value.trim() || '—'}`, '', d().notSaved, d().app
    ].join('\n');
  }

  async function copyBlueprint() {
    const value = blueprintText();
    try { await navigator.clipboard.writeText(value); }
    catch {
      const area = document.createElement('textarea'); area.value = value; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
    }
    const status = document.getElementById('creator-action-status'); status.textContent = d().copied; setTimeout(() => status.textContent = '', 2500);
  }

  async function load() {
    try {
      const [ideaResponse, resourceResponse] = await Promise.all([
        fetch('/assets/data/youth-project-ideas.json', {cache:'no-store'}),
        fetch('/assets/data/learning-resources.json', {cache:'no-store'})
      ]);
      if (!ideaResponse.ok || !resourceResponse.ok) throw new Error('Data failed to load');
      const data = await ideaResponse.json();
      state.ideas = data.ideas || [];
      state.ageBands = data.age_bands || {};
      state.resources = (await resourceResponse.json()).resources || [];
      updateLanguage();
    } catch (error) {
      document.getElementById('creator-idea-output').innerHTML = '<div class="creator-empty-state">The project library could not load. Refresh the page and try again.</div>';
      console.error(error);
    }
  }

  document.querySelectorAll('[data-creator-language]').forEach(button => button.addEventListener('click', () => {
    state.language = button.dataset.creatorLanguage;
    localStorage.setItem('familypd:youth-creator-language', state.language);
    updateLanguage();
  }));
  document.getElementById('generate-creator-idea').addEventListener('click', chooseIdea);
  document.getElementById('copy-creator-blueprint').addEventListener('click', copyBlueprint);
  load();
})();
