export {}
// import { blocksArray } from './blocks.ts'
// console.log(blocksArray)

let gameBoard: any = document.getElementById("game-canvas")
const gameBoardContext = gameBoard.getContext('2d')
const boardBackground: string = 'white'
const boardBorder: string = 'black'
let isDragging: boolean = false
let playerBlock
// gameBoard.width = '10%'

type Paddle = {
    x: number,
    y: number,
    width: number,
    height: number,
    incoming: boolean
}

type Ball = {
    x: number,
    y: number,
    radius: number,
    dy: number,
    dx: number
}

let gamePaddle: Paddle = {
    x: 350,
    y: 450,
    width: 100,
    height: 20,
    incoming: true
}

const reset = ball => {
    ball.x = 250
    ball.y = 100
    ball.dy = 2
    ball.dx = 0
}

let gameBall: Ball = {
    x: 250,
    y: 100,
    radius: 10,
    dy: 2,
    dx: 0
}

let scores: {
    leftPlayerScore: number,
    rightPlayerScore: number
} = {
    leftPlayerScore: 0,
    rightPlayerScore: 0
}

window.onload = function() {
    clearCanvas()
    draw()
  }

function main(): void {
    setTimeout(() => {
        clearCanvas()
        checkIfBounced()
        gameBall.x += gameBall.dx
        gameBall.y += gameBall.dy
        draw()
        main()
    }, 10)
}

const clearCanvas = (): void => {
    gameBoardContext.fillStyle = boardBackground;
    //  Select the colour for the border of the canvas
    gameBoardContext.strokestyle = boardBorder;
    // Draw a "filled" rectangle to cover the entire canvas
    gameBoardContext.fillRect(0, 0, gameBoard.width, gameBoard.height);
    // Draw a "border" around the entire canvas
    gameBoardContext.strokeRect(0, 0, gameBoard.width, gameBoard.height);
}

const draw = ():void => {
    gameBoardContext.fillStyle = 'lightblue'
    gameBoardContext.strokeStyle = 'darkblue'
   
    gameBoardContext.fillRect(gamePaddle.x, gamePaddle.y, gamePaddle.width, gamePaddle.height)
    gameBoardContext.strokeRect(gamePaddle.x, gamePaddle.y, gamePaddle.width, gamePaddle.height);
    gameBoardContext.beginPath()
    gameBoardContext.arc(gameBall.x, gameBall.y, gameBall.radius, 0, 2 * Math.PI)
    gameBoardContext.stroke()
}

const checkIfHitgamePaddle = (): boolean => {
    if (
        (((gameBall.x + gameBall.radius) >= gamePaddle.x) && ((gameBall.x + gameBall.radius) <= (gamePaddle.x + gamePaddle.width)))
        && ((gameBall.y + gameBall.radius) > gamePaddle.y && (gameBall.y - gameBall.radius) < (gamePaddle.y + 100))) {
            return true
        }
    else {
        return false
    }
}

const checkIfHitTopWall = (): boolean => {
    if (((gameBall.y - gameBall.radius) < 1)) {
        gamePaddle.incoming = true
        return true
    } else {
        return false
    }
}

const checkIfHitSideWalls = (): boolean => {
    if (((gameBall.x - gameBall.radius) < 1) || ((gameBall.x + gameBall.radius) > gameBoard.width)) {
        gamePaddle.incoming = true
        return true
    } else {
        return false
    }
}

const checkIfHitBottomWall = (): boolean => {
    if ((gameBall.y + gameBall.radius) > gameBoard.height) {
        return true
    } else {
        return false
    }
}

// const findBlockSection() {

// }

let checkIfInBlock = (xClick, yClick, block) => {
    let leftSideOfBlock = block.x
    let rightSideOfBock = block.x + block.width
    let topSideOfBlock = block.y
    let bottomSideOfBlock = block.y + block.height

    console.log(leftSideOfBlock, rightSideOfBock)

    if (xClick > leftSideOfBlock && xClick < rightSideOfBock && yClick > topSideOfBlock && yClick < bottomSideOfBlock) {
        return true
    } else {
        return false
    }
}

let mouseDown = function(e) {
    e.preventDefault();

    let startX = parseInt(e.offsetX)
    let startY = parseInt(e.offsetY)
    console.log(startX, startY)
    console.log(e)

    if(checkIfInBlock(startX, startY, gamePaddle)) {
        isDragging = true
        playerBlock = gamePaddle
    }
}

let mouseMove = function(e) {
    if (isDragging) {
        playerBlock.x = e.offsetX
        clearCanvas()
        draw()
    }
}

gameBoard.onmousedown = mouseDown
gameBoard.onmousemove = mouseMove

const checkIfBounced = (): void => {
    if (gamePaddle.incoming && checkIfHitgamePaddle()) {
        if (gameBall.dy < 10) {
            gameBall.dy += 0.1
        }
        gameBall.dy = -1*gameBall.dy
        let dxChange = (gamePaddle.x - gameBall.x) + (gamePaddle.width/2)
        gameBall.dx = -1*(dxChange/25)
        gamePaddle.incoming = false
    } else if (checkIfHitTopWall()) {
        gameBall.dy = -1*gameBall.dy
    } else if (checkIfHitSideWalls()) {
        gameBall.dx = -1*gameBall.dx
    } else if (checkIfHitBottomWall()) {
        reset(gameBall)
    }

}

const updateScore = side => {
    if (side === 'left') {
        document.getElementById('left-player-score').innerText = scores.leftPlayerScore.toString()
    } else if (side === 'right') {
        document.getElementById('right-player-score').innerText = scores.rightPlayerScore.toString()
    }
}
