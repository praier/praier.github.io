(function(){
  const button = document.getElementById('flipCoin');
  const result = document.getElementById('coinResult');
  const coin = document.getElementById('coinVisual');
  const hand = document.getElementById('coinHand');
  if(!button || !result || !coin) return;

  function flip(){
    const isHeads = Math.random() < 0.5;
    button.disabled = true;
    result.textContent = '동전이 날아가는 중...';
    result.className = 'result-value coin-result-wait';
    coin.classList.remove('coin-land');
    hand?.classList.remove('hand-flick');
    void coin.offsetWidth;
    void (hand?.offsetWidth || 0);
    hand?.classList.add('hand-flick');
    coin.className = 'coin-visual ' + (isHeads ? 'final-heads' : 'final-tails');
    coin.classList.add('coin-flipping');

    setTimeout(()=>{
      coin.classList.remove('coin-flipping');
      coin.classList.add('coin-land');
      result.textContent = isHeads ? '앞면' : '뒷면';
      result.className = 'result-value coin-result-show';
      button.disabled = false;
      button.textContent = '다시 던지기';
    }, 1450);
  }

  button.addEventListener('click', flip);
})();
