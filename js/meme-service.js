'use strict';
let gNextId = 1;
let gKeywords = { happy: 11, pet: 2 };
let gImgs = [];

let gMeme = {
  selectedImgId: 5,
  selectedLineIdx: 0,

  lines: [
    {
      txt: 'We are cute dogs',
      size: 20,
      align: 'left',
      color: 'red',
    },
  ],
};

function setMemeId(imgId){
  gMeme.selectedImgId = imgId;
}




function getImg(imgId){
  return gImgs.find(img=>{
    return (img.id===imgId)
  })
}


function getImgs() {
  return gImgs;
}













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
