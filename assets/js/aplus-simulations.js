'use strict';

const simulations = {
  15: {
    initial: () => ({editor: 'Read', reader: 'Read', editorTest: false, readerTest: false}),
    status: s => 'Share permissions — Editors: ' + s.editor + '. Readers: ' + s.reader +
      '. Network verification — Editor: ' + (s.editorTest ? 'tested' : 'pending') +
      '. Reader: ' + (s.readerTest ? 'tested' : 'pending') + '.',
    change(s, control, value) {
      const editor = control === 'edit-grant';
      s[editor ? 'editor' : 'reader'] = value;
      s[editor ? 'editorTest' : 'readerTest'] = false;
      return 'Share permission saved. Retest the affected identity.';
    },
    act(s, action) {
      const editor = action === 'test-editor';
      s[editor ? 'editorTest' : 'readerTest'] = true;
      const grant = editor ? s.editor : s.reader;
      const result = editor
        ? (grant === 'Read' ? 'Editor: open succeeded; save was blocked.' : 'Editor: open and save succeeded.')
        : 'Reader: open succeeded; NTFS Read blocked saving.';
      if (s.editor === 'Full Control' || s.reader !== 'Read') {
        return result + ' Review least privilege. Both permission layers matter even when the current NTFS rules prevent an unwanted action.';
      }
      return s.editorTest && s.readerTest && s.editor === 'Change'
        ? result + ' Both identities meet the ticket and the share follows least privilege.'
        : result;
    }
  },
  16: {
    initial: () => ({backup: false, upgraded: false, driver: false, tested: false, approved: false}),
    status: s => (s.backup ? 'Backup verified.' : 'Backup verification pending.') +
      (s.upgraded ? ' Pilot upgraded.' : ' Pilot on original OS.') +
      (s.tested ? ' Workflow tests passed.' : ' Workflow acceptance pending.') +
      (s.approved ? ' Rollout eligible for approval.' : ' Rollout on hold.'),
    act(s, action) {
      if (action === 'verify-backup') {
        s.backup = true;
        return 'A sample file was restored from the backup and opened successfully.';
      }
      if (action === 'run-upgrade') {
        if (!s.backup) return 'Upgrade blocked. Verify a recoverable backup first.';
        if (s.upgraded) return 'The pilot is already upgraded. Continue with acceptance tests.';
        s.upgraded = true;
        return 'Upgrade finished. The workstation is ready for acceptance testing.';
      }
      if (!s.upgraded) return 'The pilot upgrade must finish before this step.';
      if (action === 'install-driver') {
        if (s.driver) return 'The approved driver is already installed.';
        s.driver = true;
        return 'Approved driver installed. Test the user workflow to verify the change.';
      }
      if (action === 'run-tests') {
        s.tested = s.driver;
        return s.tested ? 'Standard-user sign-in, print, and scan all passed.' : 'Sign-in and print passed. Scan failed because the required driver is missing.';
      }
      if (!s.tested) return 'Rollout blocked until all three acceptance checks pass.';
      s.approved = true;
      return 'All gates passed. Submit the pilot’s evidence to the change owner for rollout approval.';
    }
  },
  20: {
    initial: () => ({authorized: false, online: false, command: 'Not issued'}),
    status: s => (s.authorized ? 'Enrollment and authorization verified.' : 'Authorization pending.') +
      ' Phone ' + (s.online ? 'online' : 'offline') + '. Work-profile removal: ' + s.command + '.',
    act(s, action) {
      if (action === 'verify-phone') {
        s.authorized = true;
        return 'The enrollment record matches the work profile and permits selective removal.';
      }
      if (action === 'check-console') {
        return 'Console receipt: ' + s.command + (s.command === 'Complete' ? '. The device acknowledged work-profile removal.' : '. No completion acknowledgment is available.');
      }
      if (action === 'connect-phone') {
        s.online = true;
        if (s.command !== 'Queued') return 'The phone checked in. There was no pending command to deliver.';
        s.command = 'Complete';
        return 'The device received and acknowledged the queued work-profile removal.';
      }
      if (!s.authorized) return 'Action blocked until device enrollment and authorization are verified.';
      if (s.command !== 'Not issued') return 'A removal command already exists. Read its status in the console.';
      s.command = s.online ? 'Complete' : 'Queued';
      return s.online ? 'The online device acknowledged work-profile removal.' : 'Command queued. The device must check in before completion can be confirmed.';
    }
  },
  21: {
    initial: () => ({count: 0, verified: false}),
    status: s => 'Recovery point: ' + ['none', 'Sunday 18:00', 'Monday 18:00', 'Tuesday 18:00'][s.count] +
      '. Restore verification: ' + (s.verified ? 'passed' : 'pending') + '.',
    act(s, action) {
      const order = ['restore-sunday', 'restore-monday', 'restore-tuesday'];
      const descriptions = ['Sunday full restored.', 'Monday changes applied.', 'Tuesday changes applied.'];
      if (action === 'verify-restore') {
        if (s.count !== order.length) return 'The restore chain is incomplete. Recover through Tuesday before acceptance testing.';
        s.verified = true;
        return 'The sample opened and the expected access rules worked. Recovery reached Tuesday 18:00. Data loss is 17 hours, exceeding the eight-hour target by nine hours.';
      }
      const position = order.indexOf(action);
      if (position < s.count) return 'That backup set has already been applied.';
      if (position !== s.count) return 'Restore blocked. The earlier required backup set is missing.';
      s.count++;
      return descriptions[position];
    }
  }
};

for (const lab of document.querySelectorAll('[data-bench]')) {
  const model = simulations[lab.dataset.bench];
  const stateText = lab.querySelector('[data-bench-state]');
  const result = lab.querySelector('[data-bench-status]');
  const log = lab.querySelector('[data-bench-log]');
  const controls = [...lab.querySelectorAll('[data-bench-control]')];
  let state = model.initial();

  function record(message) {
    stateText.textContent = model.status(state);
    result.textContent = message;
    if (log.firstElementChild?.textContent === 'No actions recorded.') log.replaceChildren();
    const entry = document.createElement('li');
    entry.textContent = message;
    log.append(entry);
    if (log.children.length > 12) log.firstElementChild.remove();
  }

  stateText.textContent = model.status(state);
  for (const control of controls) {
    control.addEventListener('change', () => record(model.change(state, control.dataset.benchControl, control.value)));
  }
  for (const button of lab.querySelectorAll('[data-bench-action]')) {
    button.addEventListener('click', () => record(model.act(state, button.dataset.benchAction)));
  }
  lab.querySelector('[data-bench-reset]').addEventListener('click', () => {
    state = model.initial();
    for (const control of controls) control.selectedIndex = 0;
    stateText.textContent = model.status(state);
    result.textContent = 'Simulation reset.';
    const entry = document.createElement('li');
    entry.textContent = 'No actions recorded.';
    log.replaceChildren(entry);
  });
}
