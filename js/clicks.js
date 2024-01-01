'use strict'

function cellFirstClicked(elCell, ev, i, j) {
    if (ev.which !== 1) return

    setMines(gLevel.size, gLevel.mines, gBoard, i, j)
    setMinesNegsCount(gBoard)

    isFirstClick = false
    onCellClicked(elCell, ev, i, j)

    renderPanelCell('.time', '0')
    clearInterval(gTimer)
    startTimer()
}


function onCellClicked(elCell, ev, i, j) {
    if (!gGame.isOn) return

    if (isFirstClick) {
        cellFirstClicked(elCell, ev, i, j)
        return
    }

    if (ev.which === 3) {
        onCellMarked(elCell, ev, i, j)
        return
    }

    var cell = gBoard[i][j]

    if (cell.isMarked) return
    //************************************************************************* */
    if (cell.isMine) {
        if (gGame.lives > 1) {
            gGame.lives-- //MODEL
            renderPanelCell('.lives span', gGame.lives) //DOM
            renderCell(i, j, MINE) //DOM

            //Flash Mine
            setTimeout(() => {
                renderCell(i, j, '')
                elCell.classList.remove('clicked')
            }, 200);
            return
        } else {
            gGame.lives--
            renderPanelCell('.lives span', gGame.lives)
            renderCell(i, j, MINE)
            gameOver(false)
        }
    //************************************************************************** */
    } else if (cell.minesAroundCount) {
        cell.isShown = true
        gGame.shownCount++
        renderCell(i, j, cell.minesAroundCount)

        if (isWin()) {
            gameOver(true)
            return
        }
    //************************************************************************** */
    } else {
        cell.isShown = true
        gGame.shownCount++
        renderCell(i, j, '')
        revealCells(i, j)

        if (isWin()) {
            gameOver(true)
            return
        }
    }
}


function revealCells(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const cell = gBoard[i][j]
            if (cell.isMarked || cell.isShown) continue
            cell.isShown = true
            gGame.shownCount++
            const value = checkCellContent(i, j)
            renderCell(i, j, value)
            if (value===EMPTY) revealCells(i, j)
        }
    }
}


function checkCellContent(rowIdx, colIdx) {
    var cell = gBoard[rowIdx][colIdx]

    if (cell.isMine) return MINE
    if (cell.minesAroundCount > 0) return cell.minesAroundCount
    return ''
}

function expandShown(board, elCell, i, j) {

}


function onCellMarked(elCell, ev, i, j) {
    var cell = gBoard[i][j]
    if (cell.isShown) return

    cell.isMarked = true
    elCell.innerText = FLAG
    gGame.markedCount++
    if (!cell.isMine) gGame.shownCount++
    renderPanelCell('.count', gGame.markedCount)
}


function onSmileyClick() {
    resetGame()
    onInit()
    renderPanelCell('.smiley', '😁')
    renderPanelCell('.time', '0')
}




