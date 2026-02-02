/**
 * Lógica principal de SportSprint
 * Incluye: Rendimiento, Usuarios, Carrito, Voz, Cookies y GEOLOCALIZACIÓN AVANZADA
 */

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    cargarProductos();
    checkSesion();
    inicializarCarrito();
    checkCookies();
    configurarBusqueda();
    configurarLogin();
    configurarRegister();
    initGeolocalizacion(); // Inicia el cálculo de distancia
});

const URL_JSON = 'productos.json';
let productosGlobales = []; 
let usuarioActual = null; 
let USUARIOS = []; 

// Coordenadas de Deportes Moya (Av. del Mediterráneo, 26, Madrid)
const TIENDA_COORDS = { lat: 40.406328, lon: -3.677567 };

// --- GESTIÓN DE USUARIOS ---
function cargarUsuarios() {
    const usuariosGuardados = localStorage.getItem('usuariosDB');
    if (usuariosGuardados) {
        USUARIOS = JSON.parse(usuariosGuardados);
    } else {
        USUARIOS = [
            { user: 'admin', pass: '1234', nombre: 'Administrador' },
            { user: 'cliente', pass: '1234', nombre: 'Cliente Habitual' }
        ];
        localStorage.setItem('usuariosDB', JSON.stringify(USUARIOS));
    }
}

function configurarRegister() {
    const formRegister = document.getElementById('formRegister');
    if(formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('regNombre').value;
            const user = document.getElementById('regUsuario').value;
            const pass = document.getElementById('regPassword').value;

            if (USUARIOS.find(u => u.user === user)) {
                mostrarNotificacion('¡Ese usuario ya existe!', 'error');
                return;
            }

            const nuevoUsuario = { user, pass, nombre };
            USUARIOS.push(nuevoUsuario);
            localStorage.setItem('usuariosDB', JSON.stringify(USUARIOS));

            const modalRegisterEl = document.getElementById('registerModal');
            const modalRegister = bootstrap.Modal.getInstance(modalRegisterEl);
            modalRegister.hide();

            login(user, pass);
            mostrarNotificacion(`¡Bienvenido a SportSprint, ${nombre}!`, 'success');
        });
    }
}

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
        
        const modalLoginEl = document.getElementById('loginModal');
        const modalLogin = bootstrap.Modal.getInstance(modalLoginEl);
        if(modalLogin) modalLogin.hide();

        document.getElementById('formLogin').reset();
        document.getElementById('loginError').style.display = 'none';

        actualizarUserUI();
        actualizarCarritoUI();
        mostrarNotificacion(`Hola de nuevo, ${usuarioActual.nombre}`, 'success');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function logout() {
    usuarioActual = null;
    localStorage.removeItem('sesionActiva');
    actualizarUserUI();
    actualizarCarritoUI();
    mostrarNotificacion("Sesión cerrada correctamente", "success");
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
            <div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm fw-bold" data-bs-toggle="modal" data-bs-target="#loginModal">
                    ENTRAR
                </button>
                <button class="btn btn-primary btn-sm fw-bold text-dark" data-bs-toggle="modal" data-bs-target="#registerModal">
                    REGISTRARSE
                </button>
            </div>
        `;
    }
}

// --- CARGA DE PRODUCTOS ---
async function cargarProductos() {
    try {
        const response = await fetch(URL_JSON);
        if (!response.ok) throw new Error("Error al cargar JSON");
        productosGlobales = await response.json();
        
        const visitasLocales = JSON.parse(localStorage.getItem('contadorVisitas')) || {};
        productosGlobales.forEach(prod => {
            if (visitasLocales[prod.id]) prod.visitas += visitasLocales[prod.id];
        });

        renderizarCarrusel(productosGlobales);
        renderizarCatalogo(productosGlobales);
    } catch (error) { 
        console.error("Error:", error);
    }
}

function renderizarCarrusel(productos) {
    const contenedor = document.getElementById('contenedor-carrusel');
    if (!contenedor) return;
    const destacados = [...productos].sort((a, b) => b.visitas - a.visitas).slice(0, 3);
    
    let html = '';
    destacados.forEach((prod, index) => {
        const activeClass = index === 0 ? 'active' : ''; 
        const loadingAttr = index === 0 ? 'eager' : 'lazy';
        const priorityAttr = index === 0 ? 'fetchpriority="high"' : '';
        
        html += `
            <div class="carousel-item ${activeClass}">
                <img src="${prod.imagen}" class="d-block w-100" alt="${prod.nombre}" 
                     style="cursor: pointer" onclick="verDetalle(${prod.id})"
                     width="1200" height="450" loading="${loadingAttr}" ${priorityAttr}> 
                <div class="carousel-caption d-none d-md-block">
                    <h5 class="display-6 fw-bold text-uppercase text-primary">TOP VENTAS</h5>
                    <h3 class="text-white">${prod.nombre}</h3>
                    <p class="fs-5 text-white">${prod.precio} €</p>
                    <button class="btn btn-primary fw-bold" onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio}, '${prod.imagen}')">LO QUIERO</button>
                </div>
            </div>`;
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
    
    // Recuperamos favoritos para pintar corazones
    const claveFav = usuarioActual ? `fav_${usuarioActual.user}` : 'fav_invitado';
    const favoritos = JSON.parse(localStorage.getItem(claveFav)) || [];

    let html = '';
    productos.forEach(prod => {
        const esFav = favoritos.includes(prod.id);
        const iconoFav = esFav ? 'bi-heart-fill' : 'bi-heart';
        const claseActive = esFav ? 'active' : '';

        html += `
            <div class="col">
                <div class="card h-100 card-producto shadow-sm">
                    <div class="position-relative" style="cursor: pointer;" onclick="verDetalle(${prod.id})">
                        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}" loading="lazy" width="300" height="250">
                        
                        <button id="btn-fav-${prod.id}" 
                                class="btn btn-fav position-absolute top-0 end-0 m-2 text-white ${claseActive}"
                                onclick="event.stopPropagation(); toggleFavorito(${prod.id})">
                            <i class="bi ${iconoFav}"></i>
                        </button>

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

