
(() => {
  const form = document.getElementById('reality-check-form');
  const output = document.getElementById('reality-results');
  if (!form || !output) return;

  const groups = {
    poverty: {
      title: 'Possible financial instability or material hardship',
      text: 'Your responses may suggest that essential needs are difficult to meet consistently. Some families are living in poverty or near-poverty without recognizing the term because they are still working, paying some bills, or “making it work.” Official poverty is based on income and family size, but everyday hardship can exist above that line too.',
      ideas: ['List the next 30 days of essential needs before optional spending.', 'Check eligibility for food, utility, housing, health, transportation, school, or workforce assistance.', 'Choose one trusted person or community organization to contact before the situation becomes urgent.']
    },
    health: {
      title: 'Daily health routines may need support',
      text: 'Your responses may show that stress, limited time, cost, or exhaustion is affecting water, meals, sleep, or care. These patterns can make concentration, patience, school, work, and family communication harder.',
      ideas: ['Choose one routine to stabilize first: water, one balanced meal, sleep, medication, or an overdue appointment.', 'Use a visible reminder or shared family routine instead of relying on one person to remember everything.', 'Seek a qualified health professional when symptoms, distress, or delayed care are concerning.']
    },
    relationship: {
      title: 'Communication may be causing harm or disconnection',
      text: 'Frequent yelling, insults, threats, ridicule, fear, or silent treatment can become normalized inside a household. Your responses may suggest that the family needs safer communication, boundaries, repair, or professional support.',
      ideas: ['Discuss one specific behavior rather than labeling a person.', 'Create a pause-and-return agreement for heated conversations.', 'Consider counseling, a trusted mediator, faith leader, or family-support professional when patterns are difficult to change alone.']
    },
    workload: {
      title: 'One person may be carrying too much',
      text: 'Visible chores are only part of household work. Planning, remembering, scheduling, caregiving, emotional support, and noticing what needs to happen also consume time and energy.',
      ideas: ['Use the Household Workload Calculator to name visible and invisible responsibilities.', 'Assign backup people for essential work instead of leaving one person responsible every time.', 'Rotate, simplify, automate, postpone, or ask outside support for tasks that do not need to remain with one person.']
    },
    community: {
      title: 'The household may be too isolated',
      text: 'Isolation increases pressure on caregivers and can leave a family without help during illness, transportation problems, school emergencies, financial shocks, or emotional crisis. Needing community is not failure.',
      ideas: ['Identify one person for practical help and one person for emotional support.', 'Explore school, neighborhood, faith, library, nonprofit, parent-group, or community-center connections.', 'For single parents and isolated caregivers, build backup plans before an emergency rather than waiting until everything becomes unmanageable.']
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = [...form.querySelectorAll('input[name="reality"]:checked')].map(el => el.value);
    if (!selected.length) {
      output.innerHTML = '<h2>Your reflection results</h2><p>Please select at least one statement that feels familiar.</p>';
      return;
    }
    const active = new Set(selected.map(v => v.split('-')[0]));
    const cards = [...active].map(key => {
      const group = groups[key];
      return `<article class="result-card"><h3>${group.title}</h3><p>${group.text}</p><h4>Possible next steps</h4><ul>${group.ideas.map(i => `<li>${i}</li>`).join('')}</ul></article>`;
    }).join('');
    output.innerHTML = `<h2>Your reflection results</h2><p class="result-intro">These patterns are possibilities, not diagnoses. Use what fits, seek qualified help where needed, and begin with immediate safety and basic needs.</p><div class="result-card-grid">${cards}</div>
      <div class="result-next-links"><a class="button" href="/toolkit/pillar-check/">Complete the Five-Pillar Check-In</a><a class="button button-secondary" href="/toolkit/roles-responsibilities/">Open the Workload Calculator</a></div>`;
    output.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();
