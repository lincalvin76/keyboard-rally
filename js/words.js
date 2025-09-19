const usedWords = new Set();
let currentWord = "";
let typed = "";
let bigBall = false;
let start = true;
window.locked = false;

const wordDisplay = document.getElementById("wordDisplay");

const typeWriter = document.createElement("div");
typeWriter.id = "typeWrite";
wordDisplay.appendChild(typeWriter);

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

async function getRandomWord() {
    try {
        const length = Math.floor(Math.random() * 10) + 4;
        const pattern = "?".repeat(length);

        const res = await fetch(`https://api.datamuse.com/words?sp=${pattern}&max=999`);
        const data = await res.json();

        let word;
        let attempts = 0;
        do {
            word = removeAccents(data[Math.floor(Math.random() * data.length)].word);
            attempts++;
            if (attempts > 20) break;
        } while (usedWords.has(word));

        usedWords.add(word);
        return word;
    } catch (err) {
        console.error("Error fetching word:", err);
        return "error";
    }
}

async function showWord() {
    currentWord = start ? "Type to start!" : await getRandomWord();
    start = false;
    wordDisplay.innerHTML= "";
    typed = "";

    for (let char of currentWord) {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.classList.add("pending");
        wordDisplay.append(span);
    }

    wordDisplay.appendChild(typeWriter);
    lockWord();
    updateTypeLoc();

}

function updateDisplay() {
    const spans = wordDisplay.querySelectorAll("span");

    spans.forEach((span, i) => {
        span.classList.remove("correct", "incorrect", "pending", "current", "locked");

        if (i < typed.length) {
            span.classList.add(typed[i] === currentWord[i] ? "correct" : "incorrect");
        } else {
            span.classList.add("pending");
            lockWord();
        }

    });

    updateTypeLoc();
}

function updateTypeLoc() {
    const spans = wordDisplay.querySelectorAll("span");
    const currInd = typed.length;

    if (currInd < spans.length) {
        const span = spans[currInd];
        typeWriter.style.left = (span.offsetLeft) + "px";
        typeWriter.style.height = (span.offsetHeight) + "px";
    } else {
        const lastSpan = spans[spans.length - 1];
        typeWriter.style.left = (lastSpan.offsetLeft + lastSpan.offsetWidth) + "px";
        typeWriter.style.height = lastSpan.offsetHeight + "px";
    }
}

async function handleKey(e) {
    if (e.key === "Backspace") {
        typed = typed.slice(0, -1);
    } else if (e.key.length === 1 && typed.length < currentWord.length && !locked) {
        typed += e.key;
    }

    updateDisplay();

    if (typed === currentWord) {
        showWord();
        if (!bigBall) {
            bigBall = true;
            spinBall();
            ballBig();
        } else {
            ballReturn();
            stopCountDown();
        }
    }
}

function resetTypingtest() {
    usedWords.clear();
    showWord();
}

document.addEventListener("keydown", handleKey);

showWord();