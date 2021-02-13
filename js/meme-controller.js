'use strict';
let gElCanvas;
let gCtx;
let gIsSearchOn = false;
let gIsKeywordsClicked = false;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function onInit() {
  _createImgs(18);
  renderGallery();
  loadSavedMemes();
}

function renderGallery() {
  if (gIsSearchOn) {
    var imgs = getSearchedImgs();
  } else {
    var imgs = getImgs();
  }
  let strHtml = `
  <div class="grid-header">
  <div class="search-container flex justify-space-around align-center">
  <input list="keywords" id="keywords-search" onkeyup="onSearchImgs(this)" placeholder="SEARCH IMGS">
  <datalist id="keywords">
    <option value="happy">
    <option value="pet">
    <option value="man">
    <option value="baby">
    <option value="sleep">
  </datalist>
  <p class="keywords-display flex justify-space-between">

  </p>
  </div>

  </div>
  <section class="grid-container">
  `;

  imgs.forEach((img) => {
    strHtml += `<div class="img img-${img.id}" onclick="renderDesignPage(${img.id})"><img src="${img.url}"></div>`;
  });

  strHtml += '</section>';

  let elGrid = document.querySelector('.main-container');
  elGrid.innerHTML = strHtml;
  if (gIsKeywordsClicked === false) addKeywords();
  renderKeywords();
  document.querySelector('.about-me').style.display = 'block';
  gIsSearchOn = false;
}

function renderKeywords() {
  let strHtml = '';
  let keywords = document.querySelectorAll('#keywords option');
  keywords.forEach((keyword) => {
    let obj = getKeyWord(keyword.value);
    strHtml += `<span onclick="emphasizeKeyword(this)" style="font-size: ${obj.size}px">${keyword.value}</span>`;
  });
  let keywordsDisplay = document.querySelector('.keywords-display');
  keywordsDisplay.innerHTML = strHtml;
}

function addKeywords() {
  let keywords = document.querySelectorAll('#keywords option');
  keywords.forEach((keyword) => {
    addKeyword({ key: keyword.value, size: 22 });
  });
}

function emphasizeKeyword(el) {
  gIsKeywordsClicked = true;

  let objKeyword = getKeyWord(el.innerText);
  objKeyword.size += 3;
  // let size = parseInt(getComputedStyle(el).getPropertyValue('font-size'));
  // el.style.fontSize = size + 3+'px';

  searchImgs(el.innerText);
  gIsSearchOn = true;
  renderGallery();
}

function renderDesignPage(imgId) {
  setMemeId(imgId);

  let img = getImg(imgId);
  let strHtml = `
    <div class="main-design-container flex justify">

    <section class="canvas-container">
    <canvas id="meme-canvas" height="551" width="541" onclick=""><img class="img-meme" src="${img.url}"></canvas>
    </section>
    
    <section class="design-tools flex column justify-space-between align-center">

    <div class="txt-box-container">
    <input type="text" class="line line-0" onclick="drawFocus()" onkeyup="onSetTxt()">
    </div>

        <section class="txt-size flex">
        <button class="add-line clean-btn" onclick="onAddLine()"><img class="icon" src="ICONS/add.png"></button>
        <button class="increase-txt  clean-btn" onclick="onChangeTxtSize(2)"><img class="icon" src="ICONS/increase-font-icon.png"></button>
        <button class="decrease-txt clean-btn" onclick="onChangeTxtSize(-2)"><img class="icon" src="ICONS/decrease-font-icon.png"></button>
        </section>
        
        <section class="txt-dec flex">
        <button class="lines-focus clean-btn" onclick="changeFocusLine()"><img class="icon" src="ICONS/up-and-down-opposite-double-arrows-side-by-side.png"></button> 
        <button class="btn-change-color clean-btn"><input type="color" id="fill-color" name="fill-color" onchange="onChangeColor(this)"><img class="icon" src="ICONS/paint-board-and-brush.png"></button>
        <button class="btn-change-font clean-btn">
        <select id="change-font" onchange="onChangeFont(this)">
        <option>Helvetica</option>
        <option>Arial Black</option>
        <option>Impact</option>
        <option>Tahoma</option>
        <option>Lucida Console</option>
        </select>
        font
        </button>
        </section>

      
        <section class="alignment-txt flex">
        <button class="btn-left clean-btn" onclick="onSetAlignment('left')"><img class="icon" src="ICONS/align-to-left.png"></button>
        <button class="btn-center clean-btn" onclick="onSetAlignment('center')"><img class="icon" src="ICONS/center-text-alignment.png"></button>
        <button class="btn-right clean-btn" onclick="onSetAlignment('right')"><img class="icon" src="ICONS/align-to-right.png"></button>
        </section>
      
        <section class="memory-tools flex">
        <button class="btn-save clean-btn" onclick="onSaveMeme()"><img class="icon" src="ICONS/save.png"></button>
        <button class="btn-download clean-btn"><a href="#" onclick="onDownloadMeme(this)" download="my-meme"><img class="icon" src="ICONS/download.png"></a></button>
        </section>
        
    </section>
    
    </div>
    `;

  let elDesignSection = document.querySelector('.main-container');
  elDesignSection.innerHTML = strHtml;

  renderCanvas();
  resizeCanvas();
  drawImg();
  drawTxt();
  addMouseListeners();
  addTouchListeners();
  document.querySelector('.about-me').style.display = 'none';
}

