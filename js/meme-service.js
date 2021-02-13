'use strict';
let gNextId = 1;
let gNextIdx=1;
let gKeywords= [];
let gImgsKeywords = {
  1: ['pet'],
  2: ['trump', 'man'],
  3: ['baby', 'dog', 'sleep'],
  4: ['pet', 'computer', 'sleep'],
  5: ['baby', 'succeed'],
  6: ['man'],
  7: ['baby', 'wow'],
  8: ['man'],
  9: ['baby'],
  10: ['obama', 'happy', 'smile'],
  11: ['kiss', 'man'],
  12: ['man'],
  13: ['drink', 'man'],
  14: ['man'],
  15: ['man'],
  16: ['man', 'funny'],
  17: ['man'],
  18: ['toy'],
};
let gImgs = [];
let gSearchedImgs=[];
let gSavedMemes = [];


let gMeme = {
  selectedImgId: 0,
  selectedLineIdx: 0,
  linesCount: 0,

  lines: [
    {
      idx:0,
      txt: '',
      size: 30,
      align: 'center',
      color: 'white',
      font: 'IMPACT',
      pos: {
        x: 250,
        y: 100,
      },
      isDragging: false,
    },
  ],
};

function clearMeme(){
   gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    linesCount: 0,
  
    lines: [
      {
        idx:0,
        txt: '',
        size: 30,
        align: 'center',
        color: 'white',
        font: 'IMPACT',
        pos: {
          x: 250,
          y: 100,
        },
        isDragging: false,
      },
    ],
  };
}

function deleteLine(){
  let idx =gMeme.selectedLineIdx 
  if (!gMeme.linesCount) return;
  gMeme.lines.splice(idx,1);
  gMeme.linesCount--;
  // gMeme.lines.forEach(line=>{
  //   if (line.idx>idx) line.idx--;
  // })
  if (!gMeme.selectedLineIdx) gMeme.selectedLineIdx++;
  else gMeme.selectedLineIdx--;
  console.log(gMeme);
}

function addLine(width, height){
  let yPos;
  if (gMeme.linesCount===0) 
  {
    yPos= width - 30;
  }
  else {
    yPos=height/2
  }
  gMeme.lines.push({
  idx: gNextIdx,
  txt: '',
  size: 30,
  align: 'center',
  color: 'white',
  font: 'IMPACT',
  pos: {
    x: width / 2,
    y: yPos,
  },
  isDragging: false,})
  gMeme.linesCount++;
  gNextIdx++;
}

function resizeLinesPos(width) {
  gMeme.lines[0].pos.x = width / 2;
  gMeme.lines[0].pos.y = width / 5;
  // gMeme.lines[1].pos.x = width / 2;
  // gMeme.lines[1].pos.y = width - 30;
}

function setSelectedLineIdx(idx) {
  gMeme.selectedLineIdx = idx;
}

function setMemeId(imgId) {
  gMeme.selectedImgId = imgId;
}

function setTxtPos(diff) {
  let idx = gMeme.selectedLineIdx;
  gMeme.lines[idx].pos -= diff;
}

function setTxtSize(diff) {
  let idx = gMeme.selectedLineIdx;
  gMeme.lines[idx].size += diff;
}

function changeColor(color) {
  gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function changeFont(font) {
  gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function setAlignment(alignment, width) {
  if (alignment === 'left') {
    return (gMeme.lines[gMeme.selectedLineIdx].pos.x = width / 5);
  }
  if (alignment === 'center') {
    return (gMeme.lines[gMeme.selectedLineIdx].pos.x = width / 2);
  }
  if (alignment === 'right') {
    return (gMeme.lines[gMeme.selectedLineIdx].pos.x = width / 1.3);
  }
}

function setTxt(txt) {
  let idx = gMeme.selectedLineIdx;
  gMeme.lines[idx].txt = txt;
}

function getMeme() {
  return gMeme;
}

function getImg(imgId) {
  return gImgs.find((img) => {
    return img.id === imgId;
  });
}

function getImgs() {
  return gImgs;
}

function loadSavedMemes() {
  if (!loadFromStorage('memes')) return [];
  gSavedMemes = loadFromStorage('memes');
}

function getSavedMemes() {
  return loadFromStorage('memes');
}

function saveMeme(data) {
  gSavedMemes.push({ data });
  saveToStorage('memes', gSavedMemes);
}

function findTxtClicked(clickedPos) {
  let lines = gMeme.lines;

  return lines.find((line) => {
    return (
      clickedPos.x > line.pos.x - 230 &&
      clickedPos.x < line.pos.x + 260 &&
      clickedPos.y > line.pos.y - 40 &&
      clickedPos.y < line.pos.y + 10
    );
  });
}

function findTxtDragging() {
  let lines = gMeme.lines;

  return lines.find((line) => {
    return line.isDragging;
  });
}

function getSearchedImgs(){
  return gSearchedImgs;
}

function searchImgs(keyword) {
  let searchedImgs = gImgs.filter((img) => {
    return img.keywords.find((imgKeyword) => {
      return imgKeyword === keyword;
    });
  });
  gSearchedImgs = searchedImgs;
}

function getKeyWord(keyword){
  return gKeywords.find(obj=>{
    return obj.key===keyword;
  })
}

function addKeyword(keywordObj){
  gKeywords.push(keywordObj);
}

function _getSelectedLine() {
  return gMeme.lines[gMeme.selectedLineIdx];
}

function _getSelectedLineIdx() {
  return gMeme.selectedLineIdx;
}

function _createImg() {
  let img = {
    id: gNextId,
    url: `imgs/${gNextId}.jpg`,
    keywords: gImgsKeywords[gNextId],
  };
  gNextId++;
  return img;
}

function _createImgs(count) {
  for (let i = 0; i < count; i++) {
    gImgs.push(_createImg());
  }
}
