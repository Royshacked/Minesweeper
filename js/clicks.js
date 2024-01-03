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

    if(isHintClicked()) {
        var hintNum = isHintClicked()
        removeHint(hintNum)
        flashHintCells(i,j)
        return
    }

    //********************************** */ if mega-hint clicked

    if(isMegaHint) {
        gMegaHintCells.push({i:i,j:j})
        if(gMegaHintCells.length>=2) {
            showMegaHint()
            clickMegaHint()
        }
        return
    }

    //********************************** */ if its a right click - go to mark cell function

    if (ev.which === 3) {                   
        onCellMarked(elCell, ev, i, j)
        return
    }
    //********************************** */ if cell is already flagged or shown

    if (cell.isMarked||cell.isShown) return   

    //********************************** */ set mines manually
    if (gIsFirstClick && gIsManual) {
        cell.isMine = true //MODEL
        flashMine(i, j)
        gManMinesCount++
        renderPanelCell('.mode', `${gManMinesCount}|${gLevel.mines}`)

        if (gManMinesCount === gLevel.mines) {
            gManMinesCount = 0
            gIsFirstClick = false
            renderPanelCell('.mode', 'Play')
            setMinesNegsCount(gBoard)
        }
        return
    }

    //************************************************************************* */ if clicked cell is a mine
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
            return
        }
    }
    //************************************************************************** */ if clicked cell is a neighbour
    if (cell.minesAroundCount) {
        cell.isShown = true
        gGame.shownCount++
        renderCell(i, j, cell.minesAroundCount)
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
            createClicksHistory(i, j)
            if (value === EMPTY) revealCells(i, j)
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

//******************************************************************************************************************************************** */

function flashMine(row, col) {
    renderCell(row, col, MINE)

    setTimeout(() => {
        renderCell(row, col, EMPTY)
        removeCellClass(`.cell-${row}-${col}`, 'clicked')
    }, 200);
}

//******************************************************************************************************************************************** */

function onSmileyClick() {
    resetGame()
    renderPanelCell('.smiley', '😁')
}

//******************************************************************************************************************************************** */

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

//******************************************************************************************************************************************** */

function setMode() {
    if(!gIsFirstClick) return

    if (!gIsManual) {
        gIsManual = true
        addCellClass('.mode', 'marked')
    } else {
        gIsManual = false
        removeCellClass('.mode', 'marked')
    }
}

//******************************************************************************************************************************************** */

function clickHint(selector) {
    if(isHintClicked()||gIsFirstClick) return
    if(gHints[selector-1].blocked) return

    gHints[selector-1].clicked = true
    renderPanelCell(`.hint${selector}`, '💡')
}

//******************************************************************************************************************************************** */

function removeHint(selector) {
    gHints[selector-1].clicked = false
    gHints[selector-1].blocked = true
    renderPanelCell(`.hint${selector}`, '🚫')
}

//******************************************************************************************************************************************** */

function isHintClicked() {
    for(var i = 0; i < 3; i++) {
        if (gHints[i].clicked) return i+1
    }
    return false
}

//******************************************************************************************************************************************** */

function flashHintCells(rowIdx,colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const cell = gBoard[i][j]

            if (cell.isMarked || cell.isShown) continue
            cell.isHint = true
            const value = checkCellContent(i, j)
            renderCell(i, j, value)
        }
    }

    clearTimeout(gHintsTimeOut)

    gHintsTimeOut = setTimeout(() => {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) { 
            if (i < 0 || i >= gBoard.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue
                const cell = gBoard[i][j]

                if (!cell.isHint) continue
                cell.isHint = false
                renderCell(i, j, EMPTY)
                removeCellClass(`.cell-${i}-${j}`, 'clicked')
            }
        }
    }, 1000);  
}

//******************************************************************************************************************************************** */

function undo() {
    if (!gClicksHistory.length) return

    var clickedCell = gClicksHistory.pop()
    var row = clickedCell.i
    var col = clickedCell.j

    var cell = gBoard[row][col]

    cell.isShown = false
    gGame.shownCount--
    renderCell(row,col,EMPTY)
    removeCellClass(`.cell-${row}-${col}`, 'clicked')
}

//******************************************************************************************************************************************** */

function clickMegaHint() {
    if(gIsFirstClick||isMegaHintClicked) return
    if(!isMegaHint) {
        isMegaHint = true
        addCellClass('.mega-hint','marked')
        return true
    } else {
        isMegaHint = false
        isMegaHintClicked = true
        removeCellClass('.mega-hint','marked')
        return false
    }
}

//******************************************************************************************************************************************** */

function showMegaHint() {
    const startRow = gMegaHintCells[0].i
    const startCol = gMegaHintCells[0].j
    const endRow = gMegaHintCells[1].i
    const endCol = gMegaHintCells[1].j

    for(var i = startRow; i<= endRow; i++) {
        for(var j = startCol; j <= endCol; j++) {
            const cell = gBoard[i][j]
            const value = checkCellContent(i, j)
            renderCell(i, j, value)
        }
    }

    gMegaHintTimeOut = setTimeout(() => {
        for(var i = startRow; i<= endRow; i++) {
            for(var j = startCol; j <= endCol; j++) {
                const cell = gBoard[i][j]
                renderCell(i, j, EMPTY)
                removeCellClass(`.cell-${i}-${j}`, 'clicked')
            }
        }
    }, 2000);
}