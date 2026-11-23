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

