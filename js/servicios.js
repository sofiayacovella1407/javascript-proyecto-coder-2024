// Definición de servicios
const servicios = [
    {
        id: 1,
        categoria: "Desarrollo Web",
        opciones: [
            {
                id: "web-basic",
                nombre: "Plan Básico",
                descripcion: "Landing page simple + Hosting por 1 año",
                precio: 150000,
                caracteristicas: ["1 página", "Diseño responsive", "Formulario de contacto"]
            },
            {
                id: "web-pro",
                nombre: "Plan Profesional",
                descripcion: "Sitio web completo + SEO básico + Hosting por 1 año",
                precio: 250000,
                caracteristicas: ["Hasta 5 páginas", "Blog", "SEO básico", "Analytics"]
            }
        ]
    },
    {
        id: 2,
        categoria: "Diseño",
        opciones: [
            {
                id: "design-basic",
                nombre: "Pack Básico",
                descripcion: "Logo + Paleta de colores + Tipografía",
                precio: 80000,
                caracteristicas: ["2 propuestas de logo", "Manual de marca básico"]
            },
            {
                id: "design-pro",
                nombre: "Pack Completo",
                descripcion: "Identidad visual completa",
                precio: 150000,
                caracteristicas: ["4 propuestas de logo", "Manual de marca completo", "Papelería básica"]
            }
        ]
    },
    {
        id: 3,
        categoria: "Redes Sociales",
        opciones: [
            {
                id: "social-basic",
                nombre: "Gestión Básica",
                descripcion: "Gestión de 2 redes sociales",
                precio: 60000,
                caracteristicas: ["8 posts mensuales", "2 stories semanales", "Informe mensual"]
            },
            {
                id: "social-pro",
                nombre: "Gestión Premium",
                descripcion: "Gestión completa de redes sociales",
                precio: 100000,
                caracteristicas: ["15 posts mensuales", "Stories diarios", "Reels", "Informe quincenal"]
            }
        ]
    }
];

// Clase para manejar el carrito
class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
        this.actualizarInterfaz();
    }

    agregarItem(servicio) {
        this.items.push(servicio);
        this.guardarCarrito();
        this.actualizarInterfaz();
    }

    eliminarItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarInterfaz();
    }

    calcularTotal() {
        return this.items.reduce((total, item) => total + item.precio, 0);
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    vaciarCarrito() {
        this.items = [];
        this.guardarCarrito();
        this.actualizarInterfaz();
    }

    estaVacio() {
        return this.items.length === 0;
    }

    // Método para actualizar la interfaz del carrito
    actualizarInterfaz() {
        const carritoContainer = document.getElementById('carrito-items');
        const totalElement = document.getElementById('carrito-total');
        const cantidadElement = document.getElementById('carrito-cantidad');

        if (carritoContainer) {
            carritoContainer.innerHTML = '';

            if (this.items.length > 0) {
                this.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'carrito-item';
                    itemElement.innerHTML = `
                        <div class="producto-card">
                            <h3>${item.nombre}</h3>
                            <p class="precio">$${item.precio.toLocaleString()}</p>
                            <button onclick="carrito.eliminarItem('${item.id}')" class="btn-eliminar">
                                Eliminar
                            </button>
                        </div>
                    `;
                    carritoContainer.appendChild(itemElement);
                });
            } else {
                // Si el carrito está vacío
                carritoContainer.innerHTML = '<p class="vacío">Tu carrito está vacío.</p>';
            }

            // Actualizar el total del carrito
            if (totalElement) {
                totalElement.textContent = `Total: $${this.calcularTotal().toLocaleString()}`;
            }

            // Actualizar la cantidad de items en el carrito
            if (cantidadElement) {
                cantidadElement.textContent = this.items.length;
            }
        }
    }
}

// Inicialización del carrito
const carrito = new Carrito();

// Función para mostrar los servicios en el DOM
function mostrarServicios() {
    const serviciosContainer = document.getElementById('servicios-container');

    servicios.forEach(categoria => {
        const categoriaElement = document.createElement('section');
        categoriaElement.className = 'categoria-servicios';

        categoriaElement.innerHTML = 
            `<h2>${categoria.categoria}</h2>
            <div class="opciones-container">
                ${categoria.opciones.map(opcion => 
                    `<div class="opcion-servicio">
                        <div class="plan-card">
                            <h3>${opcion.nombre}</h3>
                            <p class="descripcion">${opcion.descripcion}</p>
                            <p class="precio">$${opcion.precio.toLocaleString()}</p>
                            <ul class="caracteristicas">
                                ${opcion.caracteristicas.map(caract => 
                                    `<li>${caract}</li>`
                                ).join('')}
                            </ul>
                            <button 
                                onclick="carrito.agregarItem({
                                    id: '${opcion.id}',
                                    nombre: '${opcion.nombre}',
                                    precio: ${opcion.precio}
                                })"
                                class="btn-agregar">
                                Agregar al carrito
                            </button>
                        </div>
                    </div>`
                ).join('')}
            </div>
        `;

        serviciosContainer.appendChild(categoriaElement);
    });
}

function comprarCarrito() {
    // Verificar si el carrito está vacío
    if (carrito.estaVacio()) {
        // Mostrar un mensaje si el carrito está vacío
        alert('El carrito está vacío. Agrega productos para realizar la compra');
        return; // No hacer nada más si el carrito está vacío
    }

    // Pedir confirmación antes de realizar la compra
    const confirmarCompra = confirm("¿Estás seguro de que quieres realizar la compra?");

    // Si el usuario confirma, proceder con la compra
    if (confirmarCompra) {
        // Mostrar un mensaje de éxito
        alert('¡Compra realizada con éxito! Pronto me pondré en contacto contigo');

        // Vaciar el carrito
        carrito.vaciarCarrito();
    } else {
        // Si el usuario cancela, no hacer nada
        alert('Compra cancelada');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarServicios();
    let carritoIcono = document.getElementById("carritoIcono");
    let carritoModal = document.getElementById("carritoModal");
    let cerrarBtn = document.querySelector(".cerrar");

    // Asegura que el modal esté oculto al cargar la página
    carritoModal.style.display = "none";

    // Variable para rastrear si el modal está abierto
    let modalAbierto = false;

    // Evento para abrir el modal SOLO cuando se haga clic en el carrito
    carritoIcono.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que otros eventos interfieran
        if (!modalAbierto) {
            carritoModal.style.display = "block";
            document.body.classList.add("modal-abierto"); // Bloquea el scroll del body
            modalAbierto = true;
        }
    });

    // Evento para cerrar el modal
    cerrarBtn.addEventListener("click", function () {
        carritoModal.style.display = "none";
        document.body.classList.remove("modal-abierto"); // Restaura el scroll del body
        modalAbierto = false;
    });
});

  