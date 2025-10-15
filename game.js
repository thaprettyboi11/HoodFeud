let current = 0;
let scoreA = 0;
let scoreB = 0;
let strikes = 0;
let timer;
let fuse;
let musicPlayed = false;

function playIntroMusic() {
  if (!musicPlayed) {
    document.getElementById("intro").play();
    musicPlayed = true;
  }
}

function startGame() {
  document.getElementById("intro").pause();
  document.getElementById("intro").currentTime = 0;
  loadQuestion();
}

function loadQuestion() {
  const q = questions[current];
  document.getElementById("question").textContent = q.question;
  const answerList = document.getElementById("answers");
  answerList.innerHTML = "";
  q.answers.forEach((a, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ______`;
    answerList.appendChild(li);
  });
  fuse = new Fuse(q.answers, { keys: ["text"], threshold: 0.4 });
  document.getElementById("strikes").textContent = "";
  document.getElementById("timer").textContent = "";
  if (q.type === "lightning") startTimer(q);
}

function startTimer(q) {
  let time = current === 1 ? 20 : 25;
  document.getElementById("timer").textContent = `⏱️ ${time}s`;
  timer = setInterval(() => {
    time--;
    document.getElementById("timer").textContent = `⏱️ ${time}s`;
    if (time <= 0) clearInterval(timer);
  }, 1000);
}

function submitGuess() {
  const input = document.getElementById("guess").value.trim();
  const q = questions[current];
  const match = fuse.search(input)[0];
  if (match && !match.item.revealed) {
    match.item.revealed = true;
    const index = q.answers.indexOf(match.item);
    document.querySelectorAll("#answers li")[index].textContent = `${index + 1}. ${match.item.text} - ${match.item.points} pts`;
    document.getElementById("reveal").play();
    if (q.type === "lightning") {
      scoreA += match.item.points;
      document.getElementById("scoreA").textContent = scoreA;
    }
  } else {
    document.getElementById("buzz").play();
    strikes++;
    document.getElementById("strikes").textContent += "❌";
    if (strikes >= 3) alert("3 strikes! Other team gets the points.");
  }
  document.getElementById("guess").value = "";
}

function nextRound() {
  clearInterval(timer);
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    alert("Game over!");
  }
}
