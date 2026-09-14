(function(){
  const list = document.getElementById('optionList');
  const add = document.getElementById('addOption');
  const pick = document.getElementById('pickOption');
  const result = document.getElementById('pickResult');
  const wheel = document.getElementById('dartWheel');
  const dart = document.getElementById('dart');
  const status = document.getElementById('dartStatus');
  if(!list || !pick || !result || !wheel || !dart) return;

  let wheelAngle = 0;
  let running = false;
  const palette = ['#ffd166','#ff9f9f','#b8e1ff','#c9f7c5','#d8c1ff','#ffd3a5','#bfeee1','#f6c1e8'];

  function createRow(value=''){
    const row=document.createElement('div');
    row.className='picker-row';
    row.innerHTML=`<input class="option-input" type="text" placeholder="선택지 입력" value="${value.replaceAll('"','&quot;')}"><button class="remove-option" type="button" aria-label="선택지 삭제">×</button>`;
    row.querySelector('.remove-option').addEventListener('click',()=>{ row.remove(); ensureRows(); drawWheel(); });
    row.querySelector('.option-input').addEventListener('input',drawWheel);
    list.appendChild(row);
  }

  function ensureRows(){
    while(list.children.length<2) createRow('');
  }

  function options(){
    return [...list.querySelectorAll('.option-input')].map(x=>x.value.trim()).filter(Boolean);
  }

  function drawWheel(){
    const opts=options();
    const display=opts.length>=2?opts:['선택지 1','선택지 2','선택지 3','선택지 4'];
    wheel.innerHTML='';
    const n=display.length;
    display.forEach((text,i)=>{
      const slice=document.createElement('div');
      slice.className='dart-slice';
      slice.style.setProperty('--i',i);
      slice.style.setProperty('--n',n);
      slice.style.setProperty('--bg',palette[i%palette.length]);
      slice.innerHTML=`<span>${escapeHtml(text)}</span>`;
      wheel.appendChild(slice);
    });
    wheel.style.transform=`rotate(${wheelAngle}deg)`;
  }

  function escapeHtml(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

  function pickOption(){
    const opts=options();
    if(opts.length<2){ status.textContent='선택지를 2개 이상 입력해 주세요.'; return; }
    if(running) return;
    running=true;
    pick.disabled=true;
    status.textContent='다트를 던집니다!';
    result.textContent='결과 계산 중...';
    result.className='result-value';

    const chosenIndex=Math.floor(Math.random()*opts.length);
    const segment=360/opts.length;
    const targetCenter=chosenIndex*segment + segment/2;
    const normalized=((360-targetCenter)%360);
    const current=((wheelAngle%360)+360)%360;
    let delta=normalized-current;
    if(delta<40) delta+=360;
    const spins=4*360;
    wheelAngle += spins + delta;
    wheel.style.transition='transform 2.45s cubic-bezier(.15,.75,.15,1)';
    wheel.style.transform=`rotate(${wheelAngle}deg)`;

    dart.classList.remove('dart-throw');
    void dart.offsetWidth;
    dart.classList.add('dart-throw');

    setTimeout(()=>{
      result.textContent=opts[chosenIndex];
      result.className='result-value result-pop';
      status.textContent='🎯 명중!';
      running=false;
      pick.disabled=false;
    },2500);
  }

  add?.addEventListener('click',()=>{createRow('');drawWheel();});
  pick.addEventListener('click',pickOption);
  ['치킨','피자','햄버거','분식'].forEach(createRow);
  drawWheel();
})();
