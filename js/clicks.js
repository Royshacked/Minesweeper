'use strict'

function cellFirstClicked(elCell, ev, i, j) {
    if (ev.which !== 1) return

    setMines(gLevel.size, gLevel.mines, gBoard, i, j)
    setMinesNegsCount(gBoard)
    restartTimers()
    startTimer()

    gIsFirstClick = false
    onCellClicked(elCell, ev, i, j)
}

//******************************************************************************************************************************************** */

function onCellClicked(elCell, ev, i, j) {
    const cell = gBoard[i][j]

    if (!gGame.isOn) return

    //********************************** */ if its first click and not manual mode - go to first click function

    if (gIsFirstClick && !gIsManual) {
        cellFirstClicked(elCell, ev, i, j)
        return
    }

    //********************************** */ if hint clicked

    if (isHintClicked()) {
        var hintNum = isHintClicked()
        removeHint(hintNum)
        flashHintCells(i, j)
        return
    }

    //********************************** */ if mega-hint clicked

    if (gIsMegaHintClicked) {
        createMegaHint(i, j)
        return
    }

    //********************************** */ if its a right click - go to mark cell function

    if (ev.which === 3) {
        onCellMarked(elCell, ev, i, j)
        return
    }
    //********************************** */ if cell is already flagged or shown

    if (cell.isMarked || cell.isShown) return

    //********************************** */ set mines manually
    if (gIsFirstClick && gIsManual) {
        if(cell.isMine) return
        cell.isMine = true //MODEL
        flashMine(i, j)
        gManMinesCount++
        renderPanelElement('.mode', `${gManMinesCount}|${gLevel.mines}`)

        if (gManMinesCount === gLevel.mines) {
            gManMinesCount = 0
            gIsFirstClick = false
            renderPanelElement('.mode', 'Play')
            setMinesNegsCount(gBoard)
            restartTimers()
            startTimer()
        }
        return
    }

    //************************************************************************* */ if clicked cell is a mine
    if (cell.isMine) {
        if (gGame.lives > 1) {
            gGame.lives-- //MODEL
            renderPanelElement('.lives span', gGame.lives) //DOM
            flashMine(i, j)
            return
        } else {
            gGame.lives--
            renderPanelElement('.lives span', gGame.lives)
            renderCell(i, j, MINE)
            addCellClass(i, j, 'clicked')
            gameOver(false)
            return
        }
    }
    //************************************************************************** */ if clicked cell is a neighbour
    if (cell.minesAroundCount) {
        cell.isShown = true
        gGame.shownCount++
        renderCell(i, j, cell.minesAroundCount)
        addCellClass(i, j, 'clicked')
        createClicksHistory(i, j)
        gClicksCount++
        if (isWin()) {
            gameOver(true)
            return
        }
        //************************************************************************** */ if clicked cell is an empty
    } else {
        cell.isShown = true
        gGame.shownCount++
        renderCell(i, j, '')
        addCellClass(i, j, 'clicked')
        createClicksHistory(i, j)
        gClicksCount++
        revealCells(i, j)
        if (isWin()) {
            gameOver(true)
            return
        }
    }
}

//******************************************************************************************************************************************** */

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
            addCellClass(i, j, 'clicked')
            createClicksHistory(i, j)
            if (value === EMPTY) revealCells(i, j) // if opened cell is empty recursion
        }
    }
    gClicksCount++
}

//******************************************************************************************************************************************** */

function checkCellContent(rowIdx, colIdx) {
    var cell = gBoard[rowIdx][colIdx]

    if (cell.isMine) return MINE
    if (cell.minesAroundCount > 0) return cell.minesAroundCount
    return EMPTY
}

//******************************************************************************************************************************************** */

function onCellMarked(elCell, ev, i, j) {
    var cell = gBoard[i][j]

    if (cell.isShown) return

    if (!cell.isMarked) {
        cell.isMarked = true
        elCell.innerText = FLAG
        gGame.markedCount++
        if (!cell.isMine) gGame.shownCount++
        renderPanelElement('.count', gGame.markedCount)
        createClicksHistory(i, j)
        return
    }

    if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerText = EMPTY
        gGame.markedCount--
        if (!cell.isMine) gGame.shownCount--
        renderPanelElement('.count', gGame.markedCount)
    }
}

//******************************************************************************************************************************************** */

function flashMine(row, col) {
    renderCell(row, col, MINE)
    addCellClass(row, col, 'clicked')

    setTimeout(() => {
        renderCell(row, col, HIDDEN)
        removeCellClass(row, col, 'clicked')
    }, 200);
}

