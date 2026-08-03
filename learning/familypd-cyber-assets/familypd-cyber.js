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
            feedback.textContent = btn.dataset.feedback || q.dataset.wrongFeedback || `Not quite. Try another answer.`;
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
      {n:1,src:'10.10.10.25 (hacker)',dst:'10.10.10.1',proto:'DNS',info:'Standard query A target.lab',tags:['dns','target'],why:'The hacker machine asks DNS for the address associated with target.lab.'},
      {n:2,src:'10.10.10.1',dst:'10.10.10.25 (hacker)',proto:'DNS',info:'Standard query response A 10.10.10.20',tags:['dns','target'],why:'DNS responds that target.lab uses the fictional address 10.10.10.20.'},
      {n:3,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TCP',info:'52344 → 443 [SYN]',tags:['tcp','target','443'],why:'The client begins a TCP three-way handshake with target port 443.'},
      {n:4,src:'10.10.10.20 (target)',dst:'10.10.10.25 (hacker)',proto:'TCP',info:'443 → 52344 [SYN, ACK]',tags:['tcp','target','443'],why:'The target acknowledges the connection request and responds.'},
      {n:5,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TCP',info:'52344 → 443 [ACK]',tags:['tcp','target','443'],why:'The final ACK completes the fictional TCP handshake.'},
      {n:6,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TLS',info:'Client Hello',tags:['tls','target','443'],why:'The client proposes TLS settings for an encrypted session.'},
      {n:7,src:'10.10.10.20 (target)',dst:'10.10.10.25 (hacker)',proto:'TLS',info:'Server Hello, Certificate',tags:['tls','target','443'],why:'The target selects TLS settings and sends a fictional certificate.'},
      {n:8,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'TLS',info:'Application Data (encrypted)',tags:['tls','target','443'],why:'The payload is represented as encrypted TLS application data.'},
      {n:9,src:'10.10.10.25 (hacker)',dst:'10.10.10.20 (target)',proto:'HTTP',info:'POST /login username=hacker&password=practice',tags:['http','target'],why:'This intentionally insecure fictional HTTP example shows why unencrypted credentials are dangerous.'}
    ];
    const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    function render(){const v=filter.value;const shown=packets.filter(p=>v==='all'||p.tags.includes(v)||p.proto.toLowerCase()===v);rows.innerHTML=shown.map(p=>`<tr tabindex="0" data-packet="${p.n}"><td>${p.n}</td><td>${esc(p.src)}</td><td>${esc(p.dst)}</td><td><b>${p.proto}</b></td><td>${esc(p.info)}</td></tr>`).join('');$$('[data-packet]',rows).forEach(row=>{const open=()=>{const p=packets.find(x=>x.n===Number(row.dataset.packet));detail.innerHTML=`<h3>Packet ${p.n}: ${p.proto}</h3><p><b>Source:</b> ${esc(p.src)}<br><b>Destination:</b> ${esc(p.dst)}<br><b>Info:</b> ${esc(p.info)}</p><p><b>What it means:</b> ${esc(p.why)}</p>`;$$('tr',rows).forEach(x=>x.classList.remove('selected'));row.classList.add('selected');};row.addEventListener('click',open);row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});}
    filter.addEventListener('change',render);render();
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
  const computerPaths={
    data:{open:['storage','motherboard','ram','cpu','gpu'],save:['cpu','ram','motherboard','storage'],web:['nic','motherboard','ram','cpu','gpu'],video:['storage','ram','cpu','gpu']},
    power:{open:['outlet','psu','motherboard','storage','ram','cpu','gpu'],save:['outlet','psu','motherboard','cpu','ram','storage'],web:['outlet','psu','motherboard','nic','ram','cpu','gpu'],video:['outlet','psu','motherboard','storage','ram','cpu','gpu']}
  };
  let computerMode='data', computerRun=0;
  async function runComputer(){
    const board=document.getElementById('computerFlowBoard'), out=document.getElementById('computerSimOutput'); if(!board||!out)return;
    const token=++computerRun, task=document.getElementById('computerTask').value, path=computerPaths[computerMode][task];
    board.hidden=false; out.hidden=false; board.querySelectorAll('.flow-node').forEach(n=>n.classList.remove('active','power-active'));
    const descriptions={open:'The picture is read from storage, copied into RAM, processed by the CPU, and sent to the display.',save:'The document is created and processed, held temporarily in RAM, then written to long-term storage.',web:'The network interface receives the response, RAM holds active data, the CPU processes it, and the browser displays it.',video:'Storage supplies the media, RAM buffers it, the CPU coordinates playback, and the GPU builds the frames.'};
    out.innerHTML='<b>Watch the highlighted path.</b> '+(computerMode==='power'?'Electrical energy is being distributed so each component can operate.':descriptions[task]);
    for(const id of path){if(token!==computerRun)return; const node=board.querySelector('[data-node="'+id+'"]'); if(node){node.classList.add(computerMode==='power'?'power-active':'active'); node.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});} await wait(650)}
    out.innerHTML+='<br><b>Complete:</b> '+(computerMode==='power'?'Power makes the work possible; it is not the information itself.':'The same underlying bits can represent instructions, text, image pixels, sound, addresses, or packet fields depending on context.');
  }
  const start=document.getElementById('computerSimStart'); if(start)start.addEventListener('click',()=>{document.querySelector('#computerFlowSimulator .sim-controls').hidden=false; start.textContent='Run again'; runComputer()});
  document.querySelectorAll('[data-computer-mode]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-computer-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');computerMode=b.dataset.computerMode;runComputer()}));
  const task=document.getElementById('computerTask'); if(task)task.addEventListener('change',runComputer); const replay=document.getElementById('computerSimReplay'); if(replay)replay.addEventListener('click',runComputer);

  const packetScenarios={
    https:[
      {hop:'app',title:'Browser creates a request',protocol:'HTTPS',port:'443',info:'The application asks for a secure web resource.'},
      {hop:'nic',title:'Network interface prepares signals',protocol:'TCP/TLS',port:'443',info:'The operating system adds protocol information and the NIC transmits the bits.'},
      {hop:'switch',title:'Local network forwards the frame',protocol:'Ethernet / Wi-Fi',port:'—',info:'Local delivery uses MAC-address information.'},
      {hop:'router',title:'Router forwards the packet',protocol:'IP',port:'443',info:'The router examines the destination IP and selects the next path.'},
      {hop:'target',title:'Target receives and responds',protocol:'HTTPS',port:'443',info:'The target reassembles the request, processes it, and sends encrypted response packets back.'}],
    ping:[{hop:'app',title:'Ping creates an echo request',protocol:'ICMP',port:'No port',info:'Ping uses ICMP rather than TCP or UDP ports.'},{hop:'nic',title:'NIC transmits the request',protocol:'ICMP',port:'No port',info:'The request leaves hacker at 10.10.10.25.'},{hop:'router',title:'Router forwards by IP',protocol:'IP/ICMP',port:'No port',info:'The destination is target at 10.10.10.20.'},{hop:'target',title:'Target sends an echo reply',protocol:'ICMP',port:'No port',info:'A reply suggests the fictional target is reachable in this simulation.'}],
    scan:[{hop:'app',title:'Scanner checks a service',protocol:'TCP',port:'443',info:'The simulator sends a fictional connection request to a selected port.'},{hop:'nic',title:'NIC sends the packet',protocol:'TCP SYN',port:'443',info:'Source 10.10.10.25 asks target 10.10.10.20 whether the service is listening.'},{hop:'router',title:'Router forwards the packet',protocol:'IP/TCP',port:'443',info:'IP identifies the target; the port identifies the service endpoint.'},{hop:'target',title:'Target responds',protocol:'TCP SYN-ACK',port:'443',info:'The fictional response indicates that HTTPS is open. Open does not automatically mean vulnerable.'}]
  };
  let packetIndex=0;
  function showPacket(reset=false){const route=document.getElementById('packetRoute'),card=document.getElementById('packetCard'),out=document.getElementById('packetSimOutput');if(!route||!card)return; if(reset)packetIndex=0; const scenario=document.getElementById('packetScenario').value,steps=packetScenarios[scenario],step=steps[packetIndex]; route.hidden=false;card.hidden=false;out.hidden=false;route.querySelectorAll('.route-node').forEach(n=>n.classList.remove('active'));const node=route.querySelector('[data-hop="'+step.hop+'"]');if(node){node.classList.add('active');node.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})}card.innerHTML='<h4>'+step.title+'</h4><div class="packet-field"><div><b>Source</b><br><code>10.10.10.25</code></div><div><b>Destination</b><br><code>10.10.10.20</code></div><div><b>Protocol</b><br>'+step.protocol+'</div><div><b>Port</b><br>'+step.port+'</div></div><p>'+step.info+'</p>';out.innerHTML='<b>Step '+(packetIndex+1)+' of '+steps.length+'.</b> '+(packetIndex===steps.length-1?'The response then travels back through the network so the application can use it.':'Select Next step to continue.');}
  const ps=document.getElementById('packetSimStart');if(ps)ps.addEventListener('click',()=>{document.getElementById('packetControls').hidden=false;ps.textContent='Restart simulation';showPacket(true)});
  const pn=document.getElementById('packetNext');if(pn)pn.addEventListener('click',()=>{const steps=packetScenarios[document.getElementById('packetScenario').value];packetIndex=(packetIndex+1)%steps.length;showPacket()});
  const pr=document.getElementById('packetReplay');if(pr)pr.addEventListener('click',()=>showPacket(true)); const psc=document.getElementById('packetScenario');if(psc)psc.addEventListener('change',()=>showPacket(true));
})();
