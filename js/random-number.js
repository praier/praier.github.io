(function(){
  const minEl = document.getElementById('min');
  const maxEl = document.getElementById('max');
  const sticksEl = document.getElementById('stickCount');
  const createBtn = document.getElementById('createSticks');
  const resetBtn = document.getElementById('resetSticks');
  const board = document.getElementById('stickBoard');
  const result = document.getElementById('numberResult');
  const message = document.getElementById('numberMessage');
  if(!createBtn || !board) return;

  let values = [];
  let picked = false;

  function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  function validRange(){
    let min = Number(minEl.value), max = Number(maxEl.value);
    if(!Number.isFinite(min)) min=1;
    if(!Number.isFinite(max)) max=100;
    if(min>max) [min,max]=[max,min];
    return {min,max};
  }

  function makeSticks(){
    const {min,max} = validRange();
    const count = Math.min(12, Math.max(4, Number(sticksEl.value)||8));
    values = Array.from({length:count},()=>randomInt(min,max));
    picked = false;
    result.textContent = '-';
    result.className = 'result-value';
    message.textContent = '막대 하나를 골라보세요. 클릭하면 숫자가 공개됩니다.';
    board.innerHTML='';
    values.forEach((value,i)=>{
      const stick = document.createElement('button');
      stick.type='button';
      stick.className='lottery-stick';
      stick.style.setProperty('--tilt', `${(Math.random()*8-4).toFixed(2)}deg`);
      stick.style.setProperty('--delay', `${i*45}ms`);
      stick.innerHTML = `<span class="stick-top"></span><span class="stick-label">?</span><span class="stick-number">${value}</span>`;
      stick.addEventListener('click',()=>pick(i,stick));
      board.appendChild(stick);
    });
  }

  function pick(index, stick){
    if(picked) return;
    picked = true;
    [...board.children].forEach(b=>b.disabled=true);
    stick.classList.add('is-picked');
    setTimeout(()=>{
      const value = values[index];
      result.textContent = value;
      result.className = 'result-value result-pop';
      message.textContent = '선택한 제비의 숫자가 공개됐습니다.';
      [...board.children].forEach((b,i)=>{ if(i!==index) b.classList.add('is-other'); });
    }, 720);
  }

  createBtn.addEventListener('click',makeSticks);
  resetBtn?.addEventListener('click',makeSticks);
  makeSticks();
})();
