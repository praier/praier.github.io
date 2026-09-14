(function(){
  const countEl=document.getElementById('playerCount');
  const button=document.getElementById('rollDice');
  const board=document.getElementById('diceBoard');
  const summary=document.getElementById('diceSummary');
  if(!countEl||!button||!board||!summary)return;

  const pipMap={1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};
  const finalRotation={1:'rotateX(0deg) rotateY(0deg)',2:'rotateX(90deg) rotateY(0deg)',3:'rotateX(0deg) rotateY(-90deg)',4:'rotateX(0deg) rotateY(90deg)',5:'rotateX(-90deg) rotateY(0deg)',6:'rotateX(0deg) rotateY(180deg)'};
  const rand=()=>Math.floor(Math.random()*6)+1;
  const escapeHtml=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const pips=n=>pipMap[n].map(pos=>`<span class="pip pip-${pos}"></span>`).join('');
  function cube(){return `<div class="die-cube"><div class="die-face die-front">${pips(1)}</div><div class="die-face die-back">${pips(6)}</div><div class="die-face die-right">${pips(3)}</div><div class="die-face die-left">${pips(4)}</div><div class="die-face die-top">${pips(5)}</div><div class="die-face die-bottom">${pips(2)}</div></div>`}
  function render(count){
    board.innerHTML='';
    for(let i=1;i<=count;i++){
      const card=document.createElement('article');
      card.className='dice-player-card';
      card.innerHTML=`<div class="player-name">플레이어 ${i}</div><div class="dice-stage"><div class="rolling-shadow"></div><div class="dice-cube-wrap">${cube()}</div></div><div class="dice-result-top">—</div><div class="dice-state">굴릴 준비 완료</div>`;
      board.appendChild(card);
    }
  }
  function roll(){
    const count=Math.max(2,Math.min(10,Number(countEl.value)||2));
    const results=Array.from({length:count},rand);
    render(count);
    button.disabled=true;
    button.textContent='🎲 주사위 굴리는 중…';
    summary.textContent='주사위가 굴러가고 있습니다…';
    [...board.children].forEach((card,i)=>{
      card.classList.add('is-rolling');
      const cubeEl=card.querySelector('.die-cube');
      cubeEl.style.setProperty('--final-transform',finalRotation[results[i]]);
      card.querySelector('.dice-state').textContent='굴러가는 중…';
    });
    setTimeout(()=>{
      const high=Math.max(...results);
      [...board.children].forEach((card,i)=>{
        const v=results[i];
        const cubeEl=card.querySelector('.die-cube');
        const top=card.querySelector('.dice-result-top');
        card.classList.remove('is-rolling');
        cubeEl.classList.add('dice-final');
        cubeEl.style.setProperty('--final-transform',finalRotation[v]);
        top.textContent=v;
        top.classList.add('result-pop');
        card.querySelector('.dice-state').textContent=v===high?'최고 숫자!':'결과 확인';
        if(v===high)card.classList.add('is-winner');
      });
      const winners=results.map((v,i)=>v===high?`플레이어 ${i+1}`:null).filter(Boolean).join(', ');
      summary.textContent=`최고 결과 ${high} · ${winners}`;
      summary.classList.add('summary-show');
      button.disabled=false;
      button.textContent='🎲 다시 굴리기';
    },1550);
  }
  countEl.addEventListener('change',()=>render(Number(countEl.value)||2));
  button.addEventListener('click',roll);
  render(Number(countEl.value)||2);
})();
