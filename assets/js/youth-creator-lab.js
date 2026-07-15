(() => {
  'use strict';
  const root = document.getElementById('youth-creator-lab');
  if (!root) return;

  const state = {
    language: localStorage.getItem('familypd:youth-creator-language') || 'en',
    ideas: [],
    resources: [],
    selectedIdea: null
  };

  const dictionary = {
    en: {
      anyAge:'Any age', anyPillar:'Any pillar', anyType:'Any project type', anyTime:'Any amount of time',
      generate:'Generate Household Project Idea', household:'Household need this project can help',
      school:'School-connected skills', community:'School or community connection',
      mission:'Project mission', skills:'Skills practiced', steps:'Build steps',
      test:'Family test questions', learn:'Learn before you build',
      open:'Open official learning resource', copy:'Copy practice blueprint',
      copied:'Practice blueprint copied.', notSaved:'Practice mode: entries are not saved to a FamilyPD workspace.',
      app:'Real implementation will happen in the FamilyPD App.',
      noIdea:'Choose options and generate a household-impact project idea.',
      noMatch:'No exact match was found. A related project was selected instead.',
      pillars:{Health:'Health',Relationships:'Relationships','Education & Skills':'Education & Skills',Finances:'Finances',Goals:'Goals'},
      types:{App:'App',Comic:'Comic','Family Challenge':'Family Challenge',Game:'Game',Printable:'Printable','Study Tool':'Study Tool',Tracker:'Tracker','Video or Presentation':'Video or Presentation'},
      times:{'30–60 minutes':'30–60 minutes','30–90 minutes':'30–90 minutes','1–2 hours':'1–2 hours','1–3 hours':'1–3 hours','2–5 hours':'2–5 hours','2–6 hours':'2–6 hours','3–8 hours':'3–8 hours'},
      roles:{Researcher:'Researcher',Writer:'Writer',Artist:'Artist',Coder:'Coder',Tester:'Tester',Editor:'Editor',Narrator:'Narrator','Family feedback lead':'Family feedback lead'},
      skillsMap:{
        Planning:'Planning',Drawing:'Drawing',Sequencing:'Sequencing',Storytelling:'Storytelling',Empathy:'Empathy',
        Communication:'Communication','Safety awareness':'Safety awareness','Decision-making':'Decision-making',
        'Game design':'Game design',Research:'Research','Learning strategies':'Learning strategies',Design:'Design',
        Coding:'Coding',Logic:'Logic',Responsibility:'Responsibility',Budgeting:'Budgeting',Math:'Math',
        'Career research':'Career research','Public speaking':'Public speaking','Source review':'Source review',
        'Career readiness':'Career readiness','Goal setting':'Goal setting',Reflection:'Reflection','Family engagement':'Family engagement'
      }
    },
    es: {
      anyAge:'Cualquier edad', anyPillar:'Cualquier pilar', anyType:'Cualquier tipo de proyecto', anyTime:'Cualquier cantidad de tiempo',
      generate:'Generar idea para ayudar al hogar', household:'Necesidad del hogar que puede ayudar',
      school:'Habilidades relacionadas con la escuela', community:'Conexión con la escuela o la comunidad',
      mission:'Misión del proyecto', skills:'Habilidades que se practican', steps:'Pasos para crear',
      test:'Preguntas para probar con la familia', learn:'Aprenda antes de crear',
      open:'Abrir recurso oficial', copy:'Copiar plan de práctica',
      copied:'Plan de práctica copiado.', notSaved:'Modo de práctica: la información no se guarda en un espacio de trabajo de FamilyPD.',
      app:'La implementación real se realizará en la aplicación FamilyPD.',
      noIdea:'Elija opciones y genere una idea que ayude al hogar.',
      noMatch:'No se encontró una coincidencia exacta. Se seleccionó un proyecto relacionado.',
      pillars:{Health:'Salud',Relationships:'Relaciones','Education & Skills':'Educación y habilidades',Finances:'Finanzas',Goals:'Metas'},
      types:{App:'Aplicación',Comic:'Cómic','Family Challenge':'Reto familiar',Game:'Juego',Printable:'Recurso imprimible','Study Tool':'Herramienta de estudio',Tracker:'Registro','Video or Presentation':'Video o presentación'},
      times:{'30–60 minutes':'30–60 minutos','30–90 minutes':'30–90 minutos','1–2 hours':'1–2 horas','1–3 hours':'1–3 horas','2–5 hours':'2–5 horas','2–6 hours':'2–6 horas','3–8 hours':'3–8 horas'},
      roles:{Researcher:'Investigador',Writer:'Escritor',Artist:'Artista',Coder:'Programador',Tester:'Probador',Editor:'Editor',Narrator:'Narrador','Family feedback lead':'Responsable de comentarios familiares'},
      skillsMap:{
        Planning:'Planificación',Drawing:'Dibujo',Sequencing:'Secuencias',Storytelling:'Narración',Empathy:'Empatía',
        Communication:'Comunicación','Safety awareness':'Conciencia de seguridad','Decision-making':'Toma de decisiones',
        'Game design':'Diseño de juegos',Research:'Investigación','Learning strategies':'Estrategias de aprendizaje',Design:'Diseño',
        Coding:'Programación',Logic:'Lógica',Responsibility:'Responsabilidad',Budgeting:'Presupuesto',Math:'Matemáticas',
        'Career research':'Investigación profesional','Public speaking':'Hablar en público','Source review':'Revisión de fuentes',
        'Career readiness':'Preparación profesional','Goal setting':'Establecimiento de metas',Reflection:'Reflexión','Family engagement':'Participación familiar'
      }
    }
  };

  const d = () => dictionary[state.language];
  const text = value => typeof value === 'string' ? value : value?.[state.language] || value?.en || '';
  const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");
  const labelPillar = value => d().pillars[value] || value;
  const labelType = value => d().types[value] || value;
  const labelTime = value => d().times[value] || value;
  const labelSkill = value => d().skillsMap[value] || value;

  function setOptionLabels() {
    const age = document.getElementById('creator-age');
    const pillar = document.getElementById('creator-pillar');
    const type = document.getElementById('creator-type');
    const time = document.getElementById('creator-time');
    const role = document.getElementById('creator-role');

    age.options[0].textContent = d().anyAge;
    [...age.options].slice(1).forEach(option => {
      const band = window.__FPD_YOUTH_DATA__?.age_bands?.[option.value];
      if (band) option.textContent = text(band);
    });

    pillar.options[0].textContent = d().anyPillar;
    [...pillar.options].slice(1).forEach(option => option.textContent = labelPillar(option.value));

    type.options[0].textContent = d().anyType;
    [...type.options].slice(1).forEach(option => option.textContent = labelType(option.value));

    time.options[0].textContent = d().anyTime;
    [...time.options].slice(1).forEach(option => option.textContent = labelTime(option.value));

    role.options[0].textContent = state.language === 'es' ? 'Elija un rol' : 'Choose a role';
    [...role.options].slice(1).forEach(option => option.textContent = d().roles[option.value] || option.value);
  }

  function updateLanguage() {
    document.documentElement.lang = state.language;
    document.querySelectorAll('[data-creator-copy]').forEach(element => {
      const copy = element.dataset[state.language];
      if (copy) element.textContent = copy;
    });
    document.querySelectorAll('[data-creator-language]').forEach(button => {
      const active = button.dataset.creatorLanguage === state.language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-placeholder-en]').forEach(element => {
      element.placeholder = state.language === 'es' ? element.dataset.placeholderEs : element.dataset.placeholderEn;
    });
    document.getElementById('generate-creator-idea').textContent = d().generate;
    document.getElementById('copy-creator-blueprint').textContent = d().copy;
    setOptionLabels();
    renderIdea();
  }

  function filters() {
    return {
      age: document.getElementById('creator-age').value,
      pillar: document.getElementById('creator-pillar').value,
      type: document.getElementById('creator-type').value,
      time: document.getElementById('creator-time').value
    };
  }

  function chooseIdea() {
    const f = filters();
    let candidates = state.ideas.filter(idea =>
      (!f.age || idea.ages.includes(f.age)) &&
      (!f.pillar || idea.pillar === f.pillar) &&
      (!f.type || idea.project_type === f.type) &&
      (!f.time || idea.time === f.time)
    );

    let fallback = false;
    if (!candidates.length) {
      fallback = true;
      candidates = state.ideas.filter(idea =>
        (!f.age || idea.ages.includes(f.age)) &&
        (!f.pillar || idea.pillar === f.pillar)
      );
    }
    if (!candidates.length) {
      fallback = true;
      candidates = state.ideas.filter(idea => !f.age || idea.ages.includes(f.age));
    }
    if (!candidates.length) candidates = state.ideas;

    state.selectedIdea = candidates[Math.floor(Math.random() * candidates.length)];
    document.getElementById('creator-match-note').textContent = fallback ? d().noMatch : '';
    renderIdea();
  }

  function resourceById(id) {
    return state.resources.find(resource => resource.id === id);
  }

  function resourceCard(resource) {
    return `<article class="creator-learning-card">
      <span>${esc(resource.category)}</span>
      <h4>${esc(resource.name)}</h4>
      <p>${esc(text(resource.use_for))}</p>
      <small>${esc(text(resource.support_note))}</small>
      <a href="${esc(resource.url)}" target="_blank" rel="noopener noreferrer">${d().open} ↗</a>
    </article>`;
  }

  function renderIdea() {
    const output = document.getElementById('creator-idea-output');
    if (!state.selectedIdea) {
      output.innerHTML = `<div class="creator-empty-state"><strong>${d().noIdea}</strong><span>${d().notSaved}</span></div>`;
      return;
    }

    const idea = state.selectedIdea;
    const skills = idea.skills.map(item => `<span>${esc(labelSkill(item))}</span>`).join('');
    const steps = (idea.steps?.[state.language] || idea.steps.en).map(item => `<li>${esc(item)}</li>`).join('');
    const tests = (idea.test_questions?.[state.language] || idea.test_questions.en).map(item => `<li>${esc(item)}</li>`).join('');
    const resources = (idea.resource_ids || []).map(resourceById).filter(Boolean);

    output.innerHTML = `<article class="creator-challenge-card">
      <div class="creator-challenge-meta"><span>${esc(labelPillar(idea.pillar))}</span><span>${esc(labelType(idea.project_type))}</span><span>${esc(labelTime(idea.time))}</span></div>
      <h2>${esc(text(idea.title))}</h2>
      <div class="creator-bridge-sections">
        <section><strong>${d().household}</strong><p>${esc(text(idea.household_need))}</p></section>
        <section><strong>${d().school}</strong><p>${esc(text(idea.school_connection))}</p></section>
        <section><strong>${d().community}</strong><p>${esc(text(idea.community_connection))}</p></section>
      </div>
      <div class="creator-mission"><strong>${d().mission}</strong><p>${esc(text(idea.mission))}</p></div>
      <div class="creator-skills"><strong>${d().skills}</strong><div>${skills}</div></div>
      <div class="creator-output-grid">
        <section><h3>${d().steps}</h3><ol>${steps}</ol></section>
        <section><h3>${d().test}</h3><ul>${tests}</ul></section>
      </div>
      <section class="creator-learning-section">
        <h3>${d().learn}</h3>
        <div class="creator-learning-grid">${resources.map(resourceCard).join('')}</div>
        <a class="inline-link" href="../../resources/learning-tools/">${state.language === 'es' ? 'Ver todas las herramientas de aprendizaje' : 'View all learning tools'} →</a>
      </section>
    </article>`;

    document.getElementById('creator-project-title').value = text(idea.title);
    document.getElementById('creator-project-purpose').value = text(idea.mission);
  }

  function blueprintText() {
    const idea = state.selectedIdea;
    if (!idea) return d().noIdea;
    const role = document.getElementById('creator-role').value;

    return [
      state.language === 'es' ? 'PLAN DE PRÁCTICA — FAMILY PERSONAL DEVELOPMENT' : 'FAMILY PERSONAL DEVELOPMENT PRACTICE BLUEPRINT',
      '',
      `${state.language === 'es' ? 'Proyecto' : 'Project'}: ${document.getElementById('creator-project-title').value.trim() || text(idea.title)}`,
      `${state.language === 'es' ? 'Necesidad del hogar' : 'Household need'}: ${text(idea.household_need)}`,
      `${state.language === 'es' ? 'Conexión escolar' : 'School connection'}: ${text(idea.school_connection)}`,
      `${state.language === 'es' ? 'Conexión comunitaria' : 'Community connection'}: ${text(idea.community_connection)}`,
      '',
      `${d().mission}: ${document.getElementById('creator-project-purpose').value.trim() || text(idea.mission)}`,
      `${state.language === 'es' ? 'Rol' : 'Role'}: ${d().roles[role] || role || '—'}`,
      `${state.language === 'es' ? 'Materiales' : 'Materials'}: ${document.getElementById('creator-materials').value.trim() || '—'}`,
      `${state.language === 'es' ? 'Primer paso' : 'First step'}: ${document.getElementById('creator-first-step').value.trim() || '—'}`,
      `${state.language === 'es' ? 'Apoyo adulto' : 'Adult support'}: ${document.getElementById('creator-adult-support').value.trim() || '—'}`,
      `${state.language === 'es' ? 'Revisor' : 'Reviewer'}: ${document.getElementById('creator-reviewer').value.trim() || '—'}`,
      '',
      d().notSaved,
      d().app
    ].join('\n');
  }

  async function copyBlueprint() {
    const content = blueprintText();
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
    const status = document.getElementById('creator-action-status');
    status.textContent = d().copied;
    setTimeout(() => status.textContent = '', 3000);
  }

  async function loadData() {
    try {
      const [ideaResponse, resourceResponse] = await Promise.all([
        fetch('../../assets/data/youth-project-ideas.json', {cache:'no-store'}),
        fetch('../../assets/data/learning-resources.json', {cache:'no-store'})
      ]);
      if (!ideaResponse.ok || !resourceResponse.ok) throw new Error();
      window.__FPD_YOUTH_DATA__ = await ideaResponse.json();
      state.ideas = window.__FPD_YOUTH_DATA__.ideas || [];
      state.resources = (await resourceResponse.json()).resources || [];

      const requestedAge = new URLSearchParams(window.location.search).get('age');
      if (requestedAge && ['4-7','8-12','13-18'].includes(requestedAge)) {
        document.getElementById('creator-age').value = requestedAge;
      }
      updateLanguage();
    } catch {
      document.getElementById('creator-idea-output').innerHTML = '<div class="creator-empty-state">The project library could not load. Please refresh the page.</div>';
    }
  }

  document.querySelectorAll('[data-creator-language]').forEach(button => button.addEventListener('click', () => {
    state.language = button.dataset.creatorLanguage;
    localStorage.setItem('familypd:youth-creator-language', state.language);
    updateLanguage();
  }));
  document.getElementById('generate-creator-idea').addEventListener('click', chooseIdea);
  document.getElementById('copy-creator-blueprint').addEventListener('click', copyBlueprint);
  loadData();
})();