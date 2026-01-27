/**
 * Lógica principal de SportSprint - OPTIMIZADA
 */

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    checkSesion();
    inicializarCarrito();
    checkCookies();
    configurarBusqueda();
    configurarLogin();
});

const URL_JSON = 'productos.json';
let productosGlobales = []; 
let usuarioActual = null; 
const USUARIOS = [
    { user: 'admin', pass: '1234', nombre: 'Administrador' },
    { user: 'cliente', pass: '1234', nombre: 'Cliente Habitual' }
];

// ... (Las funciones de Login, Logout, checkSesion y actualizarUserUI se mantienen IGUAL) ...
function configurarLogin() {
    const formLogin = document.getElementById('formLogin');
    if(formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('usuarioInput').value;
            const pass = document.getElementById('passwordInput').value;
            login(user, pass);
        });
    }
}

function login(user, pass) {
    const usuarioEncontrado = USUARIOS.find(u => u.user === user && u.pass === pass);
    if (usuarioEncontrado) {
        usuarioActual = usuarioEncontrado;
        localStorage.setItem('sesionActiva', JSON.stringify(usuarioActual));
        const modalEl = document.getElementById('loginModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        document.getElementById('formLogin').reset();
        document.getElementById('loginError').style.display = 'none';
        actualizarUserUI();
        actualizarCarritoUI();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function logout() {
    usuarioActual = null;
    localStorage.removeItem('sesionActiva');
    actualizarUserUI();
    actualizarCarritoUI();
}

function checkSesion() {
    const sesionGuardada = localStorage.getItem('sesionActiva');
    if (sesionGuardada) usuarioActual = JSON.parse(sesionGuardada);
    actualizarUserUI();
}

function actualizarUserUI() {
    const container = document.getElementById('user-container');
    if (usuarioActual) {
        container.innerHTML = `
            <div class="dropdown">
                <a href="#" class="text-white fs-5 dropdown-toggle text-decoration-none" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle text-primary"></i> <span class="fs-6 ms-1">${usuarioActual.user}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark">
                    <li><a class="dropdown-item" href="#">Mi Perfil</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Cerrar Sesión</a></li>
                </ul>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#loginModal">
                INICIAR SESIÓN
            </button>
        `;
    }
}

// --- CARGA DE PRODUCTOS OPTIMIZADA ---
async function cargarProductos() {
    try {
        const response = await fetch(URL_JSON);
        if (!response.ok) throw new Error("Error");
        productosGlobales = await response.json();
        
        const visitasLocales = JSON.parse(localStorage.getItem('contadorVisitas')) || {};
        productosGlobales.forEach(prod => {
            if (visitasLocales[prod.id]) prod.visitas += visitasLocales[prod.id];
        });

        renderizarCarrusel(productosGlobales);
        renderizarCatalogo(productosGlobales);
    } catch (error) { console.error(error); }
}

function renderizarCarrusel(productos) {
    const contenedor = document.getElementById('contenedor-carrusel');
    if (!contenedor) return;
    const destacados = [...productos].sort((a, b) => b.visitas - a.visitas).slice(0, 3);
    
    let html = '';
    destacados.forEach((prod, index) => {
        const activeClass = index === 0 ? 'active' : ''; 
        // LCP OPTIMIZACIÓN: La primera imagen es 'eager' (carga urgente), las demás pueden esperar
        const loadingAttr = index === 0 ? 'eager' : 'lazy';
        const priorityAttr = index === 0 ? 'fetchpriority="high"' : ''; // NUEVO
        
        html += `
    <div class="carousel-item ${activeClass}">
        <img src="${prod.imagen}" class="d-block w-100" alt="${prod.nombre}" 
             style="cursor: pointer" onclick="verDetalle(${prod.id})"
             width="1200" height="450" loading="${loadingAttr}" ${priorityAttr}> 
        ```;
    });
    contenedor.innerHTML = html;
}

function renderizarCatalogo(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    if (productos.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center mt-5"><h3 class="text-white">No hay productos.</h3></div>`;
        return;
    }

    let html = '';
    productos.forEach(prod => {
        // PERFORMANCE: 
        // 1. loading="lazy": Solo carga la imagen cuando haces scroll y llegas a ella.
        // 2. width/height: Reserva el espacio para evitar saltos (CLS).
        html += `
            <div class="col">
                <div class="card h-100 card-producto shadow-sm">
                    <div class="position-relative" style="cursor: pointer;" onclick="verDetalle(${prod.id})">
                        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}"
                             loading="lazy" width="300" height="250">
                        <div class="descripcion-overlay flex-column">
                             <i class="bi bi-cart-plus-fill display-3 icono-hover mb-2"></i>
                             <span class="btn btn-sm btn-outline-light rounded-pill px-3">VER DETALLES</span>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fs-6 fw-bold text-white text-truncate">${prod.nombre}</h5>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="text-primary fw-bold fs-5">${prod.precio} €</span>
                            <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio}, '${prod.imagen}')">
                                <i class="bi bi-plus-lg"></i> AÑADIR
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    contenedor.innerHTML = html;
}

// ... (El resto de funciones: verDetalle, carrito, búsqueda, cookies se mantienen IGUAL) ...
function verDetalle(id) {
    const producto = productosGlobales.find(p => p.id === id);
    if (!producto) return;
    producto.visitas++;
    const visitasLocales = JSON.parse(localStorage.getItem('contadorVisitas')) || {};
    visitasLocales[id] = (visitasLocales[id] || 0) + 1;
    localStorage.setItem('contadorVisitas', JSON.stringify(visitasLocales));
    renderizarCarrusel(productosGlobales);

    document.getElementById('carruselDestacados').style.display = 'none';
    document.getElementById('seccion-catalogo').style.display = 'none';
    const seccionDetalle = document.getElementById('seccion-detalle');

    seccionDetalle.innerHTML = `
        <div class="row mt-5 align-items-center">
            <div class="col-12 mb-4">
                <button class="btn btn-outline-secondary" onclick="volverAlCatalogo()"><i class="bi bi-arrow-left"></i> VOLVER</button>
            </div>
            <div class="col-md-6">
                <img src="${producto.imagen}" class="img-fluid rounded w-100 border border-secondary shadow-lg" loading="eager">
            </div>
            <div class="col-md-6 text-white">
                <span class="badge bg-primary text-black mb-2">${producto.categoria}</span>
                <h1 class="display-4 fw-bold text-white">${producto.nombre}</h1>
                <p class="text-muted lead">${producto.descripcion || ''}</p>
                <h2 class="text-primary display-5 fw-bold my-4">${producto.precio} €</h2>
                <button class="btn btn-primary btn-lg w-100 py-3" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}')">
                    AÑADIR A LA CESTA
                </button>
            </div>
        </div>`;
    seccionDetalle.style.display = 'block';
    window.scrollTo(0, 0);
}

function volverAlCatalogo() {
    document.getElementById('seccion-detalle').style.display = 'none';
    document.getElementById('carruselDestacados').style.display = 'block';
    document.getElementById('seccion-catalogo').style.display = 'block';
}

function obtenerClaveCarrito() {
    return usuarioActual ? `carrito_${usuarioActual.user}` : 'carrito_invitado';
}

function agregarAlCarrito(id, nombre, precio, imagen) {
    const clave = obtenerClaveCarrito();
    let carrito = JSON.parse(localStorage.getItem(clave)) || [];
    carrito.push({ id, nombre, precio, imagen });
    localStorage.setItem(clave, JSON.stringify(carrito));
    actualizarCarritoUI();
}

function eliminarDelCarrito(index) {
    const clave = obtenerClaveCarrito();
    let carrito = JSON.parse(localStorage.getItem(clave)) || [];
    carrito.splice(index, 1);
    localStorage.setItem(clave, JSON.stringify(carrito));
    actualizarCarritoUI();
}

function inicializarCarrito() { actualizarCarritoUI(); }

function actualizarCarritoUI() {
    const clave = obtenerClaveCarrito();
    const carrito = JSON.parse(localStorage.getItem(clave)) || [];
    const contador = document.getElementById('contador-carrito');
    if(contador) contador.innerText = carrito.length;
    const contenedorCarrito = document.getElementById('carrito-body');
    const totalElemento = document.getElementById('carrito-total');
    if (contenedorCarrito && totalElemento) {
        contenedorCarrito.innerHTML = '';
        let total = 0;
        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = `<div class="text-center mt-5"><p class="text-muted">Cesta vacía.</p></div>`;
        } else {
            carrito.forEach((prod, index) => {
                total += prod.precio;
                const imgSrc = prod.imagen || 'https://via.placeholder.com/50';
                contenedorCarrito.innerHTML += `
                    <div class="card mb-3 bg-dark text-white border-secondary">
                        <div class="row g-0 align-items-center">
                            <div class="col-3"><img src="${imgSrc}" class="img-fluid rounded-start"></div>
                            <div class="col-9">
                                <div class="card-body p-2 position-relative">
                                    <h6 class="mb-0 small fw-bold">${prod.nombre}</h6>
                                    <p class="mb-0 small text-primary">${prod.precio} €</p>
                                    <button onclick="eliminarDelCarrito(${index})" class="btn btn-link text-danger p-0 position-absolute top-0 end-0 me-2"><i class="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
        }
        totalElemento.innerText = total.toFixed(2) + ' €';
    }
}

function configurarBusqueda() {
    const inputBuscar = document.getElementById('inputBuscar');
    const btnVoz = document.getElementById('btnVoz');
    const botonesFiltro = document.querySelectorAll('.filter-btn');

    inputBuscar.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        if (document.getElementById('seccion-detalle').style.display === 'block') volverAlCatalogo();
        filtrarProductos(texto);
    });

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            volverAlCatalogo();
            botonesFiltro.forEach(b => { b.classList.remove('active'); });
            e.target.classList.add('active');
            const cat = e.target.getAttribute('data-cat');
            inputBuscar.value = '';
            if (cat === 'all') renderizarCatalogo(productosGlobales);
            else renderizarCatalogo(productosGlobales.filter(p => p.categoria.toLowerCase() === cat));
        });
    });

    if (btnVoz) {
        btnVoz.addEventListener('click', () => {
            if (!('webkitSpeechRecognition' in window)) { alert("Navegador no compatible."); return; }
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.start();
            const iconoOriginal = btnVoz.innerHTML;
            btnVoz.innerHTML = '<i class="bi bi-mic-fill text-danger"></i>';
            recognition.onresult = (e) => {
                inputBuscar.value = e.results[0][0].transcript;
                inputBuscar.dispatchEvent(new Event('input'));
                btnVoz.innerHTML = iconoOriginal;
            };
            recognition.onend = () => btnVoz.innerHTML = iconoOriginal;
        });
    }
}

function filtrarProductos(texto) {
    const filtrados = productosGlobales.filter(prod => 
        prod.nombre.toLowerCase().includes(texto) || (prod.descripcion && prod.descripcion.toLowerCase().includes(texto))
    );
    renderizarCatalogo(filtrados);
}

function checkCookies() {
    if (!localStorage.getItem('cookiesAceptadas')) {
        const modalElement = document.getElementById('cookieModal');
        const cookieModal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
        cookieModal.show();
        document.getElementById('btn-aceptar-cookies').addEventListener('click', () => {
            localStorage.setItem('cookiesAceptadas', 'true');
            cookieModal.hide();
        });
    }
}