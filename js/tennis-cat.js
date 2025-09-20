const ballWrap = document.getElementById('ball-wrap');
const ball = document.getElementById('ball');
let intervalId;
let duration = 1500;
let countTime = 5;
let ready = true;

function resetBallStats() {
    duration = 1500;
    countTime = 5;
}

function explosion() {
    const tennis = document.getElementById('tennis');
    let explosion = document.createElement('img');
    explosion.src = "images/explosion.gif";
    explosion.classList.add("position-absolute", "h-100", "w-100" ,"z-2");
    tennis.insertBefore(explosion, tennis.firstChild);

    setTimeout(() => {
        removeExplosion();
        resetBall();
        resetStats();
        stopCountDown();
        resetTypingtest();
        resetBallStats();
    }, 2000)
}

function removeExplosion() {
    const tennis = document.getElementById('tennis');
    const explosion = tennis.querySelector("img[src='images/explosion.gif']");
    if (explosion) {
        tennis.removeChild(explosion);
    }
}

function diffIncrease() {
    if (countTime <= 2) {
        return;
    } else {
        countTime--
    }
    if (duration <= 500) {
        return;
    } else {
        duration = duration - 100;
    }
}

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
    ball.style.animation = 'ball-spin 2s linear infinite'
}

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
            explosion();
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
            countDown(countTime);
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
