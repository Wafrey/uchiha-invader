let keys = {};

let state = {
    player: {
        x: 30,
        y: 200,
        width: 0,
        height: 0,
        lastTimeFiredFireball: 0
    },
    gameScene: {
        isGameActive: true,
        score: 0,
        lastCloudSpawn: 0,
        lastShurikenSpawn: 0
    }
}

function gameOverAction() {
    state.gameScene.isGameActive = false;
    gameScore.parentElement.removeChild(gameScore);
    gameOver.textContent = `Game Over! You've reached ${state.gameScene.score} points.`;
    gameOver.classList.remove('hide');

}

function isCollision(firstEl, secondEl) {
    let firstRect = firstEl.getBoundingClientRect();
    let secondRect = secondEl.getBoundingClientRect();

    return !(firstRect.top > secondRect.bottom ||
        firstRect.bottom < secondRect.top ||
        firstRect.right < secondRect.left ||
        firstRect.left > secondRect.right)
}

function addFireBall(player) {
    let fireBall = document.createElement('div');
    fireBall.classList.add('fireball');
    fireBall.style.top = (player.y + player.height / 2 - 60) + 'px';
    fireBall.x = (player.x + player.width);
    fireBall.style.left = fireBall.x + 'px';
    gameArea.appendChild(fireBall);
}

function onKeyDown(e) {
    keys[e.code] = true;
}

function onKeyUp(e) {
    keys[e.code] = false;
}