let productos = [];

//Traemos las cosas del DOM

const contenedorProductos = document.querySelector('#contenedor-productos');
let productosCategorias = document.querySelectorAll('.li-categoria'); 
const tituloCategoria = document.querySelector('#titulo-categoria');
const selectOrdenar = document.querySelector('#select-ordenar');
const formPrecio = document.querySelector('#form-precio');
const precioDesde = document.querySelector('#precio-desde');
const precioHasta = document.querySelector('#precio-hasta');
const parrafoVacio = document.querySelector('#p-vacio');
const filtrarProd = document.querySelector('#filtrar-prod');
const filtros = document.querySelector('#filtros');
const cerrarFiltros = document.querySelector('#cerrar-filtros');
const body = document.querySelector('body');





//funcion Get products LS
function getProductsLs() {
    const productsLS = JSON.parse(localStorage.getItem('products'));
    return productsLS;
}



function getCategoria() {
    const categoriaLs = localStorage.getItem('categoria-actual');
    return categoriaLs;
}

function cargarProductos(productos) {
    if (productos.length != 0) {
        parrafoVacio.classList.add('disabled');
    }
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        const enlace = document.createElement("a");
        enlace.href= `../pages/producto-detalle.html?id=${producto.id}`;
        enlace.innerHTML = `
            <div class="cards">
                <img src="${producto.img}" alt="${producto.nombre}">
                <div>
                    <p>${producto.nombre}</p>
                    <p><strong>$${producto.precio}</strong></p>
                </div>
            </div>
        `;
        contenedorProductos.append(enlace);
    });
}



//CATEGORIAS
productosCategorias.forEach((categoria)=>{
    categoria.addEventListener('click', (e)=>{
        productosCategorias.forEach(categoria => categoria.classList.remove("active"));

        e.currentTarget.classList.add("active");

        const idCategoria = e.currentTarget.id;

        localStorage.removeItem('productos-segun-precio');
        
        selectOrdenar.value = 'seleccione';

        const productosCategoria = filtrarCategoria(idCategoria);

        cargarProductos(productosCategoria)

        closeFilters();

    })
})

//Filtrar por categoria
function filtrarCategoria(categoria) { 
    const productoSegunPrecio = getProductosSegunPrecio();
    console.log(productoSegunPrecio);
    productos = getProductsLs();
    const categoriaMayuscula = categoria.toUpperCase();
    let productoCategoria = [];
    setCategoria(categoria);
    if (categoria != "todos") {
        tituloCategoria.innerText = categoriaMayuscula;
        if (productoSegunPrecio) {
            productoCategoria = productoSegunPrecio.filter(producto=>producto.categoria === categoria);
        }else{
            console.log('no hay productos segun precio', productoSegunPrecio);
            console.log(productos);
            productoCategoria = productos.filter(producto=>producto.categoria === categoria);
        } 
        console.log(productoCategoria);
        return productoCategoria;        
    } else {
        tituloCategoria.innerText = "PRODUCTOS";
        if (productoSegunPrecio) {
            return productoSegunPrecio;
        }else{
            return productos
        }
    }

}

//EVENTO ORDENAR POR

function ordenarPor() {
    const categoriaActual = getCategoria();
    const productosCategoria = filtrarCategoria(categoriaActual);
    const productosCopia = [...productosCategoria];
    const orden = selectOrdenar.value;
    console.log(orden);
    if (orden === 'a-z' || orden === 'z-a') {
        productosCopia.sort((a, b)=>{
            if(a.nombre < b.nombre){
                return orden === 'a-z' ? -1 : 1;
            }else if (a.nombre > b.nombre) {
                return orden === 'a-z' ? 1 : -1;
            }else{
                return 0;
            }
        });
    }
    if (orden === 'p:men-ma' || orden === 'p:ma-me') {
        productosCopia.sort((a, b)=>{
            if(a.precio < b.precio){
                return orden === 'p:men-ma' ? -1 : 1;
            }else if (a.precio > b.precio) {
                return orden === 'p:men-ma' ? 1 : -1;
            }else{
                return 0;
            } 
        });
    }
    if (orden === 'mas-viejo-nuev' || orden === 'mas-nuev-viejo') {
        productosCopia.sort((a, b)=>{
            if (new Date(a.fechaIngreso) < new Date(b.fechaIngreso)) {
                return orden === 'mas-viejo-nuev' ? -1 : 1;
            }else if (new Date(a.fechaIngreso) > new Date(b.fechaIngreso)) {
                return orden === 'mas-viejo-nuev' ? 1 : -1;
            } else {
                return 0;
            }
        })
    }
    return productosCopia;
}

