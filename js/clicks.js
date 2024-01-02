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
    const cell = gBoard[i][j]

    if (!gGame.isOn) return

    if (isFirstClick && !isManual) {
        cellFirstClicked(elCell, ev, i, j)
        return
    }

    if (ev.which === 3) {
        onCellMarked(elCell, ev, i, j)
        return
    }

    if (cell.isMarked) return

    //********************************** */

    if (isFirstClick && isManual) {
        cell.isMine = true //MODEL
        flashMine(i, j)
        manualCount++
        renderPanelCell('.mode', `${manualCount}|${gLevel.mines}`)

        if (manualCount === gLevel.mines) {
            manualCount = 0
            isFirstClick = false
            renderPanelCell('.mode', 'Play')
            setMinesNegsCount(gBoard)
        }
        return
    }

    //************************************************************************* */
    if (cell.isMine) {
        if (gGame.lives > 1) {
            gGame.lives-- //MODEL
            renderPanelCell('.lives span', gGame.lives) //DOM
            flashMine(i, j)
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
            if (value === EMPTY) revealCells(i, j)
        }
    }
}


function checkCellContent(rowIdx, colIdx) {
    var cell = gBoard[rowIdx][colIdx]

    if (cell.isMine) return MINE
    if (cell.minesAroundCount > 0) return cell.minesAroundCount
    return ''
}


function onCellMarked(elCell, ev, i, j) {
    var cell = gBoard[i][j]

    if (cell.isShown) return

    if (!cell.isMarked) {
        cell.isMarked = true
        elCell.innerText = FLAG
        gGame.markedCount++
        if (!cell.isMine) gGame.shownCount++
        renderPanelCell('.count', gGame.markedCount)
        return
    }

    if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerText = EMPTY
        gGame.markedCount--
        if (!cell.isMine) gGame.shownCount--
        renderPanelCell('.count', gGame.markedCount)
    }
}

function flashMine(row, col) {
    renderCell(row, col, MINE)

    setTimeout(() => {
        renderCell(row, col, EMPTY)
        removeCellClass(`.cell-${row}-${col}`, 'clicked')
    }, 200);
}


function onSmileyClick() {
    resetGame()
    renderPanelCell('.smiley', '😁')
}

function onSafeClick() {
    if (!gGame.isOn || gSafeClickCounter <= 0) return

    var row = getRandomInt(0, gLevel.size)
    var col = getRandomInt(0, gLevel.size)

    var isEmpty = (gBoard[row][col].isMine || gBoard[row][col].isShown || gBoard[row][col].isMarked) ? false : true
    while (!isEmpty) {
        row = getRandomInt(0, gLevel.size)
        col = getRandomInt(0, gLevel.size)
        isEmpty = (gBoard[row][col].isMine || gBoard[row][col].isShown || gBoard[row][col].isMarked) ? false : true
    }

    addCellClass(`.cell-${row}-${col}`, 'marked')

    gSafeClickTimeOut = setTimeout(() => {
        removeCellClass(`.cell-${row}-${col}`, 'marked')
    }, 500);

    gSafeClickCounter--
    renderPanelCell('.safe-click span', gSafeClickCounter)
}

function setMode() {
    if (!isManual) {
        isManual = true
        addCellClass('.mode', 'marked')
    } else {
        isManual = false
        removeCellClass('.mode', 'marked')
    }
}




