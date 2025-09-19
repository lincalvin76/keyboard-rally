let wpm, acc, score = 0;

let wpmDisplay = document.getElementById('wpm');
let accDisplay = document.getElementById('acc');
let scoreDisplay = document.getElementById('score');

function resetStats() {
    score = 0;
    acc = 0;
    wpm = 0;
    wpmDisplay.textContent = wpm;
    accDisplay.textContent = acc;
    scoreDisplay.textContent = score;
}

function addScore() {
    score++;
    scoreDisplay.textContent = score;
}

function setWPM() {
    const elapsedTime = (Date.now() - startTime) / 1000 / 60;
    wpm = Math.round((typedChars / 5) / elapsedTime);

    wpmDisplay.textContent = wpm;
}

function setAcc(word) {
    acc = ((word.length / typedChars) * 100);
    accDisplay.textContent = `${acc.toFixed(1)}%`;
}