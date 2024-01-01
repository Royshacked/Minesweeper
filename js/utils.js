'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }

function renderCell(rowIdx, colIdx, value) {
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
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