let keys = {};

const initialState = () => ({
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
    },
    clouds: [],
    fireBalls: [],
    shurikens: [],
});

const nextPlayer = (state) => state.player;
const nextGameScene = (state) => state.gameScene;
const nextClouds = (state) => state.clouds;
const nextFireBalls = (state) => state.fireBalls.map(f=>({...f, x: f.x + game.speed * game.fireBallMultiplier}));
const nextShurikens = (state) => state.shurikens;

const next = (state) => ({
    player: nextPlayer(state),
    gameScene: nextGameScene(state),
    clouds: nextClouds(state),
    fireBalls: nextFireBalls(state),
    shurikens: nextShurikens(state)
});

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

function addFireBall(state) {
    let fireBall = document.createElement('div');
    fireBall.classList.add('fireball');
    fireBall.style.top = (state.player.y + state.player.height / 2 - 60) + 'px';
    fireBall.x = (state.player.x + state.player.width);
    fireBall.style.left = fireBall.x + 'px';
    gameArea.appendChild(fireBall);

    state.fireBalls.push({
        x: state.player.x,
        y: state.player.y + state.player.height / 2 - 60,
        el: fireBall
    });
}

function onKeyDown(e) {
    keys[e.code] = true;
}

function onKeyUp(e) {
    keys[e.code] = false;
}