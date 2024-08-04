
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
                                    <i id="restar" class="bi bi-dash-lg suma-resta"></i>
                                    <span>0</span>
                                    <i id="sumar" class="bi bi-plus-lg suma-resta"></i>
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



function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto)=> acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


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
    console.log(productosEnCarrito);
    localStorage.setItem('productos-carrito', JSON.stringify(productosEnCarrito));
    cargarProductosEnCarrito();
    

}

botonVaciarCarrito.addEventListener('click', vaciarCarrito);

function vaciarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem('productos-carrito', JSON.stringify(productosEnCarrito));
    cargarProductosEnCarrito();
}

function actualizarTotal() {
    const total = productosEnCarrito.reduce((acc, producto)=> acc + (producto.precio * producto.cantidad), 0);
    parrafoTotal.innerText = `$${total}`;
}


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