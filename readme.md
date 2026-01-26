# Tienda de Deportes - Proyecto Web (FP)

Este proyecto consiste en el desarrollo de una página web dinámica para una tienda de deportes ficticia ("SportSprint"), implementada utilizando tecnologías web estándar y carga de datos asíncrona.

## 📋 Descripción del Proyecto
El objetivo principal es demostrar el uso de **AJAX** para la carga dinámica de contenido. Los productos no están escritos directamente en el HTML, sino que se generan automáticamente leyendo un fichero externo (`productos.json`).

### Tecnologías Utilizadas
* **HTML5 / CSS3:** Estructura y diseño responsivo.
* **Bootstrap 5:** Framework para maquetación.
* **JavaScript (ES6):** Lógica de interacción.
* **AJAX (Fetch API):** Carga asíncrona del catálogo.
* **Inteligencia Artificial:** Generación de recursos gráficos.

---

## 🚀 Instrucciones de Instalación

⚠️ **IMPORTANTE:** Este proyecto utiliza **AJAX**. Por seguridad (CORS), los navegadores bloquean la carga de datos si abres el archivo directamente (`file://`).

**Para ejecutarlo correctamente:**
1.  Usa **Visual Studio Code**.
2.  Instala la extensión **Live Server**.
3.  Click derecho en `index.html` -> **Open with Live Server**.

---

## ⚖️ Créditos y Licencias

A continuación se detalla la procedencia y licencia de uso de cada imagen utilizada en el proyecto, conforme a los requisitos de propiedad intelectual.

| Archivo local | Autor | Web Origen | Tipo de licencia | Link original / Prompt |
| :--- | :--- | :--- | :--- | :--- |
| `nike_running_shoe.jpg` | Nejko | Pixabay | **Pixabay license** | [Ver enlace](https://pixabay.com/es/photos/zapato-nike-moda-deporte-correr-5800166/) |
| `adidas_running_shoe.jpg` | MBatty | Pixabay | **Pixabay license** | [Ver enlace](https://pixabay.com/es/photos/adidas-pureboost-purebost-dpr-2554690/) |
| `asics_running_shoe.jpg` | Hans | Pixabay | **Pixabay license** | [Ver enlace](https://pixabay.com/es/photos/zapatilla-zapatos-para-correr-zapato-1024978/) |
| `hoka_running_shoe.jpg` | Photographer2575 | Pixabay | **Pixabay license** | [Ver enlace](https://pixabay.com/es/photos/zapato-deportes-corriendo-2660196/) |
| `brooks_runnning_shoe.jpg` | Ssu | Wikimedia Commons | **CC BY-SA 4.0** | [Ver enlace](https://commons.wikimedia.org/wiki/File:Brooks_Glycerin_19_running_shoe.jpg) |
| `saucony_running_shoe.gif` | Karldmartini | Wikimedia Commons | **CC BY-SA 4.1** | [Ver enlace](https://commons.wikimedia.org/wiki/File:Saucony_shoe_animation.gif) |
| `new_balance_running_shoe.jpg` | Licht-aus | Pixabay | **Pixabay license** | [Ver enlace](https://pixabay.com/es/photos/zapato-zapatilla-calzado-deportivo-7493218/) |
| `mizuno_running_shoe.jpg` | Ssu | Wikimedia Commons | **CC BY-SA 4.0** | [Ver enlace](https://commons.wikimedia.org/wiki/File:Mizuno_Wave_Horizon_5_running_shoe.jpg) |
| `sports_watch.jpg` | indraprojects | Pixabay | **Pixabay license** | [Ver enlace](https://pixabay.com/es/photos/reloj-inteligente-tecnolog%c3%ada-reloj-8300238/) |
| `headphones.jpg` | Alejandro SG97 | Wikimedia Commons | **CC BY-SA 4.0** | [Ver enlace](https://commons.wikimedia.org/wiki/File:Auriculares_Blancos.jpg) |
| `t-shirt.jpg` | matitadigitale | Pixabay | **Pixabay license** | [Ver enlace](https://pixabay.com/es/photos/modelo-t-shirt-maniqu%c3%ad-azul-2710535/) |
| `pantalon.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: quiero que generes una imagen de un pantalon corto... |
| `calcetines.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Genera una imagen de unos calcetines para un escaparate... |
| `gorra.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Genera una imagen de una gorra para correr... |
| `cinturon.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una foto de un cinturón... |
| `chaleco_trail_running.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: quiero que generes una imagen de un chaleco... |
| `cortavientos.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de un cortaviento... |
| `geles.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de un pack de geles... |
| `bicicleta.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de una bicicleta tope... |
| `casco.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de un casco... |
| `gafas.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de unas gafas... |
| `maillot.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de un maillot... |
| `culotte.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de un culotte... |
| `zapatillas.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de unas zapatillas... |
| `ciclocomputador.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de un ciclocomputador... |
| `radar.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: quiero que me generes una imagen de un radar... |
| `pedales.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de unos pedales... |
| `potenciometro.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de un potenciometro... |
| `rodillo.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de un rodillo... |
| `cubierta.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de una cubierta... |
| `bomba.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: quiero que generes una imagen de una bomba... |
| `bolsa_sillin.jpg` | IA (Google Gemini) | IA (Google Gemini) | **Generado por IA (Uso libre)** | Prompt: Quiero que generes una imagen de una bolsa de sillin... |

---

## ⚠️ Aviso Legal
Este sitio web es un **proyecto académico sin ánimo de lucro**. Los productos mostrados, precios y marcas son ficticios o se utilizan con fines demostrativos bajo la doctrina de *Fair Use* educativo.