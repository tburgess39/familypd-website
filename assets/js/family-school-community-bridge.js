(() => {
  const form=document.getElementById('connector-form');
  const output=document.getElementById('connector-output');
  if(!form||!output)return;
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const types={
    school:{name:'school or district',contact:'teacher, counselor, family liaison, case manager, department chair, or administrator',verify:'Use the official school or district directory.'},
    government:{name:'public agency',contact:'front-desk specialist, caseworker, program coordinator, or constituent-services contact',verify:'Use an official .gov website or verified public phone number.'},
    community:{name:'community organization',contact:'intake specialist, program coordinator, family navigator, volunteer coordinator, or director',verify:'Confirm the organization’s services, fees, eligibility rules, and privacy practices.'},
    health:{name:'health or counseling provider',contact:'licensed provider, nurse, care coordinator, intake specialist, or patient advocate',verify:'Confirm credentials, cost, insurance, privacy limits, and urgent-care instructions.'},
    career:{name:'education or career contact',contact:'admissions adviser, workforce navigator, CTE counselor, program coordinator, employer representative, or mentor',verify:'Confirm requirements, deadlines, costs, and whether the opportunity is official.'},
    faith:{name:'faith, cultural, or neighborhood group',contact:'community leader, family ministry contact, group coordinator, or trusted member',verify:'Ask how the group protects privacy, safety, inclusion, and boundaries.'},
    person:{name:'trusted person',contact:'relative, friend, neighbor, co-parent, colleague, or mentor',verify:'Start with one specific request and agree on boundaries rather than assuming ongoing availability.'}
  };
  const requests={
    information:{ask:'clear information and an explanation of the correct process',questions:['Who is the best person to answer this?','What information or documents should I prepare?','Can the next steps be explained in plain language?']},
    meeting:{ask:'a short meeting or conversation',questions:['Who should attend?','How much time should we reserve?','What should I send or prepare beforehand?']},
    referral:{ask:'a referral or warm introduction',questions:['Who has the right expertise or authority?','May I mention your name when I contact them?','Is there a direct contact rather than only a general webpage?']},
    application:{ask:'help understanding or completing a process, form, or application',questions:['What are the eligibility rules and deadlines?','Which documents are required?','Who can help if I get stuck or receive a denial?']},
    support:{ask:'one specific form of practical or ongoing support',questions:['What support is realistically available?','What schedule, boundaries, or eligibility rules apply?','What backup option exists if this support is unavailable?']},
    collaboration:{ask:'a conversation about possible collaboration',questions:['What shared purpose could this support?','Who can approve or coordinate the partnership?','What would a small first step look like?']},
    concern:{ask:'help understanding and resolving a concern',questions:['Who has authority to address this concern?','What complaint, review, or appeal process applies?','What response time and follow-up should I expect?']}
  };
  let currentMessage='';
  function naturalMethod(v){return {email:'a written response',phone:'a phone call',meeting:'an in-person or virtual meeting',introduction:'a warm introduction'}[v]||'a response';}
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const type=types[document.getElementById('connection-type').value];
    const request=requests[document.getElementById('request-type').value];
    const topic=document.getElementById('connection-topic').value.trim();
    const history=document.getElementById('connection-history').value.trim();
    const method=naturalMethod(document.getElementById('connection-method').value);
    if(!type||!request||!topic){output.innerHTML='<p><strong>Please choose the organization type and request, then briefly describe the topic.</strong></p>';return;}
    currentMessage=`Hello, I am reaching out because ${topic.charAt(0).toLowerCase()+topic.slice(1)}. I am seeking ${request.ask}. ${history?`So far, I have ${history.charAt(0).toLowerCase()+history.slice(1)}. `:''}Could you let me know whether you are the correct contact, or connect me with the person who can help? I would prefer ${method}. Thank you for your time.`;
    output.innerHTML=`<section><h3>Who may be useful to contact</h3><p>Look for a ${esc(type.contact)}.</p><p><strong>Before sharing private information:</strong> ${esc(type.verify)}</p></section><section><h3>Editable outreach message</h3><textarea class="message-box" id="generated-connection-message">${esc(currentMessage)}</textarea></section><section><h3>Questions to clarify the next step</h3><ul>${request.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></section><section><h3>Follow-up plan</h3><ol><li>Write down the person’s name, role, and preferred contact method.</li><li>Confirm the next step, deadline, and expected response time.</li><li>Send a brief follow-up or thank-you and keep a record of agreed actions.</li></ol></section>`;
    document.getElementById('generated-connection-message').addEventListener('input',e=>currentMessage=e.target.value);
  });
  document.getElementById('copy-connection').addEventListener('click',async()=>{const status=document.getElementById('connection-status');if(!currentMessage){status.textContent='Build a message first.';return;}try{await navigator.clipboard.writeText(currentMessage);status.textContent='Message copied.';}catch{status.textContent='Select and copy the message manually.';}});
  document.getElementById('print-connection').addEventListener('click',()=>window.print());
})();
