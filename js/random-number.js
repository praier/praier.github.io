(function(){
  const minEl=document.getElementById('min'), maxEl=document.getElementById('max'), sticksEl=document.getElementById('stickCount');
  const createBtn=document.getElementById('createSticks'), resetBtn=document.getElementById('resetSticks'), board=document.getElementById('stickBoard');
  const result=document.getElementById('numberResult'), message=document.getElementById('numberMessage');
  const customEl=document.getElementById('customItems');
  const modeTabs=[...document.querySelectorAll('.mode-tab')];
  if(!createBtn||!board||!result||!customEl) return;
  let values=[], picked=false, mode='range';
  const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

  function setMode(next){
    mode=next;
    modeTabs.forEach(t=>t.classList.toggle('active',t.dataset.mode===next));
    document.querySelectorAll('.range-only').forEach(x=>x.hidden=next!=='range');
    const custom=document.querySelector('.custom-only'); if(custom) custom.hidden=next!=='custom';
  }
  modeTabs.forEach(t=>t.addEventListener('click',()=>setMode(t.dataset.mode)));

  function sourceValues(){
    const count=Math.min(12,Math.max(4,Number(sticksEl.value)||8));
    if(mode==='custom'){
      const items=customEl.value.split(/\n/).map(x=>x.trim()).filter(Boolean);
      if(items.length<2) return null;
      return shuffle(items.slice(0, Math.max(items.length,count))).slice(0,count);
    }
    let min=Number(minEl.value), max=Number(maxEl.value);
    if(!Number.isFinite(min)) min=1; if(!Number.isFinite(max)) max=100; if(min>max)[min,max]=[max,min];
    return Array.from({length:count},()=>String(rand(min,max)));
  }

  function makeSticks(){
    const src=sourceValues();
    if(!src){message.textContent='직접 입력 모드에서는 2개 이상의 항목을 입력해 주세요.';return;}
    values=src; picked=false; result.textContent='-'; result.className='result-value';
    message.textContent='막대 하나를 골라보세요. 클릭하면 내용이 공개됩니다.';
    board.innerHTML='';
    values.forEach((value,i)=>{
      const stick=document.createElement('button'); stick.type='button'; stick.className='lottery-stick';
      stick.style.setProperty('--tilt',`${(Math.random()*8-4).toFixed(2)}deg`); stick.style.setProperty('--delay',`${i*45}ms`);
      stick.innerHTML=`<span class="stick-top"></span><span class="stick-label">?</span><span class="stick-number">${escapeHtml(value)}</span>`;
      stick.addEventListener('click',()=>pick(i,stick)); board.appendChild(stick);
    });
  }

  function pick(index,stick){
    if(picked)return; picked=true; [...board.children].forEach(b=>b.disabled=true); stick.classList.add('is-picked');
    setTimeout(()=>{result.textContent=values[index]; result.className='result-value result-pop'; message.textContent='선택한 제비의 내용이 공개됐습니다.'; [...board.children].forEach((b,i)=>{if(i!==index)b.classList.add('is-other');});},720);
  }
  function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  createBtn.addEventListener('click',makeSticks); resetBtn?.addEventListener('click',makeSticks); setMode('range'); makeSticks();
})();
