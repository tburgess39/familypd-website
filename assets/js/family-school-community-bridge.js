(() => {
  const form = document.getElementById('connector-form');
  const output = document.getElementById('connector-output');
  if (!form || !output) return;

  const typeSelect = document.getElementById('connection-type');
  const requestSelect = document.getElementById('request-type');
  const focusSelect = document.getElementById('communication-focus');
  const subjectSelect = document.getElementById('connection-subject');
  const detailBox = document.getElementById('connection-detail');
  const historyBox = document.getElementById('connection-history');
  const status = document.getElementById('connection-status');
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  const types = {
    school: {name:'school or district', contact:'teacher, counselor, family liaison, department chair, case manager, or administrator', verify:'Use the official school or district directory.'},
    government: {name:'public agency', contact:'caseworker, program specialist, front-desk staff member, or constituent-services contact', verify:'Use an official .gov website or verified public phone number.'},
    community: {name:'community organization', contact:'intake specialist, family navigator, program coordinator, or director', verify:'Confirm services, eligibility, cost, hours, and privacy practices.'},
    health: {name:'health or counseling provider', contact:'provider, nurse, care coordinator, intake specialist, billing specialist, or patient advocate', verify:'Use a verified provider number or secure patient channel.'},
    career: {name:'education or career contact', contact:'adviser, counselor, workforce navigator, program coordinator, employer representative, or mentor', verify:'Confirm requirements, deadlines, costs, and whether the opportunity is official.'},
    faith: {name:'faith, cultural, or neighborhood group', contact:'community leader, group coordinator, family-support contact, or trusted member', verify:'Ask about confidentiality, inclusion, safety, costs, and boundaries.'},
    person: {name:'trusted person', contact:'relative, friend, neighbor, co-parent, colleague, or mentor', verify:'Make a specific request and discuss boundaries rather than assuming availability.'}
  };

  const requests = {
    information: {label:'information or an explanation', close:'Could you please explain the next step or point me to the right person?'},
    meeting: {label:'a conversation or meeting', close:'Could we schedule a short phone call or meeting to talk through this?'},
    referral: {label:'a referral or introduction', close:'Could you connect me with the person or program that would be the best fit?'},
    application: {label:'help with a process, form, or application', close:'Could you explain what is still needed and where I should submit it?'},
    support: {label:'practical or ongoing support', close:'Could you let me know what support is available and how to get started?'},
    concern: {label:'help resolving a concern', close:'Could you help me understand the options for addressing this and the next step?' }
  };

  const focuses = {
    school: [
      {id:'grades', label:'Grades, missing assignments, credits, or end-of-term options', message:(s)=>`I'm reaching out regarding ${s}'s grades and missing assignments. I want to understand what is currently missing, what can still be completed, and what support may be available.`, call:(s)=>`Hi, I'm calling about ${s}'s grades and missing assignments. I want to make sure I understand what is missing and what options are still available.`, reflect:['Have I checked the grade portal and recent school messages?','Did I contact the teacher when the concern first appeared, or am I reaching out near the end of the term?','Has my child asked questions, attended help sessions, or completed the work that was available?','What weekly routine can help us notice concerns earlier next grading period?'], advocate:'Advocate when information is unclear, records appear incorrect, promised supports are missing, a student is being treated unfairly, or a barrier is preventing access. Ask for the current facts, the written policy, realistic options, and a follow-up date.'},
      {id:'attendance', label:'Attendance, tardiness, or missed instructional time', message:(s)=>`I'm reaching out regarding ${s}'s attendance. I want to make sure I understand the attendance record, any work that needs to be made up, and whether support is available for the barrier affecting attendance.`, call:(s)=>`Hi, I'm calling about ${s}'s attendance. I would like to review the record and understand what we should do next.`, reflect:['Have I reviewed the attendance record and notices?','Have I informed the school promptly about absences or barriers?','Are transportation, sleep, health, or family routines contributing to the pattern?','What support should I request from the school?'], advocate:'Advocate when the attendance record is inaccurate, a health or disability need is not being addressed, transportation or safety is affecting access, or the family needs a support plan.'},
      {id:'support-plan', label:'IEP, 504, counseling, behavior, or student support', message:(s)=>`I'm reaching out regarding support for ${s}. I have noticed a pattern that may be affecting learning or well-being, and I would like to understand the current supports, who should be involved, and whether a meeting or evaluation should be considered.`, call:(s)=>`Hi, I'm calling because I have concerns about the support ${s} may need. I would like to understand the current plan and who I should speak with.`, reflect:['Can I describe specific examples, dates, and patterns instead of using only labels?','Have I reviewed the current plan and prior notices?','Have I attended meetings and shared information the team needs?','What outcome or support am I requesting?'], advocate:'Advocate when agreed supports are not being provided, concerns are repeatedly dismissed, the plan is unclear, or the student is not receiving meaningful access.'},
      {id:'pathway', label:'Graduation, CTE, college, career, or course planning', message:(s)=>`I'm reaching out about ${s}'s graduation and future planning. I would like to understand current credits, remaining requirements, deadlines, and the available course, CTE, college, or career options.`, call:(s)=>`Hi, I'm calling about ${s}'s graduation and course planning. I want to make sure we understand the credits, deadlines, and available pathways.`, reflect:['Have I reviewed the transcript, graduation plan, and course catalog?','Are we asking early enough to preserve more options?','Have we discussed the student’s interests and goals?','What deadlines should be placed on our family calendar?'], advocate:'Advocate when the student cannot access needed courses, information is inconsistent, credits appear incorrect, or a pathway decision was made without clear explanation.'},
      {id:'communication', label:'Communication, discipline, safety, access, or fairness concern', message:(s)=>`I'm reaching out about a concern involving ${s}. I would like to understand what happened, review the relevant information or policy, and discuss a fair next step.`, call:(s)=>`Hi, I'm calling about a concern involving ${s}. I would like to understand what happened and discuss the next step.`, reflect:['Am I separating verified facts from assumptions?','Have I read the full message, notice, or policy?','Could my timing, tone, missed messages, or delayed response have affected the situation?','What specific outcome am I asking for?'], advocate:'Advocate when safety is involved, due process is unclear, decisions appear inconsistent, communication is disrespectful, or the student may be experiencing discrimination or denied access.'}
    ],
    government: [
      {id:'benefits', label:'Benefits, eligibility, case status, or required documents', message:(s)=>`I'm reaching out about ${s}'s benefits or case. I would like to understand the current status, whether anything is missing, and what the next step is.`, call:(s)=>`Hi, I'm calling about ${s}'s benefits or case status. I want to check whether anything is missing and what happens next.`, reflect:['Have I read the full notice and deadline?','Am I using the official contact information?','Do I have the documents the agency requested?'], advocate:'Ask for the written reason for a delay or denial, the review or appeal process, and the deadline.'},
      {id:'service', label:'Public service, permit, record, fee, or local issue', message:(s)=>`I'm reaching out about a public service or local issue affecting ${s}. I would like to know which office handles it and what process I should follow.`, call:(s)=>`Hi, I'm calling about a public service or local issue. Could you help me find the correct office and next step?`, reflect:['Am I contacting the office with authority over the issue?','Have I checked the official instructions first?'], advocate:'Escalate when the official process has been followed and the issue remains unresolved or time-sensitive.'}
    ],
    community: [
      {id:'basic-needs', label:'Food, housing, utilities, transportation, childcare, or basic needs', message:(s)=>`I'm reaching out because ${s} needs help with a basic need. I would like to know what assistance is available, the requirements, and how to apply or make an appointment.`, call:(s)=>`Hi, I'm calling to ask about help with a basic need for ${s}. Could you explain what is available and the requirements?`, reflect:['Have I confirmed the hours and requirements before traveling?','What is the most immediate need or deadline?','What backup resource can I contact if this program is full?'], advocate:'Ask for another referral when a program cannot help, and request plain-language explanations of eligibility.'},
      {id:'family-support', label:'Parenting, caregiving, mentoring, youth, or family support', message:(s)=>`I'm reaching out because ${s} could use family or caregiving support. I would like to learn what programs, groups, mentoring, or referrals are available and how to get started.`, call:(s)=>`Hi, I'm calling to ask about family or caregiving support for ${s}. Could you explain the available programs and next steps?`, reflect:['What kind of support would actually reduce strain?','Are there schedule, transportation, age, or cost barriers?','Am I willing to accept help before the situation becomes a crisis?'], advocate:'Ask about waitlists, alternatives, transportation, language access, and referrals.'},
      {id:'partnership', label:'Volunteer opportunity, donation, partnership, or collaboration', message:()=>`I'm reaching out because I would like to learn about ways to volunteer, contribute, or partner with your organization. I would appreciate information about your current needs and the best person to speak with.`, call:()=>`Hi, I'm calling to ask about volunteer or partnership opportunities and your current needs.`, reflect:['Does the proposed help match what the organization actually needs?','Can I start with a small, realistic commitment?'], advocate:'Clarify expectations, decision-making authority, and the next small step.'}
    ],
    health: [
      {id:'care', label:'Appointment, referral, test, medication, or care coordination', message:(s)=>`I'm reaching out about care for ${s}. I would like to understand the appointment or referral status, what needs to happen next, and whether there are any instructions I should follow.`, call:(s)=>`Hi, I'm calling about care for ${s}. I want to check the appointment or referral status and understand the next step.`, reflect:['Is this urgent or an emergency that needs immediate care?','Am I using a secure, verified health channel?','Do I have the dates, medication list, or referral information available?'], advocate:'Ask for a patient advocate, care coordinator, supervisor, or written explanation when access or communication remains unclear.'},
      {id:'billing', label:'Insurance, billing, cost, language, disability, or access barrier', message:(s)=>`I'm reaching out about a billing or access concern for ${s}. I would like a clear explanation of the charge or requirement and information about payment, insurance, language, disability, or other support options.`, call:(s)=>`Hi, I'm calling about a billing or access concern. Could someone explain the charge or requirement and the available options?`, reflect:['Have I reviewed the bill or explanation of benefits?','Am I keeping notes of names, dates, and reference numbers?'], advocate:'Ask for an itemized bill, interpreter, accommodation, payment option, appeal, or patient advocate as appropriate.'}
    ],
    career: [
      {id:'program', label:'Program, training, admission, credential, or financial aid', message:(s)=>`I'm reaching out about a program or training opportunity for ${s}. I would like to understand the requirements, cost, schedule, deadline, and what credential or outcome the program leads to.`, call:(s)=>`Hi, I'm calling about a program or training opportunity. Could you explain the requirements, cost, deadline, and outcome?`, reflect:['Have I reviewed the official program page?','Does the program lead to a recognized credential, transfer option, advancement, or job opportunity?','What support is available for cost, transportation, childcare, or technology?'], advocate:'Ask for written requirements, total costs, refund rules, completion outcomes, and support services.'},
      {id:'employment', label:'Job, interview, workplace concern, advancement, or mentoring', message:(s)=>`I'm reaching out about an employment or mentoring opportunity for ${s}. I would appreciate information about the next step, the qualifications needed, and who would be the best person to speak with.`, call:(s)=>`Hi, I'm calling about an employment or mentoring opportunity. Could you explain the next step and who I should speak with?`, reflect:['Is the resume or application complete and accurate?','Did I follow the stated instructions and deadlines?','Have I followed up professionally without overwhelming the contact?'], advocate:'Advocate when an accommodation, fair review, promised response, or clear process is needed.'}
    ],
    faith: [
      {id:'belonging', label:'Belonging, spiritual care, family support, event, or community involvement', message:(s)=>`I'm reaching out because ${s} is looking for community, spiritual care, or family support. I would like to learn about available groups, events, services, and how to participate.`, call:(s)=>`Hi, I'm calling to learn about community, spiritual care, or family-support opportunities.`, reflect:['What kind of connection or support are we seeking?','Have I asked about confidentiality, inclusion, child safety, costs, and expectations?'], advocate:'Set clear boundaries and ask for another contact when the group is not a safe or appropriate fit.'}
    ],
    person: [
      {id:'practical', label:'Childcare, transportation, meals, errands, check-ins, or practical help', message:(s)=>`I'm reaching out because ${s} could use some practical help. Would you be able to help, or let me know if you know someone who might be available? It is completely okay if you cannot.`, call:(s)=>`Hi, I'm calling because ${s} could use some practical help. I wanted to ask whether you may be available or know someone who is.`, reflect:['Is the request specific and limited?','Have I made it safe for the person to say no?','Have we discussed timing, transportation, cost, and boundaries?'], advocate:'Be clear about the request and avoid relying on one person as the only backup.'},
      {id:'relationship', label:'Conversation, conflict repair, boundary, encouragement, or emotional support', message:(s)=>`I'm reaching out because I would like to talk about something affecting ${s}. I want us to understand each other better and work toward a respectful next step.`, call:(s)=>`Hi, I wanted to talk about something affecting ${s}. I hope we can understand each other better and agree on a respectful next step.`, reflect:['Can I describe what I noticed without insults or mind-reading?','Is there anything I could apologize for or do differently?','What boundary or repair am I asking for?'], advocate:'End or pause the conversation if it becomes threatening, abusive, or unsafe.'}
    ]
  };

  function selectedFocus(){ return (focuses[typeSelect.value] || []).find(item => item.id === focusSelect.value); }
  function sentence(text){ const t=(text||'').trim(); return t ? (/[.!?]$/.test(t) ? t : `${t}.`) : ''; }

  function updateFocusOptions(){
    const list = focuses[typeSelect.value] || [];
    focusSelect.disabled = !typeSelect.value;
    focusSelect.innerHTML = typeSelect.value
      ? '<option value="">Choose the specific topic</option>' + list.map(item => `<option value="${esc(item.id)}">${esc(item.label)}</option>`).join('')
      : '<option value="">Choose who you are contacting first</option>';
  }
  typeSelect.addEventListener('change', updateFocusOptions);

  let currentMessage='';
  let printablePlan='';

  form.addEventListener('submit', event => {
    event.preventDefault();
    const type=types[typeSelect.value];
    const request=requests[requestSelect.value];
    const focus=selectedFocus();
    const subject=subjectSelect.value;
    const detail=sentence(detailBox.value);
    const history=sentence(historyBox.value);
    if(!type || !request || !focus){
      output.innerHTML='<p><strong>Please choose who you are contacting, the kind of help needed, and the specific topic.</strong></p>';
      return;
    }

    const base=focus.message(subject);
    const close=request.close;
    currentMessage=`Hello,\n\n${base}${detail ? ` ${detail}` : ''}${history ? ` So far, ${history.charAt(0).toLowerCase()+history.slice(1)}` : ''}\n\n${close}\n\nThank you.`;
    const phone=`${focus.call(subject)}${detail ? ` ${detail}` : ''} ${close}`;
    const meeting=`Thank you for meeting with me. I would like to talk about ${focus.label.toLowerCase()} involving ${subject}. My goal is to understand the current facts, what each person can do next, and when we should follow up.`;

    const reflection=focus.reflect.map(x=>`<li>${esc(x)}</li>`).join('');
    output.innerHTML=`
      <section><h3>Ready-to-copy email or message</h3><textarea class="message-box" id="generated-connection-message">${esc(currentMessage)}</textarea></section>
      <section><h3>Phone-call opening</h3><p class="copy-block">${esc(phone)}</p></section>
      <section><h3>In-person or virtual meeting opening</h3><p class="copy-block">${esc(meeting)}</p></section>
      <section><h3>Before reaching out: honest reflection</h3><p>This is not about blaming the family or excusing poor service. It helps identify what can be strengthened while still expecting the school, agency, organization, or other person to do their part.</p><ul>${reflection}</ul></section>
      <section><h3>When to advocate</h3><p>${esc(focus.advocate)}</p></section>
      <section><h3>Who may be useful to contact</h3><p>Look for a ${esc(type.contact)}.</p><p><strong>Protect your information:</strong> ${esc(type.verify)}</p></section>
      <section><h3>Follow-up</h3><ol><li>Write down the name and role of the person contacted.</li><li>Confirm the next action, who owns it, and the date it should happen.</li><li>Send a short follow-up after a call or meeting so everyone has the same understanding.</li></ol></section>`;

    document.getElementById('generated-connection-message').addEventListener('input', e=>currentMessage=e.target.value);
    printablePlan={title:'FamilyPD Community Connection Plan',type:type.name,topic:focus.label,message:currentMessage,phone,meeting,reflection:focus.reflect,advocate:focus.advocate,contact:type.contact,verify:type.verify};
    status.textContent='Communication options created.';
  });

  document.getElementById('copy-connection').addEventListener('click', async()=>{
    if(!currentMessage){ status.textContent='Create a message first.'; return; }
    try{ await navigator.clipboard.writeText(currentMessage); status.textContent='Email/message copied.'; }
    catch{ status.textContent='Select and copy the message manually.'; }
  });

  document.getElementById('print-connection').addEventListener('click', ()=>{
    if(!printablePlan){ status.textContent='Create an outreach plan first.'; return; }
    printablePlan.message=currentMessage;
    const existing=document.getElementById('connector-print-document');
    if(existing) existing.remove();
    const lis=printablePlan.reflection.map(x=>`<li>${esc(x)}</li>`).join('');
    const doc=document.createElement('section');
    doc.id='connector-print-document';
    doc.className='connector-print-document';
    doc.setAttribute('aria-hidden','true');
    doc.innerHTML=`<div class="connector-print-sheet"><div class="connector-print-brand">Family Personal Development</div><h1 class="connector-print-title">Outreach Communication Plan</h1><p class="connector-print-sub">Natural language and preparation guidance for reaching a person or organization.</p><div class="connector-print-meta"><div><strong>Contact type</strong><br>${esc(printablePlan.type)}</div><div><strong>Topic</strong><br>${esc(printablePlan.topic)}</div></div><div class="connector-print-section"><h2>Copy-and-send message</h2><div class="connector-print-message">${esc(printablePlan.message)}</div></div><div class="connector-print-section"><h2>Phone-call opening</h2><div class="connector-print-message">${esc(printablePlan.phone)}</div></div><div class="connector-print-section"><h2>Meeting opening</h2><div class="connector-print-message">${esc(printablePlan.meeting)}</div></div><div class="connector-print-section"><h2>Before reaching out</h2><ul>${lis}</ul></div><div class="connector-print-section"><h2>When to advocate</h2><div class="connector-print-callout">${esc(printablePlan.advocate)}</div></div><div class="connector-print-section"><h2>Possible contact</h2><p>${esc(printablePlan.contact)}</p><p><strong>Protect your information:</strong> ${esc(printablePlan.verify)}</p></div><p class="connector-print-footer">FamilyPD provides general educational guidance. Confirm official procedures and contact information before sharing private information.</p></div>`;
    document.body.appendChild(doc);
    document.body.classList.add('connector-printing');
    const cleanup=()=>{document.body.classList.remove('connector-printing');doc.remove();window.removeEventListener('afterprint',cleanup);};
    window.addEventListener('afterprint',cleanup);
    status.textContent='Opening the print dialog…';
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.print()));
    setTimeout(()=>{ if(document.body.classList.contains('connector-printing')) cleanup(); },30000);
  });
})();
