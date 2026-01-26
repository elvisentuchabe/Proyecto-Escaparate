document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    inicializarCarrito();
    checkCookies();
    configurarBusquedaVoz();
});

// Ruta al JSON (asegúrate de que el nombre coincide)
const URL_JSON = 'productos.json';

// --- 1. CARGA DE DATOS (AJAX) [cite: 55, 88] ---
async function cargarProductos() {
    try {
        const response = await fetch(URL_JSON);
        if (!response.ok) throw new Error("Error al cargar JSON");
        
        const productos = await response.json();
        
        // Renderizar Carrusel (Top 3 visitas)
        renderizarCarrusel(productos);
        
        // Renderizar Catálogo Completo
        renderizarCatalogo(productos);

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('contenedor-productos').innerHTML = 
            `<div class="alert alert-danger">Error cargando productos. Intenta usar un servidor local.</div>`;
    }
}

// --- 2. RENDERIZAR CARRUSEL  ---
function renderizarCarrusel(productos) {
    const contenedor = document.getElementById('contenedor-carrusel');
    
    // Ordenar por visitas (mayor a menor) y coger los 3 primeros
    const destacados = [...productos].sort((a, b) => b.visitas - a.visitas).slice(0, 3);
    
    let html = '';
    destacados.forEach((prod, index) => {
        const activeClass = index === 0 ? 'active' : ''; // El primero debe tener la clase active
        html += `
            <div class="carousel-item ${activeClass}">
                <img src="${prod.imagen}" class="d-block w-100" alt="${prod.nombre}">
                <div class="carousel-caption d-none d-md-block">
                    <h5 class="display-6 fw-bold text-uppercase">TOP VENTAS</h5>
                    <h3>${prod.nombre}</h3>
                    <p class="fs-5">${prod.precio} €</p>
                    <button class="btn btn-warning fw-bold" onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio})">¡Lo quiero!</button>
                </div>
            </div>
        `;
    });
    contenedor.innerHTML = html;
}

// --- 3. RENDERIZAR CATÁLOGO (CARDS) [cite: 49] ---
function renderizarCatalogo(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    let html = '';

    productos.forEach(prod => {
        //  Al poner el ratón encima debe mostrar información
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
                            <button class="btn btn-sm btn-outline-dark" onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio})">
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

// --- 4. GESTIÓN DEL CARRITO (WebStorage) [cite: 45, 52] ---
function agregarAlCarrito(id, nombre, precio) {
    // Recuperar carrito actual o crear array vacío
    let carrito = JSON.parse(localStorage.getItem('carritoSportSprint')) || [];
    
    // Añadir producto
    carrito.push({ id, nombre, precio });
    
    // Guardar en LocalStorage
    localStorage.setItem('carritoSportSprint', JSON.stringify(carrito));
    
    // Feedback visual y actualizar contador
    alert(`¡${nombre} añadido al carrito!`);
    actualizarContadorCarrito();
}

function inicializarCarrito() {
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoSportSprint')) || [];
    const contador = document.getElementById('contador-carrito');
    if(contador) contador.innerText = carrito.length;
}

// --- 5. BÚSQUEDA POR VOZ [cite: 43, 44] ---
function configurarBusquedaVoz() {
    const btnVoz = document.getElementById('btnVoz');
    const inputBuscar = document.getElementById('inputBuscar');

    // Comprobar soporte del navegador
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;

        btnVoz.addEventListener('click', () => {
            recognition.start();
            // Cambiar icono para indicar "escuchando"
            btnVoz.innerHTML = '<i class="bi bi-mic-mute-fill text-danger"></i>';
        });

        recognition.onresult = (event) => {
            const texto = event.results[0][0].transcript;
            inputBuscar.value = texto;
            alert(`Has buscado por voz: "${texto}"`);
            // Aquí podrías llamar a una función filtrarProductos(texto)
            
            // Restaurar icono
            btnVoz.innerHTML = '<i class="bi bi-mic-fill text-dark"></i>';
        };

        recognition.onerror = (event) => {
            console.error("Error reconocimiento voz", event.error);
            btnVoz.innerHTML = '<i class="bi bi-mic-fill text-dark"></i>';
        };
        
        recognition.onend = () => {
             btnVoz.innerHTML = '<i class="bi bi-mic-fill text-dark"></i>';
        };

    } else {
        btnVoz.style.display = 'none'; // Ocultar si no es soportado
        console.log("API de voz no soportada en este navegador");
    }
}

// --- 6. COOKIES [cite: 76, 77] ---
function checkCookies() {
    const cookiesAceptadas = localStorage.getItem('cookiesAceptadas');
    const banner = document.getElementById('aviso-cookies');

    if (!cookiesAceptadas) {
        banner.style.display = 'block';
        
        document.getElementById('btn-aceptar-cookies').addEventListener('click', () => {
            // Guardar aceptación
            localStorage.setItem('cookiesAceptadas', 'true');
            
            // Crear cookie real (opcional, como pide el pdf hostname/url)
            document.cookie = `usuario_aceptado=true; path=/; max-age=31536000`; 
            document.cookie = `origen=${window.location.hostname}; path=/`;

            banner.style.display = 'none';
        });
    }
}