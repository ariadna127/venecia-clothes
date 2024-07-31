const formBusqueda = document.querySelector('#form-busqueda');


formBusqueda.addEventListener('submit', (e)=>{
    e.preventDefault();
    const productoBuscar = document.querySelector('#buscando').value;
    window.location.href = `./pages/productos.html?search=${encodeURIComponent(productoBuscar)}`;
    formBusqueda.reset();
})