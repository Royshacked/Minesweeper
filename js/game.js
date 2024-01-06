'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gBoard

const gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    correctMarksCount: 0,
    secsPassed: 0,
    lives: 3
}

var gIsFirstClick = true
var gTimer
var gSafeClickTimeOut
var gSafeClickCounter = 3
var gIsManual = false
var gManMinesCount = 0
var gHints
var gHintsTimeOut
var gClicksCount = 0
var gClicksHistory = []
var gMegaHintCells = []
var gIsMegaHint = false
var gIsMegaHintClicked = false
var gMegaHintTimeOut

//******************************************** */

function onInit() {
    gBoard = buildBoard(gLevel.size, gLevel.mines)
    renderBoard(gBoard)
    renderPanel()
    restartTimers()
    createHints()
    gGame.isOn = true
}

function clickLevel(level) {
    switch (level) {
        case 1:
            gLevel.size = 4
            gLevel.mines = 2
            break
        case 2:
            gLevel.size = 8
            gLevel.mines = 14
            break
        case 3:
            gLevel.size = 12
            gLevel.mines = 32
            break
        default:
            gLevel.size = 4
            gLevel.mines = 2
    }
    resetGame()
}


function buildBoard(size, mines) {
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isHint: false
            }
            board[i].push(cell)
        }
    }
    return board
}


function renderBoard(board) {
    var cell
    var strHTML = '<table><tbody class = "board">'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const className = `cell cell-${i}-${j}`
            strHTML += `<td
            class="${className}" 
            onmousedown = "onCellClicked(this,event,${i},${j})"
            oncontextmenu="return false;">
            </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elBoard = document.querySelector('.board-container')
    elBoard.innerHTML = strHTML
}


function renderPanel() {
    renderPanelElement('.safe-click span',3)
    renderPanelElement('.lives span', gGame.lives)
    renderPanelElement('.smiley', '😁')
    renderPanelElement('.count', gGame.markedCount)
    renderPanelElement('.mines', gLevel.mines)
    renderPanelElement('.mode', 'Manual')
    removePanelElementClass('.mode', 'marked')
    addPanelElementClass('.modal', 'hidden')
    removePanelElementClass('.modal', 'win')
    removePanelElementClass('.modal', 'lose')
}

function renderModal() {
    const smiley = document.querySelector('.smiley').innerText
    
    const strHTML = `
    ${smiley}
    <br> Time: ${gGame.secsPassed} sec 
    <br> Correct flags: ${gGame.correctMarksCount}
    <br> Lives Spent: ${3 - gGame.lives} 
    `
    const elModalSpan = document.querySelector('.modal span')
    elModalSpan.innerHTML = strHTML

    removePanelElementClass('.modal', 'hidden')
}

function gameOver(isWin) {
    if (isWin) { 
        renderPanelElement('.smiley', '😎')
        addPanelElementClass('.modal','win')
    } else { 
        renderPanelElement('.smiley', '😒')
        addPanelElementClass('.modal','lose')
    }
    showAllMines(gBoard)
    renderModal()
    clearInterval(gTimer)
    gGame.isOn = false
}


function isWin() {
    if (gGame.shownCount === (gLevel.size ** 2 - gLevel.mines)) return true
    return false
}

function resetGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        correctMarksCount: 0, 
        secsPassed: 0,
        lives: 3
    }
    gIsFirstClick = true
    gSafeClickCounter = 3
    gIsManual = false
    gClicksCount = 0
    gClicksHistory = []
    gMegaHintCells = []
    gIsMegaHint = false
    gIsMegaHintClicked = false
    onInit()
}

function createHints() {
    gHints = []

    for (var i = 0; i < 3; i++) {
        gHints[i] = {
            clicked: false,
            blocked: false
        }
        renderPanelElement(`.hint${i+1}`, '❓')
    }
}

function startTimer() {
	var startTime = Date.now()

	gTimer = setInterval(() => {
		const elapsedTime = Date.now() - startTime
        const formattedTime = (elapsedTime / 1000).toFixed(2)
        gGame.secsPassed = formattedTime
		renderPanelElement('.time',formattedTime)
    }, 37)
}

function restartTimers() {
    renderPanelElement('.time', '0')
    clearInterval(gTimer)
    clearTimeout(gSafeClickTimeOut)
    clearTimeout(gHintsTimeOut)
    clearTimeout(gMegaHintTimeOut)
}

function createClicksHistory(i, j) {
    gClicksHistory.push({
        i: i,
        j: j 
    })
}


// function setDarkMode() {
//     var strHTML = `
//     <style>
//         :root { color: blue }
//         @media (prefers-color-scheme: dark) {
//         :root { color: purple }
//         }
//     </style>
//     `
//     const elBody = document.querySelector('body')
//     elBody.innerHTML += strHTML
// }









