'use strict';

for (const demo of document.querySelectorAll('[data-concept-demo]')) {
  const result = demo.querySelector('.concept-result');
  const actions = [...demo.querySelectorAll('[data-demo-outcome]')];
  for (const action of actions) {
    action.setAttribute('aria-pressed', 'false');
    action.addEventListener('click', () => {
      for (const button of actions) button.setAttribute('aria-pressed', String(button === action));
      result.textContent = action.textContent + ': ' + action.dataset.demoOutcome;
    });
  }
}

for (const response of document.querySelectorAll('[data-case-response]')) {
  const status = response.querySelector('[data-case-status]');
  const rubric = response.querySelector('[data-case-rubric]');
  const fields = [...response.querySelectorAll('textarea')];
  response.querySelector('[data-review-response]').addEventListener('click', () => {
    const incomplete = fields.find(field => !field.value.trim());
    if (incomplete) {
      status.textContent = 'Complete the evidence, action, and verification fields first.';
      incomplete.focus();
      return;
    }
    rubric.open = true;
    status.textContent = 'Your response is ready for self-review. Compare it with the criteria below.';
  });
}
