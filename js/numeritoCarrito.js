const numerito = document.querySelector('#numerito');
let productosEnCarrito = localStorage.getItem('productos-carrito');


if (productosEnCarrito) {
    productosEnCarrito = JSON.parse(productosEnCarrito);
    actualizarNumerito();
}else{
    numerito.innerText = 0;
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto)=> acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


