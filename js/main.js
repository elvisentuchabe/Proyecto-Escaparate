document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    inicializarCarrito();
    checkCookies();
    configurarBusqueda(); // Buscador inteligente
});

// Ruta al JSON
const URL_JSON = 'productos.json';

// Variable GLOBAL para tener los productos siempre a mano para buscar
let productosGlobales = [];

// --- 1. CARGA DE DATOS (AJAX) ---
async function cargarProductos() {
    try {
        const response = await fetch(URL_JSON);
        if (!response.ok) throw new Error("Error al cargar JSON");
        
        // Guardamos los productos en la variable global para el buscador
        productosGlobales = await response.json();
        
        renderizarCarrusel(productosGlobales);
        renderizarCatalogo(productosGlobales);

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('contenedor-productos').innerHTML = 
            `<div class="alert alert-danger">Error cargando productos. Intenta usar un servidor local.</div>`;
    }
}

// --- 2. RENDERIZAR CARRUSEL ---
function renderizarCarrusel(productos) {
    const contenedor = document.getElementById('contenedor-carrusel');
    const destacados = [...productos].sort((a, b) => b.visitas - a.visitas).slice(0, 3);
    
    let html = '';
    destacados.forEach((prod, index) => {
        const activeClass = index === 0 ? 'active' : ''; 
        // IMPORTANTE: Pasamos 'prod.imagen' al carrito
        html += `
            <div class="carousel-item ${activeClass}">
                <img src="${prod.imagen}" class="d-block w-100" alt="${prod.nombre}">
                <div class="carousel-caption d-none d-md-block">
                    <h5 class="display-6 fw-bold text-uppercase">TOP VENTAS</h5>
                    <h3>${prod.nombre}</h3>
                    <p class="fs-5">${prod.precio} €</p>
                    <button class="btn btn-warning fw-bold" onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio}, '${prod.imagen}')">¡Lo quiero!</button>
                </div>
            </div>
        `;
    });
    contenedor.innerHTML = html;
}

// --- 3. RENDERIZAR CATÁLOGO ---
function renderizarCatalogo(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    
    // Gestión de búsqueda sin resultados
    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center mt-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h3 class="mt-3 text-muted">No encontramos productos con esa búsqueda</h3>
                <p>Prueba con "zapatillas", "garmin" o "camiseta"</p>
            </div>`;
        return;
    }

    let html = '';
    productos.forEach(prod => {
        // IMPORTANTE: Pasamos 'prod.imagen' al carrito
        html += `
            <div class="col">
                <div class="card h-100 card-producto shadow-sm">
                    <div class="position-relative">
                        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
                        <div class="descripcion-overlay">
                            <p class="small">${prod.descripcion}</p>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fs-6 fw-bold">${prod.nombre}</h5>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="text-primary fw-bold fs-5">${prod.precio} €</span>
                            <button class="btn btn-sm btn-outline-dark" onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio}, '${prod.imagen}')">
                                <i class="bi bi-cart-plus"></i> Añadir
                            </button>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                         <small class="text-muted text-uppercase" style="font-size: 0.7rem">${prod.categoria}</small>
                    </div>
                </div>
            </div>
        `;
    });
    contenedor.innerHTML = html;
}

// --- 4. GESTIÓN DEL CARRITO (Lógica Visual Completa) ---

function agregarAlCarrito(id, nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem('carritoSportSprint')) || [];
    
    // Guardamos ID, Nombre, Precio e IMAGEN
    carrito.push({ id, nombre, precio, imagen });
    
    localStorage.setItem('carritoSportSprint', JSON.stringify(carrito));
    
    // Actualizamos la interfaz completa (Contador + Lista desplegable)
    actualizarCarritoUI();
    
    // Feedback opcional (puedes quitarlo si prefieres que sea silencioso)
    alert(`¡${nombre} añadido al carrito!`);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carritoSportSprint')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carritoSportSprint', JSON.stringify(carrito));
    actualizarCarritoUI();
}

function inicializarCarrito() {
    actualizarCarritoUI();
}

// Esta función se encarga de TODO: Poner el número y dibujar la lista
function actualizarCarritoUI() {
    const carrito = JSON.parse(localStorage.getItem('carritoSportSprint')) || [];
    
    // 1. Actualizar el contador rojo del menú
    const contador = document.getElementById('contador-carrito');
    if(contador) contador.innerText = carrito.length;

    // 2. Pintar los productos dentro del Offcanvas (Menú lateral)
    const contenedorCarrito = document.getElementById('carrito-body');
    const totalElemento = document.getElementById('carrito-total');
    
    if (contenedorCarrito && totalElemento) {
        contenedorCarrito.innerHTML = ''; // Limpiamos lo anterior
        let total = 0;

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = `
                <div class="text-center mt-5">
                    <i class="bi bi-basket display-1 text-muted"></i>
                    <p class="text-muted mt-3">Tu cesta está vacía.</p>
                </div>
            `;
        } else {
            carrito.forEach((prod, index) => {
                total += prod.precio;
                
                // Placeholder por si alguna imagen antigua fallara
                const imgSrc = prod.imagen || 'https://via.placeholder.com/50';

                const item = document.createElement('div');
                item.classList.add('card', 'mb-3', 'border-0', 'shadow-sm');
                item.innerHTML = `
                    <div class="row g-0 align-items-center">
                        <div class="col-3">
                            <img src="${imgSrc}" class="img-fluid rounded-start" alt="${prod.nombre}" style="max-height: 60px; object-fit: contain;">
                        </div>
                        <div class="col-9">
                            <div class="card-body p-2 position-relative">
                                <h6 class="card-title mb-1 small fw-bold">${prod.nombre}</h6>
                                <p class="card-text text-primary mb-0 small">${prod.precio} €</p>
                                <button onclick="eliminarDelCarrito(${index})" class="btn btn-link text-danger p-0 position-absolute top-0 end-0 me-2" title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                contenedorCarrito.appendChild(item);
            });
        }
        
        totalElemento.innerText = total.toFixed(2) + ' €';
    }
}

