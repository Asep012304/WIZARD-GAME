const menu = document.getElementById("menu");
const game = document.getElementById("game");
const startGameButton = document.getElementById("startGameButton");
const buttongame = document.querySelector(".control");

const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

let playermovment = false;

let nyerang = false;

// music
window.addEventListener('load', () => {
    const audio = document.getElementById('background-music');
    audio.volume = 0.5;
    // Coba mulai musik
    audio.play().catch((error) => {
        console.log('Autoplay dicegah oleh browser. Menunggu interaksi pengguna...');
    });
});



// Membuat elemen bar darah musuh
const healthBar = document.createElement("div");
healthBar.id = "health-bar";
const health = document.createElement("div");
health.classList.add("health");

// Enemy Health (Darah)
let enemyHP = 100;
let playerPosition = window.innerHeight / 2 - 25;
let enemyPosition = window.innerHeight / 2 - 25;
let bullets = [];
let enemyBullets = [];
let gameInterval, enemyShootInterval;

// Start Game
function startGame() {


    playermovment = true;
    healthBar.appendChild(health);
    document.body.appendChild(healthBar);
    menu.style.display = "none";
    game.style.display = "block";
    buttongame.style.display = "block";

    // Reset positions
    playerPosition = window.innerHeight / 2 - 25;
    enemyPosition = window.innerHeight / 2 - 25;
    player.style.bottom = `${playerPosition}px`;
    enemy.style.bottom = `${enemyPosition}px`;

    // Reset health bar
    enemyHP = 100;
    health.style.width = `${enemyHP}%`;

    bullets = [];
    enemyBullets = [];

    // Start game loop and enemy shooting
    gameInterval = requestAnimationFrame(gameLoop);
    enemyShootInterval = setInterval(enemyShoot, 1500);
}

// Reset Game
const lose = document.getElementById("gameover");
const popimg = document.getElementById("popimg");
function gameOver(image){
  clearInterval(enemyShootInterval);
  cancelAnimationFrame(gameInterval);
  popimg.style.backgroundImage = image;
  lose.style.animation = "muncul 2s"
  lose.style.visibility = "visible"
  playermovment = false;
}
// Player Movement
function movehero(e) {
    if (!playermovment) return; 
    if ((e.key === 'ArrowDown' || e.target.id === "down-btn") && playerPosition > 0) playerPosition -= 20;
    if ((e.key === 'ArrowUp' || e.target.id === "up-btn") && playerPosition < window.innerHeight - 50) playerPosition += 20;

    if (e.key === " " || e.target.id === "attack-btn") {
        if (!nyerang) {
            nyerang = true;
            player.style.animation = 'none';
            player.style.animation = 'attack 0.3s forwards';
            const bullet = document.createElement("div");
            bullet.classList.add("bullet");
            bullet.style.left = "70px";
            bullet.style.transform = "scalex(-1)";
            bullet.style.transform = "rotate(-90deg)";
            bullet.style.filter = "invert(100%) hue-rotate(300deg)";
            bullet.style.bottom = `${playerPosition}px`;
            game.appendChild(bullet);
            bullets.push(bullet);

            setTimeout(() => {
                nyerang = false;
                player.style.animation = 'idle 0.7s infinite';
            }, 500);
        }
    }

    clearTimeout(stopAnimationTimeout);

    stopAnimationTimeout = setTimeout(() => {
        player.style.animation = 'idle .7s infinite';
    }, 300);

    player.style.bottom = `${playerPosition}px`;
};
let stopAnimationTimeout;

// Enemy Shooting
function enemyShoot() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.right = "70px";
    bullet.style.filter = "hue-rotate(270deg) saturate(200%)";
    bullet.style.bottom = `${enemyPosition + 20}px`;
    game.appendChild(bullet);
    enemyBullets.push(bullet);
}

// Update Game
function gameLoop() {
    // Player Bullets
    bullets.forEach((bullet, index) => {
        let left = parseInt(bullet.style.left);
        if (left > window.innerWidth) {
            bullet.remove();
            bullets.splice(index, 1);
        } else {
            bullet.style.left = `${left + 10}px`;
        }

        // Check collision with enemy
        const bulletRect = bullet.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        if (
            bulletRect.right >= enemyRect.left &&
            bulletRect.top < enemyRect.bottom &&
            bulletRect.bottom > enemyRect.top
        ) {
            enemyHP -= 10;
            health.style.width = `${enemyHP}%`;

            if (enemyHP <= 0) {
                gameOver('url("assets/winner.png")')
                resetGame("You Win! Enemy Defeated!");
                return;
            }

            bullet.remove();
            bullets.splice(index, 1);

            updateEnemyShootSpeed();
        }
    });

    // Enemy Bullets
    enemyBullets.forEach((bullet, index) => {
        let right = parseInt(bullet.style.right);
        if (right > window.innerWidth) {
            bullet.remove();
            enemyBullets.splice(index, 1);
        } else {
            bullet.style.right = `${right + 10}px`;
        }
    
        const bulletRect = bullet.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        if (
            bulletRect.left <= playerRect.right &&
            bulletRect.right >= playerRect.left && // Tambahkan cek untuk sisi kiri peluru
            bulletRect.top <= playerRect.bottom && // Periksa apakah peluru berada di dalam area vertikal pemain
            bulletRect.bottom >= playerRect.top
        ) {
            gameOver('url("assets/loser.png")');
            resetGame("Game Over! You Lose!");
            return;
        }
    });
    

    // Enemy random movement
    if (Math.random() < 0.05) {
        enemyPosition += Math.random() > 0.5 ? 20 : -20;
        if (enemyPosition < 0) enemyPosition = 0;
        if (enemyPosition > window.innerHeight - 50) enemyPosition = window.innerHeight - 50;
        enemy.style.bottom = `${enemyPosition}px`;
    }

    gameInterval = requestAnimationFrame(gameLoop);
}

// Update Enemy Shooting Speed based on HP
function updateEnemyShootSpeed() {
    let newInterval = Math.max(500, 1500 - (100 - enemyHP) * 10);
    clearInterval(enemyShootInterval);
    enemyShootInterval = setInterval(enemyShoot, newInterval);
}

// Event Listener for Start Button
startGameButton.addEventListener("click", startGame);
window.addEventListener("keydown", movehero);
document.getElementById("down-btn").addEventListener("click", movehero);
document.getElementById("up-btn").addEventListener("click", movehero);
document.getElementById("attack-btn").addEventListener("click", movehero);
