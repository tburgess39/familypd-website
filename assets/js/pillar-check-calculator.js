
(() => {
const groups = [
 {key:'health',title:'Health',questions:[
  'Family members drink water regularly during the day.',
  'The household can usually access balanced meals or nutritious food options.',
  'Sleep routines provide enough rest for school, work, caregiving, and emotional regulation.',
  'Medical, dental, mental-health, and medication needs are addressed rather than repeatedly postponed.',
  'Family members generally feel physically and emotionally safe at home.'
 ]},
 {key:'relationships',title:'Relationships',questions:[
  'People can disagree without insults, threats, ridicule, or fear.',
  'Family members listen and allow others to finish speaking.',
  'Apologies, repair, and changed behavior follow hurtful interactions.',
  'Family members have regular moments of connection, encouragement, or quality time.',
  'People can ask for help, set limits, and express feelings without being punished.'
 ]},
 {key:'education',title:'Education & Skills',questions:[
  'School attendance, assignments, grades, or adult learning progress are reviewed regularly.',
  'Learners know where to ask for help when they are confused.',
  'The family understands important school deadlines, credits, graduation, or career requirements.',
  'Children and adults have opportunities to build useful skills, credentials, or career awareness.',
  'Learning mistakes are treated as information and opportunities to improve.'
 ]},
 {key:'finances',title:'Finances',questions:[
  'Essential bills, food, transportation, medicine, and housing are usually covered without crisis borrowing.',
  'The household knows what income is coming in and what essential expenses are due.',
  'There is at least a small plan for emergencies or unexpected expenses.',
  'Money conversations can happen without secrecy, threats, or constant conflict.',
  'The family knows where to seek benefits, financial counseling, workforce help, or community resources if needed.'
 ]},
 {key:'goals',title:'Goals',questions:[
  'The family can name one or two current priorities.',
  'Goals are broken into small actions with realistic time frames.',
  'Someone reviews progress and obstacles instead of waiting until a deadline or crisis.',
  'Responsibilities and support for goals are clear.',
  'The family notices and celebrates progress, not only final outcomes.'
 ]}
];
const root = document.getElementById('pillar-question-groups');
const form = document.getElementById('pillar-calculator');
const results = document.getElementById('pillar-calculator-results');
if(!root||!form||!results)return;
const labels=['Not true right now','Rarely true','Sometimes true','Usually true'];
root.innerHTML = groups.map(g=>`<fieldset class="pillar-question-card"><legend>${g.title}</legend><p>Rate each statement based on the past few weeks.</p>${g.questions.map((q,i)=>`<div class="rating-question"><span>${q}</span><div class="rating-options">${labels.map((l,n)=>`<label><input type="radio" name="${g.key}-${i}" value="${n+1}"><span>${n+1}<small>${l}</small></span></label>`).join('')}</div></div>`).join('')}</fieldset>`).join('');

form.addEventListener('submit',e=>{
 e.preventDefault();
 const summaries=[];
 groups.forEach(g=>{
   const vals=g.questions.map((_,i)=>form.querySelector(`input[name="${g.key}-${i}"]:checked`)).filter(Boolean).map(el=>Number(el.value));
   if(!vals.length)return;
   const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
   let status,desc;
   if(avg<1.75){status='May need immediate attention';desc='Several basic experiences are not currently steady. Consider safety, urgent needs, and qualified support first.'}
   else if(avg<2.5){status='Needs support';desc='Some important routines or conditions are inconsistent and may be adding stress.'}
   else if(avg<3.25){status='Mixed or developing';desc='There are strengths to build on and a few patterns worth discussing.'}
   else {status='Currently supportive';desc='This pillar appears to contain several steady habits or supports. Continue reviewing it as circumstances change.'}
   summaries.push({g,avg,status,desc});
 });
 if(!summaries.length){results.innerHTML='<h2>Your check-in summary</h2><p>Please answer at least one question.</p>';return;}
 const sorted=[...summaries].sort((a,b)=>a.avg-b.avg);
 const lowest=sorted[0];
 const strengths=summaries.filter(s=>s.avg>=3.25);
 results.innerHTML=`<h2>Your check-in summary</h2>
 <div class="pillar-score-grid">${summaries.map(s=>`<article><strong>${s.g.title}</strong><span>${s.avg.toFixed(1)} / 4</span><h3>${s.status}</h3><p>${s.desc}</p></article>`).join('')}</div>
 <div class="reflection-summary"><h3>A possible starting point: ${lowest.g.title}</h3><p>${lowest.desc} Consider choosing one question in this pillar that received the lowest rating and discussing what would make it one step more manageable.</p>
 ${strengths.length?`<p><strong>Current strengths:</strong> ${strengths.map(s=>s.g.title).join(', ')}. These areas may provide support while the family works on other needs.</p>`:''}
 <label>What is going well?<textarea rows="3" placeholder="Name routines, people, resources, or behaviors that are helping."></textarea></label>
 <label>What is getting in the way?<textarea rows="3" placeholder="Consider time, cost, health, conflict, information, transportation, workload, or missing support."></textarea></label>
 <label>What feels like a realistic next step?<textarea rows="3" placeholder="Choose one small action or one person/resource to contact."></textarea></label></div>`;
 results.scrollIntoView({behavior:'smooth',block:'start'});
});
})();
