const ballWrap = document.getElementById('ball-wrap');
const ball = document.getElementById('ball');
const mobileInput = document.getElementById('mobileInput');
let intervalId;
let duration = 1500;
let countTime = 5;
let ready = true;

const MAX_SCALE = 4.0; 
const MIN_SCALE = 0.8;   
const BALL_GAP = 2;       
const TITLE_GAP = 6;    

function updateBallTarget() {
    const tennis = document.getElementById('tennis');
    const panel = document.querySelector('.typing-panel');
    const header = document.querySelector('header');
    if (!tennis || !panel) return;

    const W = ballWrap.offsetWidth;
    const H = ballWrap.offsetHeight;
    const ballCx = ball.offsetLeft + ball.offsetWidth / 2;
    const ballBottom = ball.offsetTop + ball.offsetHeight;

    const box = tennis.getBoundingClientRect();
    const p = panel.getBoundingClientRect();

    const bottomEdge = p.top - BALL_GAP;
    const topLimit = header ? header.getBoundingClientRect().bottom + TITLE_GAP : 0;
    const room = bottomEdge - topLimit;

    const fraction = Math.max(0.45, Math.min(1, room / 600));
    const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, (room * fraction) / ball.offsetHeight));
    const targetX = (p.left + p.width / 2) - box.left;
    const targetY = bottomEdge - box.top;

    const dx = (targetX - W / 2) / scale - (ballCx - W / 2);
    const dy = (targetY - H / 2) / scale - (ballBottom - H / 2);

    tennis.style.setProperty('--ball-scale', scale);
    tennis.style.setProperty('--ball-dx', dx + 'px');
    tennis.style.setProperty('--ball-dy', dy + 'px');
}

function scheduleBallUpdate() {
    requestAnimationFrame(updateBallTarget); 
}

window.addEventListener('resize', scheduleBallUpdate);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleBallUpdate);
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleBallUpdate);

if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(scheduleBallUpdate);
    ['.typing-panel', '#tennis', 'main', 'header'].forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) ro.observe(el);
    });
}

updateBallTarget();

function focusTyping() {
    if (mobileInput && document.activeElement !== mobileInput) {
        mobileInput.focus({ preventScroll: true });
    }
}

document.addEventListener('click', focusTyping);

document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('a')) e.preventDefault();
});

if (mobileInput) {
    mobileInput.addEventListener('input', () => { mobileInput.value = ''; });
}

function resetBallStats() {
    duration = 1500;
    countTime = 5;
}

function explosion() {
    const tennis = document.getElementById('tennis');
    let explosion = document.createElement('img');
    explosion.src = "images/explosion.gif";
    explosion.classList.add("position-absolute", "top-0", "start-0", "h-100", "w-100", "z-2");
    tennis.insertBefore(explosion, tennis.firstChild);

    setTimeout(() => {
        resetBall();
        resetStats();
        stopCountDown();
        resetTypingtest();
        resetBallStats();
        removeExplosion();
    }, 500)
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
        speedUp();
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
    ballWrap.style.animation = 'none';
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
    ball.style.animation = 'ball-spin 2s linear infinite';
}

function stopSpin() {
    ball.style.animation = 'none';
}

function countDown(time) {
    let remain = time;

    const display = document.createElement("h1");
    display.classList.add("countdown");
    display.id = "countdown";
    const num = document.createElement("span");
    num.textContent = remain;
    display.appendChild(num);

    document.getElementById("ball-wrap").appendChild(display);

    intervalId = setInterval(() => {
        remain--;

        if (remain >= 0) {
            num.textContent = remain;
        } else {
            clearInterval(intervalId);
            // Ran out of time
            stopSpin();
            gameOver();

            setTimeout(() => {
                explosion();
                explode();
            }, 1000);
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
    updateBallTarget();
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
    if (ready) {
        updateBallTarget();
        ready = false;
        stopBall()
        locked = true;

        function onReturnEnd(event) {
            if (event.animationName === "ball-return") {
                racquetAnimate()
                catHit();
                ballBig();
                ballWrap.removeEventListener("animationend", onReturnEnd);
            }
        }

        ballWrap.addEventListener("animationend", onReturnEnd);

        ballWrap.style.animation = `ball-return ${duration}ms linear forwards`;
    }
}

function stopBall() {
    ballWrap.style.animation = 'none';
    void ballWrap.offsetWidth;
}