// --- CARRITO (PROTEGIDO) ---
function obtenerClaveCarrito() {
    return usuarioActual ? `carrito_${usuarioActual.user}` : 'carrito_invitado';
}

function agregarAlCarrito(id, nombre, precio, imagen) {
    if (!usuarioActual) {
        mostrarNotificacion("Debes iniciar sesión para comprar", "error");
        const modalLogin = new bootstrap.Modal(document.getElementById('loginModal'));
        modalLogin.show();
        return;
    }

    const clave = obtenerClaveCarrito();
    let carrito = JSON.parse(localStorage.getItem(clave)) || [];
    carrito.push({ id, nombre, precio, imagen });
    localStorage.setItem(clave, JSON.stringify(carrito));
    actualizarCarritoUI();
    mostrarNotificacion("Producto añadido a la cesta", "success");
}

function eliminarDelCarrito(index) {
    const clave = obtenerClaveCarrito();
    let carrito = JSON.parse(localStorage.getItem(clave)) || [];
    carrito.splice(index, 1);
    localStorage.setItem(clave, JSON.stringify(carrito));
    actualizarCarritoUI();
    mostrarNotificacion("Producto eliminado", "error");
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

// --- BÚSQUEDA Y VOZ ---
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

    if (btnVoz && inputBuscar) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            btnVoz.style.display = 'none';
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true; 
        recognition.interimResults = true;
        let temporizadorSilencio;

        btnVoz.addEventListener('click', () => {
            try { recognition.start(); } catch (error) { console.log("Ya activo"); }
        });

        recognition.onstart = () => {
            btnVoz.innerHTML = '<i class="bi bi-mic-fill text-danger"></i>';
            inputBuscar.placeholder = "Escuchando... (Espera 2s)";
            inputBuscar.value = '';
        };

        recognition.onend = () => {
            btnVoz.innerHTML = '<i class="bi bi-mic-fill text-white"></i>';
            inputBuscar.placeholder = "Buscar productos...";
            clearTimeout(temporizadorSilencio);
            inputBuscar.dispatchEvent(new Event('input'));
        };

        recognition.onresult = (event) => {
            clearTimeout(temporizadorSilencio);
            const transcript = Array.from(event.results).map(result => result[0].transcript).join('');
            inputBuscar.value = transcript;
            inputBuscar.dispatchEvent(new Event('input'));
            temporizadorSilencio = setTimeout(() => { recognition.stop(); }, 2000);
        };
    }
}

