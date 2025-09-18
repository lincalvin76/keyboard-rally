function lockWord() {
    const spans = wordDisplay.querySelectorAll("span");
    
    spans.forEach((span) => {
        span.classList.remove("locked");
        if (locked) {
            span.classList.add("locked");
        }
    });

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

const ballWrap = document.getElementById('ball-wrap');
const duration = 2000;
let ready = true;

function ballBig() {
    ready = false;
    stopBall()
    window.locked = true;

    function ballBigEnd(event) {
         if (event.animationName === "ball-big") {
            ready = true;
            ballWrap.removeEventListener("animationend", ballBigEnd);
            window.locked = false;
            lockWord();
        }
    }

    ballWrap.addEventListener("animationend", ballBigEnd);

    ballWrap.style.animation = `ball-big ${duration}ms linear forwards`;
}

function ballReturn() {
    if(ready) {
        ready = false;
        stopBall()
        window.locked = true;

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
