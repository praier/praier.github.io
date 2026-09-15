(function(){
  const namesEl=document.getElementById('names');
  const teamCountEl=document.getElementById('teamCount');
  const button=document.getElementById('makeTeams');
  const result=document.getElementById('teamResult');
  if(!namesEl||!teamCountEl||!button||!result) return;

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function renderTeams(teams){
    result.innerHTML='<div class="team-results">'+teams.map((team,i)=>`
      <section class="team-card" style="--team-delay:${i*130}ms">
        <h3>팀 ${i+1}</h3>
        <div class="team-members">${team.map((name,j)=>`<div class="member-chip" style="--member-delay:${j*90}ms">${escapeHtml(name)}</div>`).join('')}</div>
      </section>`).join('')+'</div>';
    requestAnimationFrame(()=>{
      result.querySelectorAll('.team-card').forEach(x=>x.classList.add('team-card-show'));
      result.querySelectorAll('.member-chip').forEach(x=>x.classList.add('member-chip-show'));
    });
  }
  function escapeHtml(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

  button.addEventListener('click',()=>{
    const names=namesEl.value.split(/\n|,/).map(s=>s.trim()).filter(Boolean);
    const teamCount=Number(teamCountEl.value)||2;
    if(names.length<teamCount){ result.innerHTML='<p class="muted">팀 수보다 참가자가 많거나 같아야 합니다.</p>'; return; }
    button.disabled=true;
    button.textContent='섞는 중...';
    result.innerHTML=`<div class="team-shuffle-scene"><div class="shuffle-ring">${names.slice(0,12).map((n,i)=>`<span style="--i:${i}">${escapeHtml(n)}</span>`).join('')}</div><div class="shuffle-caption">참가자를 섞고 있어요...</div></div>`;
    const mixed=shuffle([...names]);
    const teams=Array.from({length:teamCount},()=>[]);
    mixed.forEach((name,i)=>teams[i%teamCount].push(name));
    setTimeout(()=>{
      renderTeams(teams);
      button.disabled=false;
      button.textContent='다시 팀 나누기';
    },1500);
  });
})();
