# Tienda de Deportes - Proyecto Web (FP)

Este proyecto consiste en el desarrollo de una página web dinámica para una tienda de deportes ficticia ("SportSprint"), implementada utilizando tecnologías web estándar y carga de datos asíncrona.

## 📋 Descripción del Proyecto
El objetivo principal es demostrar el uso de **AJAX** para la carga dinámica de contenido. Los productos no están escritos directamente en el HTML, sino que se generan automáticamente leyendo un fichero externo (`productos.json`).

### Tecnologías Utilizadas
* **HTML5 / CSS3:** Estructura y diseño responsivo.
* **Bootstrap 5:** Framework para maquetación y componentes (Navbars, Cards, Modales).
* **JavaScript (ES6):** Lógica de interacción y manipulación del DOM.
* **AJAX (Fetch API):** Carga asíncrona del catálogo de productos desde JSON.
* **Inteligencia Artificial:** Generación de recursos gráficos mediante Google Gemini (SynthID).

---

## 🚀 Instrucciones de Instalación y Ejecución

⚠️ **IMPORTANTE:** Dado que este proyecto utiliza **AJAX (Fetch API)** para cargar el archivo `productos.json`, los navegadores modernos bloquearán la carga de datos si se abre el archivo `index.html` directamente con doble clic (debido a las políticas de seguridad CORS para el protocolo `file://`).

Para visualizar el proyecto correctamente, por favor siga uno de estos métodos:

### Opción A (Recomendada - VS Code)
1.  Abra la carpeta del proyecto en Visual Studio Code.
2.  Instale la extensión **"Live Server"**.
3.  Haga clic derecho en `index.html` y seleccione **"Open with Live Server"**.

### Opción B (Servidor Local Python)
Si tiene Python instalado, abra una terminal en la carpeta del proyecto y ejecute:
```bash
python -m http.server 8000