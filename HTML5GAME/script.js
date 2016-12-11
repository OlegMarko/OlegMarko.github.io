/**
 * Created by {OM} on 11.12.2016.
 */

window.onload = init;

var map;
var ctxMap;

var playerCanvas;
var ctxGamer;

var status1;
var ctxStatus;

var enemuCanvas;
var ctxEnemy;

var drawBtn;
var clearBtn;

var gameWidth = 450;
var gameHeight = 300;

var bg_img = new Image();
bg_img.src = 'pexels-photo-155534.jpeg';

var bg_img1 = new Image();
bg_img1.src = 'pexels-photo-155534.jpeg';

var game_img = new Image();
game_img.src = 'game_img.png';

var mapX = 0;
var mapX1 = gameWidth;

var gamer;
var enemy = [];

var isPlaying;

var spawnInterval = 24000;
var spawnTime = 5000;
var spawnAmount = 3;

var health;

var requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame;

function init() {
    map = document.getElementById('map');
    ctxMap = map.getContext('2d');

    playerCanvas = document.getElementById('gamer');
    ctxGamer = playerCanvas.getContext('2d');

    enemuCanvas = document.getElementById('enemy');
    ctxEnemy = enemuCanvas.getContext('2d');

    status1 = document.getElementById('status');
    ctxStatus = status1.getContext('2d');

    map.width = gameWidth;
    map.height = gameHeight;

    playerCanvas.width = gameWidth;
    playerCanvas.height = gameHeight;

    enemuCanvas.width = gameWidth;
    enemuCanvas.height = gameHeight;

    status.width = gameWidth;
    status.height = gameHeight;

    ctxStatus.fillStyle = '#9d9d9d';
    ctxStatus.font = 'bold 15pt Consolas';

    drawBtn = document.getElementById('drawBtn');
    clearBtn = document.getElementById('clearBtn')

    drawBtn.addEventListener('click', drawRect, false);
    clearBtn.addEventListener('click', clearRect, false);

    gamer = new Gamer();

    resetHealth();

    startLoop();

    spawnEnemy(2);

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
}

function resetHealth() {
    health = 10;
}

function spawnEnemy(count) {
    for (var i = 0; i < count; i++) {
        enemy[i] = new Enemy();
    }
}

function startCreatingEnemy() {
    stopCreatingEnemy();
    spawnInterval = setInterval(function() {
        spawnEnemy(spawnAmount);
    }, spawnTime);
}

function stopCreatingEnemy() {
    clearInterval(spawnInterval);
}

function loop() {
    if (isPlaying) {
        draw();
        update();
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();

    startCreatingEnemy();
}

function stopLoop() {
    isPlaying = false;
}

function draw() {
    gamer.draw();
    clearCtxEnemy();

    for (var i = 0; i < enemy.length; i++) {
        enemy[i].draw();
    }
}

function update() {
    bgUpdate();
    drawBg();
    updateStatus();
    gamer.update();

    for (var i = 0; i < enemy.length; i++) {
        enemy[i].update();
    }
}

function bgUpdate() {
    var speed = 4;
    mapX -= 4;
    mapX1 -= 4;

    if (mapX + gameWidth <= 0) {
        mapX = gameWidth-7;
    }
    if (mapX1 + gameWidth <= 0) {
        mapX1 = gameWidth-7;
    }
}

function Gamer() {
    this.srcX = 0;
    this.srcY = 0;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 150;
    this.height = 50;

    this.speed = 5;

    this.isUp = false;
    this.isDown = false;
    this.isRight = false;
    this.isLeft = false;
}

function Enemy() {
    this.srcX = 0;
    this.srcY = 130;
    this.drawX = Math.floor(Math.random() * gameWidth) + gameWidth;
    this.drawY = Math.floor(Math.random() *  gameHeight);
    this.width = 75;
    this.height = 25;

    this.speed = 5;
}

Enemy.prototype.draw = function() {
    ctxEnemy.drawImage(game_img, this.srcX, this.srcY, 125, 100,
        this.drawX, this.drawY, this.width, this.height);
}

Enemy.prototype.update = function() {
    this.drawX -= this.speed;
    if (this.drawX + this.width < 0) {
        this.destroy();
    }
}

Enemy.prototype.destroy = function() {
    enemy.splice(enemy.indexOf(this), 1);
}

Gamer.prototype.draw = function() {
    clearCtxGamer();
    ctxGamer.drawImage(game_img, this.srcX, this.srcY, 437, 105,
        this.drawX, this.drawY, this.width, this.height);
}

Gamer.prototype.update = function() {
    if (health <= 0) {
        resetHealth();
    }

    if (this.drawX < 0) {
        this.drawX = 0;
    } else if (this.drawX > (gameWidth - this.width - 50)) {
        this.drawX = gameWidth - this.width - 50;
    }
    if (this.drawY < 0) {
        this.drawY = 0;
    } else if (this.drawY > (gameHeight - this.height)) {
        this.drawY = gameHeight - this.height;
    }

    for (var i = 0; i < enemy.length; i++) {
        if (this.drawX >= enemy[i].drawX && this.drawY >= enemy[i].drawY &&
            this.drawX <= enemy[i].drawX + enemy[i].width &&
            this.drawY <= enemy[i].drawY + enemy[i].height) {

            health--;
        }
    }

    gamer.chooseDir();
}

Gamer.prototype.chooseDir = function () {
    if (this.isUp) {
        this.drawY -= this.speed;
    } else if (this.isDown) {
        this.drawY += this.speed;
    } else if (this.isLeft) {
        this.drawX -= this.speed;
    } else if (this.isRight) {
        this.drawX += this.speed;
    }
}

function keyDown(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if (keyChar == "W") {
        gamer.isUp = true;
        e.preventDefault();
    } else if (keyChar == "S") {
        gamer.isDown = true;
        e.preventDefault();
    } else if (keyChar == "D") {
        gamer.isRight = true;
        e.preventDefault();
    } else if (keyChar == "A") {
        gamer.isLeft = true;
        e.preventDefault();
    }
}

function keyUp(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if (keyChar == "W") {
        gamer.isUp = false;
        e.preventDefault();
    } else if (keyChar == "S") {
        gamer.isDown = false;
        e.preventDefault();
    } else if (keyChar == "D") {
        gamer.isRight = false;
        e.preventDefault();
    } else if (keyChar == "A") {
        gamer.isLeft = false;
        e.preventDefault();
    }
}

function drawRect() {
    ctxMap.fillStyle = "#ccc";
    ctxMap.fillRect(10, 10, 100, 100);
}

function clearRect() {
    ctxMap.clearRect(0, 0, 450, 300);
}

function clearCtxGamer() {
    ctxGamer.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCtxEnemy() {
    ctxEnemy.clearRect(0, 0, gameWidth, gameHeight);
}

function updateStatus() {
    ctxStatus.clearRect(0, 0, gameWidth, gameHeight);
    ctxStatus.fillText('Health: ' + health, 0, 25);
}

function drawBg() {
    ctxMap.clearRect(0, 0, gameWidth, gameHeight);
    ctxMap.drawImage(bg_img, 0, 0, 811, 363, mapX, 0, gameWidth, gameHeight);
    ctxMap.drawImage(bg_img1, 0, 0, 811, 363, mapX1, 0, gameWidth, gameHeight);
}