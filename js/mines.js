'use strict'

function setMines(size, mines, board, rowIdx, colIdx) {
    for (var i = 0; i < mines; i++) {
        const row = getRandomInt(0, size)
        const col = getRandomInt(0, size)
        
        if ((row === rowIdx && col === colIdx)||(board[row][col].isMine)) {
            i--
            continue
        } else {
            board[row][col].isMine = true
        }
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = mineNegsCount(i, j)
        }
    }
}


function mineNegsCount(rowIdx, colIdx) {
    var mineCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j].isMine) mineCount++
        }
    }
    return mineCount
}

function showAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isShown = true
                if (board[i][j].isMarked) {
                    addCellClass(`.cell-${i}-${j}`,'marked')
                    continue
                }
                renderCell(i, j, MINE)
            }
        }
    }
}