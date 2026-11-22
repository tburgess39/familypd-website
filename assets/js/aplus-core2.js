'use strict';

for (const quiz of document.querySelectorAll('[data-quiz]')) {
  const fields = [...quiz.querySelectorAll('fieldset')];
  const score = quiz.querySelector('[data-score]');

  quiz.querySelector('[data-grade]').addEventListener('click', () => {
    let correct = 0;
    let unanswered = 0;
    for (const field of fields) {
      const answer = field.querySelector('input:checked');
      const feedback = field.querySelector('[data-feedback]');
      if (!answer) {
        unanswered++;
        feedback.textContent = 'Choose an answer.';
      } else if (answer.value === '0') {
        correct++;
        feedback.textContent = 'Correct. Explain the clue in your own words.';
      } else {
        feedback.textContent = 'Review the explanation and try again.';
      }
    }
    const pending = unanswered ? ' Unanswered: ' + unanswered + '.' : '';
    score.textContent = correct + ' of ' + fields.length + ' correct.' + pending;
  });

  quiz.querySelector('[data-reset]').addEventListener('click', () => {
    for (const field of fields) {
      for (const input of field.querySelectorAll('input')) input.checked = false;
      field.querySelector('[data-feedback]').textContent = '';
      field.querySelector('details').open = false;
    }
    score.textContent = 'Answers cleared.';
  });
}
