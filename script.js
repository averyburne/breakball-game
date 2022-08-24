"use strict";
exports.__esModule = true;
// import { blocksArray } from './blocks.ts'
// console.log(blocksArray)
var gameBoard = document.getElementById("game-canvas");
var gameBoardContext = gameBoard.getContext('2d');
var boardBackground = 'white';
var boardBorder = 'black';
var isDragging = false;
var playerBlock;
var block1 = {
    x: 100,
    y: 20,
    width: 20,
    height: 20,
    incoming: true
};
var gamePaddle = {
    x: 350,
    y: 450,
    width: 100,
    height: 20,
    incoming: true
};
var reset = function (ball) {
    ball.x = 250;
    ball.y = 100;
    ball.dy = 2;
    ball.dx = 0;
};
var gameBall = {
    x: 250,
    y: 100,
    radius: 10,
    dy: 2,
    dx: 0
};
var scores = {
    leftPlayerScore: 0,
    rightPlayerScore: 0
};
window.onload = function () {
    clearCanvas();
    draw();
};
function main() {
    setTimeout(function () {
        clearCanvas();
        checkIfBounced();
        if (checkIfHitBlock(block1)) {
            block1.height = 0;
            block1.width = 0;
            block1.x = 0;
            block1.y = 0;
        }
        gameBall.x += gameBall.dx;
        gameBall.y += gameBall.dy;
        draw();
        main();
    }, 10);
}
var clearCanvas = function () {
    gameBoardContext.fillStyle = boardBackground;
    //  Select the colour for the border of the canvas
    gameBoardContext.strokestyle = boardBorder;
    // Draw a "filled" rectangle to cover the entire canvas
    gameBoardContext.fillRect(0, 0, gameBoard.width, gameBoard.height);
    // Draw a "border" around the entire canvas
    gameBoardContext.strokeRect(0, 0, gameBoard.width, gameBoard.height);
};
var draw = function () {
    gameBoardContext.fillStyle = 'lightblue';
    gameBoardContext.strokeStyle = 'darkblue';
    gameBoardContext.fillRect(gamePaddle.x, gamePaddle.y, gamePaddle.width, gamePaddle.height);
    gameBoardContext.strokeRect(gamePaddle.x, gamePaddle.y, gamePaddle.width, gamePaddle.height);
    gameBoardContext.fillRect(block1.x, block1.y, block1.width, block1.height);
    gameBoardContext.strokeRect(block1.x, block1.y, block1.width, block1.height);
    gameBoardContext.beginPath();
    gameBoardContext.arc(gameBall.x, gameBall.y, gameBall.radius, 0, 2 * Math.PI);
    gameBoardContext.stroke();
};
var checkIfHitgamePaddle = function () {
    if ((((gameBall.x + gameBall.radius) >= gamePaddle.x) && ((gameBall.x + gameBall.radius) <= (gamePaddle.x + gamePaddle.width)))
        && ((gameBall.y + gameBall.radius) > gamePaddle.y && (gameBall.y - gameBall.radius) < (gamePaddle.y + 100))) {
        return true;
    }
    else {
        return false;
    }
};
var checkIfHitBlock = function (block) {
    if ((gameBall.x - gameBall.radius) <= (block.x + block.width) && (gameBall.x + gameBall.radius) >= block.x && (gameBall.y + gameBall.radius) <= (block.y + block.height) && (gameBall.y + gameBall.radius) >= block.y) {
        console.log('hit');
        return true;
    }
    else {
        return false;
    }
};
var checkIfHitTopWall = function () {
    if (((gameBall.y - gameBall.radius) < 1)) {
        gamePaddle.incoming = true;
        return true;
    }
    else {
        return false;
    }
};
var checkIfHitSideWalls = function () {
    if (((gameBall.x - gameBall.radius) < 1) || ((gameBall.x + gameBall.radius) > gameBoard.width)) {
        gamePaddle.incoming = true;
        return true;
    }
    else {
        return false;
    }
};
var checkIfHitBottomWall = function () {
    if ((gameBall.y + gameBall.radius) > gameBoard.height) {
        return true;
    }
    else {
        return false;
    }
};
// const findBlockSection() {
// }
var checkIfInBlock = function (xClick, yClick, block) {
    var leftSideOfBlock = block.x;
    var rightSideOfBock = block.x + block.width;
    var topSideOfBlock = block.y;
    var bottomSideOfBlock = block.y + block.height;
    if (xClick > leftSideOfBlock && xClick < rightSideOfBock && yClick > topSideOfBlock && yClick < bottomSideOfBlock) {
        return true;
    }
    else {
        return false;
    }
};
var mouseDown = function (e) {
    e.preventDefault();
    var startX = parseInt(e.offsetX);
    var startY = parseInt(e.offsetY);
    if (checkIfInBlock(startX, startY, gamePaddle)) {
        isDragging = true;
        playerBlock = gamePaddle;
    }
};
var mouseMove = function (e) {
    if (isDragging) {
        playerBlock.x = e.offsetX;
        clearCanvas();
        draw();
    }
};
gameBoard.onmousedown = mouseDown;
gameBoard.onmousemove = mouseMove;
var checkIfBounced = function () {
    if (gamePaddle.incoming && checkIfHitgamePaddle()) {
        if (gameBall.dy < 10) {
            gameBall.dy += 0.1;
        }
        gameBall.dy = -1 * gameBall.dy;
        var dxChange = (gamePaddle.x - gameBall.x) + (gamePaddle.width / 2);
        gameBall.dx = -1 * (dxChange / 25);
        gamePaddle.incoming = false;
    }
    else if (checkIfHitTopWall()) {
        gameBall.dy = -1 * gameBall.dy;
    }
    else if (checkIfHitSideWalls()) {
        gameBall.dx = -1 * gameBall.dx;
    }
    else if (checkIfHitBottomWall()) {
        reset(gameBall);
    }
};
var updateScore = function (side) {
    if (side === 'left') {
        document.getElementById('left-player-score').innerText = scores.leftPlayerScore.toString();
    }
    else if (side === 'right') {
        document.getElementById('right-player-score').innerText = scores.rightPlayerScore.toString();
    }
};
