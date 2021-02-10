'use strict';
let gElCanvas;
let gCtx;

function onInit() {
  _createImgs(18);
  renderGallery();
//  renderDesignPage(1);
}

function renderGallery() {
  let imgs = getImgs();
  let strHtml = '<section class="grid-container">';

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
    <div class="main-design-container">

    <section class="canvas-container">
    <canvas id="meme-canvas" height="500" width="500" onclick=""><img class="img-meme" src="${img.url}"></canvas>
    </section>
    
    <section class="design-tools">
    <input type="text" id="line-1" onkeyup="onSetTxt()">
    <input type="text" id="line-2" onkeyup="onSetTxt()">

    <button class="increase-txt" onclick="onChangeTxtSize(2)">+</button>
    <button class="decrease-txt" onclick="onChangeTxtSize(-2)">-</button>

    <button class="txt-up" onclick="onChangeTxtPos(2)">&#8593;</button>
    <button class="txt-down" onclick="onChangeTxtPos(-2)">&#8595;</button>
    
    <button class="lines-switch" onclick="onSwitchLines()">switch</button>
    </section>

    </div>
    `;
  let elDesignSection = document.querySelector('.main-container');
  elDesignSection.innerHTML = strHtml;

  renderCanvas();
  resizeCanvas();
  drawImg();
  drawTxt();
}

function drawImg() {
  const elImg = document.querySelector('.img-meme');
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function resizeCanvas() {
  const elContainer = document.querySelector('.canvas-container');
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height = elContainer.offsetHeight;
}

function renderCanvas(){
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
}

function onChangeTxtSize(diff){
    setTxtSize(diff);
    onSetFirstLineTxt();
}

function onChangeTxtPos(diff){
    setTxtPos(diff);
    onSetFirstLineTxt();
}

function onSwitchLines(){
    let meme = getMeme();
    switchLines();
    renderCanvas();
    drawImg();
    drawTxt(`${meme.lines[0].txt}`,`${meme.lines[0].size}`, gElCanvas.width/2, `${meme.lines[0].pos}` );
    drawTxt(`${meme.lines[1].txt}`,`${meme.lines[1].size}`, gElCanvas.width/2, 400 );
}

function drawTxt(txt,size, x, y){
    gCtx.beginPath();

    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle= 'white';
    gCtx.textAlign = 'center';
    gCtx.font = `${size}px IMPACT`;
    
    gCtx.fillText(txt,x,y);
    gCtx.strokeText(txt,x,y);
}


function onSetTxt(){
    renderCanvas();
    drawImg();
    console.log('fd');
    let meme = getMeme();
    
    let txt1 = document.querySelector('#line-1').value;
    setTxt(txt1, 0);
    drawTxt(txt1,`${meme.lines[0].size}`, gElCanvas.width/2, `${meme.lines[0].pos}` );
    
    let txt2 = document.querySelector('#line-2').value;
    setTxt(txt2, 1);
    drawTxt(txt2,`${meme.lines[1].size}`, gElCanvas.width/2, 400 );
}
