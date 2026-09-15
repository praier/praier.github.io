'use strict';
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
const $ = id => document.getElementById(id);
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function randomInt(n) {
  if (!Number.isSafeInteger(n) || n < 1 || n > 4294967296) throw Error('Invalid range');
  const a = new Uint32Array(1), limit = 4294967296 - 4294967296 % n;
  do { crypto.getRandomValues(a); } while (a[0] >= limit);
  return a[0] % n;
}
function shuffle(values) {
  const a = [...values];
  for (let i = a.length - 1; i > 0; i--) { const j = randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const lines = text => text.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
function error(text) { $('error').textContent = text; }
function make(tag, className, text) {
  const el = document.createElement(tag); el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
const pill = text => make('span', 'picked', text);
async function motion(el, frames, options = {}) {
  if (!el || reduceMotion() || !el.animate) return;
  const anim = el.animate(frames, { duration: 1400, easing: 'cubic-bezier(.18,.7,.25,1)', ...options });
  try { await anim.finished; } catch (_) { /* Cancellation leaves the computed result available. */ }
}
let busy = false;
async function locked(action) {
  if (busy) return;
  busy = true; error('');
  const controls = [...document.querySelectorAll('.fields input, .fields select, .fields textarea, .fields button')];
  const states = controls.map(el => el.disabled);
  controls.forEach(el => el.disabled = true);
  document.querySelector('.workspace')?.setAttribute('aria-busy', 'true');
  try { await action(); }
  catch (_) { error('결과를 만들지 못했어요. 다시 시도해주세요.'); }
  finally {
    controls.forEach((el, i) => el.disabled = states[i]);
    document.querySelector('.workspace')?.setAttribute('aria-busy', 'false'); busy = false;
  }
}
// Face normals: front 1, top 2, right 3, left 4, bottom 5, back 6.
const faceRotations = [[0, 0], [90, 0], [0, 90], [0, -90], [-90, 0], [0, 180]];
const resultRotations = [[0, 0], [-90, 0], [0, -90], [0, 90], [90, 0], [0, 180]];
const pipPositions = [[5], [1, 9], [1, 5, 9], [1, 3, 7, 9], [1, 3, 5, 7, 9], [1, 3, 4, 6, 7, 9]];
function dieTransform(value, turns = 0) {
  const [x, y] = resultRotations[value - 1];
  return `rotateX(${x + turns * 360}deg) rotateY(${y + turns * 360}deg)`;
}
function makeDie(value, index) {
  const slot = make('div', 'die-slot');
  const mover = make('div', 'die-mover');
  const view = make('div', 'die-view');
  const cube = make('div', 'die-cube');
  for (let face = 1; face <= 6; face++) {
    const side = make('div', 'die-face'); side.dataset.face = face;
    const [x, y] = faceRotations[face - 1];
    side.style.transform = `rotateX(${x}deg) rotateY(${y}deg) translateZ(calc(var(--die-size) / 2))`;
    for (let pos = 1; pos <= 9; pos++) side.append(make('span', pipPositions[face - 1].includes(pos) ? 'pip on' : 'pip'));
    cube.append(side);
  }
  cube.style.transform = dieTransform(value);
  view.append(cube); mover.append(view); slot.append(mover, make('span', 'die-label', `${index + 1}번 참가자`));
  return { slot, mover, cube, value };
}
let dice = [];
function showDice(values) {
  $('dice-visual').hidden = false;
  dice = values.map(makeDie); $('dice-visual').replaceChildren(...dice.map(d => d.slot));
  $('dice-visual').classList.toggle('many-dice', values.length > 3);
}
if ($('roll')) {
  showDice(Array.from({ length: Number($('players').value) }, (_, i) => i ? 5 : 3));
  $('players').addEventListener('change', () => { showDice(Array.from({ length: Number($('players').value) }, (_, i) => i % 6 + 1)); $('result').textContent = '준비되면 주사위를 굴려주세요'; });
  $('roll').addEventListener('click', () => locked(async () => {
    const values = dice.map(() => randomInt(6) + 1);
    $('dice-visual').hidden = false;
    $('result').textContent = '주사위가 구르는 중…';
    await Promise.all(dice.map(async (d, i) => {
      const start = dieTransform(d.value), end = dieTransform(values[i], 3 + i % 2);
      d.cube.style.transform = end;
      await Promise.all([
        motion(d.cube, [{ transform: start }, { transform: end }], { duration: 1500 + i * 110 }),
        motion(d.mover, [
          { transform: 'translate(0, 0) rotateZ(0deg)' },
          { transform: `translate(${i % 2 ? 22 : -22}px, -45px) rotateZ(-15deg)`, offset: .25 },
          { transform: 'translate(10px, 4px) rotateZ(10deg)', offset: .62 },
          { transform: 'translate(-5px, -10px) rotateZ(-4deg)', offset: .79 },
          { transform: 'translate(0, 0) rotateZ(0deg)' }
        ], { duration: 1500 + i * 110, easing: 'ease-in-out' })
      ]);
      d.value = values[i]; d.cube.style.transform = dieTransform(values[i]);
    }));
    $('dice-visual').hidden = true;
    $('result').replaceChildren(...values.map((n, i) => pill(`${i + 1}번 참가자 · ${n}`)));
  }));
}
if ($('flip')) {
  const rotor = $('coin-rotor');
  // Thin stacked discs keep the coin's edge visible while it rotates edge-on.
  for (let z = -4; z <= 4; z++) { const edge = make('div', 'coin-edge'); edge.style.transform = `translateZ(${z}px)`; rotor.append(edge); }
  let angle = 0;
  $('flip').addEventListener('click', () => locked(async () => {
    const tail = randomInt(2), target = (Math.floor(angle / 360) + 6) * 360 + tail * 180;
    $('result').textContent = '동전이 회전하는 중…';
    const from = `rotateY(${angle}deg)`, to = `rotateY(${target}deg)`;
    rotor.style.transform = to;
    await motion(rotor, [
      { transform: `${from} rotateZ(0deg)` },
      { transform: `rotateY(${angle + 720}deg) rotateZ(-18deg)`, offset: .28 },
      { transform: `${to} rotateZ(0deg)` }
    ], { duration: 2100, easing: 'cubic-bezier(.12,.4,.18,1)' });
    angle = tail * 180; rotor.style.transform = `rotateY(${angle}deg)`;
    $('result').textContent = tail ? '뒷면' : '앞면';
  }));
}
if ($('mode')) {
  let picked = [], target = 0, picking = false;
  $('mode').addEventListener('change', () => { $('range').hidden = $('mode').value !== 'number'; $('text-input').hidden = $('mode').value !== 'text'; });
  $('prepare').addEventListener('click', () => {
    if (picking) return; error(''); let values; const count = Number($('count').value);
    if ($('mode').value === 'number') {
      const min = Number($('min').value), max = Number($('max').value);
      if (!$('min').value.trim() || !$('max').value.trim() || !Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) return error('최소값과 최대값을 올바른 정수로 입력해주세요.');
      if (max - min + 1 > 200) return error('숫자 범위는 200개 이내로 설정해주세요.');
      values = Array.from({ length: max - min + 1 }, (_, i) => String(min + i));
    } else {
      values = [...new Set(lines($('items').value))];
      if (values.some(x => x.length > 100)) return error('항목 하나는 100자 이내로 입력해주세요.');
    }
    if (!values.length || values.length > 200) return error('뽑을 항목을 1개 이상, 200개 이하로 입력해주세요.');
    if (!Number.isSafeInteger(count) || count < 1 || count > values.length) return error(`뽑을 개수는 1부터 ${values.length} 사이로 입력해주세요.`);
    picked = []; target = count; $('sticks').replaceChildren(); $('result').textContent = `${target}개의 제비를 골라주세요`;
    shuffle(values).forEach((value, i) => {
      const btn = make('button', 'stick'); btn.type = 'button';
      // Position is spoken to screen readers only; no visible numbers or result hints.
      btn.setAttribute('aria-label', `닫힌 제비 ${i + 1}, 뽑기`);
      btn.append(make('span', 'stick-fold'));
      btn.addEventListener('click', async () => {
        if (picking || btn.disabled || picked.length >= target) return;
        picking = true; btn.disabled = true; $('prepare').disabled = true;
        await motion(btn, [{ transform: 'rotateY(0deg) translateY(0)' }, { transform: 'rotateY(180deg) translateY(-8px)' }], { duration: 360 });
        btn.classList.add('opened'); btn.setAttribute('aria-label', '뽑은 제비'); picked.push(value);
        $('result').replaceChildren(...picked.map(pill), make('p', 'hint', `${picked.length} / ${target}개 뽑음${picked.length === target ? ' · 완료' : ''}`));
        if (picked.length === target) document.querySelectorAll('.stick').forEach(b => b.disabled = true);
        $('prepare').disabled = false; picking = false;
      });
      $('sticks').append(btn);
    });
  });
}
if ($('teams')) $('teams').addEventListener('click', () => {
  if (busy) return; error('');
  const names = lines($('participants').value), count = Number($('team-count').value);
  if (names.length < count) return error(`팀 수보다 적은 인원이에요. 최소 ${count}명을 입력해주세요.`);
  if (names.length > 200) return error('참가자는 최대 200명까지 입력할 수 있어요.');
  if (names.some(x => x.length > 100)) return error('이름은 100자 이내로 입력해주세요.');
  if (new Set(names).size !== names.length) return error('같은 이름이 있어요. 동명이인은 이름 뒤에 번호를 붙여주세요.');
  return locked(async () => {
    const ordered = shuffle(names), teams = Array.from({ length: count }, () => []);
    ordered.forEach((name, i) => teams[i % count].push(name));
    const deck = $('team-shuffle'); deck.hidden = false;
    deck.replaceChildren(...ordered.slice(0, 3).map(n => make('span', 'name-card', n)));
    $('result').textContent = '이름표를 섞고 있어요…';
    await Promise.all([...deck.children].map((card, i) => motion(card, [
      { transform: `translateX(${(i - 1) * 35}px) rotate(${(i - 1) * 12}deg)` },
      { transform: `translate(${(1 - i) * 80}px, -18px) rotate(${(1 - i) * 24}deg)`, offset: .35 },
      { transform: `translateX(${(i - 1) * 60}px) rotate(${(i - 1) * 8}deg)`, offset: .7 },
      { transform: 'translateX(0) rotate(0deg)' }
    ], { duration: 1000, easing: 'ease-in-out' })));
    deck.hidden = true;
    const cards = teams.map((team, i) => {
      const card = make('div', 'team-card');
      const list = make('div', 'team-members');
      card.append(make('h3', '', `${i + 1}팀 · ${team.length}명`), list);
      team.forEach(name => list.append(make('span', 'member', name)));
      return card;
    });
    $('result').replaceChildren(...cards); $('result').classList.add('teams-grid');
    $('result').setAttribute('aria-label', '팀 배정 완료');
    await Promise.all(cards.flatMap((card, i) => [...card.querySelector('.team-members').children].map((member, j) => motion(member, [
      { opacity: 0, transform: 'translate(18px, -14px) rotate(-5deg)' },
      { opacity: 1, transform: 'translate(0, 0) rotate(0deg)' }
    ], { duration: 350, delay: Math.min((j * count + i) * 65, 1000), fill: 'backwards' }))));
  });
});
