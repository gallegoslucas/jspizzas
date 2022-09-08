

class Producto {
    constructor(id, nombre, precio, ingredientes, foto) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.ingredientes = ingredientes;
        this.foto = foto;
    }
}

class ElementoCarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

/**
 * Definiciones de constantes
 */

//Arrays donde guardaremos catálogo de productos y elementos en carrito
const productos = [];
let elementosCarrito = [];
// RECUPERAR CARRITO
if (localStorage.getItem("elementosCarrito") != null) {
    elementosCarrito = JSON.parse(localStorage.getItem("elementosCarrito"));

};
const contenedorProductos = document.getElementById('contenedor-productos');

const contenedorCarritoCompras = document.querySelector("#items")

const contenedorFooterCarrito = document.querySelector("#footer");

/**
 * Ejecución de funciones
 */

cargarProductos();
cargarCarrito();
dibujarCarrito();
dibujarCatalogoProductos();

/**
 * Definiciones de funciones
 */

function cargarProductos() {
    productos.push(new Producto(1, 'Margarita', 800, 'Salsa de tomate, ajo, oregano, albahaca, acSalsa de tomate, mozzarella, cebolla.eite de oliva.', './img/margarita.jpg'));
    productos.push(new Producto(2, 'Fugazzeta', 900, 'Salsa de tomate, mozzarella, cebolla.', './img/fugazzeta.jpg'))
    productos.push(new Producto(3, 'Calabresa', 900, 'Salsa de tomate, mozzarella, calabresa.', './img/calabresa.jpg'));
    productos.push(new Producto(4, 'Rucula y jamon crudo', 950, 'Salsa de tomate, mozzarella, rucula, jamon crudo, parmesano.', './img/ruculaycrudo.jpg'));
}

function cargarCarrito() { }

function dibujarCarrito() {

    let sumaCarrito = 0;
    contenedorCarritoCompras.innerHTML = "";

    elementosCarrito.forEach(
        (elemento) => {
            let renglonesCarrito = document.createElement("tr");

            renglonesCarrito.innerHTML = `
                <td>${elemento.producto.id}</td>
                <td>${elemento.producto.nombre}</td>
                <td><input id="cantidad-producto-${elemento.producto.id}" type="number" value="${elemento.cantidad}" min="1" max="1000" step="1" style="width: 50px;"/></td>
                <td>$ ${elemento.producto.precio}</td>
                <td>$ ${(elemento.producto.precio * elemento.cantidad)}</td>
                <td><button id="eliminar-producto-${elemento.producto.id}" type="button" class="btn btn-danger"><i class="bi bi-trash-fill"></i></button></td>
            `;

            contenedorCarritoCompras.append(renglonesCarrito);

            sumaCarrito += elemento.cantidad * elemento.producto.precio;

            //agregamos evento a carrito
            let cantidadProductos = document.getElementById(`cantidad-producto-${elemento.producto.id}`);

            cantidadProductos.addEventListener("change", (e) => {
                let nuevaCantidad = e.target.value;
                elemento.cantidad = nuevaCantidad;
                dibujarCarrito();
            });

            let borrarProducto = document.getElementById(`eliminar-producto-${elemento.producto.id}`);

            borrarProducto.addEventListener("click", (e) => {
                removerProductoCarrito(elemento);
                dibujarCarrito();
            });
        }
    );

        if (elementosCarrito.length == 0) {
            contenedorFooterCarrito.innerHTML = `
                <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
            `;
        } else {
            contenedorFooterCarrito.innerHTML = `
                <th scope="row" colspan="5">Total de la compra: $${(sumaCarrito)}</th>
            `;
        }
    localStorage.setItem("elementosCarrito", JSON.stringify(elementosCarrito))
}





function removerProductoCarrito(elementoAEliminar) {
    const elementosAMantener = elementosCarrito.filter((elemento) => elementoAEliminar.producto.id != elemento.producto.id);
    elementosCarrito.length = 0;

    elementosAMantener.forEach((elemento) => elementosCarrito.push(elemento));
}

function crearCard(producto) {
    //Botón
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-success";
    botonAgregar.innerText = "Agregar";

    //Card body
    let cuerpoCarta = document.createElement("div");
    cuerpoCarta.className = "card-body";
    cuerpoCarta.innerHTML = `
        <h5>${producto.nombre}</h5>
        <h6>${producto.ingredientes}</h6>
        <p>$ ${producto.precio} </p>
    `;
    cuerpoCarta.append(botonAgregar);

    //Imagen
    let imagen = document.createElement("img");
    imagen.src = producto.foto;
    imagen.className = "card-img-top";
    imagen.alt = producto.nombre;

    //Card
    let carta = document.createElement("div");
    carta.className = "card m-2 p-2";
    carta.style = "width: 18rem";
    carta.append(imagen);
    carta.append(cuerpoCarta);


    botonAgregar.onclick = () => {
        let elementoExistente = elementosCarrito.find((elemento) => elemento.producto.id == producto.id);

        if (elementoExistente) {
            elementoExistente.cantidad += 1;
        } else {
            let elementoCarrito = new ElementoCarrito(producto, 1);
            elementosCarrito.push(elementoCarrito);
        }
        dibujarCarrito();
        swal({
            title: "¡Producto agregado!",
            text: `${producto.nombre} agregado al carrito de compra.`,
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

    }
    return carta;
}
function dibujarCatalogoProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach(
        (producto) => {
            let contenedorCarta = crearCard(producto);
            contenedorProductos.append(contenedorCarta);
        }
    );
}