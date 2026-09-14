(function(){
 const modeTabs=[...document.querySelectorAll('.mode-tab')];
 const rangeFields=[...document.querySelectorAll('.range-only')];
 const customWrap=document.getElementById('customWrap');
 const minEl=document.getElementById('min'),maxEl=document.getElementById('max'),countEl=document.getElementById('stickCount'),drawCountEl=document.getElementById('drawCount');
 const customEl=document.getElementById('customItems'),createBtn=document.getElementById('createSticks'),resetBtn=document.getElementById('resetSticks'),board=document.getElementById('stickBoard'),result=document.getElementById('numberResult'),message=document.getElementById('numberMessage'),resultsEl=document.getElementById('drawResults');
 if(!createBtn||!board)return;
 let mode='range',values=[],picked=new Set(),target=1,drawn=[];
 const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function setMode(m){mode=m;modeTabs.forEach(t=>t.classList.toggle('active',t.dataset.mode===m));rangeFields.forEach(x=>x.hidden=m!=='range');if(customWrap)customWrap.hidden=m!=='custom'}
 modeTabs.forEach(t=>t.addEventListener('click',()=>setMode(t.dataset.mode)));
 function sourceValues(){
   if(mode==='custom'){
     const items=customEl.value.split(/\n/).map(s=>s.trim()).filter(Boolean);
     return items.length>=2?shuffle(items.slice()).slice(0,16):null;
   }
   let min=Number(minEl.value),max=Number(maxEl.value),count=Math.max(2,Math.min(16,Number(countEl.value)||8));
   if(!Number.isFinite(min))min=1;if(!Number.isFinite(max))max=100;if(min>max)[min,max]=[max,min];
   return Array.from({length:count},()=>String(rand(min,max)));
 }
 function build(){
   const src=sourceValues();
   if(!src){message.textContent='직접 입력 모드에서는 2개 이상의 항목을 입력해 주세요.';return}
   values=shuffle(src.slice());picked.clear();drawn=[];target=Math.min(values.length,Math.max(1,Number(drawCountEl.value)||1));result.textContent='-';resultsEl.innerHTML='';message.textContent=`총 ${target}개를 원하는 막대에서 하나씩 골라보세요.`;board.innerHTML='';
   values.forEach((v,i)=>{const stick=document.createElement('button');stick.type='button';stick.className='lottery-stick';stick.style.setProperty('--tilt',`${(Math.random()*8-4).toFixed(2)}deg`);stick.style.setProperty('--delay',`${i*38}ms`);stick.innerHTML=`<span class="stick-top"></span><span class="stick-label">?</span><span class="stick-number">${esc(v)}</span>`;stick.addEventListener('click',()=>pick(i,stick));board.appendChild(stick);});
 }
 function pick(index,stick){
   if(picked.has(index)||drawn.length>=target)return;
   picked.add(index);stick.disabled=true;stick.classList.add('is-picked');result.textContent='';message.textContent='제비를 뽑았습니다!';
   setTimeout(()=>{
     const value=values[index];drawn.push(value);result.textContent=value;result.className='result-value result-pop';
     resultsEl.innerHTML=drawn.map((v,i)=>`<span><b>${i+1}</b> ${esc(v)}</span>`).join('');
     if(drawn.length<target)message.textContent=`${drawn.length}번째 결과입니다. ${target-drawn.length}개 더 뽑을 수 있어요.`;else message.textContent='설정한 뽑기 횟수를 모두 완료했습니다.';
     if(drawn.length>=target)[...board.children].forEach((b,j)=>{if(!picked.has(j))b.disabled=true});
   },560);
 }
 createBtn.addEventListener('click',build);resetBtn&&resetBtn.addEventListener('click',build);setMode('range');build();
})();
