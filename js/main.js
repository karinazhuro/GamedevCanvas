const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 30;

const colorItems = '#0095dd';
let colorBall = '#0095dd';

let dx = 2;
let dy = -2;

const ballRadius = 10;

const paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const font = '16px Arial';

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];

let score = 0;

let lives = 3;

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, 10, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = colorBall;
  ctx.fill();
  ctx.closePath();
}

function getRandomColor() {
  return '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = colorItems;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = colorItems;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  x += dx;
  y += dy;

  if (x + dx > canvas.width - ballRadius || x < ballRadius) {
    colorBall = getRandomColor();
    dx = -dx;
  }
  if (y < ballRadius) {
    colorBall = getRandomColor();
    dy = -dy;
  } else if (y > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      paddleWidth -= 3;
      dx += 1;
      dy -= 1;
    } else {
      lives--;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }


  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  requestAnimationFrame(draw);
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          colorBall = getRandomColor();
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = font;
  ctx.fillStyle = colorItems;
  ctx.fillText('Score: ' + score, 8, 20);
}

function drawLives() {
  ctx.font = font;
  ctx.fillStyle = colorItems;
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

draw(); 