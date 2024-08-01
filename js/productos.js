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
const formBusqueda = document.querySelector('#form-busqueda');
const inputBuscar = document.querySelector('#buscando');
const parrafoBusqueda = document.querySelector('#p-vacio-busqueda');
const contenedorSelectOrdenar = document.querySelector('#contenedor-ordenar-por');
const filtrosTalle = document.querySelector('#filtros-talle');
const filtrosPrecio = document.querySelector('#filtros-precio');





//funcion Get products LS
function getProductsLs() {
    const productsLS = JSON.parse(localStorage.getItem('products'));
    return productsLS;
}


//Funcion get categoria LS
function getCategoria() {
    const categoriaLs = localStorage.getItem('categoria-actual');
    return categoriaLs;
}


//Cargar productos en el DOM
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

        activarSelectyFiltros();

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
    console.log(categoriaActual);
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

//Evento change del select ordenar
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


//Funcion ordenar por precio
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


//get productos segun precio del LS
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



//BARRA DE BUSQUEDA - FILTRAR POR BUSQUEDA
formBusqueda.addEventListener('submit', (e)=>{
    e.preventDefault();
    filtrarPorbusqueda(inputBuscar.value);
})

function filtrarPorbusqueda(itemBuscar) {
    productosCategorias.forEach(categoria => categoria.classList.remove('active'));
    desactivarSelectyFiltros();
    const productosABuscar = quitarAcentos(itemBuscar).toLowerCase();
    const productosLs = getProductsLs();
    const productosBuscados = productosLs.filter((producto)=>{
        const nombreSinAcentos = quitarAcentos(producto.nombre).toLowerCase();
        return nombreSinAcentos.includes(productosABuscar) || producto.categoria === productosABuscar;
    }); 
    console.log(productosBuscados);
    tituloCategoria.innerText = 'RESULTADO DE BUSQUEDA';
    if (productosBuscados.length == 0) {
        contenedorProductos.innerHTML = "";
        parrafoBusqueda.classList.remove('disabled');
    } else {
        parrafoBusqueda.classList.add('disabled');
        cargarProductos(productosBuscados);
    }
    formBusqueda.reset();
    //Eliminar el parametro de busqueda de la URL
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
}


//funcion para quitar acentos 
function quitarAcentos(cadena) {
    return cadena.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

//desactivar select y filtros
function desactivarSelectyFiltros() {
    contenedorSelectOrdenar.classList.add('disabled');
    filtrosTalle.classList.add('disabled');
    filtrosPrecio.classList.add('disabled');
}

//activar select y filtros
function activarSelectyFiltros() {
    contenedorSelectOrdenar.classList.remove('disabled');
    filtrosTalle.classList.remove('disabled');
    filtrosPrecio.classList.remove('disabled');
}

//Busqueda desde otro HTML

function getParametroDeBusqueda() {
    const urlParametro = new URLSearchParams(window.location.search);
    console.log(urlParametro);
    return urlParametro.get('search');
}




//////

document.addEventListener('DOMContentLoaded', ()=>{
    if (JSON.parse(localStorage.getItem('products')) === null) {
        fetch("../json/productos.json")
        .then(response => response.json())
        .then(data => {
            productos = data;
            setProductos(productos)
            getParametroDeBusqueda();
            const itemBuscado = getParametroDeBusqueda();
            if (itemBuscado) {
                inputBuscar.value = itemBuscado;
                console.log(itemBuscado);
                filtrarPorbusqueda(itemBuscado);
            }else{
                manejarProductos();
            }

        }
    )
    }else{
        const itemBuscado = getParametroDeBusqueda();
            if (itemBuscado) {
                inputBuscar.value = itemBuscado;
            filtrarPorbusqueda(itemBuscado);
            }else{
                manejarProductos();
            }
    }
    

    
})

function manejarProductos() {
    const categoriaUrl = conseguirUrlParams();
    console.log(categoriaUrl);
    if (categoriaUrl != null) {
        const productosCategoria = filtrarCategoria(categoriaUrl);
        cargarProductos(productosCategoria); 
    }else{
        productos = getProductsLs();
        setCategoria('todos');
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

