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
    secsPassed: 0,
    lives: 3
}

var isFirstClick = true
var gTimer
var gSafeClickTimeOut
var gSafeClickCounter = 3
var isManual = false
var manualCount = 0

//******************************************** */

function onInit() {
    gBoard = buildBoard(gLevel.size, gLevel.mines)
    renderBoard(gBoard)
    renderPanel()
    clearInterval(gTimer)
    clearTimeout(gSafeClickTimeOut)
    renderPanelCell('.time', '0')
    gGame.isOn = true
}

function clickLevel(level) {
    switch(level) {
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
                isMarked: false
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
    renderPanelCell('.lives span', gGame.lives)
    renderPanelCell('.smiley', '😁')
    renderPanelCell('.count', gGame.shownCount)
    renderPanelCell('.mines', gLevel.mines)
    renderPanelCell('.mode', 'Manual')
    removeCellClass('.mode', 'marked')
}


function gameOver(isWin) {
    if (isWin) renderPanelCell('.smiley', '😎')
    else renderPanelCell('.smiley', '😒')
    
    showAllMines(gBoard)
    clearInterval(gTimer)
    gGame.isOn = false 
}


function isWin() {
    if (gGame.shownCount === ( gLevel.size ** 2 - gLevel.mines )) return true
    return false
}

function resetGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }
    isFirstClick = true
    gSafeClickCounter = 3
    isManual = false
    onInit()
}










