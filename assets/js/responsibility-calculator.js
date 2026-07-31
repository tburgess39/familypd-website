
(() => {
const count=document.getElementById('member-count'), membersEl=document.getElementById('member-fields'), rowsEl=document.getElementById('responsibility-rows'), out=document.getElementById('workload-results');
if(!count||!membersEl||!rowsEl||!out)return;
let rowId=0;
const categories=['Cleaning','Meals','Laundry','Errands','Transportation','Finances','School','Caregiving','Health','Maintenance','Planning','Emotional support','Safety','Other'];
const frequencies={Occasional:1,Monthly:2,Weekly:4,'Several times/week':8,Daily:14};
const presets={
 common:[['Kitchen cleanup','Cleaning'],['Meal planning and preparation','Meals'],['Laundry','Laundry'],['Shopping and errands','Errands'],['Transportation','Transportation'],['Bills and budgeting','Finances'],['School communication','School'],['Appointments and caregiving','Caregiving']],
 invisible:[['Remembering deadlines','Planning'],['Scheduling appointments','Planning'],['Monitoring supplies','Planning'],['Planning celebrations and family events','Planning'],['Checking on everyone emotionally','Emotional support'],['Anticipating emergencies and backup plans','Safety']]
};
function names(){return [...membersEl.querySelectorAll('.member-name')].map((el,i)=>el.value.trim()||`Member ${i+1}`)}
function renderMembers(){
 const old=[...membersEl.querySelectorAll('.member-name')].map(e=>e.value);
 membersEl.innerHTML='';
 for(let i=0;i<Number(count.value);i++){
  const div=document.createElement('div');div.className='member-card';
  div.innerHTML=`<label>Name or nickname<input class="member-name" value="${old[i]||`Member ${i+1}`}"></label><label>Age group<select class="member-age"><option>Adult</option><option>Teen</option><option>Child</option><option>Older adult</option></select></label><label>Availability or limits<input class="member-limits" placeholder="Work schedule, disability, health, school, caregiving…"></label>`;
  membersEl.append(div)
 }
 refreshOwnerOptions();
}
function optionList(multiple=false){return names().map((n,i)=>`<option value="${i}">${n}</option>`).join('')}
function addRow(task='',category='Other'){
 rowId++;const tr=document.createElement('tr');tr.dataset.rowId=rowId;
 tr.innerHTML=`<td><input class="task-name" value="${task}" placeholder="Responsibility"></td><td><select class="task-category">${categories.map(c=>`<option ${c===category?'selected':''}>${c}</option>`).join('')}</select></td><td><select class="task-owner"><option value="">Unassigned</option>${optionList()}</select></td><td><select class="task-helpers" multiple size="2">${optionList(true)}</select></td><td><select class="task-frequency">${Object.keys(frequencies).map(f=>`<option>${f}</option>`).join('')}</select></td><td><select class="task-effort"><option value="1">1 — light</option><option value="2">2</option><option value="3" selected>3 — moderate</option><option value="4">4</option><option value="5">5 — heavy</option></select></td><td><select class="task-mental"><option value="1">1 — little</option><option value="2">2</option><option value="3" selected>3 — moderate</option><option value="4">4</option><option value="5">5 — high</option></select></td><td><button type="button" class="remove-task" aria-label="Remove responsibility">Remove</button></td>`;
 rowsEl.append(tr);tr.querySelector('.remove-task').onclick=()=>tr.remove();
}
function refreshOwnerOptions(){
 [...rowsEl.querySelectorAll('tr')].forEach(tr=>{
  const owner=tr.querySelector('.task-owner'),helpers=tr.querySelector('.task-helpers');const ov=owner.value,hv=[...helpers.selectedOptions].map(o=>o.value);
  owner.innerHTML=`<option value="">Unassigned</option>${optionList()}`;owner.value=ov;
  helpers.innerHTML=optionList(true);[...helpers.options].forEach(o=>o.selected=hv.includes(o.value));
 })
}
count.onchange=renderMembers;membersEl.addEventListener('input',refreshOwnerOptions);
document.getElementById('add-responsibility').onclick=()=>addRow();
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>presets[b.dataset.preset].forEach(x=>addRow(...x)));
document.getElementById('calculate-workload').onclick=()=>{
 const ns=names(), totals=ns.map(()=>0), categoriesBy=ns.map(()=>new Set()), backup=ns.map(()=>0);let total=0,unassigned=0;
 [...rowsEl.querySelectorAll('tr')].forEach(tr=>{
  const owner=tr.querySelector('.task-owner').value, freq=frequencies[tr.querySelector('.task-frequency').value], effort=Number(tr.querySelector('.task-effort').value), mental=Number(tr.querySelector('.task-mental').value), cat=tr.querySelector('.task-category').value;
  const points=freq*(effort+mental)/2; total+=points;
  if(owner===''){unassigned+=points}else{totals[Number(owner)]+=points;categoriesBy[Number(owner)].add(cat)}
  [...tr.querySelector('.task-helpers').selectedOptions].forEach(o=>backup[Number(o.value)]++)
 });
 if(!rowsEl.children.length){out.innerHTML='<h2>Workload summary</h2><p>Add at least one responsibility first.</p>';return}
 const shares=totals.map(v=>total?v/total*100:0), max=Math.max(...shares), min=Math.min(...shares), maxI=shares.indexOf(max);
 const overload=max>=45&&max-min>=20;
 out.innerHTML=`<h2>Workload summary</h2><div class="workload-bars">${ns.map((n,i)=>`<article><div><strong>${n}</strong><span>${shares[i].toFixed(0)}%</span></div><div class="bar-track"><i style="width:${Math.min(100,shares[i])}%"></i></div><small>${categoriesBy[i].size} categories · helper on ${backup[i]} responsibilities</small></article>`).join('')}</div>
 ${overload?`<div class="overload-alert"><strong>${ns[maxI]} may be carrying a disproportionate share.</strong><p>This does not prove unfairness, but it is worth discussing time, health, capacity, invisible work, and whether support can be shared.</p></div>`:''}
 ${unassigned?`<p><strong>Unassigned work:</strong> About ${(unassigned/total*100).toFixed(0)}% of listed work has no primary owner.</p>`:''}
 <div class="suggestion-grid"><article><h3>Ways adults can share</h3><ul><li>Divide planning from execution—for example, one person plans meals while another shops or cooks.</li><li>Rotate recurring chores or assign alternating weeks.</li><li>Create backup owners for essential tasks.</li><li>Simplify, automate, batch, or postpone lower-priority work.</li></ul></article>
 <article><h3>Ways children can contribute safely</h3><ul><li>Put away personal items, sort laundry, wipe safe surfaces, refill water, or prepare simple snacks with supervision.</li><li>Help track supplies, calendars, or school materials.</li><li>Choose tasks based on maturity, ability, and safety—not pressure to replace adult caregiving.</li><li>Adults should handle hazardous chemicals, heavy lifting, dangerous tools, driving, and age-inappropriate supervision.</li></ul></article>
 <article><h3>Ways community can help</h3><ul><li>Ask relatives or trusted friends for scheduled—not only emergency—support.</li><li>Use school, library, faith, neighborhood, parent, workforce, and nonprofit programs.</li><li>Consider meal trains, carpools, childcare swaps, tutoring, transportation, respite, or support groups.</li><li>Single parents and isolated caregivers especially benefit from a written backup network.</li></ul></article></div>`;
 out.scrollIntoView({behavior:'smooth',block:'start'})
}
renderMembers();presets.common.slice(0,4).forEach(x=>addRow(...x));
})();
