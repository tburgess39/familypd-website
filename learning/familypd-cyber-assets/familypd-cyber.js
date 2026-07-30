
const FPD = (() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function initRevealCards() {
    $$('.reveal-card > button').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.reveal-card');
        const open = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

  function initSingleChoiceQuiz(root=document) {
    $$('.question', root).forEach(q => {
      $$('.option', q).forEach(btn => {
        btn.addEventListener('click', () => {
          if (q.dataset.locked === '1') return;
          const correct = btn.dataset.choice === q.dataset.answer;
          const feedback = $('.feedback', q);
          $$('.option', q).forEach(x => x.classList.remove('correct','incorrect'));
          btn.classList.add(correct ? 'correct' : 'incorrect');
          if (correct) {
            q.dataset.locked = '1';
            $$('.option', q).forEach(x => x.disabled = true);
            feedback.textContent = q.dataset.correctFeedback || 'Correct.';
            feedback.className = 'feedback good';
          } else {
            feedback.textContent = btn.dataset.feedback || q.dataset.wrongFeedback || 'Look again at the clue.';
            feedback.className = 'feedback try';
          }
          updateScore(root);
        });
      });
    });
  }

  function updateScore(root=document) {
    const questions = $$('.question', root);
    if (!questions.length) return;
    const answered = questions.filter(q => q.dataset.locked === '1').length;
    const score = $('.score', root);
    if (score) score.textContent = `Answers revealed: ${answered} / ${questions.length}`;
  }

  function resetQuiz(root=document) {
    $$('.question', root).forEach(q => {
      q.dataset.locked = '0';
      $$('.option', q).forEach(x => {
        x.disabled = false;
        x.classList.remove('correct','incorrect');
      });
      const f = $('.feedback', q);
      if (f) { f.textContent = ''; f.className = 'feedback'; }
    });
    updateScore(root);
    root.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function initResetButtons() {
    $$('[data-reset-quiz]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.querySelector(btn.dataset.resetQuiz);
        if (target) resetQuiz(target);
      });
    });
  }

  function initComponentCards() {
    const detail = $('#componentDetail');
    const parts = window.FPD_COMPONENTS || {};
    $$('.component').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.component').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        const item = parts[btn.dataset.part];
        if (detail && item) detail.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p><p><b>Security connection:</b> ${item.security}</p>`;
      });
    });
  }

  function initPorts() {
    const detail = $('#portDetail');
    const ports = window.FPD_PORTS || {};
    $$('.port').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.port').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        const p = ports[btn.dataset.port];
        if (detail && p) detail.innerHTML = `<h3>${p.name} — port ${btn.dataset.port}</h3><p>${p.use}</p><p><b>Defender view:</b> ${p.security}</p>`;
      });
    });
  }

  function initConverter() {
    const dec=$('#decimal'), bin=$('#binary'), hex=$('#hexadecimal'), status=$('#converterStatus');
    if (!dec || !bin || !hex) return;
    let changing=false;
    function show(n){
      if (!Number.isSafeInteger(n) || n < 0) {
        status.textContent='Use a whole number from 0 through 9,007,199,254,740,991.';
        return;
      }
      changing=true;
      dec.value=String(n); bin.value=n.toString(2); hex.value=n.toString(16).toUpperCase();
      status.textContent=`${n} in decimal = ${bin.value} in binary = ${hex.value} in hexadecimal.`;
      changing=false;
    }
    dec.addEventListener('input',()=>{if(changing)return;const v=dec.value.trim();if(v==='')return;show(Number(v))});
    bin.addEventListener('input',()=>{if(changing)return;const v=bin.value.trim();if(!/^[01]+$/.test(v)){status.textContent='Binary uses only 0 and 1.';return;}show(parseInt(v,2))});
    hex.addEventListener('input',()=>{if(changing)return;const v=hex.value.trim();if(!/^[0-9a-f]+$/i.test(v)){status.textContent='Hexadecimal uses 0–9 and A–F.';return;}show(parseInt(v,16))});
    show(42);
  }

  function initGlossary() {
    const input=$('#glossarySearch');
    if (!input) return;
    input.addEventListener('input',()=>{
      const q=input.value.trim().toLowerCase();
      $$('.term').forEach(t=>t.hidden=!t.textContent.toLowerCase().includes(q));
    });
  }

  function initTerminal() {
    const input=$('#termIn'), output=$('#termOut'), run=$('#runCmd');
    if(!input || !output || !run) return;
    const outputs = {
      'pwd':'/home/victimpi',
      'ls':'Documents  Downloads  linux-lab  notes.txt',
      'ls -la':'drwxr-xr-x  5 victimpi victimpi 4096 .\ndrwxr-xr-x  3 root     root     4096 ..\ndrwxr-xr-x  2 victimpi victimpi 4096 Documents\ndrwxr-xr-x  2 victimpi victimpi 4096 Downloads\ndrwxr-xr-x  3 victimpi victimpi 4096 linux-lab\n-rw-r--r--  1 victimpi victimpi   77 notes.txt',
      'lsblk':'NAME         SIZE FSTYPE MOUNTPOINTS\nmmcblk0       32G\n├─mmcblk0p1  512M vfat   /boot/firmware\n└─mmcblk0p2 31.5G ext4   /\nsda           16G\n└─sda1        16G exfat  /media/victimpi/CLASS_USB',
      'df -h':'Filesystem       Size  Used Avail Use% Mounted on\n/dev/mmcblk0p2   31G   11G   19G  37% /\n/dev/sda1        16G  4.2G   12G  27% /media/victimpi/CLASS_USB',
      'mount':'/dev/mmcblk0p2 on / type ext4 (rw,relatime)\n/dev/sda1 on /media/victimpi/CLASS_USB type exfat (rw,nosuid,nodev)',
      'cat notes.txt':'Read-only exploration: identify the USB device, its file system, mount point, and available space.',
      'clear':'__CLEAR__'
    };
    function exec(cmd){
      cmd=cmd.trim();
      if(!cmd)return;
      const result=outputs[cmd] || 'That command is not included in this safe simulator. Try: pwd, ls, ls -la, lsblk, df -h, mount, cat notes.txt, or clear.';
      if(result==='__CLEAR__') output.textContent='';
      else output.textContent += `\nvictimpi@lab:~$ ${cmd}\n${result}\n`;
      output.scrollTop=output.scrollHeight;
      input.value='';
    }
    run.addEventListener('click',()=>exec(input.value));
    input.addEventListener('keydown',e=>{if(e.key==='Enter')exec(input.value)});
    $$('[data-cmd]').forEach(btn=>btn.addEventListener('click',()=>exec(btn.dataset.cmd)));
  }

  function initFacts() {
    const facts=$('#browserFacts');
    if(!facts)return;
    const rows=[
      ['Page opened',new Date().toLocaleString()],
      ['Language',navigator.language || 'Not exposed'],
      ['Time zone',Intl.DateTimeFormat().resolvedOptions().timeZone || 'Not exposed'],
      ['Screen size',`${screen.width} × ${screen.height} pixels`],
      ['Viewport',`${innerWidth} × ${innerHeight} pixels`],
      ['Touch points',String(navigator.maxTouchPoints ?? 'Not exposed')],
      ['CPU threads',String(navigator.hardwareConcurrency ?? 'Not exposed')],
      ['Approx. device memory',navigator.deviceMemory ? `${navigator.deviceMemory} GB (approx.)` : 'Not exposed'],
      ['Online status',navigator.onLine ? 'Browser reports online' : 'Browser reports offline'],
      ['Referring page',document.referrer || 'None supplied'],
      ['Current address',location.href],
      ['Browser identifier',navigator.userAgent || 'Not exposed']
    ];
    const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    facts.innerHTML=rows.map(([k,v])=>`<div class="fact"><b>${esc(k)}</b><code>${esc(v)}</code></div>`).join('');
  }


  function initVersionQuestions() {
    $$('[data-version-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.version-question');
        if (!card) return;
        $$('.option', card).forEach(x => x.classList.remove('correct','incorrect'));
        btn.classList.add('correct');
        const feedback = $('[data-version-feedback]', card);
        if (feedback) {
          feedback.textContent = 'Use the live Tony Stark challenge to verify this item. The public answer copy shows these choices but does not reliably preserve the selected range, so this exploration does not guess.';
          feedback.className = 'feedback good';
        }
      });
    });
  }

  function initCredentialDemo() {
    const button=$('#fakeSignIn'), consoleBox=$('#console');
    if(!button || !consoleBox)return;
    button.addEventListener('click',()=>{
      const u=$('#fakeUser').value, p=$('#fakePass').value;
      consoleBox.textContent=`PRACTICE CAPTURE\nusername: ${u}\npassword: ${p}\n\nNo authentication occurred. The local page simply displayed the fixed practice values.`;
    });
  }

  return {
    init(){
      initRevealCards(); initSingleChoiceQuiz(); initResetButtons(); initComponentCards();
      initPorts(); initConverter(); initGlossary(); initTerminal(); initFacts(); initVersionQuestions(); initCredentialDemo();
    }
  };
})();
document.addEventListener('DOMContentLoaded',()=>FPD.init());
