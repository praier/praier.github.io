const diceFace = n => ["","⚀","⚁","⚂","⚃","⚄","⚅"][n];

document.addEventListener("DOMContentLoaded", () => {
  const count = document.getElementById("playerCount");
  const board = document.getElementById("diceBoard");
  const rollBtn = document.getElementById("rollDice");

  function renderPlayers() {
    board.innerHTML = "";
    for (let i = 1; i <= Number(count.value); i++) {
      board.insertAdjacentHTML("beforeend",
        `<div class="player"><div class="player-name">플레이어 ${i}</div><div class="die" data-player="${i}">⚄</div><div class="muted">아직 굴리지 않음</div></div>`
      );
    }
  }
  count.addEventListener("change", renderPlayers);
  renderPlayers();

  rollBtn.addEventListener("click", () => {
    const results = [];
    board.querySelectorAll(".player").forEach((card, index) => {
      const value = Math.floor(Math.random() * 6) + 1;
      results.push({index, value});
      card.querySelector(".die").textContent = diceFace(value);
      card.querySelector(".muted").textContent = `${value}이 나왔습니다.`;
    });
    const max = Math.max(...results.map(r => r.value));
    results.filter(r => r.value === max).forEach(r => {
      board.children[r.index].querySelector(".muted").textContent = `${max} — 가장 높은 숫자`;
    });
  });
});
