const FPD = (() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function initRevealCards() {
    $$('.reveal-card > button').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.reveal-card');
        const open = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

  function quizQuestions(root=document) {
    return $$('.question[data-answer-hash], .question[data-correct-choice]', root);
  }

  function initSingleChoiceQuiz(root=document) {
    const salt = document.querySelector('meta[name="fpd-quiz-salt"]')?.content || '';
    quizQuestions(root).forEach(q => {
      $$('.option', q).forEach(btn => {
        btn.addEventListener('click', async () => {
          if (q.dataset.locked === '1' || q.dataset.checking === '1') return;
          q.dataset.checking = '1';
          const choice = btn.dataset.choice || '';
          let correct = false;

          // Public learning pages may store the answer directly. Other pages can
          // continue using a salted hash so this helper remains backward compatible.
          if (q.dataset.correctChoice) {
            correct = choice === q.dataset.correctChoice;
          } else if (q.dataset.answerHash) {
            const qid = q.dataset.questionId || '';
            const candidate = await sha256(`${salt}|${qid}|${choice}`);
            correct = candidate === q.dataset.answerHash;
          }

          const feedback = $('.feedback', q);
          $$('.option', q).forEach(x => x.classList.remove('correct','incorrect'));
          btn.classList.add(correct ? 'correct' : 'incorrect');

          if (correct) {
            q.dataset.locked = '1';
            $$('.option', q).forEach(x => x.disabled = true);
            if (feedback) {
              feedback.textContent = q.dataset.correctFeedback || 'Correct.';
              feedback.className = 'feedback good';
            }
          } else if (feedback) {
            const hint = btn.dataset.feedback || q.dataset.wrongFeedback || 'Not quite.';
            const correctBtn = q.dataset.correctChoice ? q.querySelector('.option[data-choice="' + CSS.escape(q.dataset.correctChoice) + '"]') : null;
            feedback.textContent = correctBtn ? hint + ' Correct answer: ' + correctBtn.textContent.trim() : hint + ' Try another answer.';
            feedback.className = 'feedback try';
          }

          q.dataset.checking = '0';
          updateScore(root);
        });
      });
    });
    updateScore(root);
  }

  function updateScore(root=document) {
    const questions = quizQuestions(root);
    if (!questions.length) return;
    const answered = questions.filter(q => q.dataset.locked === '1').length;
    const score = $('.score', root);
    if (score) score.textContent = `Completed: ${answered} / ${questions.length}`;
  }

  function resetQuiz(root=document) {
    quizQuestions(root).forEach(q => {
      q.dataset.locked = '0'; q.dataset.checking = '0';
      $$('.option', q).forEach(x => { x.disabled = false; x.classList.remove('correct','incorrect'); });
      const f = $('.feedback', q);
      if (f) { f.textContent = ''; f.className = 'feedback'; }
    });
    updateScore(root);
    root.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function initResetButtons() {
    $$('[data-reset-quiz]').forEach(btn => btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.resetQuiz);
      if (target) resetQuiz(target);
    }));
  }

  function initComponentCards() { const detail=$('#componentDetail'),parts=window.FPD_COMPONENTS||{}; $$('.component').forEach(btn=>btn.addEventListener('click',()=>{$$('.component').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const item=parts[btn.dataset.part];if(detail&&item)detail.innerHTML=`<h3>${item.title}</h3><p>${item.body}</p><p><b>Security connection:</b> ${item.security}</p>`;})); }
  function initPorts() { const detail=$('#portDetail'),ports=window.FPD_PORTS||{}; $$('.port').forEach(btn=>btn.addEventListener('click',()=>{$$('.port').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const p=ports[btn.dataset.port];if(detail&&p)detail.innerHTML=`<h3>${p.name} — port ${btn.dataset.port}</h3><p>${p.use}</p><p><b>Defender view:</b> ${p.security}</p>`;})); }
  function initConverter(){const dec=$('#decimal'),bin=$('#binary'),hex=$('#hexadecimal'),status=$('#converterStatus');if(!dec||!bin||!hex)return;let changing=false;function show(n){if(!Number.isSafeInteger(n)||n<0){status.textContent='Use a whole number from 0 through 9,007,199,254,740,991.';return;}changing=true;dec.value=String(n);bin.value=n.toString(2);hex.value=n.toString(16).toUpperCase();status.textContent=`${n} in decimal = ${bin.value} in binary = ${hex.value} in hexadecimal.`;changing=false;}dec.addEventListener('input',()=>{if(changing)return;const v=dec.value.trim();if(v==='')return;show(Number(v))});bin.addEventListener('input',()=>{if(changing)return;const v=bin.value.trim();if(!/^[01]+$/.test(v)){status.textContent='Binary uses only 0 and 1.';return;}show(parseInt(v,2))});hex.addEventListener('input',()=>{if(changing)return;const v=hex.value.trim();if(!/^[0-9a-f]+$/i.test(v)){status.textContent='Hexadecimal uses 0–9 and A–F.';return;}show(parseInt(v,16))});show(42)}
  function initGlossary(){const input=$('#glossarySearch');if(!input)return;input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();$$('.term').forEach(t=>t.hidden=!t.textContent.toLowerCase().includes(q));})}
  function initCyberLabTabs(){
    const tabs=$$('[data-lab-tab]');
    if(!tabs.length)return;
    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      tabs.forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false');});
      $$('.cyber-lab-panel').forEach(p=>{p.classList.remove('active');p.hidden=true;});
      tab.classList.add('active');tab.setAttribute('aria-selected','true');
      const panel=document.getElementById(tab.dataset.labTab);if(panel){panel.hidden=false;panel.classList.add('active');}
    }));
  }

  function initTerminal(){
    const input=$('#termIn'),output=$('#termOut'),run=$('#runCmd');if(!input||!output||!run)return;
    const outputs={
      'pwd':'/home/hacker',
      'whoami':'hacker',
      'hostname':'hacker',
      'uname -a':'Linux hacker 6.1.0-lab-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
      'cat /etc/os-release':'PRETTY_NAME="FamilyPD Safe Linux Lab"\nNAME="FamilyPD Lab"\nVERSION="1.0 (fictional simulation)"',
      'ip addr':'1: lo: <LOOPBACK,UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 10.10.10.25/24 brd 10.10.10.255 scope global eth0\n    state UP',
      'ip route':'default via 10.10.10.1 dev eth0\n10.10.10.0/24 dev eth0 proto kernel scope link src 10.10.10.25',
      'ping -c 3 10.10.10.20':'PING target (10.10.10.20): 56 data bytes\n64 bytes from 10.10.10.20: icmp_seq=1 ttl=64 time=0.82 ms\n64 bytes from 10.10.10.20: icmp_seq=2 ttl=64 time=0.76 ms\n64 bytes from 10.10.10.20: icmp_seq=3 ttl=64 time=0.79 ms\n--- target ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss',
      'ping target':'PING target (10.10.10.20): 56 data bytes\n64 bytes from 10.10.10.20: icmp_seq=1 ttl=64 time=0.82 ms\n64 bytes from 10.10.10.20: icmp_seq=2 ttl=64 time=0.76 ms\n64 bytes from 10.10.10.20: icmp_seq=3 ttl=64 time=0.79 ms\n--- target ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss',
      'ping 10.10.10.20':'PING target (10.10.10.20): 56 data bytes\n64 bytes from 10.10.10.20: icmp_seq=1 ttl=64 time=0.82 ms\n64 bytes from 10.10.10.20: icmp_seq=2 ttl=64 time=0.76 ms\n64 bytes from 10.10.10.20: icmp_seq=3 ttl=64 time=0.79 ms\n--- target ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss',
      'nmap 10.10.10.20':'Nmap scan report for target (10.10.10.20)\nHost is up.\nPORT    STATE  SERVICE\n22/tcp  open   ssh\n80/tcp  open   http\n443/tcp open   https\n445/tcp open   microsoft-ds\n3389/tcp closed ms-wbt-server\n\nPreset simulation only—no packets were sent.',
      'nmap -sV 10.10.10.20':'Nmap scan report for target (10.10.10.20)\nPORT    STATE SERVICE       VERSION\n22/tcp  open  ssh           OpenSSH 9.2 (fictional)\n80/tcp  open  http          Apache httpd 2.4 (fictional)\n443/tcp open  ssl/http      Apache httpd 2.4 (fictional)\n445/tcp open  microsoft-ds  Samba 4.x (fictional)\n\nPreset service detection only—this is not a real scan.',
      'curl http://10.10.10.20':'HTTP/1.1 200 OK\nServer: target-lab/1.0 (fictional)\nContent-Type: text/html\n\n<h1>Target Practice Server</h1>\n<p>This response is simulated locally by FamilyPD.</p>',
      'ls':'Documents  Downloads  linux-lab  notes.txt',
      'ls -la':'drwxr-xr-x  5 hacker hacker 4096 .\ndrwxr-xr-x  3 root   root   4096 ..\ndrwxr-xr-x  2 hacker hacker 4096 Documents\ndrwxr-xr-x  2 hacker hacker 4096 Downloads\ndrwxr-xr-x  3 hacker hacker 4096 linux-lab\n-rw-r--r--  1 hacker hacker  111 notes.txt',
      'lsblk':'NAME      SIZE FSTYPE MOUNTPOINTS\nvda        32G\n├─vda1    512M vfat   /boot\n└─vda2   31.5G ext4   /\nsdb        16G\n└─sdb1     16G exfat  /media/hacker/LAB_USB',
      'df -h':'Filesystem  Size  Used Avail Use% Mounted on\n/dev/vda2    31G   11G   19G  37% /\n/dev/sdb1    16G  4.2G   12G  27% /media/hacker/LAB_USB',
      'mount':'/dev/vda2 on / type ext4 (rw,relatime)\n/dev/sdb1 on /media/hacker/LAB_USB type exfat (rw,nosuid,nodev)',
      'free -h':'               total        used        free      shared  buff/cache   available\nMem:           3.8Gi       1.1Gi       1.9Gi       112Mi       822Mi       2.4Gi\nSwap:          1.0Gi          0B       1.0Gi',
      'ps':'  PID TTY          TIME CMD\n 1201 pts/0    00:00:00 bash\n 1288 pts/0    00:00:00 ps',
      'history':'  1  pwd\n  2  whoami\n  3  ip addr\n  4  ip route\n  5  lsblk\n  6  df -h',
      'cat notes.txt':'SAFE LAB ONLY: Identify the fictional hacker IP, discover the fictional target, inspect exposed services, and explain what a defender should review.',
      'clear':'__CLEAR__'
    };
    function exec(cmd){cmd=cmd.trim();if(!cmd)return;const result=outputs[cmd]||'That command is not included in this safe simulator. Try one of the command buttons above.';if(result==='__CLEAR__')output.textContent='';else output.textContent+=`\nhacker@lab:~$ ${cmd}\n${result}\n`;output.scrollTop=output.scrollHeight;input.value='';}
    run.addEventListener('click',()=>exec(input.value));input.addEventListener('keydown',e=>{if(e.key==='Enter')exec(input.value)});$$('[data-cmd]').forEach(btn=>btn.addEventListener('click',()=>exec(btn.dataset.cmd)));
  }

  function initFakeScans(){
    const out=$('#scanOut');if(!out)return;
    const scans={
      discovery:'hacker@lab:~$ nmap -sn 10.10.10.0/24\nStarting Nmap (fictional FamilyPD simulation)\nNmap scan report for target-router (10.10.10.1)\nHost is up.\nNmap scan report for target-workstation (10.10.10.10)\nHost is up.\nNmap scan report for target (10.10.10.20)\nHost is up.\nNmap scan report for hacker (10.10.10.25)\nHost is up.\nNmap done: 256 IP addresses (4 hosts up) scanned in 2.41 seconds',
      ports:'hacker@lab:~$ nmap 10.10.10.20\nNmap scan report for target (10.10.10.20)\nHost is up.\nPORT    STATE  SERVICE\n22/tcp  open   ssh\n80/tcp  open   http\n443/tcp open   https\n445/tcp open   microsoft-ds\n3389/tcp closed ms-wbt-server\nNmap done: 1 IP address (1 host up) scanned in 0.38 seconds',
      services:'hacker@lab:~$ nmap -sV 10.10.10.20\nNmap scan report for target (10.10.10.20)\nPORT    STATE SERVICE       VERSION\n22/tcp  open  ssh           OpenSSH 9.2 (fictional)\n80/tcp  open  http          Apache httpd 2.4 (fictional)\n443/tcp open  ssl/http      Apache httpd 2.4 (fictional)\n445/tcp open  microsoft-ds  Samba 4.x (fictional)\n\nService detection performed. These are preset educational results—not a real scan.'
    };
    $$('[data-fake-scan]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.fakeScan;out.textContent=key==='clear'?'Select a scan above. Start with “Discover hosts.”':scans[key];}));
    $$('.scan-answer').forEach(btn=>btn.addEventListener('click',()=>{const f=$('#scanFeedback');$$('.scan-answer').forEach(x=>x.classList.remove('correct','incorrect'));if(btn.dataset.scanAnswer==='445'){btn.classList.add('correct');f.textContent='Correct. Port 445 is commonly associated with SMB file sharing. Defenders should verify that it is necessary, patched, authenticated, restricted, and logged.';f.className='feedback good';}else{btn.classList.add('incorrect');f.textContent='Not quite. The correct answer is 445 / SMB, which is commonly associated with file sharing.';f.className='feedback bad';}}));
  }

  function initPacketExplorer(){
    const rows=$('#packetRows'),filter=$('#packetFilter'),detail=$('#packetDetail');if(!rows||!filter||!detail)return;
    const packets=[
      {n:1,src:'10.10.10.25 (hacker)',dst:'10.10.10.1',proto:'DNS',len:74,info:'Standard query A target.lab',tags:['dns','target'],sport:'53124',dport:'53',why:'The hacker machine asks DNS for the address associated with target.lab.'},
      {n:2,src:'10.10.10.1',dst:'10.10.10.25 (hacker)',proto:'DNS',len:90,info:'Standard query response A 10.10.10.20',tags:['dns','target'],sport:'53',dport:'53124',why:'DNS responds that target.lab uses the fictional address 10.10.10.20.'},
      {n:3,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TCP',len:66,info:'52344 → 443 [SYN]',tags:['tcp','target','443'],sport:'52344',dport:'443',why:'The client begins a TCP three-way handshake with target port 443.'},
      {n:4,src:'10.10.10.20 (target)',dst:'10.10.10.25 (hacker)',proto:'TCP',len:66,info:'443 → 52344 [SYN, ACK]',tags:['tcp','target','443'],sport:'443',dport:'52344',why:'The target acknowledges the connection request and responds.'},
      {n:5,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TCP',len:54,info:'52344 → 443 [ACK]',tags:['tcp','target','443'],sport:'52344',dport:'443',why:'The final ACK completes the fictional TCP handshake.'},
      {n:6,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TLS',len:517,info:'Client Hello',tags:['tls','target','443'],sport:'52344',dport:'443',why:'The client proposes TLS settings for an encrypted session.'},
      {n:7,src:'10.10.10.20 (target)',dst:'10.10.10.25 (hacker)',proto:'TLS',len:1248,info:'Server Hello, Certificate',tags:['tls','target','443'],sport:'443',dport:'52344',why:'The target selects TLS settings and sends a fictional certificate.'},
      {n:8,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'ICMP',len:98,info:'Echo (ping) request',tags:['icmp','target'],sport:'—',dport:'—',why:'ICMP is used here to ask whether the fictional target can respond.'},
      {n:9,src:'10.10.10.20 (target)',dst:'10.10.10.25 (hacker)',proto:'ICMP',len:98,info:'Echo (ping) reply',tags:['icmp','target'],sport:'—',dport:'—',why:'The target replies, indicating reachability in this preset simulation.'},
      {n:10,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TLS',len:742,info:'Application Data (encrypted)',tags:['tls','target','443'],sport:'52344',dport:'443',why:'The payload is represented as encrypted TLS application data, so the page contents are not readable in the packet list.'},
      {n:11,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TCP',len:66,info:'53110 → 80 [SYN]',tags:['tcp','http','target'],sport:'53110',dport:'80',why:'A second fictional connection begins to the unencrypted HTTP service on port 80.'},
      {n:12,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'HTTP',len:176,info:'POST /login username=hacker&password=practice',tags:['http','target'],sport:'53110',dport:'80',why:'This intentionally insecure fictional HTTP example shows why unencrypted credentials are dangerous: readable form data may appear directly in a capture.'}
    ];
    const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    function openPacket(p){detail.innerHTML=`<h3>Packet ${p.n}: ${p.proto}</h3><div class="packet-field"><div><b>Source</b><br>${esc(p.src)}</div><div><b>Destination</b><br>${esc(p.dst)}</div><div><b>Source port</b><br>${esc(p.sport)}</div><div><b>Destination port</b><br>${esc(p.dport)}</div><div><b>Length</b><br>${p.len} bytes</div><div><b>Summary</b><br>${esc(p.info)}</div></div><p><b>What it means:</b> ${esc(p.why)}</p>`;$$('tr',rows).forEach(x=>x.classList.toggle('selected',Number(x.dataset.packet)===p.n));}
    function render(){const v=filter.value;const shown=packets.filter(p=>v==='all'||p.tags.includes(v)||p.proto.toLowerCase()===v);rows.innerHTML=shown.map(p=>`<tr tabindex="0" data-packet="${p.n}"><td>${p.n}</td><td>${esc(p.src)}</td><td>${esc(p.dst)}</td><td><b>${p.proto}</b></td><td>${p.len}</td><td>${esc(p.info)}</td></tr>`).join('');$$('[data-packet]',rows).forEach(row=>{const open=()=>openPacket(packets.find(x=>x.n===Number(row.dataset.packet)));row.addEventListener('click',open);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});}
    filter.addEventListener('change',render);render();
    const reset=$('#packetReset');if(reset)reset.addEventListener('click',()=>{filter.value='all';render();detail.innerHTML='<h3>Select a packet</h3><p>Choose a row to see what the source, destination, protocol, port, and message mean.</p>';const f=$('#packetChallengeFeedback');if(f){f.textContent='';f.className='feedback';}$$('.packet-answer').forEach(x=>x.classList.remove('correct','incorrect'));});
    $$('.packet-answer').forEach(btn=>btn.addEventListener('click',()=>{const f=$('#packetChallengeFeedback');$$('.packet-answer').forEach(x=>x.classList.remove('correct','incorrect'));if(btn.dataset.packetAnswer==='12'){btn.classList.add('correct');f.textContent='Correct. Packet 12 contains a fictional HTTP login request whose form values are readable. HTTPS/TLS would encrypt the application data.';f.className='feedback good';openPacket(packets.find(p=>p.n===12));}else{btn.classList.add('incorrect');f.textContent='Not quite. Packet 12 is the clearest example because the fictional username and password appear in readable HTTP data.';f.className='feedback bad';}}));
  }

  function initFacts(){const facts=$('#browserFacts');if(!facts)return;const rows=[['Page opened',new Date().toLocaleString()],['Language',navigator.language||'Not exposed'],['Time zone',Intl.DateTimeFormat().resolvedOptions().timeZone||'Not exposed'],['Screen size',`${screen.width} × ${screen.height} pixels`],['Viewport',`${innerWidth} × ${innerHeight} pixels`],['Touch points',String(navigator.maxTouchPoints??'Not exposed')],['CPU threads',String(navigator.hardwareConcurrency??'Not exposed')],['Approx. device memory',navigator.deviceMemory?`${navigator.deviceMemory} GB (approx.)`:'Not exposed'],['Online status',navigator.onLine?'Browser reports online':'Browser reports offline'],['Referring page',document.referrer||'None supplied'],['Current address',location.href],['Browser identifier',navigator.userAgent||'Not exposed']];const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));facts.innerHTML=rows.map(([k,v])=>`<div class="fact"><b>${esc(k)}</b><code>${esc(v)}</code></div>`).join('')}
  function initVersionQuestions(){$$('[data-version-option]').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.version-question');if(!card)return;$$('.option',card).forEach(x=>x.classList.remove('correct','incorrect'));btn.classList.add('correct');const feedback=$('[data-version-feedback]',card);if(feedback){feedback.textContent='Use the live Tony Stark challenge to verify this item. The public answer copy shows these choices but does not reliably preserve the selected range, so this exploration does not guess.';feedback.className='feedback good';}}))}
  function initCredentialDemo(){const button=$('#fakeSignIn'),consoleBox=$('#console');if(!button||!consoleBox)return;button.addEventListener('click',()=>{const u=$('#fakeUser').value,p=$('#fakePass').value;consoleBox.textContent=`PRACTICE CAPTURE\nusername: ${u}\npassword: ${p}\n\nNo authentication occurred. The local page simply displayed the fixed practice values.`;})}

  return { init(){initRevealCards();initSingleChoiceQuiz();initResetButtons();initComponentCards();initPorts();initConverter();initGlossary();initCyberLabTabs();initTerminal();initFakeScans();initPacketExplorer();initFacts();initVersionQuestions();initCredentialDemo();} };
})();
document.addEventListener('DOMContentLoaded',()=>FPD.init());

// FamilyPD interactive computer and packet-flow simulations
(function(){
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const computerScenarios={
    open:{label:'Open a saved picture',steps:[
      ['storage','Storage','Reads the saved picture as bytes.'],
      ['ram','RAM','Holds the active picture data temporarily.'],
      ['cpu','CPU','Runs instructions that interpret the file.'],
      ['gpu','GPU','Builds the image from processed values.'],
      ['display','Display','Shows the completed picture.']
    ]},
    save:{label:'Type and save a document',steps:[
      ['input','Keyboard / input','A key press becomes an input code.'],
      ['cpu','CPU','The application interprets the keystroke.'],
      ['ram','RAM','Holds the active, unsaved document.'],
      ['storage','Storage','Writes the document bytes for long-term storage.']
    ]},
    web:{label:'Open a website',steps:[
      ['nic','Network interface','Receives network signals and reconstructs frames.'],
      ['ram','RAM','Buffers packet and browser data.'],
      ['cpu','CPU','Runs browser instructions and processes the response.'],
      ['gpu','GPU','Builds the page image.'],
      ['display','Display','Shows the website.']
    ]},
    video:{label:'Play a video',steps:[
      ['storage','Storage','Reads the compressed video file.'],
      ['ram','RAM','Buffers upcoming video data.'],
      ['cpu','CPU','Coordinates decoding and playback.'],
      ['gpu','GPU','Builds the video frames.'],
      ['display','Display / speakers','Present the picture and sound.']
    ]},
    typeA:{label:'Type the letter A',steps:[
      ['input','Keyboard / input','The A key produces an input code.'],
      ['cpu','CPU','Software interprets the input as the letter A.'],
      ['ram','RAM','Holds the byte 01000001 while the program is running.'],
      ['gpu','GPU','Builds pixels shaped like A.'],
      ['display','Display','Shows A on the screen.']
    ]}
  };
  const powerScenario={label:'Power on the computer',steps:[
    [['outlet'],'Wall outlet','120 V AC is available at the outlet.','Input: 120 V AC'],
    [['psu'],'Power supply','The PSU converts AC into regulated DC rails.','Typical PSU rails: 12 V, 5 V, and 3.3 V DC'],
    [['motherboard'],'Motherboard and voltage regulators','Power enters motherboard connectors. Regulators create the voltages required by individual circuits.','The exact CPU, RAM, and chipset voltages depend on the hardware.'],
    [['cpu','ram','storage','gpu','nic','input','display'],'Powered components','Separate branches power the CPU, RAM, storage, GPU, network interface, input devices, and display. They do not receive power through one another.','Power is distributed in parallel to component branches.']
  ]};
  let computerMode='data';
  let computerRunId=0;
  function cancelComputerRun(){computerRunId+=1;}
  function cardMarkup(id,title,detail,index){return '<article class="simple-flow-step" data-flow-id="'+id+'"><span class="flow-step-number">'+(index+1)+'</span><div><b>'+title+'</b><p>'+detail+'</p><small data-flow-status>Waiting</small></div></article>';}
  function renderComputerFlow(steps){
    const board=document.getElementById('computerFlowBoard');if(!board)return;
    board.innerHTML=steps.map((step,i)=>{
      const ids=Array.isArray(step[0])?step[0]:[step[0]];
      const title=step[1],detail=step[2];
      return cardMarkup(ids.join(','),title,detail,i);
    }).join('<div class="simple-flow-arrow" aria-hidden="true">↓</div>');
  }
  function resetFlowCards(){document.querySelectorAll('#computerFlowBoard .simple-flow-step').forEach(card=>{card.classList.remove('current','done');const st=card.querySelector('[data-flow-status]');if(st)st.textContent='Waiting';});}
  function activateFlowCard(index){
    const cards=[...document.querySelectorAll('#computerFlowBoard .simple-flow-step')];
    cards.forEach((card,i)=>{
      card.classList.toggle('current',i===index);
      card.classList.toggle('done',i<index);
      const st=card.querySelector('[data-flow-status]');
      if(st)st.textContent=i<index?'Complete':i===index?'Active now':'Waiting';
    });
    cards[index]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'});
  }
  function completeFlowCards(){document.querySelectorAll('#computerFlowBoard .simple-flow-step').forEach(card=>{card.classList.remove('current');card.classList.add('done');const st=card.querySelector('[data-flow-status]');if(st)st.textContent='Complete';});}
  async function runComputer(){
    const board=document.getElementById('computerFlowBoard'),out=document.getElementById('computerSimOutput'),status=document.getElementById('computerStepStatus'),powerReadout=document.getElementById('powerVoltageReadout'),bitReadout=document.getElementById('bitSignalReadout'),taskSelect=document.getElementById('computerTask'),startState=document.getElementById('computerStartState');
    if(!board||!out||!taskSelect)return;
    const runId=++computerRunId;
    const scenario=computerMode==='power'?powerScenario:computerScenarios[taskSelect.value];
    const steps=scenario.steps;
    renderComputerFlow(steps);resetFlowCards();board.hidden=false;out.hidden=false;if(status)status.hidden=false;
    if(startState)startState.innerHTML=computerMode==='power'?'<b>Power-flow starting state:</b> The computer begins unplugged. The four stages below show the simplified startup path. The final stage is one parallel branch, not a chain through each component.':'<b>Data-flow starting state:</b> The computer is already plugged in, powered on, and idle. The cards show only the major components used by the selected task.';
    out.innerHTML='<b>'+scenario.label+':</b> follow the highlighted card from top to bottom.';
    for(let i=0;i<steps.length;i++){
      if(runId!==computerRunId)return;
      activateFlowCard(i);
      const step=steps[i];
      if(status)status.innerHTML='<b>Step '+(i+1)+' of '+steps.length+': '+step[1]+'</b><span>'+step[2]+'</span>';
      if(computerMode==='power'){
        if(powerReadout)powerReadout.textContent=step[3]||'Power is being distributed.';
        if(bitReadout)bitReadout.textContent='Power mode shows energy delivery. A power-rail voltage is not a data bit.';
      }else{
        if(powerReadout)powerReadout.textContent='The computer remains powered while this component handles the task.';
        if(bitReadout)bitReadout.innerHTML=taskSelect.value==='typeA'?'Example signal pattern: <code>01000001</code> = 8 bits = 1 byte = decimal 65 = “A”. Actual HIGH and LOW voltage limits depend on the circuit datasheet.':'Data is represented by LOW and HIGH voltage regions. Groups of 8 bits form bytes.';
      }
      await wait(1150);
    }
    if(runId!==computerRunId)return;
    completeFlowCards();
    if(status)status.innerHTML='<b>Complete.</b><span>'+(computerMode==='power'?'The outlet, PSU, motherboard/regulators, and parallel component branches are now powered.':'The task used the simplified sequence shown. Real systems overlap and pipeline many operations.')+'</span>';
    out.innerHTML='<b>Complete:</b> '+(computerMode==='power'?'Power supplies energy; component activity changes after startup.':'Voltage regions represent bits, bits form bytes, bytes form files, and transfer rates measure bits moved per second.');
  }
  function restartComputer(){cancelComputerRun();window.setTimeout(runComputer,0);}
  const computerStart=document.getElementById('computerSimStart');
  if(computerStart)computerStart.addEventListener('click',()=>{const controls=document.querySelector('#computerFlowSimulator .sim-controls');if(controls)controls.hidden=false;computerStart.textContent='Run again';restartComputer();});
  document.querySelectorAll('[data-computer-mode]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-computer-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');computerMode=b.dataset.computerMode;const task=document.getElementById('computerTask');if(task)task.closest('label').hidden=computerMode==='power';restartComputer();}));
  const computerTask=document.getElementById('computerTask');if(computerTask)computerTask.addEventListener('change',restartComputer);
  const computerReplay=document.getElementById('computerSimReplay');if(computerReplay)computerReplay.addEventListener('click',restartComputer);

  const osiLayers={
    https:{
      7:['Application','Browser creates an HTTPS request.','Device/app: browser and web server','Data'],
      6:['Presentation','TLS prepares encryption and data formatting.','Technology: TLS, encryption, encoding','Data'],
      5:['Session','The communicating applications maintain a conversation.','Function: session management','Data'],
      4:['Transport','TCP adds source/destination ports and reliable delivery controls.','Protocol: TCP • destination port 443','Segment'],
      3:['Network','IP adds hacker and target addresses; routers use this layer.','Device: router • 10.10.10.25 → 10.10.10.20','Packet'],
      2:['Data Link','The NIC builds a frame with local MAC information; a switch or Wi-Fi AP forwards it.','Devices: NIC, switch, wireless access point','Frame'],
      1:['Physical','Bits become electrical, light, or radio signals across the medium.','Devices/media: cable, fiber, antenna, repeater','Bits']
    },
    ping:{
      7:['Application','The ping utility asks to test reachability.','Application: ping','Data'],6:['Presentation','No special display formatting is needed for this simple request.','Function: data representation','Data'],5:['Session','The utility tracks the request and reply for this test.','Function: conversation tracking','Data'],4:['Transport','ICMP does not use TCP or UDP port numbers.','Note: no transport port','Message'],3:['Network','ICMP travels with IP addressing to the target.','Router • ICMP • 10.10.10.20','Packet'],2:['Data Link','The NIC and local network prepare and forward a frame.','NIC, switch/Wi-Fi, MAC addresses','Frame'],1:['Physical','Bits cross the medium as signals.','Cable/fiber/radio','Bits']
    },
    scan:{
      7:['Application','A safe simulated scanner checks whether HTTPS is listening.','Application: scanner','Data'],6:['Presentation','The test does not yet exchange encrypted web content.','Function: representation','Data'],5:['Session','The scanner tracks the connection attempt.','Function: session state','Data'],4:['Transport','TCP creates a SYN directed to port 443.','TCP SYN • destination port 443','Segment'],3:['Network','IP addresses identify hacker and target; routers forward the packet.','Router • 10.10.10.25 → 10.10.10.20','Packet'],2:['Data Link','NIC and switch/Wi-Fi use local frame and MAC information.','NIC, switch, wireless AP','Frame'],1:['Physical','The frame becomes a stream of bits carried by signals.','Cable/fiber/radio','Bits']
    }
  };
  let osiSequence=[],osiIndex=0;
  function buildOsiSequence(scenario){
    const down=[7,6,5,4,3,2,1].map(layer=>({layer,direction:'down'}));
    const transit=[{layer:0,direction:'transit'}];
    const up=[1,2,3,4,5,6,7].map(layer=>({layer,direction:'up'}));
    return [...down,...transit,...up];
  }
  function renderOsi(reset=false){
    const stack=document.getElementById('osiStack'),detail=document.getElementById('osiDetail'),output=document.getElementById('osiOutput'),progress=document.getElementById('osiProgress'),scenarioEl=document.getElementById('osiScenario');
    if(!stack||!detail||!output||!progress||!scenarioEl)return;
    if(reset){osiSequence=buildOsiSequence(scenarioEl.value);osiIndex=0;}
    const item=osiSequence[osiIndex],scenario=scenarioEl.value;
    document.querySelectorAll('.osi-layer').forEach(x=>x.classList.remove('active','completed','receiving'));
    document.querySelectorAll('.osi-endpoint,.osi-transit').forEach(x=>x.classList.remove('active'));
    if(item.direction==='transit'){
      document.querySelector('.osi-transit')?.classList.add('active');
      detail.innerHTML='<h4>Across the network</h4><p>The frame leaves the local interface. Switches or Wi-Fi handle local delivery, routers forward by IP between networks, and the physical medium carries the bits as signals.</p><div class="osi-pdu"><b>Current form:</b> Bits/signals</div>';
    }else{
      const layerBtn=stack.querySelector('[data-osi-layer="'+item.layer+'"]');if(layerBtn)layerBtn.classList.add(item.direction==='up'?'receiving':'active');
      const d=osiLayers[scenario][item.layer];
      const directionText=item.direction==='down'?'Encapsulation at hacker':'Decapsulation at target';
      detail.innerHTML='<h4>Layer '+item.layer+': '+d[0]+'</h4><p>'+d[1]+'</p><p><b>'+d[2]+'</b></p><div class="osi-pdu"><b>'+directionText+' • PDU:</b> '+d[3]+'</div>';
      const endpoint=document.querySelector(item.direction==='down'?'.osi-endpoint:not(.target)':'.osi-endpoint.target');if(endpoint)endpoint.classList.add('active');
    }
    progress.hidden=false;detail.hidden=false;output.hidden=false;
    progress.innerHTML='<b>Step '+(osiIndex+1)+' of '+osiSequence.length+'</b><span>'+(item.direction==='down'?'Sending: moving down the OSI model':item.direction==='up'?'Receiving: moving up the OSI model':'Signals crossing the fictional network')+'</span>';
    output.innerHTML=osiIndex===osiSequence.length-1?'<b>Complete:</b> The target application rebuilt and interpreted the request. A response would repeat the process in the opposite direction.':'Select <b>Next layer</b> to continue.';
  }
  const osiStart=document.getElementById('osiStart');if(osiStart)osiStart.addEventListener('click',()=>{document.getElementById('osiControls').hidden=false;document.getElementById('osiStackWrap').hidden=false;osiStart.textContent='Restart simulation';renderOsi(true);});
  const osiNext=document.getElementById('osiNext');if(osiNext)osiNext.addEventListener('click',()=>{if(!osiSequence.length)renderOsi(true);else{osiIndex=Math.min(osiIndex+1,osiSequence.length-1);renderOsi();}});
  const osiReplay=document.getElementById('osiReplay');if(osiReplay)osiReplay.addEventListener('click',()=>renderOsi(true));
  const osiScenario=document.getElementById('osiScenario');if(osiScenario)osiScenario.addEventListener('change',()=>renderOsi(true));
  document.querySelectorAll('.osi-layer').forEach(btn=>btn.addEventListener('click',()=>{const layer=Number(btn.dataset.osiLayer),scenario=document.getElementById('osiScenario')?.value||'https',d=osiLayers[scenario][layer],detail=document.getElementById('osiDetail');if(detail){detail.hidden=false;detail.innerHTML='<h4>Layer '+layer+': '+d[0]+'</h4><p>'+d[1]+'</p><p><b>'+d[2]+'</b></p><div class="osi-pdu"><b>Typical PDU:</b> '+d[3]+'</div>';}}));
})();