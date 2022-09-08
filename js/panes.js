let carrito = JSON.parse(localStorage.getItem("carrito"))||[];
let productosJSON = [];
let lista

//Evento-Cuando la ventana está cargada
window.onload=()=>{
    lista=document.getElementById("milista");
};

function renderizarProductos() {
    //renderizamos los productos 
    console.log(productosJSON)
    for (const prod of productosJSON) {
        lista.innerHTML+=(`<li class="col-sm-3 list-group-item">
        
        <img src="${prod.foto}" width="250px" height="250px">
        <p>Producto: ${prod.nombre}</p>
        <p>Precio $ ${prod.precio}</p>
        
        <button class="btn btn-danger" id='btn${prod.id}'>COMPRAR</button>
    </li>`);
    }
    //EVENTOS
    productosJSON.forEach(prod=> {
         //Evento para cada boton
         document.getElementById(`btn${prod.id}`).onclick= function() {
            agregarACarrito(prod);
        };
    });
}

function agregarACarrito(productoNuevo) {
    let encontrado = carrito.find(p => p.id == productoNuevo.id);
    console.log(encontrado);
    if (encontrado == undefined) {
        let prodACarrito = {
            ...productoNuevo,
            cantidad:1
        };
        carrito.push(prodACarrito);
        console.log(carrito);
        Swal.fire(
            'Nuevo producto agregado al carro',
            productoNuevo.nombre,
            'success'
        );
        //agregamos una nueva fila a la tabla de carrito
        document.getElementById("tablabody").innerHTML+=(`
            <tr id='fila${prodACarrito.id}'>
            <td> ${prodACarrito.id} </td>
            <td> ${prodACarrito.nombre}</td>
            <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
            <td> ${prodACarrito.precio}</td>
            <td> <button class='btn btn-light' onclick='eliminar(${prodACarrito.id})'>🗑️</button>`);
    } else {
        //el producto ya existe en el carro
        //pido al carro la posicion del producto 
        let posicion = carrito.findIndex(p => p.id == productoNuevo.id);
        console.log(posicion);
        carrito[posicion].cantidad += 1;
        //con querySelector falla
        document.getElementById(productoNuevo.id).innerHTML=carrito[posicion].cantidad;
    }
    //siempre debo recalcular el total
    document.getElementById("gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
    localStorage.setItem("carrito",JSON.stringify(carrito));
}

function calcularTotal() {
    let suma = 0;
    for (const elemento of carrito) {
        suma = suma + (elemento.precio * elemento.cantidad);
    }
    return suma;
}

function eliminar(id){
    let indice=carrito.findIndex(prod => prod.id==id);
    carrito.splice(indice,1);//eliminando del carro
    let fila=document.getElementById(`fila${id}`);
    document.getElementById("tablabody").removeChild(fila);//eliminando de la tabla
    document.getElementById("gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
    localStorage.setItem("carrito",JSON.stringify(carrito));
    Swal.fire("Producto eliminado del carro!")
}



//GETJSON de productos.json
async function obtenerJSON() {
    const URLJSON="productos.json"
    const resp=await fetch(URLJSON)
    const data= await resp.json()
    productosJSON = data;
    //ya tengo el dolar y los productos, renderizo las cartas
    renderizarProductos();
}

    obtenerJSON();
