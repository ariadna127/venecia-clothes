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

fetch("../json/productos.json")
.then(response => response.json())
.then(data => {
    productos = data;
    cargarProductos(productos);
}
)


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
        const categoriaMayuscula = idCategoria.toUpperCase();

        if (idCategoria != "todos") {
            tituloCategoria.innerText = categoriaMayuscula;
            const productoCategoria = productos.filter(producto=>producto.categoria === idCategoria);
            console.log(productoCategoria);
            cargarProductos(productoCategoria);          
        } else {
            tituloCategoria.innerText = "PRODUCTOS";
            cargarProductos(productos);
        }

        closeFilters();

    })
})

//EVENTO ORDENAR POR
selectOrdenar.addEventListener('change', ()=>{
    const productosCopia = [...productos];
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

    cargarProductos(productosCopia);
})


//Evento: ordenar por precio

formPrecio.addEventListener('submit', (e)=>{
    e.preventDefault();
    ordenarPrecio();
    formPrecio.reset()
})



//Funcion ordenarPrecio
function ordenarPrecio() {
    if (precioDesde.value != '' || precioHasta.value != '') {
        precioMin = precioDesde.value === '' ? 0 : Number(precioDesde.value);
        precioMax = precioHasta.value === '' ? Infinity : Number(precioHasta.value);
        let productoSegunPrecio = productos.filter((producto)=> precioMin < precioMax ? producto.precio >= precioMin && producto.precio <= precioMax : producto.precio >= precioMax && producto.precio <= precioMin); 
        cargarProductos(productoSegunPrecio);
        if (productoSegunPrecio.length == 0) {
            parrafoVacio.classList.remove('disabled');
            console.log('VACIO');
        }
        closeFilters();
    }
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