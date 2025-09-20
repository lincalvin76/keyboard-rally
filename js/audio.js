let catHitAud = new Audio('sounds/hit2.wav')
let userHitAud = new Audio('sounds/hit1.wav')
let gameOverAud = new Audio('sounds/game_over.mp3')
let explosionAud = new Audio('sounds/explosion.mp3')
let speedUpAud = new Audio('sounds/speed_up.mp3')

function catHit() {
    catHitAud.currentTime = 0;
    catHitAud.volume = 0.5;
    catHitAud.play();
}

function userHit() {
    userHitAud.currentTime = 0;
    userHitAud.volume = 0.5;
    userHitAud.play();
}

function gameOver() {
    gameOverAud.currentTime = 0;
    gameOverAud.volume = 0.5;
    gameOverAud.play();
}

function explode() {
    explosionAud.currentTime = 0;
    explosionAud.volume = 0.3;
    explosionAud.play();
}

function speedUp() {
    speedUpAud.currentTime = 0;
    speedUpAud.volume = 0.3;
    speedUpAud.play();
}