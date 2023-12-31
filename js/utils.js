'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }

function renderCell(rowIdx, colIdx, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    // const elCell = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`)
    elCell.innerHTML = value
    elCell.classList.add('clicked') 
}

function renderPanelCell (selector,value) {
    const elPanelCell = document.querySelector(selector)
    elPanelCell.innerHTML = value
}

function startTimer() {
	var startTime = Date.now()

	gTimer = setInterval(() => {
		const elapsedTime = Date.now() - startTime
        const formattedTime = (elapsedTime / 1000).toFixed(0)
		renderPanelCell('.time',formattedTime)
    }, 1000)
}