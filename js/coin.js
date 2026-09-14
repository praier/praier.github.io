(function(){
 const button=document.getElementById('flipCoin'), result=document.getElementById('coinResult'), coin=document.getElementById('coinVisual'), hand=document.getElementById('coinHand');
 if(!button||!result||!coin||!hand)return;
 let busy=false;
 function flip(){
   if(busy)return;
   busy=true;
   const heads=Math.random()<0.5;
   button.disabled=true;
   button.textContent='🪙 튕기는 중…';
   result.textContent='동전을 튕기는 중…';
   result.className='result-value coin-result-wait';
   coin.className='coin-visual';
   hand.classList.remove('flick');
   void coin.offsetWidth;
   void hand.offsetWidth;
   hand.classList.add('flick');
   coin.style.setProperty('--coin-duration','1.8s');
   coin.style.setProperty('--coin-final',heads?'rotateY(0deg)':'rotateY(180deg)');
   coin.classList.add('toss');
   setTimeout(()=>{
     coin.classList.remove('toss');
     coin.style.transform=heads?'translate(228px,18px) rotateY(0deg)':'translate(228px,18px) rotateY(180deg)';
     result.textContent=heads?'앞면':'뒷면';
     result.className='result-value coin-result-show';
     button.disabled=false;
     button.textContent='🪙 다시 던지기';
     busy=false;
   },1850);
 }
 button.addEventListener('click',flip);
})();
