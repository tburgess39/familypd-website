'use strict';

for (const lab of document.querySelectorAll('[data-mission-lab]')) {
  const rows = [...lab.querySelectorAll('.lab-row')];
  const score = lab.querySelector('[data-lab-score]');

  lab.querySelector('[data-lab-check]').addEventListener('click', () => {
    let correct = 0;
    let blank = 0;
    for (const row of rows) {
      const control = row.querySelector('select, input');
      const result = row.querySelector('[data-lab-result]');
      if (!control.value.trim() || !control.validity.valid) {
        blank++;
        result.textContent = control.validity.valid ? 'Enter a response.' : 'Enter a valid whole number.';
        continue;
      }
      const matches = control.type === 'number'
        ? control.valueAsNumber === Number(row.dataset.answer)
        : control.value === row.dataset.answer;
      correct += Number(matches);
      result.textContent = matches ? 'Correct.' : 'Review the evidence and try again.';
    }
    score.textContent = correct === rows.length
      ? 'All ' + rows.length + ' lab decisions are correct. Show your work below.'
      : correct + ' of ' + rows.length + ' lab decisions correct.' + (blank ? ' Incomplete: ' + blank + '.' : '');
  });

  lab.querySelector('[data-lab-reset]').addEventListener('click', () => {
    for (const row of rows) {
      row.querySelector('select, input').value = '';
      row.querySelector('[data-lab-result]').textContent = '';
      row.querySelector('details').open = false;
    }
    score.textContent = 'Lab reset.';
  });
}

for (const terminal of document.querySelectorAll('[data-console]')) {
  const outputs = JSON.parse(terminal.querySelector('script').textContent);
  const display = terminal.querySelector('pre');
  for (const button of terminal.querySelectorAll('[data-console-command]')) {
    button.addEventListener('click', () => {
      const command = button.dataset.consoleCommand;
      display.textContent = '> ' + command + '\n' + outputs[command];
    });
  }
}

for (const pilot of document.querySelectorAll('[data-inventory-pilot]')) {
  const limit = pilot.querySelector('input');
  const output = pilot.querySelector('pre');
  const fixtures = [['PC-A', 19], ['PC-B', 20], ['PC-C', null], ['PC-D', 'unreadable']];
  pilot.querySelector('[data-run-pilot]').addEventListener('click', () => {
    if (!limit.value || !limit.validity.valid) {
      output.textContent = 'Enter a whole-number threshold between 1 and 1,000 GB.';
      return;
    }
    const threshold = limit.valueAsNumber;
    const results = fixtures.map(([host, freeSpace]) => {
      if (freeSpace === null) return host + ' · Unreachable';
      if (!Number.isFinite(freeSpace)) return host + ' · Invalid measurement';
      const status = freeSpace < threshold ? 'Low space' : 'Within threshold';
      return host + ' · ' + freeSpace + ' GB · ' + status;
    });
    output.textContent = results.join('\n');
  });
}
