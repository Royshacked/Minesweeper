'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }

function renderCell(rowIdx, colIdx, value) {
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    elCell.innerText = value
    elCell.classList.add('clicked') 
}

function renderPanelCell (selector,value) {
    const elPanelCell = document.querySelector(selector)
    elPanelCell.innerText = value
}

function addCellClass (selector, classStr) {
    const elCell = document.querySelector(selector)
    elCell.classList.add(classStr)
}

function removeCellClass (selector, classStr) {
    const elCell = document.querySelector(selector)
    elCell.classList.remove(classStr)
}

function startTimer() {
	var startTime = Date.now()

	gTimer = setInterval(() => {
		const elapsedTime = Date.now() - startTime
        const formattedTime = (elapsedTime / 1000).toFixed(0)
		renderPanelCell('.time',formattedTime)
    }, 1000)
}

function restartTimers() {
    renderPanelCell('.time', '0')
    clearInterval(gTimer)
    clearTimeout(gSafeClickTimeOut)
}

function createClicksHistory(i, j) {
    gClicksHistory.push({
        i: i,
        j: j 
    })
}