// --- 5. SISTEMA DE BÚSQUEDA Y FILTROS ---
function configurarBusqueda() {
    const inputBuscar = document.getElementById('inputBuscar');
    const btnVoz = document.getElementById('btnVoz');
    const botonesFiltro = document.querySelectorAll('.filter-btn');

    // A) Búsqueda por TECLADO
    inputBuscar.addEventListener('input', (evento) => {
        const texto = evento.target.value.toLowerCase();
        filtrarProductos(texto);
        
        // Reset visual de botones
        botonesFiltro.forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-primary');
        });
    });

    // B) Filtro por CATEGORÍA (Botones)
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Estilos
            botonesFiltro.forEach(b => {
                b.classList.remove('active', 'btn-primary');
                b.classList.add('btn-outline-primary');
            });
            e.target.classList.remove('btn-outline-primary');
            e.target.classList.add('active', 'btn-primary');

            // Lógica
            const categoria = e.target.getAttribute('data-cat');
            inputBuscar.value = ''; // Limpiar buscador texto

            if (categoria === 'all') {
                renderizarCatalogo(productosGlobales);
            } else {
                const filtrados = productosGlobales.filter(p => 
                    p.categoria.toLowerCase() === categoria
                );
                renderizarCatalogo(filtrados);
            }
        });
    });

    // C) Búsqueda por VOZ
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;

        btnVoz.addEventListener('click', () => {
            recognition.start();
            btnVoz.innerHTML = '<i class="bi bi-mic-mute-fill text-danger"></i>';
        });

        recognition.onresult = (event) => {
            const texto = event.results[0][0].transcript.toLowerCase();
            inputBuscar.value = texto; 
            filtrarProductos(texto);
            btnVoz.innerHTML = '<i class="bi bi-mic-fill text-dark"></i>';
        };

        recognition.onend = () => {
             btnVoz.innerHTML = '<i class="bi bi-mic-fill text-dark"></i>';
        };
    } else {
        if(btnVoz) btnVoz.style.display = 'none';
    }
}

// Función auxiliar para filtrar
function filtrarProductos(texto) {
    const filtrados = productosGlobales.filter(prod => {
        const nombre = prod.nombre.toLowerCase();
        const descripcion = prod.descripcion ? prod.descripcion.toLowerCase() : ''; 
        return nombre.includes(texto) || descripcion.includes(texto);
    });

    renderizarCatalogo(filtrados);
}

// --- 6. COOKIES ---
function checkCookies() {
    const cookiesAceptadas = localStorage.getItem('cookiesAceptadas');
    const banner = document.getElementById('aviso-cookies');

    if (!cookiesAceptadas && banner) {
        banner.style.display = 'block';
        document.getElementById('btn-aceptar-cookies').addEventListener('click', () => {
            localStorage.setItem('cookiesAceptadas', 'true');
            banner.style.display = 'none';
        });
    }
}