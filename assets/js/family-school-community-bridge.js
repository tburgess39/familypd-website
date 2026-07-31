(() => {
  const form = document.getElementById('connector-form');
  const output = document.getElementById('connector-output');
  if (!form || !output) return;

  const typeSelect = document.getElementById('connection-type');
  const requestSelect = document.getElementById('request-type');
  const focusSelect = document.getElementById('communication-focus');
  const topicBox = document.getElementById('connection-topic');
  const historyBox = document.getElementById('connection-history');
  const methodSelect = document.getElementById('connection-method');
  const guidance = document.getElementById('topic-guidance');
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  const types = {
    school: {name:'school or district', contact:'teacher, counselor, family liaison, case manager, department chair, or administrator', verify:'Use the official school or district directory.'},
    government: {name:'public agency', contact:'front-desk specialist, caseworker, program coordinator, or constituent-services contact', verify:'Use an official .gov website or verified public phone number.'},
    community: {name:'community organization', contact:'intake specialist, program coordinator, family navigator, volunteer coordinator, or director', verify:'Confirm services, fees, eligibility rules, and privacy practices.'},
    health: {name:'health or counseling provider', contact:'licensed provider, nurse, care coordinator, intake specialist, or patient advocate', verify:'Confirm credentials, cost, insurance, privacy limits, and urgent-care instructions.'},
    career: {name:'education or career contact', contact:'admissions adviser, workforce navigator, CTE counselor, program coordinator, employer representative, or mentor', verify:'Confirm requirements, deadlines, costs, and whether the opportunity is official.'},
    faith: {name:'faith, cultural, or neighborhood group', contact:'community leader, family ministry contact, group coordinator, or trusted member', verify:'Ask how the group protects privacy, safety, inclusion, and boundaries.'},
    person: {name:'trusted person', contact:'relative, friend, neighbor, co-parent, colleague, or mentor', verify:'Start with one specific request and agree on boundaries rather than assuming ongoing availability.'}
  };

  const requests = {
    information: {ask:'clear information and an explanation of the correct process', questions:['Who is the best person to answer this?','What information or documents should I prepare?','Can the next steps be explained in plain language?']},
    meeting: {ask:'a short meeting or conversation', questions:['Who should attend?','How much time should we reserve?','What should I send or prepare beforehand?']},
    referral: {ask:'a referral or warm introduction', questions:['Who has the right expertise or authority?','May I mention your name when I contact them?','Is there a direct contact rather than only a general webpage?']},
    application: {ask:'help understanding or completing a process, form, or application', questions:['What are the eligibility rules and deadlines?','Which documents are required?','Who can help if I get stuck or receive a denial?']},
    support: {ask:'one specific form of practical or ongoing support', questions:['What support is realistically available?','What schedule, boundaries, or eligibility rules apply?','What backup option exists if this support is unavailable?']},
    collaboration: {ask:'a conversation about possible collaboration', questions:['What shared purpose could this support?','Who can approve or coordinate the partnership?','What would a small first step look like?']},
    concern: {ask:'help understanding and resolving a concern', questions:['Who has authority to address this concern?','What review, complaint, or appeal process applies?','What response time and follow-up should I expect?']}
  };

  const focuses = {
    school: [
      {id:'grades', label:'Grades, missing work, credits, or end-of-term options', starter:'I am contacting you about [student name or “my child”] in [course or grade level]. The concern is [missing work, current grade, credit status, or other fact]. I reviewed [portal, progress report, teacher message, or other record] on [date]. I would like to understand [the realistic options, remaining deadlines, recovery process, or next step].', reflection:'Before contacting the school, review the current portal, recent messages, course rules, and grading deadlines. Consider whether the concern was raised early enough for the school to offer realistic options. This is not about blame; it helps the family ask for support based on the current facts and create an earlier check-in routine next term.'},
      {id:'attendance', label:'Attendance, tardiness, or missed instructional time', starter:'I am contacting you about [student name or “my child”] and [attendance or tardiness concern]. The dates or pattern I am aware of are [brief facts]. The barrier may be [transportation, health, family schedule, safety, or unknown]. I would like help understanding [attendance records, supports, make-up expectations, or next steps].', reflection:'Review attendance notices, transportation routines, appointment schedules, and whether the school was notified promptly. Identify barriers the family can address and supports the school may be able to provide.'},
      {id:'support-plan', label:'IEP, 504, counseling, behavior, or student support', starter:'I am contacting you about [student name or “my child”] and [IEP, 504, counseling, behavior, or support concern]. The specific pattern I have observed is [brief, factual example]. I would like to understand [current supports, evaluation options, meeting process, or who should be involved].', reflection:'Bring specific examples, dates, and existing plans rather than labels or assumptions. Review prior notices and attend scheduled meetings when possible. Ask for explanations in plain language.'},
      {id:'pathway', label:'Graduation, CTE, college, career, or course planning', starter:'I am contacting you about [student name or “my child”] and [graduation, CTE, college, career, or course-planning topic]. The current goal is [brief goal]. We need clarification about [requirements, credits, deadlines, applications, or available programs].', reflection:'Review the graduation plan, course catalog, deadlines, and any prior counselor messages. Earlier planning creates more options than waiting until the final semester.'},
      {id:'communication', label:'Communication, access, discipline, safety, or fairness concern', starter:'I am contacting you about [specific communication, access, discipline, safety, or fairness concern]. The key facts are [what happened, when, and who was involved—without assumptions]. I would like help with [clarification, a meeting, review of a decision, safety planning, or another outcome].', reflection:'Separate facts from interpretations, note what communication has already occurred, and identify the outcome you are seeking. Also consider whether your own tone, timing, missed messages, or delayed response may have affected the interaction—without excusing poor treatment or unfair decisions.'}
    ],
    government: [
      {id:'benefits', label:'Benefits, eligibility, case status, or required documents', starter:'I am contacting you about [program or benefit]. My question concerns [eligibility, case status, missing document, deadline, or decision]. I have [briefly state what was submitted or received]. I would like help understanding [the next step, required proof, review process, or expected timeline].', reflection:'Review official notices and deadlines before contacting the agency. Bring the case number only when using a verified official channel.'},
      {id:'service', label:'Public service, permit, record, fee, or local issue', starter:'I am contacting you about [public service, permit, record, fee, or local issue]. The relevant location, date, or reference is [brief non-sensitive fact]. I would like to know [who handles this, what process applies, or what action is available].', reflection:'Confirm that the office has authority over the issue and use the official process before escalating.'}
    ],
    community: [
      {id:'basic-needs', label:'Food, housing, utilities, transportation, childcare, or basic needs', starter:'I am contacting you because my household needs help with [specific need]. The immediate concern is [brief fact or deadline]. I would like to understand [eligibility, availability, required documents, appointment process, or alternative resources].', reflection:'Ask for requirements before traveling. Be specific about the immediate need while sharing only the minimum private information.'},
      {id:'family-support', label:'Parenting, caregiving, mentoring, youth, or family support', starter:'I am contacting you about [parenting, caregiving, mentoring, youth, or family-support need]. The support we are seeking is [specific service or outcome]. Our availability or important limitation is [brief detail, if relevant].', reflection:'Clarify whether the organization provides direct service, referrals, classes, mentoring, or crisis support. Ask about cost, waiting lists, transportation, and age requirements.'},
      {id:'volunteer-partner', label:'Volunteer opportunity, partnership, donation, or collaboration', starter:'I am contacting you about a possible [volunteer opportunity, partnership, donation, or collaboration]. The shared purpose is [brief purpose]. FamilyPD or our household could contribute [specific skill, time, resource, or idea]. I would like to discuss [a small first step or appropriate contact].', reflection:'Start with a small, realistic request. Confirm expectations, decision-making authority, and whether the proposed help actually matches the organization’s needs.'}
    ],
    health: [
      {id:'appointment', label:'Appointment, referral, test, medication, or care coordination', starter:'I am contacting you about [appointment, referral, test, medication, or care-coordination need]. The non-emergency concern is [brief fact]. I would like help understanding [scheduling, referral status, preparation, cost, or next steps].', reflection:'Use emergency or crisis services for urgent danger. For routine care, prepare medication names, dates, and questions, but share protected information only through verified health channels.'},
      {id:'billing-access', label:'Insurance, billing, cost, language, disability, or access barrier', starter:'I am contacting you about [insurance, billing, cost, language, disability, or access issue]. The specific barrier is [brief fact]. I would like help with [an explanation, payment option, interpreter, accommodation, appeal, or patient advocate].', reflection:'Review the bill, explanation of benefits, or written policy first. Ask for plain-language explanations and document the name of each person contacted.'}
    ],
    career: [
      {id:'program', label:'Program, training, admission, credential, or financial aid', starter:'I am contacting you about [program, training, admission, credential, or financial-aid opportunity]. My goal is [brief goal]. I need clarification about [requirements, cost, deadline, schedule, credit, or support services].', reflection:'Review the official program page first and prepare specific questions. Ask how completion connects to an actual credential, job, transfer pathway, or advancement opportunity.'},
      {id:'employment', label:'Job, interview, workplace concern, advancement, or mentoring', starter:'I am contacting you about [job, interview, workplace concern, advancement, or mentoring topic]. The relevant experience or situation is [brief fact]. I would like help with [an introduction, feedback, accommodation, clarification, meeting, or next step].', reflection:'Consider whether your resume, attendance, follow-up, communication, or preparation can be strengthened. Honest self-review should support growth, not excuse discrimination or unfair treatment.'}
    ],
    faith: [
      {id:'belonging', label:'Belonging, family support, spiritual care, event, or community involvement', starter:'I am contacting you about [belonging, family support, spiritual care, event, or community-involvement need]. I am hoping to [brief outcome]. I would like to know [who to contact, how to participate, what support exists, or what expectations apply].', reflection:'Ask about confidentiality, inclusion, child-safety practices, costs, schedules, and boundaries before sharing personal details.'}
    ],
    person: [
      {id:'practical', label:'Childcare, transportation, meals, errands, check-ins, or practical help', starter:'I am reaching out to ask whether you may be able to help with [specific practical need]. The help would be needed [date, frequency, or time period]. It would involve [clear, limited task]. Please feel free to say no if this is not workable.', reflection:'Make a specific, time-limited request rather than assuming availability. Discuss safety, transportation, money, and boundaries clearly.'},
      {id:'relationship', label:'Conversation, conflict repair, boundary, encouragement, or emotional support', starter:'I would like to talk about [specific situation or relationship concern]. I felt or noticed [brief statement without insults or assumptions]. I hope we can [repair, clarify, set a boundary, make a plan, or understand each other better].', reflection:'Use “I noticed” and “I felt” language, listen for the other person’s experience, and identify anything you could do differently without taking responsibility for someone else’s harmful behavior.'}
    ]
  };

  function naturalMethod(value) {
    return {email:'a written response', phone:'a phone call', meeting:'an in-person or virtual meeting', introduction:'a warm introduction'}[value] || 'a response';
  }

  function selectedFocus() {
    const list = focuses[typeSelect.value] || [];
    return list.find(item => item.id === focusSelect.value);
  }

  function updateFocusOptions() {
    const type = typeSelect.value;
    const request = requestSelect.value;
    focusSelect.innerHTML = '';
    if (!type || !request) {
      focusSelect.disabled = true;
      focusSelect.innerHTML = '<option value="">Choose who you are contacting and the help you need first</option>';
      topicBox.value = '';
      return;
    }
    const list = focuses[type] || [];
    focusSelect.disabled = false;
    focusSelect.innerHTML = '<option value="">Choose the specific communication topic</option>' + list.map(item => `<option value="${esc(item.id)}">${esc(item.label)}</option>`).join('');
    topicBox.value = '';
  }

  function populateStarter() {
    const focus = selectedFocus();
    if (!focus) {
      topicBox.value = '';
      guidance.textContent = 'Choose a communication topic to receive an editable message starter.';
      return;
    }
    topicBox.value = focus.starter;
    guidance.textContent = 'Edit the message starter and replace every bracketed phrase. Keep the facts short and specific. The final message will use this text together with your selected contact, request, and communication method.';
  }

  typeSelect.addEventListener('change', updateFocusOptions);
  requestSelect.addEventListener('change', updateFocusOptions);
  focusSelect.addEventListener('change', populateStarter);

  let currentMessage = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    const type = types[typeSelect.value];
    const request = requests[requestSelect.value];
    const focus = selectedFocus();
    const topic = topicBox.value.trim();
    const history = historyBox.value.trim();
    const method = naturalMethod(methodSelect.value);

    if (!type || !request || !focus || !topic) {
      output.innerHTML = '<p><strong>Please choose the contact type, request, and communication topic, then edit the message starter.</strong></p>';
      return;
    }
    if (/\[[^\]]+\]/.test(topic)) {
      output.innerHTML = '<p><strong>Please replace every bracketed phrase in the message starter before building the plan.</strong></p>';
      topicBox.focus();
      return;
    }

    currentMessage = `Hello,\n\n${topic}\n\nI am seeking ${request.ask}. ${history ? `So far, I have ${history.charAt(0).toLowerCase() + history.slice(1)}. ` : ''}Could you let me know whether you are the correct contact, or connect me with the person who can help? I would prefer ${method}.\n\nThank you for your time.`;

    output.innerHTML = `
      <section><h3>Your selections</h3><p><strong>Contact:</strong> ${esc(type.name)}<br><strong>Request:</strong> ${esc(request.ask)}<br><strong>Topic:</strong> ${esc(focus.label)}</p></section>
      <section><h3>Who may be useful to contact</h3><p>Look for a ${esc(type.contact)}.</p><p><strong>Before sharing private information:</strong> ${esc(type.verify)}</p></section>
      <section><h3>Editable outreach message</h3><textarea class="message-box" id="generated-connection-message">${esc(currentMessage)}</textarea></section>
      <section><h3>Before you reach out</h3><p>${esc(focus.reflection)}</p></section>
      <section><h3>Questions to clarify the next step</h3><ul>${request.questions.map(question => `<li>${esc(question)}</li>`).join('')}</ul></section>
      <section><h3>Other ways to handle the situation</h3><ul><li>Review the official instructions, records, deadlines, and prior messages first.</li><li>Ask for a brief phone call or meeting when a long email may create confusion.</li><li>Request a warm introduction when you do not know the correct contact.</li><li>Use an official form, appeal, complaint, or escalation process when required.</li><li>Document the agreed next step, responsible person, and follow-up date.</li></ul></section>
      <section><h3>Follow-up plan</h3><ol><li>Write down the person’s name, role, and preferred contact method.</li><li>Confirm the next step, deadline, and expected response time.</li><li>Send a brief follow-up or thank-you and keep a record of agreed actions.</li></ol></section>`;

    document.getElementById('generated-connection-message').addEventListener('input', e => currentMessage = e.target.value);
  });

  document.getElementById('copy-connection').addEventListener('click', async () => {
    const status = document.getElementById('connection-status');
    if (!currentMessage) {
      status.textContent = 'Build a message first.';
      return;
    }
    try {
      await navigator.clipboard.writeText(currentMessage);
      status.textContent = 'Message copied.';
    } catch {
      status.textContent = 'Select and copy the message manually.';
    }
  });
  document.getElementById('print-connection').addEventListener('click', () => window.print());
})();
