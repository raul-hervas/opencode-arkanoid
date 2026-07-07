const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  score: 0,
  lives: 3,
  running: false,
  gameOver: false,
  started: false,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 80,
  height: 12,
  speed: 7,
};

const keys = {};

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 8,
  dx: 4,
  dy: -4,
};

const BRICK_HP = { red: 1, cyan: 2, green: 3, yellow: 2, magenta: 1, hotpink: 1, gray: 1 };
const BRICK_SCORE = 10;
const BRICK_COLORS = ['red', 'green', 'cyan', 'yellow', 'magenta', 'hotpink', 'gray'];
const BRICK_ROWS = 5;
const BRICK_COLS = Math.floor(canvas.width / 64);
const bricks = [];

let lastTime = 0;
let fps = 0;

function gameLoop(timestamp) {
  const delta = timestamp - lastTime;
  if (delta >= 1000) {
    fps = Math.round(1000 / (timestamp - lastTime));
    lastTime = timestamp;
  }

  if (state.running) {
    update();
  }

  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (keys['ArrowLeft']) {
    paddle.x = Math.max(0, paddle.x - paddle.speed);
  }
  if (keys['ArrowRight']) {
    paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius <= 0) {
    ball.dy = -ball.dy;
  }

  if (
    ball.dy > 0 &&
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x - ball.radius &&
    ball.x <= paddle.x + paddle.width + ball.radius
  ) {
    const hitPos = (ball.x - paddle.x) / paddle.width;
    const angle = (hitPos - 0.5) * 2 * (Math.PI / 3);
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = speed * Math.sin(angle);
    ball.dy = -speed * Math.cos(angle);
  }

  for (const b of bricks) {
    if (!b.alive) continue;
    if (
      ball.x + ball.radius > b.x &&
      ball.x - ball.radius < b.x + b.width &&
      ball.y + ball.radius > b.y &&
      ball.y - ball.radius < b.y + b.height
    ) {
      const overlapLeft = (ball.x + ball.radius) - b.x;
      const overlapRight = (b.x + b.width) - (ball.x - ball.radius);
      const overlapTop = (ball.y + ball.radius) - b.y;
      const overlapBottom = (b.y + b.height) - (ball.y - ball.radius);
      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);
      if (minOverlapX < minOverlapY) {
        ball.dx = -ball.dx;
      } else {
        ball.dy = -ball.dy;
      }
      b.hp--;
      if (b.hp <= 0) {
        b.alive = false;
        state.score += BRICK_SCORE * BRICK_HP[b.color];
      }
      break;
    }
  }

  if (ball.y + ball.radius >= canvas.height) {
    state.lives--;
    if (state.lives <= 0) {
      state.running = false;
      state.gameOver = true;
    } else {
      resetBall();
    }
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 4;
  ball.dy = -4;
}

function resetGame() {
  state.score = 0;
  state.lives = 3;
  state.gameOver = false;
  state.started = true;
  state.running = true;
  paddle.x = canvas.width / 2 - 40;
  createBricks();
  resetBall();
}

function createBricks() {
  bricks.length = 0;
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      const color = BRICK_COLORS[r % BRICK_COLORS.length];
      bricks.push({
        x: c * 64 + (canvas.width - BRICK_COLS * 64) / 2,
        y: r * 24 + 40,
        width: 64,
        height: 24,
        color: color,
        hp: BRICK_HP[color],
        alive: true,
      });
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const b of bricks) {
    if (b.alive) {
      drawSprite(ctx, 'block_' + b.color, b.x, b.y, b.width, b.height);
    }
  }
  drawSprite(ctx, 'paddle', paddle.x, paddle.y, paddle.width, paddle.height);
  drawSprite(ctx, 'ball', ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);

  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText('Score: ' + state.score, 10, 20);
  ctx.fillText('Lives: ' + state.lives, canvas.width - 90, 20);

  if (!state.started) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ARKANOID', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = '16px monospace';
    ctx.fillText('Press Enter to play', canvas.width / 2, canvas.height / 2 + 20);
    ctx.textAlign = 'left';
  }

  if (state.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px monospace';
    ctx.fillText('Score: ' + state.score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.font = '16px monospace';
    ctx.fillText('Press Enter to restart', canvas.width / 2, canvas.height / 2 + 60);
    ctx.textAlign = 'left';
  }
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === 'Enter') {
    if (!state.started) {
      resetGame();
    } else if (state.gameOver) {
      resetGame();
    }
  }
});
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

loadSpritesheet(() => {
  console.log('Spritesheet loaded');
  createBricks();
  requestAnimationFrame(gameLoop);
});
