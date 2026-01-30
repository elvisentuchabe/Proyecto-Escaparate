document.addEventListener('DOMContentLoaded', () => {
    renderizarLicencias();
});

const DATOS_LICENCIAS = [
    {
        archivo: "nike_running_shoe.jpg",
        autor: "Nejko",
        origen: "Pixabay",
        licencia: "Pixabay license",
        link: "https://pixabay.com/es/photos/zapato-nike-moda-deporte-correr-5800166/"
    },
    {
        archivo: "adidas_running_shoe.jpg",
        autor: "MBatty",
        origen: "Pixabay",
        licencia: "Pixabay license",
        link: "https://pixabay.com/es/photos/adidas-pureboost-purebost-dpr-2554690/"
    },
    {
        archivo: "asics_running_shoe.jpg",
        autor: "Hans",
        origen: "Pixabay",
        licencia: "Pixabay license",
        link: "https://pixabay.com/es/photos/zapatilla-zapatos-para-correr-zapato-1024978/"
    },
    {
        archivo: "hoka_running_shoe.jpg",
        autor: "Photographer2575",
        origen: "Pixabay",
        licencia: "Pixabay license",
        link: "https://pixabay.com/es/photos/zapato-deportes-corriendo-2660196/"
    },
    {
        archivo: "brooks_running_shoe.jpg", 
        autor: "Ssu",
        origen: "Wikimedia Commons",
        licencia: "CC BY-SA 4.0",
        link: "https://commons.wikimedia.org/wiki/File:Brooks_Glycerin_19_running_shoe.jpg"
    },
    {
        archivo: "saucony_running_shoe.jpg", 
        autor: "Karldmartini",
        origen: "Wikimedia Commons",
        licencia: "CC BY-SA 4.1",
        link: "https://commons.wikimedia.org/wiki/File:Saucony_shoe_animation.gif"
    },
    {
        archivo: "new_balance_running_shoe.jpg",
        autor: "Licht-aus",
        origen: "Pixabay",
        licencia: "Pixabay license",
        link: "https://pixabay.com/es/photos/zapato-zapatilla-calzado-deportivo-7493218/"
    },
    {
        archivo: "mizuno_running_shoe.jpg",
        autor: "Ssu",
        origen: "Wikimedia Commons",
        licencia: "CC BY-SA 4.0",
        link: "https://commons.wikimedia.org/wiki/File:Mizuno_Wave_Horizon_5_running_shoe.jpg"
    },
    {
        archivo: "sports_watch.jpg",
        autor: "indraprojects",
        origen: "Pixabay",
        licencia: "Pixabay license",
        link: "https://pixabay.com/es/photos/reloj-inteligente-tecnolog%c3%ada-reloj-8300238/"
    },
    {
        archivo: "headphones.jpg",
        autor: "Alejandro SG97",
        origen: "Wikimedia Commons",
        licencia: "CC BY-SA 4.0",
        link: "https://commons.wikimedia.org/wiki/File:Auriculares_Blancos.jpg"
    },
    {
        archivo: "t-shirt.jpg",
        autor: "matitadigitale",
        origen: "Pixabay",
        licencia: "Pixabay license",
        link: "https://pixabay.com/es/photos/modelo-t-shirt-maniqu%c3%ad-azul-2710535/"
    },
    // ... (El resto de imágenes generadas por IA se mantienen igual) ...
    {
        archivo: "pantalon.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar pantalón corto deporte escaparate virtual marca SportSprint"
    },
    {
        archivo: "calcetines.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar calcetines escaparate virtual sin marca"
    },
    {
        archivo: "gorra.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar gorra correr escaparate virtual sin marca"
    },
    {
        archivo: "cinturon.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar cinturón atletismo objetos sin marca"
    },
    {
        archivo: "chaleco_trail_running.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar chaleco trail running sin marcas"
    },
    {
        archivo: "cortavientos.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar cortavientos running escaparate virtual sin marca"
    },
    {
        archivo: "geles.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar pack geles deportivos sin marca"
    },
    {
        archivo: "bicicleta.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar bicicleta tope gama realista sin marca"
    },
    {
        archivo: "casco.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar casco bicicleta carretera escaparate digital sin marca"
    },
    {
        archivo: "gafas.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar gafas ciclismo"
    },
    {
        archivo: "maillot.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar maillot ciclismo colores alegres"
    },
    {
        archivo: "culotte.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar culotte ciclismo negro"
    },
    {
        archivo: "zapatillas.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar zapatillas ciclismo carretera blancas sin marca"
    },
    {
        archivo: "ciclocomputador.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar ciclocomputador bicicleta negro sin marca"
    },
    {
        archivo: "radar.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar radar aviso coches trasero tipo garmin varia"
    },
    {
        archivo: "pedales.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar pedales bicicleta carretera"
    },
    {
        archivo: "potenciometro.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar potenciometro bicicleta carretera tipo favero assioma"
    },
    {
        archivo: "rodillo.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar rodillo bicicleta"
    },
    {
        archivo: "cubierta.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar cubierta tubeless bicicleta carretera escaparate digital"
    },
    {
        archivo: "bomba.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar bomba inflar bicicleta portatil"
    },
    {
        archivo: "bolsa_sillin.jpg",
        autor: "IA (Google Gemini)",
        origen: "Generado por IA",
        licencia: "Uso libre",
        link: "Prompt: Generar bolsa sillin bicicleta escaparate digital"
    }
];

function renderizarLicencias() {
    const tbody = document.getElementById('tabla-licencias-body');
    if (!tbody) return;

    let html = '';
    DATOS_LICENCIAS.forEach(item => {
        let linkDisplay = '';
        if (item.link.startsWith('http')) {
            linkDisplay = `<a href="${item.link}" target="_blank" class="text-primary text-decoration-none">Ver Fuente <i class="bi bi-box-arrow-up-right ms-1"></i></a>`;
        } else {
            linkDisplay = `<small class="text-muted fst-italic">${item.link}</small>`;
        }

        // Usamos img/ delante del nombre del archivo
        html += `
            <tr>
                <td class="text-center">
                    <img src="img/${item.archivo}" alt="${item.archivo}" 
                         class="img-thumbnail bg-dark border-secondary" 
                         style="width: 80px; height: 80px; object-fit: cover;">
                </td>
                <td class="fw-bold text-white">${item.archivo}</td>
                <td class="text-info">${item.autor}</td>
                <td><span class="badge bg-secondary text-white border border-light">${item.licencia}</span></td>
                <td>${linkDisplay}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}