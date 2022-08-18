export {}

let gameBoard: any = document.getElementById("game-canvas")
const gameBoardContext = gameBoard.getContext('2d')
const boardBackground: string = 'white'
const boardBorder: string = 'black'
let isDragging: boolean = false
let playerBlock
let computerBlock
// gameBoard.width = '10%'

let rightBlock: {
    x: number,
    y: number,
    width: number,
    height: number,
    incoming: boolean
} = {
    x: 350,
    y: 450,
    width: 100,
    height: 20,
    incoming: true
}

let gameBall: {
    x: number,
    y: number,
    radius: number,
    dy: number,
    dx: number
} = {
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
        if(checkIfScored()) {
            setTimeout(() => {
                draw()
            }, 3000)
        }
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
   
    gameBoardContext.fillRect(rightBlock.x, rightBlock.y, rightBlock.width, rightBlock.height)
    gameBoardContext.strokeRect(rightBlock.x, rightBlock.y, rightBlock.width, rightBlock.height);
    gameBoardContext.beginPath()
    gameBoardContext.arc(gameBall.x, gameBall.y, gameBall.radius, 0, 2 * Math.PI)
    gameBoardContext.stroke()
}

const checkIfHitRightBlock = (): boolean => {
    if (
        (((gameBall.x + gameBall.radius) >= rightBlock.x) && ((gameBall.x + gameBall.radius) <= (rightBlock.x + rightBlock.width)))
        && ((gameBall.y + gameBall.radius) > rightBlock.y && (gameBall.y - gameBall.radius) < (rightBlock.y + 100))) {
            return true
        }
    else {
        return false
    }
}

const checkIfHitWall = (): boolean => {
    if (((gameBall.y - gameBall.radius) < 1) || ((gameBall.y + gameBall.radius) > gameBoard.height)) {
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

    if(checkIfInBlock(startX, startY, rightBlock)) {
        isDragging = true
        playerBlock = rightBlock
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
    if (rightBlock.incoming && checkIfHitRightBlock()) {
        if (gameBall.dx < 10) {
            gameBall.dx += 0.1
        }
        gameBall.dx = -1*gameBall.dx
        let dyChange = (rightBlock.y - gameBall.y) + (rightBlock.height/2)
        gameBall.dy = -1*(dyChange/25)
        rightBlock.incoming = false
    } else if (checkIfHitWall()) {
        gameBall.dy = -1*gameBall.dy
    }

}

const updateScore = side => {
    if (side === 'left') {
        document.getElementById('left-player-score').innerText = scores.leftPlayerScore.toString()
    } else if (side === 'right') {
        document.getElementById('right-player-score').innerText = scores.rightPlayerScore.toString()
    }
}

const checkIfScored = (): boolean => {
    if ((gameBall.x - gameBall.radius) <= 0) {
        scores.rightPlayerScore++
        updateScore('right')
        gameBall.x = 250
        gameBall.dx = 2
        gameBall.dy = 0
        rightBlock.incoming = true
        return true
    } else if ((gameBall.x + gameBall.radius) >= gameBoard.width) {
        scores.leftPlayerScore++
        updateScore('left')
        gameBall.x = 250
        gameBall.dx = -2
        gameBall.dy = 0
        rightBlock.incoming = false
        return true
    }
    return false
}
