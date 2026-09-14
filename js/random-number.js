document.addEventListener("DOMContentLoaded", () => {
  const min = document.getElementById("min");
  const max = document.getElementById("max");
  const quantity = document.getElementById("quantity");
  const unique = document.getElementById("unique");
  const button = document.getElementById("generate");
  const result = document.getElementById("numberResult");
  const message = document.getElementById("numberMessage");

  button.addEventListener("click", () => {
    const a = Number(min.value), b = Number(max.value), q = Number(quantity.value);
    if (!Number.isInteger(a) || !Number.isInteger(b) || a > b || q < 1 || q > 20) {
      message.textContent = "최소값·최대값·개수를 올바르게 입력해 주세요.";
      return;
    }
    if (unique.checked && q > b - a + 1) {
      message.textContent = "중복 없이 뽑으려면 요청한 개수가 범위의 숫자 개수보다 작거나 같아야 합니다.";
      return;
    }
    const values = [];
    while (values.length < q) {
      const v = Math.floor(Math.random() * (b - a + 1)) + a;
      if (!unique.checked || !values.includes(v)) values.push(v);
    }
    result.textContent = values.join(", ");
    message.textContent = `${a}부터 ${b} 사이에서 ${q}개를 생성했습니다.`;
  });
});
