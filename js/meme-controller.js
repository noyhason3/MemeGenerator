'use strict';
let gElCanvas;
let gCtx;

function onInit() {
  _createImgs(18);
  renderGallery();
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
    </section>

    </div>
    `;
  let elDesignSection = document.querySelector('.main-container');
  elDesignSection.innerHTML = strHtml;

  resizeCanvas();
  drawImg();
}

function drawImg() {
  const elImg = document.querySelector('.img-meme');
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
}

function resizeCanvas() {
  const elContainer = document.querySelector('.canvas-container');
  gElCanvas = document.getElementById('meme-canvas');
  gCtx = gElCanvas.getContext('2d');
  gElCanvas.width = elContainer.offsetWidth;
  gElCanvas.height = elContainer.offsetHeight;
}
