(function(){
  const button=document.getElementById('flipCoin');
  const result=document.getElementById('coinResult');
  const coin=document.getElementById('coinVisual');
  const hand=document.getElementById('coinHand');
  if(!button||!result||!coin||!hand) return;

  function flip(){
    const heads=Math.random()<0.5;
    button.disabled=true;
    result.textContent='탁! 동전이 날아가는 중...';
    result.className='result-value coin-result-wait';
    coin.classList.remove('coin-flipping','coin-land','show-heads','show-tails');
    hand.classList.remove('hand-flick');
    void coin.offsetWidth; void hand.offsetWidth;
    hand.classList.add('hand-flick');
    coin.classList.add(heads?'show-heads':'show-tails','coin-flipping');

    setTimeout(()=>{
      coin.classList.remove('coin-flipping');
      coin.classList.add('coin-land');
      result.textContent=heads?'앞면':'뒷면';
      result.className='result-value coin-result-show';
      button.disabled=false;
      button.textContent='🪙 다시 던지기';
    },1700);
  }
  button.addEventListener('click',flip);
})();
