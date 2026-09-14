(function(){
 const namesEl=document.getElementById('names'),teamCountEl=document.getElementById('teamCount'),button=document.getElementById('makeTeams'),result=document.getElementById('teamResult');
 if(!namesEl||!teamCountEl||!button||!result)return;
 const escapeHtml=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 button.addEventListener('click',()=>{
   const names=namesEl.value.split(/\n|,/).map(s=>s.trim()).filter(Boolean);
   const count=Math.max(2,Math.min(8,Number(teamCountEl.value)||2));
   if(names.length<count){result.innerHTML='<p class="muted">참가자는 팀 수보다 많거나 같아야 합니다.</p>';return}
   button.disabled=true;button.textContent='섞는 중…';
   result.innerHTML=`<div class="team-shuffle-scene"><div class="shuffle-ring">${names.slice(0,12).map((n,i)=>`<span style="--i:${i}">${escapeHtml(n)}</span>`).join('')}</div><div class="shuffle-caption">참가자를 섞고 있어요…</div></div>`;
   const mixed=shuffle(names.slice());const teams=Array.from({length:count},()=>[]);mixed.forEach((name,i)=>teams[i%count].push(name));
   setTimeout(()=>{
     result.innerHTML='<div class="team-results">'+teams.map((team,i)=>`<section class="team-card" style="--team-delay:${i*130}ms"><h3>팀 ${i+1}</h3><div class="team-members">${team.map((name,j)=>`<div class="member-chip" style="--member-delay:${j*90}ms">${escapeHtml(name)}</div>`).join('')}</div></section>`).join('')+'</div>';
     requestAnimationFrame(()=>{result.querySelectorAll('.team-card').forEach(e=>e.classList.add('team-card-show'));result.querySelectorAll('.member-chip').forEach(e=>e.classList.add('member-chip-show'));});
     button.disabled=false;button.textContent='다시 팀 나누기';
   },1300);
 });
})();
