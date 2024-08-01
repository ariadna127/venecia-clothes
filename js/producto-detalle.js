//Traemos los elementos del DOM
const mainProductDetail = document.querySelector('#main-product-detail');


//get url params
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');
    return idProducto;
}

const idProducto = getUrlParams();



//get productos de LS

function getProductosLS() {
    return JSON.parse(localStorage.getItem('products'));
}

const productos = getProductosLS();

//Encontrar producto
function buscarProducto(idProducto, productos) {
    return productos.find(producto => producto.id == idProducto);
}




// funcion mostrar producto
function mostrarProducto() {
    mainProductDetail.innerHTML = "";
    const producto = buscarProducto(idProducto, productos);
    const divProducto = document.createElement('div');
    divProducto.classList.add('contenedor-producto');
    divProducto.innerHTML = `
    <div class="contenedor-producto-img">
        <img src="${producto.img}" alt="${producto.nombre}">
    </div>
    <div class="detalles-producto">
                <h2>${producto.nombre}</h2>
                <p><strong>$${producto.precio}</strong></p>
                <p><i class="bi bi-credit-card"></i> Hasta 3 cuotas SIN interés con <span>tarjeta de débito</span></p>
                <p><i class="bi bi-truck"></i>Envío gratis</p>
                <p>Categoria: <span>${producto.categoria}</span></p>
                <div class="div-agregar-carrito">
                    <div>
                        <i id="restar" class="bi bi-dash-lg"></i>
                        <span>0</span>
                        <i id="sumar" class="bi bi-plus-lg"></i>
                    </div>
                    <button id="${producto.id}">Agregar al carrito</button>                 
                </div>
            </div>
    `
    mainProductDetail.append(divProducto);
}

mostrarProducto();


            












