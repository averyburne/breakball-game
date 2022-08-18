"use strict";
exports.__esModule = true;
var gameBoard = document.getElementById("game-canvas");
var gameBoardContext = gameBoard.getContext('2d');
var boardBackground = 'white';
var boardBorder = 'black';
var isDragging = false;
var playerBlock;
var computerBlock;
// gameBoard.width = '10%'
var Block;
var leftBlock = {
    x: 50,
    y: 200,
    width: 20,
    height: 100,
    incoming: false
};
var rightBlock = {
    x: 750,
    y: 200,
    width: 20,
    height: 100,
    incoming: true
};
var gameBall = {
    x: 250,
    y: 100,
    radius: 10,
    dy: 0,
    dx: 2
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
        if (checkIfScored()) {
            setTimeout(function () {
                draw();
            }, 3000);
        }
        if (isDragging) {
            computerMove(computerBlock);
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
    gameBoardContext.fillRect(leftBlock.x, leftBlock.y, leftBlock.width, leftBlock.height);
    gameBoardContext.strokeRect(leftBlock.x, leftBlock.y, leftBlock.width, leftBlock.height);
    gameBoardContext.fillRect(rightBlock.x, rightBlock.y, rightBlock.width, rightBlock.height);
    gameBoardContext.strokeRect(rightBlock.x, rightBlock.y, rightBlock.width, rightBlock.height);
    gameBoardContext.beginPath();
    gameBoardContext.arc(gameBall.x, gameBall.y, gameBall.radius, 0, 2 * Math.PI);
    gameBoardContext.stroke();
};
var changeDirection = function (e) {
    var UP_KEY = 38;
    var DOWN_KEY = 40;
    var W_KEY = 87;
    var S_KEY = 83;
    var keyPressed = e.keyCode;
    if (keyPressed === UP_KEY && rightBlock.y > 0) {
        rightBlock.y -= 20;
    }
    else if (keyPressed === DOWN_KEY && rightBlock.y < (400 - rightBlock.height)) {
        rightBlock.y += 20;
    }
    else if (keyPressed === W_KEY && leftBlock.y > 0) {
        leftBlock.y -= 20;
    }
    else if (keyPressed === S_KEY && leftBlock.y < (400 - leftBlock.height)) {
        leftBlock.y += 20;
    }
    clearCanvas();
    draw();
};
var checkIfHitLeftBlock = function () {
    if (((gameBall.x - gameBall.radius) <= (leftBlock.x + leftBlock.width) && (gameBall.x - gameBall.radius) >= (leftBlock.x))
        && ((gameBall.y + gameBall.radius) > leftBlock.y && (gameBall.y - gameBall.radius) < (leftBlock.y + 100))) {
        return true;
    }
    else {
        return false;
    }
};
var checkIfHitRightBlock = function () {
    if ((((gameBall.x + gameBall.radius) >= rightBlock.x) && ((gameBall.x + gameBall.radius) <= (rightBlock.x + rightBlock.width)))
        && ((gameBall.y + gameBall.radius) > rightBlock.y && (gameBall.y - gameBall.radius) < (rightBlock.y + 100))) {
        return true;
    }
    else {
        return false;
    }
};
var checkIfHitWall = function () {
    if (((gameBall.y - gameBall.radius) < 1) || ((gameBall.y + gameBall.radius) > gameBoard.height)) {
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
    console.log(leftSideOfBlock, rightSideOfBock);
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
    console.log(startX, startY);
    console.log(e);
    if (checkIfInBlock(startX, startY, rightBlock)) {
        isDragging = true;
        playerBlock = rightBlock;
        computerBlock = leftBlock;
    }
    else if (checkIfInBlock(startX, startY, leftBlock)) {
        isDragging = true;
        playerBlock = leftBlock;
        computerBlock = rightBlock;
    }
};
var mouseMove = function (e) {
    if (isDragging) {
        playerBlock.y = e.offsetY;
        clearCanvas();
        draw();
    }
};
var computerMove = function (block) {
    if (gameBall.y > block.y && block.y < (gameBoard.height - block.height)) {
        block.y++;
    }
    else if (gameBall.y < block.y && block.y > 0) {
        block.y--;
    }
    else {
        return;
    }
    clearCanvas();
    draw();
};
gameBoard.onmousedown = mouseDown;
gameBoard.onmousemove = mouseMove;
var checkIfBounced = function () {
    if (rightBlock.incoming && checkIfHitRightBlock()) {
        if (gameBall.dx < 10) {
            gameBall.dx += 0.1;
        }
        gameBall.dx = -1 * gameBall.dx;
        var dyChange = (rightBlock.y - gameBall.y) + (rightBlock.height / 2);
        gameBall.dy = -1 * (dyChange / 25);
        rightBlock.incoming = false;
        leftBlock.incoming = true;
    }
    else if (leftBlock.incoming && checkIfHitLeftBlock()) {
        if (gameBall.dx > -10) {
            gameBall.dx -= 0.1;
        }
        gameBall.dx = -1 * gameBall.dx;
        var dyChange = (leftBlock.y - gameBall.y) + (leftBlock.height / 2);
        gameBall.dy = -1 * (dyChange / 25);
        leftBlock.incoming = false;
        rightBlock.incoming = true;
    }
    else if (checkIfHitWall()) {
        gameBall.dy = -1 * gameBall.dy;
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
var checkIfScored = function () {
    if ((gameBall.x - gameBall.radius) <= 0) {
        scores.rightPlayerScore++;
        updateScore('right');
        gameBall.x = 250;
        gameBall.dx = 2;
        gameBall.dy = 0;
        leftBlock.incoming = false;
        rightBlock.incoming = true;
        return true;
    }
    else if ((gameBall.x + gameBall.radius) >= gameBoard.width) {
        scores.leftPlayerScore++;
        updateScore('left');
        gameBall.x = 250;
        gameBall.dx = -2;
        gameBall.dy = 0;
        rightBlock.incoming = false;
        leftBlock.incoming = true;
        return true;
    }
    return false;
};
document.addEventListener("keydown", changeDirection);
