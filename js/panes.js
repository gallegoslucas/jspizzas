let productosJSON = [];
let lista;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

window.onload=()=>{
    lista=document.getElementById("milista");
};
function agregarACarrito(productoNuevo) {
    let encontrado = carrito.find(p => p.id == productoNuevo.id);
    console.log(encontrado);
    if (encontrado == undefined) {
        let prodACarrito = {
            ...productoNuevo,
            cantidad: 1
        };
        carrito.push(prodACarrito);
        console.log(carrito);
        Swal.fire(
            'Nuevo producto agregado al carro',
            productoNuevo.nombre,
            'success'
        );
        //agregamos una nueva fila a la tabla de carrito
        document.getElementById("items").innerHTML += (`
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
        document.getElementById(productoNuevo.id).innerHTML = carrito[posicion].cantidad;
    }


}

function calcularTotal() {
    let suma = 0;
    for (const elemento of carrito) {
        suma = suma + (elemento.precio * elemento.cantidad);
    }
    return suma;
}

function eliminar(id) {
    let indice = carrito.findIndex(prod => prod.id == id);
    carrito.splice(indice, 1);//eliminando del carro
    let fila = document.getElementById(`fila${id}`);
    document.getElementById("tablabody").removeChild(fila);//eliminando de la tabla
    document.getElementById("gastoTotal").innerText = (`Total: $ ${calcularTotal()}`);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    Swal.fire("Producto eliminado del carro!")
}


//RENDERIZAR PRODUCTOS
function renderizarProductos() {
    for (const prod of productosJSON) {
        lista.innerHTML += (`<section class="d-flex justify-content-center mt-5  ">
        <article class="container">
         <div id="contenedor-productos" class="row row-cols-1 row-cols-md-2 g-4 ">
            <div class="card m-2 p-2">
                <img src="${prod.foto}" class="card-img-top" alt="Brownie">
                    <div class="card-body">
                        <h5>${prod.nombre}</h5>
                        <h6>${prod.ingredientes}</h6>
                        <p>$ ${prod.precio}</p>
                        <div>
                        <button class="btn btn-success" id='btn${prod.id}'>Comprar</button>
                        </div>
                    </div>
            </div>
            </div>
            </article>
            </section>`);
        
    }

    //EVENTOS
    productosJSON.forEach(prod => {
        document.getElementById(`btn${prod.id}`).onclick = function () {

            agregarACarrito(prod);

            swal({
                title: "¡Producto agregado!",
                text: `${prod.nombre} agregado al carrito de compra.`,
                icon: "success",
                buttons: {
                    cerrar: {
                        text: "Cerrar",
                        value: false
                    },
                    carrito: {
                        text: "Ir a carrito",
                        value: true
                    }
                }
            }).then((irACarrito) => {

                if (irACarrito) {

                    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), { keyboard: true });
                    const modalToggle = document.getElementById('toggleMyModal');
                    myModal.show(modalToggle);

                }
            });
        };
    });
}


//GETJSON de productos.json
async function obtenerJSON() {
    const URLJSON="productos.json"
    const resp=await fetch(URLJSON)
    const data= await resp.json()
    productosJSON = data;
    renderizarProductos();
}
obtenerJSON();
    