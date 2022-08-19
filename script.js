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
var computerBlock;
var rightBlock = {
    x: 350,
    y: 450,
    width: 100,
    height: 20,
    incoming: true
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
        if (checkIfScored()) {
            setTimeout(function () {
                draw();
            }, 3000);
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
    gameBoardContext.fillRect(rightBlock.x, rightBlock.y, rightBlock.width, rightBlock.height);
    gameBoardContext.strokeRect(rightBlock.x, rightBlock.y, rightBlock.width, rightBlock.height);
    gameBoardContext.beginPath();
    gameBoardContext.arc(gameBall.x, gameBall.y, gameBall.radius, 0, 2 * Math.PI);
    gameBoardContext.stroke();
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
    if (rightBlock.incoming && checkIfHitRightBlock()) {
        if (gameBall.dx < 10) {
            gameBall.dx += 0.1;
        }
        gameBall.dx = -1 * gameBall.dx;
        var dyChange = (rightBlock.y - gameBall.y) + (rightBlock.height / 2);
        gameBall.dy = -1 * (dyChange / 25);
        rightBlock.incoming = false;
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
        return true;
    }
    return false;
};
