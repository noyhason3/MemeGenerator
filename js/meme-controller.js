'use strict';
let gElCanvas;
let gCtx;

function onInit() {
  _createImgs(18);
  renderGallery();
}

function renderGallery() {
  let imgs = getImgs();
  let strHtml = `
  <div class="grid-header"></div>
  <section class="grid-container">
  `;

  imgs.forEach((img) => {
    strHtml += `<div class="img img-${img.id}" onclick="renderDesignPage(${img.id})"><img src="${img.url}"></div>`;
  });

  strHtml += '</section>';

  let elGrid = document.querySelector('.main-container');
  elGrid.innerHTML = strHtml;
}

function renderDesignPage(imgId) {
  setMemeId(imgId);

  let img = getImg(imgId);
  let strHtml = `
    <div class="main-design-container flex justify">

    <section class="canvas-container">
    <canvas id="meme-canvas" height="551" width="541" onclick=""><img class="img-meme" src="${img.url}"></canvas>
    </section>
    
    <section class="design-tools flex column align-center">

    <div class="txt-box-container">
    <input type="text" class="line line-0" onkeyup="onSetTxt()">
    </div>

        <section class="txt-size flex">
        <button class="lines-next clean-btn" onclick="onNextLine()"><img class="icon" src="ICONS/up-and-down-opposite-double-arrows-side-by-side.png"></button> 
        <button class="increase-txt  clean-btn" onclick="onChangeTxtSize(2)"><img class="icon" src="ICONS/increase-font-icon.png"></button>
        <button class="decrease-txt clean-btn" onclick="onChangeTxtSize(-2)"><img class="icon" src="ICONS/decrease-font-icon.png"></button>
        </section>

        <section class="txt-dec flex">
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

  // <button class="txt-up" onclick="onChangeTxtPos(2)">&#8593;</button>
  // <button class="txt-down" onclick="onChangeTxtPos(-2)">&#8595;</button>
  // <button class="lines-switch" onclick="onSwitchLines()">switch</button>
  let elDesignSection = document.querySelector('.main-container');
  elDesignSection.innerHTML = strHtml;

  renderCanvas();
  resizeCanvas();
  drawImg();
  drawTxt();
  addMouseListeners();
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

function onNextLine() {
  renderCanvas();
  onSetTxt();
  let meme = getMeme();
  if (meme.selectedLineIdx) {
    gCtx.rect(meme.lines[0].pos.x - 230, meme.lines[0].pos.y - 40, 490, 50);
    setSelectedLineIdx(0);
  } else {
    gCtx.rect(meme.lines[1].pos.x - 230, meme.lines[1].pos.y - 40, 490, 50);
    setSelectedLineIdx(1);
  }
  gCtx.strokeStyle = 'black';
  gCtx.stroke();
  let strHtml = ` <input type="text" class="line line-${meme.selectedLineIdx}" onkeyup="onSetTxt()" ></input>`;
  document.querySelector('.txt-box-container').innerHTML = strHtml;
  document.querySelector(`.line-${meme.selectedLineIdx}`).value = `${
    meme.lines[meme.selectedLineIdx].txt
  }`;
}

function onChangeTxtSize(diff) {
  setTxtSize(diff);
  onSetTxt();
}

function onChangeFont(ev){
  changeFont(ev.value);
  onSetTxt();
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
  // var meme = getMeme();
  // var div = meme.lines[0].color;
  changeColor(ev.value);
  // document.querySelector('.colorpicker').addEventListener("mousemove", function (e) {
  //       changeColor(ev.value);
  //       onSetTxt();
  //     });
  onSetTxt();
}

function onSetTxt() {
  renderCanvas();
  drawImg();
  let meme = getMeme();

  if (!meme.selectedLineIdx) {
    let txt = document.querySelector('.line-0').value;
    setTxt(txt, 0);
  }
  drawTxt(
    meme.lines[0].txt,
    meme.lines[0].size,
    meme.lines[0].color,
    meme.lines[0].font,
    meme.lines[0].pos.x,
    meme.lines[0].pos.y
  );

  if (meme.selectedLineIdx) {
    let txt = document.querySelector('.line-1').value;
    setTxt(txt, 1);
  }
  drawTxt(
    meme.lines[1].txt,
    meme.lines[1].size,
    meme.lines[1].color,
    meme.lines[1].font,
    meme.lines[1].pos.x,
    meme.lines[1].pos.y
  );
}

function onSetAlignment(alignment){
  setAlignment(alignment, gElCanvas.width);
  onSetTxt();
}

function renderSavedMemes() {
  let memesData = getSavedMemes();
  let strHtml = `
  <div class="grid-header"></div>
  <section class="grid-container">
  `;
  console.log(memesData);
  memesData.forEach((memeData) => {
    strHtml += `<div class="meme"><img src="${memeData.data}"></div>`;
  });
  strHtml += '</section>';

  let elGrid = document.querySelector('.main-container');
  elGrid.innerHTML = strHtml;
}

function onSaveMeme() {
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

function onDown(ev) {
  const pos = getEvPos(ev);
  if (!findTxtClicked(pos)) return;
  let line = findTxtClicked(pos);
  line.isDragging = true;
  line.pos = pos;

  gCtx.rect(line.pos.x - 230, line.pos.y - 40, 490, 50);
  gCtx.strokeStyle = 'black';
  gCtx.stroke();

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

  renderCanvas();
  drawImg();
  onSetTxt();
}

function onUp() {
  if (!findTxtDragging()) return;
  let line = findTxtDragging();
  line.isDragging = false;
  document.body.style.cursor = 'grab';
}

function findTxtDragging() {
  let meme = getMeme();
  let lines = meme.lines;

  return lines.find((line) => {
    return line.isDragging;
  });
}

function getEvPos(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  };
  return pos;
}

function findTxtClicked(clickedPos) {
  let meme = getMeme();
  let lines = meme.lines;

  return lines.find((line) => {
    return (
      clickedPos.x > line.pos.x - 230 &&
      clickedPos.x < line.pos.x + 260 &&
      clickedPos.y > line.pos.y - 40 &&
      clickedPos.y < line.pos.y + 10
    );
  });

  // gCtx.rect(meme.lines[0].pos.x-230,meme.lines[0].pos.y-40, 490, 50);

  // gCtx.rect(meme.lines[1].pos.x-230,meme.lines[1].pos.y-35, 490, 50);
}

function toggleMenu() {
  document.querySelector('body').classList.toggle('menu-open');
}

function onSwitchLines() {
  let meme = getMeme();
  switchLines();
  renderCanvas();
  drawImg();
  drawTxt(
    meme.lines[0].txt,
    meme.lines[0].size,
    meme.lines[0].color,
    gElCanvas.width / 2,
    100
  );
  drawTxt(
    meme.lines[1].txt,
    meme.lines[1].size,
    meme.lines[1].color,
    gElCanvas.width / 2,
    gElCanvas.height - 50
  );
}

function onChangeTxtPos(diff) {
  setTxtPos(diff);
  onSetTxt();
}