function drawImg() {
  const elImg = document.querySelector('.img-meme');
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function resizeCanvas() {
  const elContainer = document.querySelector('.canvas-container');
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height = elContainer.offsetHeight;
  if (elContainer.offsetWidth < 500) {
    resizeLinesPos(elContainer.offsetWidth);
  }
}

function renderCanvas() {
  gElCanvas = document.getElementById('meme-canvas');
  gCtx = gElCanvas.getContext('2d');
}

function changeFocusLine() {
  renderAllCanvas();
  let meme = getMeme();
  let currFocusLineIdx = _getSelectedLineIdx();
  let newFocusLineIdx;

  if (currFocusLineIdx === meme.linesCount) newFocusLineIdx = 0;
   else newFocusLineIdx = currFocusLineIdx + 1;
  

  setSelectedLineIdx(newFocusLineIdx);

  let selectedLine = _getSelectedLine();

  drawFocus();

  let strHtml = ` <input type="text" class="line line-${newFocusLineIdx}" onkeyup="onSetTxt()" ></input>`;
  document.querySelector('.txt-box-container').innerHTML = strHtml;
  document.querySelector(
    `.line-${newFocusLineIdx}`
  ).value = `${selectedLine.txt}`;
}

function drawFocus(){
  const elContainer = document.querySelector('.canvas-container');

  let selectedLine = _getSelectedLine();
  gCtx.rect(elContainer.offsetWidth/11 , selectedLine.pos.y - 40, elContainer.offsetWidth/1.2, 50);

  gCtx.strokeStyle = 'black';
  gCtx.stroke();
}

function onChangeTxtSize(diff) {
  setTxtSize(diff);
  renderAllCanvas();
}

function onChangeFont(ev) {
  changeFont(ev.value);
  renderAllCanvas();
}

function drawTxt(txt, size, color, font, x, y) {
  gCtx.beginPath();

  gCtx.lineWidth = 2;
  gCtx.strokeStyle = 'black';
  gCtx.fillStyle = color;
  gCtx.textAlign = 'center';
  gCtx.font = `${size}px ${font}`;

  gCtx.fillText(txt, x, y);
  gCtx.strokeText(txt, x, y);
}

function onChangeColor(ev) {
  changeColor(ev.value);
  renderAllCanvas();
}

function onSetTxt() {
  let idx = _getSelectedLineIdx();

  let txt = document.querySelector(`.line-${idx}`).value;
  setTxt(txt);
  renderAllCanvas();
  drawFocus();
}

function renderTxt() {
  let meme = getMeme();

  let lines = meme.lines;
  lines.forEach((line) => {
    drawTxt(line.txt, line.size, line.color, line.font, line.pos.x, line.pos.y);
  });
}

function onSetAlignment(alignment) {
  setAlignment(alignment, gElCanvas.width);
  renderAllCanvas();
}

function renderAllCanvas() {
  renderCanvas();
  drawImg();
  renderTxt();
}

function renderSavedMemes() {
  let memesData = getSavedMemes();
  if (!memesData) {
    var strHtml = 'Sorry, there is no memes saved <br> but you can start now!';
  } else {
    var strHtml = `
  <div class="grid-header"></div>
  <section class="grid-container">
  `;
    console.log(memesData);
    memesData.forEach((memeData) => {
      strHtml += `<div class="meme"><img src="${memeData.data}"></div>`;
    });
    strHtml += '</section>';
  }
  let elGrid = document.querySelector('.main-container');
  elGrid.innerHTML = strHtml;
}

function onSaveMeme() {
  renderAllCanvas();
  const data = gElCanvas.toDataURL();
  saveMeme(data);
}

function onDownloadMeme(elLink) {
  const data = gElCanvas.toDataURL();
  elLink.href = data;
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', onDown);
  gElCanvas.addEventListener('mousemove', onMove);
  gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', onDown);
  gElCanvas.addEventListener('touchmove', onMove);
  gElCanvas.addEventListener('touchend', onUp);
}

function onDown(ev) {
  const pos = getEvPos(ev);
  if (!findTxtClicked(pos)) return;
  let line = findTxtClicked(pos);
  line.isDragging = true;
  line.pos = pos;

  drawFocus();

  document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
  if (!findTxtDragging()) return;
  let line = findTxtDragging();
  const pos = getEvPos(ev);
  const dx = pos.x - line.pos.x;
  const dy = pos.y - line.pos.y;

  line.pos.x += dx;
  line.pos.y += dy;

  renderAllCanvas();
  drawFocus();
}

function onUp() {
  if (!findTxtDragging()) return;
  let line = findTxtDragging();
  line.isDragging = false;
  document.body.style.cursor = 'grab';
  renderAllCanvas();
}

function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault();
    ev = ev.changedTouches[0];
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    };
  }
  return pos;
}

function toggleMenu() {
  document.querySelector('body').classList.toggle('menu-open');
}

function onChangeTxtPos(diff) {
  setTxtPos(diff);
  renderAllCanvas();
}

function toggleActive(el) {
  let els = document.querySelectorAll('.nav-bar a');
  els.forEach((el) => {
    el.classList.remove('active');
  });

  el.classList.add('active');
}

function onSearchImgs(ev) {
  gIsSearchOn = true;
  searchImgs(ev.value);
  renderGallery();
}

function onAddLine() {
  const elContainer = document.querySelector('.canvas-container');
  addLine(elContainer.offsetWidth, elContainer.offsetHeight);
  changeFocusLine();
  // renderAllCanvas();
}
