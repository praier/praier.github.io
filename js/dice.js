(function(){
  const countEl = document.getElementById('playerCount');
  const button = document.getElementById('rollDice');
  const board = document.getElementById('diceBoard');
  if(!button || !board) return;

  function rand(){ return Math.floor(Math.random()*6)+1; }

  function renderBoard(count, rolling){
    board.innerHTML = '';
    for(let i=1;i<=count;i++){
      const card = document.createElement('div');
      card.className = 'dice-player-card' + (rolling ? ' is-rolling' : '');
      card.dataset.player = i;
      card.innerHTML = `
        <div class="player-name">플레이어 ${i}</div>
        <div class="dice-stage"><div class="dice-emoji">🎲</div></div>
        <div class="dice-number">?</div>
        <div class="dice-state">굴리는 중...</div>`;
      board.appendChild(card);
    }
  }

  function showResults(results){
    const high = Math.max(...results);
    [...board.children].forEach((card, idx)=>{
      const value = results[idx];
      const num = card.querySelector('.dice-number');
      const state = card.querySelector('.dice-state');
      card.classList.remove('is-rolling');
      card.classList.add('is-finished');
      num.textContent = value;
      state.textContent = value === high ? '🎉 최고 숫자!' : '결과 확인';
      if(value === high) card.classList.add('is-winner');
    });
  }

  button.addEventListener('click', ()=>{
    const count = Number(countEl.value) || 2;
    const results = Array.from({length:count}, rand);
    button.disabled = true;
    button.textContent = '주사위가 구르는 중...';
    renderBoard(count, true);
    const duration = 1200;
    setTimeout(()=>{
      showResults(results);
      button.disabled = false;
      button.textContent = '다시 굴리기';
    }, duration);
  });

  renderBoard(Number(countEl.value)||2, false);
  countEl.addEventListener('change', ()=>renderBoard(Number(countEl.value)||2, false));
})();
