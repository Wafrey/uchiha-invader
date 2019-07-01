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
    uchiha.classList.add('uchiha')
    uchiha.style.top = player.y + 'px';
    uchiha.style.left = player.x + 'px';
    gameArea.appendChild(uchiha);
    player.width = uchiha.offsetWidth;
    player.height = uchiha.offsetHeight;

    window.requestAnimationFrame(gameAction(0))
}

const frame = (t1) => (t2) => {

};

const gameAction = (t1) => function(timestamp) {

    const uchiha = document.querySelector('.uchiha');

    // Shuriken
    if (timestamp - gameScene.lastShurikenSpawn > game.shurikenSpawnInterval) {
        let shuriken = document.createElement('div');
        shuriken.classList.add('shuriken');
        shuriken.x = gameArea.offsetWidth - 75;
        shuriken.style.left = shuriken.x + 'px';
        shuriken.style.top = (gameArea.offsetHeight - 75) * Math.random() + 'px';

        gameArea.appendChild(shuriken);
        gameScene.lastShurikenSpawn = timestamp;
    }

    // Clouds
    if (timestamp - gameScene.lastCloudSpawn > game.cloudSpawnInterval) {
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.x = gameArea.offsetWidth - 300;
        cloud.style.left = cloud.x + 'px';
        cloud.style.top = (gameArea.offsetHeight - 300) * Math.random() + 'px';

        gameArea.appendChild(cloud);
        gameScene.lastCloudSpawn = timestamp;
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
    let isInAir = (player.y + player.height) + 50 < gameArea.offsetHeight;
    if (isInAir) {
        player.y += game.speed;
        uchiha.style.top = player.y + 'px';
    }

    // Register Player input.
    if (keys.ArrowUp && player.y > 35) {
        player.y -= game.speed * game.movingMultiplier;
        uchiha.style.top = player.y + 'px';
    }

    if (keys.ArrowDown && isInAir) {
        player.y += game.speed * game.movingMultiplier;
        uchiha.style.top = player.y + 'px';
    }

    if (keys.ArrowLeft && player.x > 10) {
        player.x -= game.speed * game.movingMultiplier;
        uchiha.style.left = player.x + 'px';
    }

    if (keys.ArrowRight && player.x + player.width + 10 < gameArea.offsetWidth) {
        player.x += game.speed * game.movingMultiplier;
        uchiha.style.left = player.x + 'px';
    }

    if (keys.Space && timestamp - player.lastTimeFiredFireball > game.fireInterval) {
        uchiha.classList.add('uchiha-fireball');

        // Fireball
        addFireBall(player);
        player.lastTimeFiredFireball = timestamp;
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
                gameScene.score += game.shurikenDestroyBonus;
                shuriken.parentElement.removeChild(shuriken);
                fireBall.parentElement.removeChild(fireBall);
            }
        })
    })

    // Score
    gamePoints.textContent = gameScene.score++;

    if (gameScene.isGameActive) {
        window.requestAnimationFrame(gameAction);
    }
}