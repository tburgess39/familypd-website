'use strict';

const terminalModels = {
  cmd: {
    start: 'C:\\Users\\Student',
    folders: {'C:\\Users\\Student':'<DIR> Documents', 'C:\\Users\\Student\\Documents':'<DIR> HelpDesk', 'C:\\Users\\Student\\Documents\\HelpDesk':'incident.txt\nbackup-job.txt'},
    commands: [
      ['cd', ({cwd}) => cwd],
      ['dir', ({cwd,model}) => 'Directory of '+cwd+'\n'+model.folders[cwd]],
      ['cd Documents', 'C:\\Users\\Student\\Documents'],
      ['cd HelpDesk', 'C:\\Users\\Student\\Documents\\HelpDesk'],
      ['cd ..', 'parent'],
      ['type backup-job.txt', ({cwd}) => cwd.endsWith('\\HelpDesk') ? 'Job: Lab Backup\nDestination: \\\\backup.example.test\\training\nError: The network name cannot be found.' : 'File not found here. Use dir and move to HelpDesk.'],
      ['ipconfig /all', () => 'Ethernet: connected\nIPv4: 10.20.30.41/24\nGateway: 10.20.30.1\nDNS Server: 10.20.30.53'],
      ['ping 10.20.30.1', () => 'Reply from 10.20.30.1: time=1ms'],
      ['nslookup backup.example.test', () => 'Server: 10.20.30.53\nbackup.example.test: NXDOMAIN']
    ]
  },
  ps: {
    start: 'C:\\Users\\Student',
    folders: {'C:\\Users\\Student':'Directory: Incident', 'C:\\Users\\Student\\Incident':'incident.txt\napp-history.txt'},
    commands: [
      ['Get-Location', ({cwd}) => cwd],
      ['Get-ChildItem', ({cwd,model}) => model.folders[cwd]],
      ['Set-Location .\\Incident', 'C:\\Users\\Student\\Incident'],
      ['Set-Location ..', 'parent'],
      ['Get-Content .\\incident.txt', ({cwd}) => cwd.endsWith('\\Incident') ? 'The training app froze during a portal lookup. Capture live process state and check the approved portal endpoint.' : 'incident.txt is in the Incident folder.'],
      ['Get-Process TrainingApp', () => 'Name: TrainingApp    ID: 8820    CPU(s): 95.2\nCPU(s) is cumulative time. Use Task Manager for current utilization and responsiveness.'],
      ['taskmgr', () => 'Task Manager → Processes\nTrainingApp: Not responding; CPU 1% now\nOther processes: responding\nCheck unsaved work before ending the process.'],
      ['Get-NetIPConfiguration', () => 'IPv4: 10.20.30.41\nDefault gateway: 10.20.30.1\nDNS: 10.20.30.53'],
      ['Test-NetConnection portal.example.test -Port 443', () => 'WARNING: Name resolution of portal.example.test failed.\nTcpTestSucceeded: False\nResolve the name before interpreting this as a blocked port.']
    ]
  },
  access: {
    start: 'C:\\Lab',
    folders: {'C:\\Lab':'Directory: Finance', 'C:\\Lab\\Finance':'budget.csv'},
    commands: [
      ['Get-Location', ({cwd}) => cwd],
      ['Get-ChildItem', ({cwd,model}) => model.folders[cwd]],
      ['Set-Location .\\Finance', 'C:\\Lab\\Finance'],
      ['Set-Location ..', 'parent'],
      ['Get-SmbShareAccess -Name Finance', () => 'Account          AccessRight\nFinance Editors  Read\nFinance Readers  Read'],
      ['Get-Acl .', ({cwd}) => cwd.endsWith('\\Finance') ? 'NTFS access\nFinance Editors: Modify\nFinance Readers: ReadAndExecute' : 'This is the parent folder. Change into Finance to inspect the target folder’s ACL.']
    ]
  },
  linux: {
    start: '/home/student',
    folders: {'/home/student':'drwxr-xr-x student student jobs','/home/student/jobs':'-rw-r--r-- student backup backup.log'},
    commands: [
      ['pwd', ({cwd}) => cwd],
      ['ls -l', ({cwd,model}) => model.folders[cwd]],
      ['cd jobs', '/home/student/jobs'],
      ['cd ..', 'parent'],
      ['cat backup.log', ({cwd}) => cwd.endsWith('/jobs') ? 'backupsvc: cannot create /srv/backup/report.tgz: Permission denied' : 'backup.log: No such file in this directory.'],
      ['id backupsvc', () => 'uid=1301(backupsvc) gid=1301(backupsvc) groups=1301(backupsvc),1302(backup)'],
      ['ls -ld /srv /srv/backup', () => 'drwxr-x--- root backup /srv\ndrwxr-x--- root backup /srv/backup'],
      ['findmnt /srv/backup', () => '/srv/backup  /dev/mapper/backup-data  ext4  rw']
    ]
  }
};

