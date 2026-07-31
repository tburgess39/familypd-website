(() => {
  const count = document.getElementById('member-count');
  const membersEl = document.getElementById('member-fields');
  const rowsEl = document.getElementById('responsibility-rows');
  const out = document.getElementById('workload-results');
  if (!count || !membersEl || !rowsEl || !out) return;

  const categories = ['Cleaning','Meals','Laundry','Errands','Transportation','Finances','School','Caregiving','Health','Maintenance','Planning','Emotional support','Safety','Other'];
  const frequencies = {Occasional:1, Monthly:2, Weekly:4, 'Several times/week':8, Daily:14};
  const presets = {
    common: [['Kitchen cleanup','Cleaning'],['Meal planning and preparation','Meals'],['Laundry','Laundry'],['Shopping and errands','Errands'],['Transportation','Transportation'],['Bills and budgeting','Finances'],['School communication','School'],['Appointments and caregiving','Caregiving']],
    invisible: [['Remembering deadlines','Planning'],['Scheduling appointments','Planning'],['Monitoring household supplies','Planning'],['Planning celebrations and family events','Planning'],['Checking on everyone emotionally','Emotional support'],['Anticipating emergencies and backup plans','Safety']]
  };

  const names = () => [...membersEl.querySelectorAll('.member-name')].map((el, i) => el.value.trim() || `Member ${i + 1}`);
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const ownerOptions = () => names().map((name, i) => `<option value="${i}">${escapeHtml(name)}</option>`).join('');

  function renderMembers() {
    const old = [...membersEl.querySelectorAll('.member-name')].map(el => el.value);
    membersEl.innerHTML = '';
    for (let i = 0; i < Number(count.value); i += 1) {
      const div = document.createElement('div');
      div.className = 'member-card compact-member-card';
      div.innerHTML = `<label>Member ${i + 1}<input class="member-name" value="${escapeHtml(old[i] || `Member ${i + 1}`)}" aria-label="Name or nickname for member ${i + 1}"></label>`;
      membersEl.append(div);
    }
    refreshOwnerOptions();
  }

  function addRow(task = '', category = 'Other') {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input class="task-name" value="${escapeHtml(task)}" placeholder="Responsibility"></td>
      <td><select class="task-category">${categories.map(c => `<option ${c === category ? 'selected' : ''}>${c}</option>`).join('')}</select></td>
      <td><select class="task-owner"><option value="">Unassigned</option>${ownerOptions()}</select></td>
      <td><select class="task-frequency">${Object.keys(frequencies).map(f => `<option>${f}</option>`).join('')}</select></td>
      <td><select class="task-effort"><option value="1">1 — light</option><option value="2">2</option><option value="3" selected>3 — moderate</option><option value="4">4</option><option value="5">5 — heavy</option></select></td>
      <td><select class="task-mental"><option value="1">1 — little</option><option value="2">2</option><option value="3" selected>3 — moderate</option><option value="4">4</option><option value="5">5 — high</option></select></td>
      <td><button type="button" class="remove-task" aria-label="Remove responsibility">Remove</button></td>`;
    rowsEl.append(tr);
    tr.querySelector('.remove-task').addEventListener('click', () => tr.remove());
  }

  function refreshOwnerOptions() {
    [...rowsEl.querySelectorAll('tr')].forEach(tr => {
      const owner = tr.querySelector('.task-owner');
      const current = owner.value;
      owner.innerHTML = `<option value="">Unassigned</option>${ownerOptions()}`;
      owner.value = current;
    });
  }

  count.addEventListener('change', renderMembers);
  membersEl.addEventListener('input', refreshOwnerOptions);
  document.getElementById('add-responsibility').addEventListener('click', () => addRow());
  document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => presets[button.dataset.preset].forEach(item => addRow(...item))));

  document.getElementById('calculate-workload').addEventListener('click', () => {
    const memberNames = names();
    const totals = memberNames.map(() => 0);
    const categoriesByPerson = memberNames.map(() => new Set());
    const taskCounts = memberNames.map(() => 0);
    let totalPoints = 0;
    let unassignedPoints = 0;
    let listedTasks = 0;

    [...rowsEl.querySelectorAll('tr')].forEach(tr => {
      const taskName = tr.querySelector('.task-name').value.trim();
      if (!taskName) return;
      listedTasks += 1;
      const owner = tr.querySelector('.task-owner').value;
      const frequency = frequencies[tr.querySelector('.task-frequency').value];
      const effort = Number(tr.querySelector('.task-effort').value);
      const mental = Number(tr.querySelector('.task-mental').value);
      const category = tr.querySelector('.task-category').value;
      const points = frequency * ((effort + mental) / 2);
      totalPoints += points;
      if (owner === '') {
        unassignedPoints += points;
      } else {
        const index = Number(owner);
        totals[index] += points;
        taskCounts[index] += 1;
        categoriesByPerson[index].add(category);
      }
    });

    if (!listedTasks) {
      out.innerHTML = '<h2>Workload summary</h2><p>Add at least one named responsibility first.</p>';
      return;
    }

    const shares = totals.map(value => totalPoints ? (value / totalPoints) * 100 : 0);
    const maxShare = Math.max(...shares);
    const assignedShares = shares.filter(value => value > 0);
    const minAssigned = assignedShares.length ? Math.min(...assignedShares) : 0;
    const maxIndex = shares.indexOf(maxShare);
    const overload = maxShare >= 45 && (maxShare - minAssigned >= 20 || memberNames.length === 2 && maxShare >= 65);
    const unassignedShare = totalPoints ? (unassignedPoints / totalPoints) * 100 : 0;

    out.innerHTML = `<h2>Workload summary</h2>
      <p class="calculator-summary-note">The estimate combines how often a responsibility occurs, its effort, and its mental load.</p>
      <div class="workload-bars">${memberNames.map((name, i) => `<article><div><strong>${escapeHtml(name)}</strong><span>${shares[i].toFixed(0)}%</span></div><div class="bar-track"><i style="width:${Math.min(100, shares[i])}%"></i></div><small>${taskCounts[i]} owned responsibilities across ${categoriesByPerson[i].size} categories</small></article>`).join('')}</div>
      ${overload ? `<div class="overload-alert"><strong>${escapeHtml(memberNames[maxIndex])} may be carrying a much larger share of the listed work.</strong><p>This is a signal for conversation, not proof of wrongdoing. Consider capacity, health, work or school demands, invisible planning, and whether some responsibilities can be shared or supported.</p></div>` : '<div class="balanced-note"><strong>No strong overload pattern appeared in the listed work.</strong><p>It can still be helpful to discuss whether the list includes hidden planning, emotional labor, and responsibilities that happen outside the home.</p></div>'}
      ${unassignedPoints ? `<p><strong>Unassigned work:</strong> About ${unassignedShare.toFixed(0)}% of the listed workload has no owner.</p>` : ''}
      <div class="suggestion-grid">
        <article><h3>Share or rotate work</h3><ul><li>Separate planning from doing—for example, one person plans meals while another shops or cooks.</li><li>Rotate recurring work or alternate weeks.</li><li>Choose backup owners for essential responsibilities.</li><li>Simplify, batch, automate, or pause lower-priority tasks.</li></ul></article>
        <article><h3>Include children safely</h3><ul><li>Children may put away personal items, sort laundry, wipe safe surfaces, refill water, organize school materials, or prepare simple snacks with supervision.</li><li>Match work to maturity, ability, and safety.</li><li>Adults remain responsible for hazardous chemicals, dangerous tools, driving, heavy lifting, and age-inappropriate caregiving.</li></ul></article>
        <article><h3>Use community support</h3><ul><li>Consider relatives, trusted friends, neighbors, schools, faith communities, libraries, parent groups, nonprofits, and local services.</li><li>Possible support includes carpools, meal help, tutoring, childcare swaps, transportation, respite, mentoring, or help navigating systems.</li><li>Single parents and isolated caregivers may benefit from identifying dependable support before a crisis.</li></ul><a class="button button-secondary" href="/programs/bridge-center/">Find connection ideas</a></article>
      </div>`;
    out.scrollIntoView({behavior:'smooth', block:'start'});
  });

  renderMembers();
  presets.common.slice(0, 4).forEach(item => addRow(...item));
})();
