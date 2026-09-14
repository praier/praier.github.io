document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("optionList");
  const add = document.getElementById("addOption");
  const pick = document.getElementById("pickOption");
  const result = document.getElementById("pickResult");

  function addRow(value="") {
    const row = document.createElement("div");
    row.className = "option-row";
    row.innerHTML = `<input type="text" placeholder="선택지를 입력하세요" value="${value.replaceAll('"','&quot;')}"><button class="btn ghost remove" type="button">삭제</button>`;
    row.querySelector(".remove").addEventListener("click", () => {
      if (list.children.length > 2) row.remove();
    });
    list.appendChild(row);
  }

  addRow("짜장면"); addRow("짬뽕"); addRow("돈까스");
  add.addEventListener("click", () => addRow());
  pick.addEventListener("click", () => {
    const options = [...list.querySelectorAll("input")].map(x => x.value.trim()).filter(Boolean);
    if (options.length < 2) {
      result.textContent = "선택지를 2개 이상 입력해 주세요.";
      return;
    }
    result.textContent = options[Math.floor(Math.random() * options.length)];
  });
});
