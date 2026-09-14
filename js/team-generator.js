document.addEventListener("DOMContentLoaded", () => {
  const names = document.getElementById("names");
  const teamCount = document.getElementById("teamCount");
  const button = document.getElementById("makeTeams");
  const result = document.getElementById("teamResult");

  button.addEventListener("click", () => {
    const people = names.value.split(/\r?\n|,/).map(x => x.trim()).filter(Boolean);
    const n = Number(teamCount.value);
    if (people.length < 2) {
      result.innerHTML = "<p>참가자를 2명 이상 입력해 주세요.</p>";
      return;
    }
    if (!Number.isInteger(n) || n < 2 || n > people.length) {
      result.innerHTML = "<p>팀 수를 참가자 수에 맞게 입력해 주세요.</p>";
      return;
    }
    for (let i = people.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [people[i], people[j]] = [people[j], people[i]];
    }
    const teams = Array.from({length:n}, () => []);
    people.forEach((person, i) => teams[i % n].push(person));
    result.innerHTML = teams.map((team, i) =>
      `<div class="team"><strong>${i+1}팀</strong><ul>${team.map(p => `<li>${p.replaceAll("<","&lt;")}</li>`).join("")}</ul></div>`
    ).join("");
  });
});
