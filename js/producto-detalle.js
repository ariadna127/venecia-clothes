//Traemos los elementos del DOM
const mainProductDetail = document.querySelector('#main-product-detail');
const numerito = document.querySelector('#numerito');


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

let cantidadProducto = 1;


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
                        <i id="restar" class="bi bi-dash-lg suma-resta"></i>
                        <span id="cantidad-num" class ="cantidad-num">${cantidadProducto}</span>
                        <i id="sumar" class="bi bi-plus-lg suma-resta"></i>
                    </div>
                    <button class="btn-agregar" id="${producto.id}">Agregar al carrito</button>                 
                </div>
            </div>
    `
    mainProductDetail.append(divProducto);

    actualizarBotonesSumarRestar();

    actualizarBotonAgregar();
}

mostrarProducto();


//Funcion para elegir la cantidad de productos a comprar
function actualizarBotonesSumarRestar() {
    const botonesSumaResta = document.querySelectorAll('.suma-resta');
    let numCantidad = document.getElementById('cantidad-num');
    botonesSumaResta.forEach((btn)=>{
        btn.addEventListener('click', (e)=>{
            const idBoton = e.currentTarget.id;
            if (idBoton == "sumar") {
                cantidadProducto++;
                numCantidad.innerText = cantidadProducto;
            }else if (numCantidad.innerText > 1) {
                cantidadProducto--;
                numCantidad.innerText = cantidadProducto;
            }
            
        })
    })
}


//Funcion para agregar productos al carrito
function actualizarBotonAgregar() {
    const botonAgregar = document.querySelector('.btn-agregar');

    botonAgregar.addEventListener('click', agregarAlCarrito);
}



function setProductosEnCarrito() {
    localStorage.setItem('productos-carrito', JSON.stringify(productosEnCarrito));
}


let productosEnCarrito = localStorage.getItem('productos-carrito');


if (productosEnCarrito) {
    productosEnCarrito = JSON.parse(productosEnCarrito);
    actualizarNumerito();
}else{
    productosEnCarrito = [];
}


function agregarAlCarrito(e) {
    const productoAgregado = buscarProducto(idProducto, productos);

    if (productosEnCarrito.some(producto => producto.id === productoAgregado.id)) {
        const index = productosEnCarrito.findIndex((producto => producto.id === productoAgregado.id));
        productosEnCarrito[index].cantidad += cantidadProducto;
    }else{
        productoAgregado.cantidad = cantidadProducto;
        productosEnCarrito.push(productoAgregado);
    }
    actualizarNumerito();
    setProductosEnCarrito();
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto)=> acc + producto.cantidad, 0);
    console.log(nuevoNumerito);
    numerito.innerText = nuevoNumerito;
}



window.addEventListener('pageshow', ()=>{
    if (productosEnCarrito) {
        console.log(productosEnCarrito);
        actualizarNumerito();
    }else{
        numerito.innerText = 0;
    }
});





