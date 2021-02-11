'use strict';
let gNextId = 1;
let gKeywords = { happy: 11, pet: 2 };
let gImgs = [];
let gSavedMemes=[];

let gMeme = {
  selectedImgId: 0,
  selectedLineIdx: 0,

  lines: [
    {
      txt: '',
      size: 30,
      align: 'center',
      color: 'white',
      font: 'IMPACT',
      pos:{
        x:250,
        y:100,
      },
      isDragging: false,
    },
    {
      txt: '',
      size: 30,
      align: 'center',
      color: 'white',
      font: 'IMPACT',
      pos:{
        x:250,
        y:485
      },
      isDragging: false,
    },
  ],
};

function resizeLinesPos(width){
    gMeme.lines[0].pos.x= width/2
    gMeme.lines[0].pos.y= width/5
    gMeme.lines[1].pos.x= width/2
    gMeme.lines[1].pos.y= width-30
}

function setSelectedLineIdx(idx){
  gMeme.selectedLineIdx=idx;
  console.log(gMeme.selectedLineIdx);

}

function switchLines(){
  let firstLine = gMeme.lines[0];
  let secondLine = gMeme.lines[1];
  gMeme.lines[0] = secondLine
  gMeme.lines[1] = firstLine
  // gMeme.lines.splice(0,1,secondLine)
  // gMeme.lines.splice(1,1,firstLine)
  
  console.log(gMeme);
  

console.log(gMeme.lines[0]);
}

function setMemeId(imgId){
  gMeme.selectedImgId = imgId;
}

function setTxtPos(diff){
  let idx = gMeme.selectedLineIdx;
  gMeme.lines[idx].pos-=diff
}

function setTxtSize(diff){
  let idx = gMeme.selectedLineIdx;
  gMeme.lines[idx].size+=diff
}

function changeColor(color){
  gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function changeFont(font){
  gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function setAlignment(alignment, width){
  if (alignment==='left'){
    return gMeme.lines[gMeme.selectedLineIdx].pos.x = width/5
  } 
  if (alignment==='center'){
    return gMeme.lines[gMeme.selectedLineIdx].pos.x = width/2
  } 
  if (alignment==='right'){
    return gMeme.lines[gMeme.selectedLineIdx].pos.x = width/1.3
  } 
}

function setTxt(txt, idx){
   gMeme.lines[idx].txt=txt;
}

function getMeme(){
  return gMeme;
}



function getImg(imgId){
  return gImgs.find(img=>{
    return (img.id===imgId)
  })
}


function getImgs() {
  return gImgs;
}

function getSavedMemes(){
  return loadFromStorage('memes');
}

function saveMeme(data){
  gSavedMemes.push({data});
  saveToStorage('memes', gSavedMemes );
}

// function saveMeme(){
//   let memes = loadFromStorage('memes')
//   if (!memes) return saveToStorage('memes', [gMeme]);
//   memes.push(gMeme);
//   saveToStorage('memes', memes );
// }












function _createImg() {
  let img = { 
    id: gNextId, 
    url: `imgs/${gNextId}.jpg`, 
    keywords: ['img'] 
  };
  gNextId++;
  return img;
}

function _createImgs(count){
  for (let i=0; i<count; i++){
    gImgs.push(_createImg());
  }
}
