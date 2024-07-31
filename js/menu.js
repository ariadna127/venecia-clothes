const menu = document.querySelector('#menu');
const ulMenu = document.querySelector('#ul-menu');
const cerrarMenu = document.querySelector('#cerrar-menu');

menu.addEventListener('click', ()=>{
    ulMenu.classList.add('visible');
    bodyClass.classList.add('shadow');
})

cerrarMenu.addEventListener('click', ()=>{
    ulMenu.classList.remove('visible');
})