selectOrdenar.addEventListener('change', ()=>{
    const productosOrdenados = ordenarPor();
    cargarProductos(productosOrdenados);
})


//Evento: ordenar por precio

formPrecio.addEventListener('submit', (e)=>{
    e.preventDefault();
    localStorage.removeItem('productos-segun-precio');
    selectOrdenar.value = 'seleccione';
    ordenarPrecio();
    formPrecio.reset()
})



//Funcion ordenarPrecio
function ordenarPrecio() {
    const categoriaActual = getCategoria();
    const productosCategoria = filtrarCategoria(categoriaActual);
    precioMin = precioDesde.value === '' ? 0 : Number(precioDesde.value);
    precioMax = precioHasta.value === '' ? Infinity : Number(precioHasta.value);
    if (precioDesde.value != '' || precioHasta.value != '') {
        let productoSegunPrecio = productosCategoria.filter((producto)=> precioMin < precioMax ? producto.precio >= precioMin && producto.precio <= precioMax : producto.precio >= precioMax && producto.precio <= precioMin); 
        localStorage.setItem('productos-segun-precio', JSON.stringify(productoSegunPrecio));
        cargarProductos(productoSegunPrecio);
        if (productoSegunPrecio.length == 0) {
            parrafoVacio.classList.remove('disabled');
            console.log('VACIO');
        }
        closeFilters();
    }
}

//get productos segun precio

function getProductosSegunPrecio() {
    const productoSegunPrecio = JSON.parse(localStorage.getItem('productos-segun-precio'));
    return productoSegunPrecio;
}

//Funcion vaciar Input que tenga coma o punto
function vaciarInput(input) {
    input.addEventListener('input', (e)=>{
        if (input.value.includes('.')||input.value.includes(',')){
            input.value = '';
        }
    })

}

vaciarInput(precioDesde);
vaciarInput(precioHasta);





//EVENTO:MOSTRAR y ESCONDER FILTROS
filtrarProd.addEventListener('click', ()=>{
    filtros.classList.add('visible');
    body.classList.add('no-scroll');

})

cerrarFiltros.addEventListener('click', ()=>{
    closeFilters();
})


function closeFilters(params) {
    filtros.classList.remove('visible');
    body.classList.remove('no-scroll');
}


//////

document.addEventListener('DOMContentLoaded', ()=>{
    
    fetch("../json/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        setProductos(productos)
        manejarProductos(productos);
        }
    )

    
})

function manejarProductos(productos) {
    const categoriaUrl = conseguirUrlParams();
    const categoriaActual = getCategoria();
    console.log(categoriaUrl);
    console.log(categoriaActual);
    if (categoriaUrl != null) {
        const productosCategoria = filtrarCategoria(categoriaUrl);
        cargarProductos(productosCategoria); 
    }else if (categoriaActual === null) {
        productos = getProductsLs();
        cargarProductos(productos);
    }

}

function conseguirUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaProducto = urlParams.get('categoria');
    return categoriaProducto;
}


//Set categorias en LS
function setCategoria(categoria) {
        localStorage.setItem('categoria-actual', categoria);
        //Actualizar url para reflejar la categoria actual
        const url = new URL(window.location);
        url.searchParams.set('categoria', categoria);
        window.history.replaceState({}, '', url);
    }

//SetProductsLs

function setProductos(productos) {
    localStorage.setItem('products', JSON.stringify(productos));
}