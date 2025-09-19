function lockWord() {
    const spans = wordDisplay.querySelectorAll("span");
    
    spans.forEach((span) => {
        span.classList.remove("locked");
        if (locked) {
            span.classList.add("locked");
        }
    });
}

function resetBall() {
    const ball = document.getElementById('ball');
    ball.style.animation = 'none';
    ballWrap.style.animation ='none';
    ballWrap.style.transform = "scale(0.8) translate(0em, -4em)";
    bigBall = false;
}

function racquetAnimate() {
    const racquet = document.getElementById('racquet');
    racquet.style.transform = 'rotate(20deg)';
    setTimeout(() => {
        racquet.style.transform = 'rotate(0deg)';
    }, 300);
}

function spinBall() {
    const ball = document.getElementById('ball');
    ball.style.animation = 'ball-spin 2s linear infinite'
}

let intervalId;

function countDown(time) {
    let remain = time;

    const display = document.createElement("h1");
    display.classList.add("countdown")
    display.id = "countdown";
    display.textContent = remain;

    document.getElementById("ball-wrap").appendChild(display);

    intervalId = setInterval(() => {
        remain--;

        if (remain >= 0) {
            display.textContent = remain;
        } else {
            clearInterval(intervalId);
            // Ran out of time;
            console.log("ran out of time")
            resetBall();
            resetStats();
            stopCountDown();
            resetTypingtest();
        }
    }, 1000);
}

function stopCountDown() {
    clearInterval(intervalId);
    const display = document.getElementById("countdown");
    if (display) {
        display.remove();
    }
}

const ballWrap = document.getElementById('ball-wrap');
const ball = document.getElementById('ball');
const duration = 1500;
let ready = true;

function ballBig() {
    ready = false;
    stopBall()
    locked = true;

    function ballBigEnd(event) {
         if (event.animationName === "ball-big") {
            ready = true;
            ballWrap.removeEventListener("animationend", ballBigEnd);
            locked = false;
            lockWord();
            countDown(5);
            startTime = null;
            typedChars = 0;
        }
    }

    ballWrap.addEventListener("animationend", ballBigEnd);

    ballWrap.style.animation = `ball-big ${duration}ms linear forwards`;
}

function ballReturn() {
    if(ready) {
        ready = false;
        stopBall()
        locked = true;

        function onReturnEnd(event) {
            if (event.animationName === "ball-return") {
                racquetAnimate()
                ballBig();
                ballWrap.removeEventListener("animationend", onReturnEnd);
            }
        }

        ballWrap.addEventListener("animationend", onReturnEnd);

        ballWrap.style.animation = `ball-return ${duration}ms linear forwards`;
    } else {
    }
}

function stopBall() {
    ballWrap.style.animation = 'none';
    void ballWrap.offsetWidth;
}
