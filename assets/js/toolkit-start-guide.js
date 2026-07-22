(() => {
  'use strict';
  const button = document.getElementById('find-starting-point');
  const result = document.getElementById('guided-start-result');
  if (!button || !result) return;

  const guides = {
    health: {
      pillar: 'Pillar One: Health',
      why: 'Health and safety come first. Stress, poor sleep, untreated health needs, or danger can make every other family system harder to use.',
      step: 'Choose one immediate safety or well-being need and identify the first qualified person, service, or routine that can support it.',
      tool: '/toolkit/pillar-check/',
      toolName: 'Use the Five-Pillar Check-In'
    },
    relationships: {
      pillar: 'Pillar Two: Relationships',
      why: 'Constant conflict, disrespect, or disconnection usually needs a calm communication and repair system before the family adds more goals.',
      step: 'Schedule one short conversation with one question: “What would help home feel more respectful or connected this week?” Choose one action, not ten.',
      tool: '/toolkit/meeting-planner/',
      toolName: 'Plan a short family meeting'
    },
    education: {
      pillar: 'Pillar Three: Education & Skills',
      why: 'School confusion, missing work, or career uncertainty becomes easier to address when information, deadlines, and support are made visible.',
      step: 'Choose one learner or one skill. Review the current status, the next deadline, and the person or resource that can help.',
      tool: '/resources/school-systems/',
      toolName: 'Review school-system guidance'
    },
    finances: {
      pillar: 'Pillar Four: Finances',
      why: 'Money stress improves through awareness and one manageable priority—not shame or trying to fix every number at once.',
      step: 'Write down one set of numbers: essential bills due before the next income date. Then choose the most urgent next action.',
      tool: '/toolkit/goal-planner/',
      toolName: 'Turn one money priority into a plan'
    },
    goals: {
      pillar: 'Pillar Five: Goals',
      why: 'When the foundation is reasonably steady but the family feels stuck, one shared direction and a repeatable check-in can create momentum.',
      step: 'Choose one realistic result for the next 30 days and the smallest action that can be completed this week.',
      tool: '/toolkit/goal-planner/',
      toolName: 'Use the Family Goal Planner'
    },
    systems: {
      pillar: 'Guiding Principle: Systems',
      why: 'Clutter, inconsistent chores, and repeated confusion often mean the family is missing a clear, repeatable way to get the work done.',
      step: 'Choose one recurring problem, list the steps in order, assign an owner, and test the routine for one week.',
      tool: '/toolkit/roles-responsibilities/',
      toolName: 'Clarify roles and responsibilities'
    },
    identity: {
      pillar: 'Shared Direction: Mission, Vision & Values',
      why: 'When the family is hopeful but unsure what it is building, shared language can guide choices and systems.',
      step: 'Choose one outcome the family wants and three values that describe how people will behave while working toward it.',
      tool: '/toolkit/mission-vision/',
      toolName: 'Build a mission and vision'
    }
  };

  function choose(outcome, problem, feeling) {
    if (problem === 'unsafe') return {key:'health', emergency:true};
    if (problem === 'health' || outcome === 'wellbeing' || feeling === 'exhausted') return {key:'health'};
    if (problem === 'arguing' || problem === 'disconnected' || outcome === 'connection' || feeling === 'tense' || feeling === 'disconnected') return {key:'relationships'};
    if (problem === 'debt' || outcome === 'money') return {key:'finances'};
    if (problem === 'school' || problem === 'skills' || outcome === 'learning') return {key:'education'};
    if (problem === 'clutter' || problem === 'routines' || outcome === 'calm') return {key:'systems'};
    if (problem === 'stuck' || outcome === 'direction') return {key:'goals'};
    if (feeling === 'hopeful' || feeling === 'confused') return {key:'identity'};
    return {key:'health'};
  }

  button.addEventListener('click', () => {
    const outcome = document.getElementById('start-outcome').value;
    const problem = document.getElementById('start-problem').value;
    const feeling = document.getElementById('start-feeling').value;
    if (!outcome && !problem && !feeling) {
      result.innerHTML = '<p><strong>Choose at least one option.</strong> You do not need to complete all three.</p>';
      return;
    }
    const selected = choose(outcome, problem, feeling);
    const guide = guides[selected.key];
    const emergency = selected.emergency ? '<div class="emergency-result"><strong>Immediate safety comes before a Family PD tool.</strong><p>Call 911 now if anyone is in immediate danger. Move to a safer place when possible and contact qualified emergency, medical, mental-health, or abuse-support professionals. In the United States, call or text 988 for a suicide or mental-health crisis.</p></div>' : '';
    result.innerHTML = `${emergency}<span class="guided-result-label">Suggested starting point</span><h3>${guide.pillar}</h3><p>${guide.why}</p><div class="guided-first-step"><strong>One small first step</strong><span>${guide.step}</span></div><a class="button button-secondary" href="${guide.tool}">${guide.toolName}</a><small>This suggestion is general education, not a diagnosis or professional recommendation. Adjust it to your family’s safety, health, culture, capacity, and qualified guidance.</small>`;
  });
})();
