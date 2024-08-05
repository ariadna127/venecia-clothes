//Traemos elementos del DOM
const carritoVacio = document.querySelector('#carrito-vacio');
const contenedorCarritoProductos = document.querySelector('#carrito-productos');
const carritoAcciones = document.querySelector('#carrito-acciones');
const carritoComprado = document.querySelector('#carrito-comprado');
const numerito = document.querySelector('#numerito');
const botonVaciarCarrito = document.querySelector('#vaciar-carrito');
const parrafoTotal = document.querySelector('#p-total');
const botonComprar = document.querySelector('#btn-comprar');
let botonesEliminar;
let productosEnCarrito = localStorage.getItem('productos-carrito');
productosEnCarrito = JSON.parse(productosEnCarrito);


//Funcion para mostrar los productos en el DOM
function cargarProductosEnCarrito() {

    if (productosEnCarrito && productosEnCarrito.length > 0) {

        carritoVacio.classList.add('disabled');
        contenedorCarritoProductos.classList.remove('disabled');
        carritoAcciones.classList.remove('disabled')
        carritoComprado.classList.add('disabled');
    
        contenedorCarritoProductos.innerHTML = '';
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement('div');
            div.classList.add('carrito-producto');
            div.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
                        <div class="detalles">
                            <div>
                                <p>${producto.nombre}</p>
                                <div class="sumar-restar">
                                    <i id="${producto.id}" class="bi bi-dash-lg resta"></i>
                                    <span class="num-cantidad">${producto.cantidad}</span>
                                    <i id="${producto.id}" class="bi bi-plus-lg suma"></i>
                                </div>
                            </div>
                            <div>
                                <i id=${producto.id} class="bi bi-trash eliminar"></i>
                                <p>$${producto.precio * producto.cantidad}</p>
                            </div>
                        </div>
            `;
    
            contenedorCarritoProductos.append(div);
            
        });
        actualizarBotonesSumar();
        actualizarBotonesRestar();
        actualizarNumerito();
        actualizarBotonesEliminar();
        actualizarTotal();
    }else{

        numerito.innerText = 0;
        carritoVacio.classList.remove('disabled');
        contenedorCarritoProductos.classList.add('disabled');
        carritoAcciones.classList.add('disabled')
        carritoComprado.classList.add('disabled');
    }
    
}

cargarProductosEnCarrito();


//Actualizar el la cantidad de productos en el icono carrito
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto)=> acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


//Funciones para eliminar un producto del carrito
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll('.eliminar');

    botonesEliminar.forEach((boton)=>{
        boton.addEventListener('click', eliminarDelCarrito);
    })
}

function eliminarDelCarrito(e) {
    let idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex((producto)=>producto.id == idBoton);
    productosEnCarrito.splice(index, 1);
    localStorage.setItem('productos-carrito', JSON.stringify(productosEnCarrito));
    cargarProductosEnCarrito();
    

}


//Evento y funcion para vaciar carrito
botonVaciarCarrito.addEventListener('click', vaciarCarrito);

function vaciarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem('productos-carrito', JSON.stringify(productosEnCarrito));
    cargarProductosEnCarrito();
}


//Funcion actualizar total
function actualizarTotal() {
    const total = productosEnCarrito.reduce((acc, producto)=> acc + (producto.precio * producto.cantidad), 0);
    parrafoTotal.innerText = `$${total}`;
}


//Evento y funcion para finalizar compra
botonComprar.addEventListener('click', comprarCarrito);

function comprarCarrito() {
    productosEnCarrito.length = 0;
    numerito.innerText = 0;
    localStorage.setItem('productos-carrito', JSON.stringify(productosEnCarrito));
    carritoVacio.classList.add('disabled');
    contenedorCarritoProductos.classList.add('disabled');
    carritoAcciones.classList.add('disabled')
    carritoComprado.classList.remove('disabled');
}


//Sumar y restar la cantidad de productos del carrito
function actualizarBotonesSumar() {
    const botonesSumar = document.querySelectorAll('.suma');
    
    botonesSumar.forEach((boton)=>{
        boton.addEventListener('click', (e)=>{
            const idBoton = e.currentTarget.id;
            const index = productosEnCarrito.findIndex((producto)=> producto.id == idBoton);
            productosEnCarrito[index].cantidad++;
            localStorage.setItem('productos-carrito', JSON.stringify(productosEnCarrito));
            cargarProductosEnCarrito();
        })
    }
    )
}

function actualizarBotonesRestar() {
    const botonesRestar = document.querySelectorAll('.resta');

    botonesRestar.forEach((boton)=>{
        boton.addEventListener('click', (e)=>{
            const idBoton = e.currentTarget.id;
            const index = productosEnCarrito.findIndex((producto)=> producto.id == idBoton);
            if (productosEnCarrito[index].cantidad > 1) {
                productosEnCarrito[index].cantidad--;
                localStorage.setItem('productos-carrito', productosEnCarrito);
                cargarProductosEnCarrito();
            }
            
        })
    })
}