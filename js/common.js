document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.querySelector('.menu-button');
  const nav=document.querySelector('.nav-links');
  if(btn&&nav) btn.addEventListener('click',()=>nav.classList.toggle('open'));
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
});
