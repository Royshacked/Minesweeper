'use strict'

function setMines(size, mines, board, rowIdx, colIdx) {
    var minesCount = 0

    while (minesCount < mines) {
        minesCount = 0
        const row = getRandomInt(0, size)
        const col = getRandomInt(0, size)
        if (row === rowIdx && col === colIdx) continue
        //MODEL
        board[row][col].isMine = true
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (board[i][j].isMine) minesCount++
            }
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
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isShown = true
                renderCell(i, j, MINE)
            }
        }
    }
}