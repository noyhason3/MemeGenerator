

function onInit(){
    _createImgs(15);
    renderGallery();
}

function renderGallery(){
    let imgs = getImgs();
    let strHtml='';

    imgs.forEach(img => {
        strHtml+=`<div class="img img-${img.id}"><img src="${img.url}"></div>`
    });

    let elGrid = document.querySelector('.gallery-container')
    elGrid.innerHTML = strHtml;

}