for (const terminal of document.querySelectorAll('[data-click-terminal]')) {
  const model = terminalModels[terminal.dataset.clickTerminal];
  const output = terminal.querySelector('pre');
  const location = terminal.querySelector('[data-terminal-cwd]');
  const container = terminal.querySelector('[data-terminal-commands]');
  const joiner = model.start.startsWith('/') ? '/' : '\\';
  let cwd = model.start;
  let history = [];
  const render = () => {
    location.textContent = 'Working directory: ' + cwd;
    output.textContent = history.join('\n\n') || 'Select a command.';
  };
  for (const [command, action] of model.commands) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = command;
    button.addEventListener('click', () => {
      const prompt = cwd;
      let response;
      if (typeof action === 'function') {
        response = action({cwd, model});
      } else if (action === 'parent') {
        if (cwd !== model.start) cwd = cwd.slice(0, cwd.lastIndexOf(joiner));
        response = 'Current directory: ' + cwd;
      } else if (action.slice(0, action.lastIndexOf(joiner)) === cwd) {
        cwd = action;
        response = 'Current directory: ' + cwd;
      } else {
        response = 'Directory not found from this location. List the current directory first.';
      }
      history.push(prompt + (joiner === '/' ? ' $ ' : '> ') + command + '\n' + response);
      history = history.slice(-8);
      render();
    });
    container.append(button);
  }
  terminal.querySelector('[data-reset-terminal]').addEventListener('click', () => {
    cwd = model.start;
    history = [];
    render();
  });
  render();
}

for (const exercise of document.querySelectorAll('[data-select-practice]')) {
  const select = exercise.querySelector('select');
  const result = exercise.querySelector('[data-pick-result]');
  exercise.querySelector('[data-check-pick]').addEventListener('click', () => {
    result.textContent = select.value === '0' ? 'Correct. ' + result.dataset.explanation
      : select.value ? 'Try again. ' + result.dataset.explanation : 'Choose an answer first.';
  });
}

for (const exercise of document.querySelectorAll('[data-sequence]')) {
  const select = exercise.querySelector('select');
  const result = exercise.querySelector('[data-seq-result]');
  const log = exercise.querySelector('[data-seq-log]');
  const steps = [...exercise.querySelectorAll('details ol li')];
  const apply = exercise.querySelector('[data-seq-apply]');
  let index = 0;
  apply.addEventListener('click', () => {
    if (!select.value) {
      result.textContent = 'Select an action first.';
      return;
    }
    if (Number(select.value) !== index) {
      result.textContent = 'That action is out of order. Review the current evidence or use Study the procedure.';
      return;
    }
    const entry = document.createElement('li');
    entry.textContent = steps[index].textContent;
    log.append(entry);
    select.selectedOptions[0].disabled = true;
    select.value = '';
    index++;
    apply.disabled = index === steps.length;
    result.textContent = apply.disabled ? 'Procedure complete. Review your action log.' : 'Action recorded. Select the next step.';
  });
  exercise.querySelector('[data-seq-reset]').addEventListener('click', () => {
    index = 0;
    for (const option of select.options) option.disabled = false;
    select.value = '';
    apply.disabled = false;
    log.replaceChildren();
    result.textContent = 'Procedure reset.';
  });
}

