document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("flipCoin");
  const result = document.getElementById("coinResult");
  button.addEventListener("click", () => {
    const isHeads = Math.random() < 0.5;
    result.textContent = isHeads ? "앞면" : "뒷면";
  });
});
