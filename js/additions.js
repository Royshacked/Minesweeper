'use strict' 

//******************************SMILEY********************************************************************************************* */

function onSmileyClick() {
    resetGame()
    renderPanelCell('.smiley', '😁')
}

//*****************************3 SAFE CLICKS**************************************************************************************************** */

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

    addCellClass(row, col, 'marked')

    gSafeClickTimeOut = setTimeout(() => {
        removeCellClass(row, col, 'marked')
    }, 500);

    gSafeClickCounter--
    renderPanelCell('.safe-click span', gSafeClickCounter)
}

//*********************************PUT MINES MANUALLY******************************************************************************************** */

function setManualMode() {
    if (!gIsFirstClick) return

    if (!gIsManual) {
        gIsManual = true
        addPanelCellClass('.mode', 'marked')
    } else {
        gIsManual = false
        removePanelCellClass('.mode', 'marked')
    }
}

//***********************************3 HINTS**************************************************************************************** */

function clickHint(selector) {
    if (isHintClicked() || gIsFirstClick) return
    if (gHints[selector - 1].blocked) return

    gHints[selector - 1].clicked = true
    renderPanelCell(`.hint${selector}`, '💡')
}

function removeHint(selector) {
    gHints[selector - 1].clicked = false
    gHints[selector - 1].blocked = true
    renderPanelCell(`.hint${selector}`, '🚫')
}

function isHintClicked() {
    for (var i = 0; i < 3; i++) {
        if (gHints[i].clicked) return i + 1
    }
    return false
}

function flashHintCells(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const cell = gBoard[i][j]

            if (cell.isMarked || cell.isShown) continue
            cell.isHint = true
            const value = checkCellContent(i, j)
            renderCell(i, j, value)
            addCellClass(i, j, 'clicked')
        }
    }

    gHintsTimeOut = setTimeout(() => {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue
                const cell = gBoard[i][j]

                if (!cell.isHint) continue
                cell.isHint = false
                renderCell(i, j, EMPTY)
                removeCellClass(i, j, 'clicked')
            }
        }
    }, 1000);
}

//***********************************UNDO********************************************************************************************* */

function undo() {
    if (!gClicksHistory.length || !gGame.isOn) return

    var clickedCell = gClicksHistory.pop()
    var row = clickedCell.i
    var col = clickedCell.j

    var cell = gBoard[row][col]

    cell.isShown = false
    gGame.shownCount--
    if (cell.isMarked) { // if undoing flags
        cell.isMarked = false
        gGame.markedCount--
        renderPanelCell('.count', gGame.markedCount)
    }
    renderCell(row, col, EMPTY)
    removeCellClass(row, col, 'clicked')
}

//**********************************MEGA HINT********************************************************************************************** */

function clickMegaHint() {
    if (gIsFirstClick || gIsMegaHintClicked) return
    if (!gIsMegaHint) {
        gIsMegaHint = true
        addPanelCellClass('.mega-hint', 'marked')
        return true
    } else {
        gIsMegaHint = false
        gIsMegaHintClicked = true
        removePanelCellClass('.mega-hint', 'marked')
        return false
    }
}

function showMegaHintCells() {
    const startRow = gMegaHintCells[0].i
    const startCol = gMegaHintCells[0].j
    const endRow = gMegaHintCells[1].i
    const endCol = gMegaHintCells[1].j

    for (var i = startRow; i <= endRow; i++) {
        for (var j = startCol; j <= endCol; j++) {
            const cell = gBoard[i][j]
            const value = checkCellContent(i, j)
            renderCell(i, j, value)
            addCellClass(i, j, 'clicked')
        }
    }

    gMegaHintTimeOut = setTimeout(() => {
        for (var i = startRow; i <= endRow; i++) {
            for (var j = startCol; j <= endCol; j++) {
                const cell = gBoard[i][j]
                if(cell.isMarked) renderCell(i,j,FLAG)
                else renderCell(i,j,EMPTY) 
                removeCellClass(i, j, 'clicked')
            }
        }
    }, 2000);
}