function filtrarProductos(texto) {
    const filtrados = productosGlobales.filter(prod => 
        prod.nombre.toLowerCase().includes(texto) || (prod.descripcion && prod.descripcion.toLowerCase().includes(texto))
    );
    renderizarCatalogo(filtrados);
}

// --- FAVORITOS Y NOTIFICACIONES ---
function mostrarNotificacion(mensaje, tipo = 'success') {
    const contenedor = document.querySelector('.toast-container');
    if(!contenedor) return;
    const colorHeader = tipo === 'success' ? 'bg-success' : 'bg-danger';
    const icono = tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';

    const html = `
        <div class="toast show align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${colorHeader} text-white">
                <i class="bi ${icono} me-2"></i>
                <strong class="me-auto">SportSprint</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body text-dark">
                ${mensaje}
            </div>
        </div>
    `;
    const toastElement = document.createElement('div');
    toastElement.innerHTML = html;
    contenedor.appendChild(toastElement.firstElementChild);
    setTimeout(() => { 
        const toast = contenedor.lastElementChild;
        if (toast) toast.remove();
    }, 3000);
}

function toggleFavorito(id) {
    const claveFav = usuarioActual ? `fav_${usuarioActual.user}` : 'fav_invitado';
    let favoritos = JSON.parse(localStorage.getItem(claveFav)) || [];
    
    const index = favoritos.indexOf(id);
    if (index === -1) {
        favoritos.push(id);
        mostrarNotificacion("Añadido a favoritos", "success");
    } else {
        favoritos.splice(index, 1);
        mostrarNotificacion("Eliminado de favoritos", "error");
    }
    
    localStorage.setItem(claveFav, JSON.stringify(favoritos));
    
    const btn = document.getElementById(`btn-fav-${id}`);
    if(btn) {
        btn.classList.toggle('active');
        const icon = btn.querySelector('i');
        icon.classList.toggle('bi-heart');
        icon.classList.toggle('bi-heart-fill');
    }
}

// --- COOKIES REALES (BOM) ---
function checkCookies() {
    if (!document.cookie.includes("aceptar_cookies=true")) {
        const modalElement = document.getElementById('cookieModal');
        const cookieModal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
        cookieModal.show();
        
        document.getElementById('btn-aceptar-cookies').addEventListener('click', () => {
            // Guardamos Cookie BOM con path y hostname
            const datos = `host=${window.location.hostname}|path=${window.location.pathname}`;
            const fecha = new Date();
            fecha.setTime(fecha.getTime() + (365*24*60*60*1000));
            
            document.cookie = `aceptar_cookies=true; expires=${fecha.toUTCString()}; path=/`;
            document.cookie = `info_ubicacion=${datos}; expires=${fecha.toUTCString()}; path=/`;
            
            cookieModal.hide();
        });
    }
}

// --- GEOLOCALIZACIÓN Y DISTANCIA ---
function initGeolocalizacion() {
    const geoDiv = document.getElementById('geo-info');
    if (!geoDiv) return;

    if ("geolocation" in navigator) {
        geoDiv.innerHTML = `<i class="bi bi-geo-alt"></i> Localizando...`;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                
                // Calcular distancia a Deportes Moya (nuestra tienda)
                const distKM = calcularDistanciaKM(userLat, userLon, TIENDA_COORDS.lat, TIENDA_COORDS.lon);
                
                geoDiv.innerHTML = `
                    <i class="bi bi-geo-alt-fill text-primary"></i> 
                    Estás a <b>${distKM} km</b> de nuestra tienda
                `;
            },
            (error) => {
                geoDiv.innerHTML = `<i class="bi bi-geo-alt"></i> Ubicación no permitida`;
                console.warn("Error geo:", error.message);
            }
        );
    } else {
        geoDiv.style.display = 'none';
    }
}

// Fórmula de Haversine para distancia en KM
function calcularDistanciaKM(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio Tierra km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1); // Devolver con 1 decimal
}