'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }

function renderCell(rowIdx, colIdx, value) {
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    elCell.innerText = value
}

function addCellClass (rowIdx, colIdx, classStr) {
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    elCell.classList.add(classStr)
}

function removeCellClass (rowIdx, colIdx, classStr) {
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    elCell.classList.remove(classStr)
}

function renderPanelCell (selector,value) {
    const elPanelCell = document.querySelector(selector)
    elPanelCell.innerText = value
}

function addPanelCellClass (selector, classStr) {
    const elCell = document.querySelector(selector)
    elCell.classList.add(classStr)
}

function removePanelCellClass (selector, classStr) {
    const elCell = document.querySelector(selector)
    elCell.classList.remove(classStr)
}

