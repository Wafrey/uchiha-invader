const gameStart = document.querySelector('.game-start');
const gameArea = document.querySelector('.game-area');
const gameOver = document.querySelector('.game-over');
const gameScore = document.querySelector('.game-score');
const gamePoints = document.querySelector('.game-score .points');

gameStart.addEventListener('click', onGameStart);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);



function onGameStart() {
    gameStart.classList.add('hide');
    alert('game started, click okey to continue! Hint: Use your keyboard, and space to shoot!');

    const uchiha = document.createElement('div');
    uchiha.classList.add('uchiha');
    uchiha.style.top = state.player.y + 'px';
    uchiha.style.left = state.player.x + 'px';
    gameArea.appendChild(uchiha);
    state.player.width = uchiha.offsetWidth;
    state.player.height = uchiha.offsetHeight;

    window.requestAnimationFrame(frame(0))
}

const frame = t1 => t2 => {
    if (t2 - t1 > game.frameLength) {
        gameActionDraw(t2);
        state.gameScene.isGameActive && window.requestAnimationFrame(frame(t2));
    } else {
        window.requestAnimationFrame(frame(t1));
    }
}

function gameActionDraw(timestamp) {

    const uchiha = document.querySelector('.uchiha');

    // Shuriken
    if (timestamp - state.gameScene.lastShurikenSpawn > game.shurikenSpawnInterval) {
        let shuriken = document.createElement('div');
        shuriken.classList.add('shuriken');
        shuriken.x = gameArea.offsetWidth - 75;
        shuriken.style.left = shuriken.x + 'px';
        shuriken.style.top = (gameArea.offsetHeight - 75) * Math.random() + 'px';

        gameArea.appendChild(shuriken);
        state.gameScene.lastShurikenSpawn = timestamp;
    }

    // Clouds
    if (timestamp - state.gameScene.lastCloudSpawn > game.cloudSpawnInterval) {
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.x = gameArea.offsetWidth - 300;
        cloud.style.left = cloud.x + 'px';
        cloud.style.top = (gameArea.offsetHeight - 300) * Math.random() + 'px';

        gameArea.appendChild(cloud);
        state.gameScene.lastCloudSpawn = timestamp;
    }

    // Shuriken modify
    let shurikens = document.querySelectorAll('.shuriken');
    shurikens.forEach(shuriken => {
        shuriken.x -= game.speed * 2;
        shuriken.style.left = shuriken.x + 'px';

        if (shuriken.x + shurikens.offsetWidth <= 0) {
            shuriken.parentElement.removeChild(shuriken);
        }
    })

    // Clouds modify
    let clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
        cloud.x -= game.speed;
        cloud.style.left = cloud.x + 'px';

        if (cloud.x + clouds.offsetWidth <= 0) {
            cloud.parentElement.removeChild(cloud);
        }
    })

    // Fireballs modify
    let fireBalls = document.querySelectorAll('.fireball');
    fireBalls.forEach(fireBall => {
        fireBall.x += game.speed * game.fireBallMultiplier;
        fireBall.style.left = fireBall.x + 'px';

        if (fireBall.x + fireBall.offsetWidth > gameArea.offsetWidth) {
            fireBall.parentElement.removeChild(fireBall);
        }
    })

    // Gravity
    let isInAir = (state.player.y + state.player.height) + 50 < gameArea.offsetHeight;
    if (isInAir) {
        state.player.y += game.speed;
        uchiha.style.top = state.player.y + 'px';
    }

    // Register Player input.
    if (keys.ArrowUp && state.player.y > 35) {
        state.player.y -= game.speed * game.movingMultiplier;
        uchiha.style.top = state.player.y + 'px';
    }

    if (keys.ArrowDown && isInAir) {
        state.player.y += game.speed * game.movingMultiplier;
        uchiha.style.top = state.player.y + 'px';
    }

    if (keys.ArrowLeft && state.player.x > 10) {
        state.player.x -= game.speed * game.movingMultiplier;
        uchiha.style.left = state.player.x + 'px';
    }

    if (keys.ArrowRight && state.player.x + state.player.width + 10 < gameArea.offsetWidth) {
        state.player.x += game.speed * game.movingMultiplier;
        uchiha.style.left = state.player.x + 'px';
    }

    if (keys.Space && timestamp - state.player.lastTimeFiredFireball > game.fireInterval) {
        uchiha.classList.add('uchiha-fireball');

        // Fireball
        addFireBall(state.player);
        state.player.lastTimeFiredFireball = timestamp;
    } else {
        uchiha.classList.remove('uchiha-fireball');
    }

    // Collision detection
    shurikens.forEach(shuriken => {
        if (isCollision(uchiha, shuriken)) {
            gameOverAction();
        }

        fireBalls.forEach(fireBall => {
            if (isCollision(fireBall, shuriken)) {
                state.gameScene.score += game.shurikenDestroyBonus;
                shuriken.parentElement.removeChild(shuriken);
                fireBall.parentElement.removeChild(fireBall);
            }
        })
    })

    // Score
    gamePoints.textContent = state.gameScene.score++;
}