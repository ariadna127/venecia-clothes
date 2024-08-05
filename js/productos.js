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
const inputsTalle = document.querySelectorAll('.input-talle');
let categoriaActual;

//Filtrar por talle
inputsTalle.forEach((input)=>{
    input.addEventListener('click', ()=>{
        removerTalleMarcado();
        selectOrdenar.value = 'seleccione';
        input.classList.add('active');
        const productosTalle = filtrarTalle(input.id);
        cargarProductos(productosTalle);
        closeFilters();
    })
})

function filtrarTalle(input) {
        let productosTalle;
        let arregloPreciosLs = getPreciosLs();
        setTalle(input);
        if (arregloPreciosLs !== null) {
            let { precioMin, precioMax } = separarEnVariables();
            let productosPrecio = ordenarPrecio(precioMin, precioMax);

            productosTalle = productosPrecio.filter((producto)=>producto.talle === input);

        }else{
            productos = filtrarCategoria();
            productosTalle = productos.filter((producto)=>producto.talle === input);
        }
        if (productosTalle.length !== 0) {
            return productosTalle;
        }else{
            parrafoVacio.classList.remove('disabled');
            return productosTalle;
        }
}

function setTalle(talle) {
    return localStorage.setItem('talle', talle);
}

function getTalle() {
    return localStorage.getItem('talle');
}

function removerTalleMarcado() {
    inputsTalle.forEach(input=>input.classList.remove('active'));
}

function separarEnVariables() {
    let arreglo = getPreciosLs();
    let precioMin = arreglo[0];
    let precioMax = arreglo[1];
    return {precioMin, precioMax};
}






//funcion Get products LS
function getProductsLs() {
    const productsLS = JSON.parse(localStorage.getItem('products'));
    return productsLS;
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

        setCategoria(idCategoria);

        removerTalleMarcado();

        localStorage.removeItem('talle');

        localStorage.removeItem('precios');
        
        selectOrdenar.value = 'seleccione';

        activarSelectyFiltros();

        const productosCategoria = filtrarCategoria();

        cargarProductos(productosCategoria)

        closeFilters();

    })
})


//Filtrar por categoria
function filtrarCategoria() { 
    categoriaActual = getCategoria();
    productos = getProductsLs();
    const categoriaMayuscula = categoriaActual.toUpperCase();
    let productoCategoria = [];
    if (categoriaActual != "todos") {
        tituloCategoria.innerText = categoriaMayuscula;
        productoCategoria = productos.filter((producto)=>producto.categoria === categoriaActual);
        return productoCategoria;        
    } else {
        tituloCategoria.innerText = "PRODUCTOS";
        return productos;
    }
}

//EVENTO ORDENAR POR

function ordenarPor() {
    const talleLs = getTalle();
    const preciosLs = getPreciosLs();

    let productosSelect;

    if ((talleLs !== null && preciosLs !== null) || (preciosLs !== null && talleLs === null)) {
        let { precioMin, precioMax } = separarEnVariables();
        productosSelect =ordenarPrecio(precioMin, precioMax);

    }else if (talleLs !== null) {
        productosSelect = filtrarTalle(talleLs);

    }else{
        productosSelect = filtrarCategoria();

    }
    const productosCopia = [...productosSelect];
    const orden = selectOrdenar.value;

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
    selectOrdenar.value = 'seleccione';
    let productosPrecio = ordenarPrecio(precioDesde.value, precioHasta.value);
    cargarProductos(productosPrecio);
    formPrecio.reset();
    closeFilters();
})


//Funcion ordenar por precio
function ordenarPrecio(precioDesde, precioHasta) {
    precioMin = precioDesde === '' ? 0 : Number(precioDesde);
    precioMax = precioHasta === '' ? Infinity : Number(precioHasta);
    let productosSegunPrecio;
    let talleLs = getTalle();

    if (talleLs !== null) {
        const productosTalle = productos.filter(producto => producto.talle === talleLs);
        if (precioMin != '' || precioMax != '') {
            productosSegunPrecio = productosTalle.filter((producto)=> precioMin < precioMax ? producto.precio >= precioMin && producto.precio <= precioMax : producto.precio >= precioMax && producto.precio <= precioMin); 
            juntarYGuardarPrecios(precioMin, precioMax);
        }
    }else{
        productos = filtrarCategoria();
        if (precioDesde != '' || precioHasta != '') {
            productosSegunPrecio = productos.filter((producto)=> precioMin < precioMax ? producto.precio >= precioMin && producto.precio <= precioMax : producto.precio >= precioMax && producto.precio <= precioMin); 
            juntarYGuardarPrecios(precioMin, precioMax);
        }
    }

    if (productosSegunPrecio.length !== 0) {
        return productosSegunPrecio;
    }else{
        parrafoVacio.classList.remove('disabled');
        return productosSegunPrecio;
    }

}

//Juntar y guardar en LS precioMin y precioMax

function juntarYGuardarPrecios(precio1, precio2) {
    let precios = [precio1, precio2];
    localStorage.setItem('precios', JSON.stringify(precios));
}

//Traer del LS precios y separarlos en precioMin y precioMax;
function getPreciosLs() {
    let arreglo = JSON.parse(localStorage.getItem('precios'));
    return arreglo;
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
    productos = getProductsLs();
    const productosBuscados = productos.filter((producto)=>{
        const nombreSinAcentos = quitarAcentos(producto.nombre).toLowerCase();
        return nombreSinAcentos.includes(productosABuscar) || producto.categoria === productosABuscar;
    }); 
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
    return urlParametro.get('search');
}




//////

document.addEventListener('DOMContentLoaded', ()=>{
    localStorage.removeItem('precios');
    localStorage.removeItem('talle');
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
    conseguirUrlParams();
    categoriaActual = getCategoria();
    if (categoriaActual != 'null') {
        const productosCategoria = filtrarCategoria();
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
    setCategoria(categoriaProducto);
}


//Set categorias en LS
function setCategoria(categoria) {
        localStorage.setItem('categoria-actual', categoria);
        //Actualizar url para reflejar la categoria actual
        const url = new URL(window.location);
        url.searchParams.set('categoria', categoria);
        window.history.replaceState({}, '', url);
    }

//Funcion get categoria LS
function getCategoria() {
    const categoriaLs = localStorage.getItem('categoria-actual');
    return categoriaLs;
}


//SetProductsLs

function setProductos(productos) {
    localStorage.setItem('products', JSON.stringify(productos));
}

