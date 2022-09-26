let productosJSON = [];
let lista;
let  pedro= JSON.parse(localStorage.getItem("pedro")) || [];


const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarritoDeCompras = document.querySelector("#items");
const contenedorFooterDeCarrito = document.querySelector("#panes");


window.onload=()=>{
    lista=document.getElementById("milista");
};


function agregarACarrito() {
    
    let sumaCarrito = 0;
    contenedorCarritoDeCompras.innerHTML = "";

    productosJSON.forEach(
        (elemento) => {
            let renglonesCarrito = document.createElement("tr");
            renglonesCarrito.innerHTML = `
            <td>${elemento.id}</td>
            <td>${elemento.nombre}</td>
            <td><input id="cantidad-producto-${elemento.id}" type="number" value="${elemento.cantidad}" min="1" max="50" step="1" style="width: 50px;"/></td>
            <td>${elemento.precio}</td>
            <td><button id="eliminar-producto-${elemento.id}" type="button" class="btn btn-danger"><i class="bi bi-trash-fill"></i></button></td>
            `;

            contenedorCarritoDeCompras.append(renglonesCarrito);

            sumaCarrito += elemento.cantidad * elemento.precio;

            //agregamos evento a carrito
            let cantidadProductos = document.getElementById(`cantidad-producto-${elemento.id}`);

            cantidadProductos.addEventListener("change", (e) => {
                alert("estoy agregando mas prodcutos")
                let nuevaCantidad = e.target.value;
                elemento.cantidad = nuevaCantidad;
                agregarACarrito();
            });

            let borrarProducto = document.getElementById(`eliminar-producto-${elemento.id}`);

            borrarProducto.addEventListener("click", (e) => {
                removerProductoCarrito(elemento);
                agregarACarrito();
            });
            
        }
    );
    // BOTON FINALIZAR COMPRA
    let finalizar = document.querySelector('#finalizar')
    finalizar.onclick = () => {
        Swal.fire({
            title: 'Orden confirmada!',
            text: 'Gracias por su compra!',
            icon: 'success',
            confirmButtonText: 'Cerrar'
        })
        contenedorCarritoDeCompras.innerHTML = "";
        contenedorFooterDeCarrito.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
    }
    
    productosJSON.length == 0 ? contenedorFooterDeCarrito.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        ` : contenedorFooterDeCarrito.innerHTML = `
          <th scope="row" colspan="5">Total de la compra: $${sumaCarrito}</th>
         `;

}
function removerProductoCarrito(elementoAEliminar) {
    const elementosAMantener = productosJSON.filter((elemento) => elementoAEliminar.id != elemento.id);
    productosJSON.length = 0;

    elementosAMantener.forEach((elemento) => productosJSON.push(elemento));
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
         
          

            agregarACarrito();

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
    