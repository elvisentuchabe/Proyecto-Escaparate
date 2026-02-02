# 🏃‍♂️ SportSprint - Escaparate Virtual

Proyecto de escaparate virtual para una tienda de deportes (Running & Ciclismo), desarrollado con HTML5, CSS3 (Bootstrap 5) y JavaScript (Vanilla).

## 🚀 Instalación y Despliegue

Este proyecto no requiere instalación de dependencias ni bases de datos (Backendless). Sigue estos pasos para ponerlo en marcha:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/elvisentuchabe/Proyecto-Escaparate.git

2.  **⚠️ IMPORTANTE: Instalar Imágenes:**
    * El repositorio contiene un archivo comprimido llamado **`img.zip`** (o `imagenes.zip`).
    * **Descomprímelo** en la raíz del proyecto (al mismo nivel que `index.html`).
    * Asegúrate de que la carpeta resultante se llame **`img`** y contenga todas las fotos (`.jpg`).
    * *Sin este paso, no se cargarán las fotos de los productos.*

3.  **Ejecutar:**
    * Usar un servidor local (ej: *Live Server* en VSCode) para evitar problemas con la carga del JSON y los módulos de voz.

## 👤 Usuarios de Prueba

El sistema cuenta con persistencia de datos en `localStorage`. Puedes usar estos usuarios predefinidos o registrar uno nuevo:

| Rol | Usuario | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin` | `1234` |
| **Cliente** | `cliente` | `1234` |

> **Nota:** Si registras un usuario nuevo, este se guardará en la memoria del navegador y no se perderá al recargar.

## ✅ Requisitos Cumplidos

El proyecto cumple con el 100% de la rúbrica solicitada:

- [x] **Estructura Web:** Cabecera, Navegación, Catálogo (Main), Novedades (Carrusel) y Pie de página.
- [x] **Buscador Avanzado:** Barra de búsqueda funcional con filtrado en tiempo real.
- [x] **Reconocimiento de Voz:** Búsqueda por voz integrada (Web Speech API) con control de silencio (2s).
- [x] **Persistencia:** Gestión de usuarios y carrito mediante `localStorage` / `sessionStorage`.
- [x] **Carga Dinámica (AJAX):** Productos cargados desde `productos.json` y renderizados con Cards de Bootstrap.
- [x] **Formularios Validados:** Login y Registro con validación nativa y Expresiones Regulares (RegEx).
- [x] **Microinteracciones:** Hover en tarjetas, sistema de "Favoritos" (corazón animado) y notificaciones Toast.
- [x] **Geolocalización:** Cálculo de distancia real en KM desde la posición del usuario hasta la tienda física (Deportes Moya).
- [x] **Cookies:** Gestión de aviso de cookies y creación de cookie real (BOM) con `hostname` y `pathname`.
- [x] **Páginas Legales:** Enlaces funcionales a Aviso Legal, Licencias y **Condiciones de Uso**.
- [x] **Rendimiento (WPO):** Lazy Loading, Preload de JSON, Fetch Priority y CLS optimizado.

## 🔒 Validaciones (Expresiones Regulares)

Se han utilizado las siguientes RegEx en el formulario de registro (`index.html`):

* **Nombre Completo:** `[a-zA-Z\s]{3,30}`
    * *Permite solo letras y espacios, entre 3 y 30 caracteres.*
* **Usuario:** `[a-zA-Z0-9]{4,12}`
    * *Alfanumérico, sin espacios, entre 4 y 12 caracteres.*
* **Contraseña:** `.{6,}`
    * *Mínimo 6 caracteres de cualquier tipo.*

## 📸 Licencias Multimedia

Todas las imágenes utilizadas son de uso libre (Creative Commons / Licencia Pixabay) o generadas por IA.

| Archivo | Autor / Origen | Licencia |
| :--- | :--- | :--- |
| `nike_running_shoe.jpg` | Nejko (Pixabay) | Pixabay License |
| `adidas_running_shoe.jpg` | MBatty (Pixabay) | Pixabay License |
| `asics_running_shoe.jpg` | Hans (Pixabay) | Pixabay License |
| `hoka_running_shoe.jpg` | Photographer2575 (Pixabay) | Pixabay License |
| `brooks_running_shoe.jpg` | Ssu (Wikimedia) | CC BY-SA 4.0 |
| `new_balance_running_shoe.jpg`| Licht-aus (Pixabay) | Pixabay License |
| `mizuno_running_shoe.jpg` | Ssu (Wikimedia) | CC BY-SA 4.0 |
| `sports_watch.jpg` | indraprojects (Pixabay) | Pixabay License |
| `headphones.jpg` | Alejandro SG97 (Wikimedia) | CC BY-SA 4.0 |
| `t-shirt.jpg` | matitadigitale (Pixabay) | Pixabay License |
| *Resto de catálogo* | **IA (Google Gemini)** | Generado por IA (Uso Libre) |

---
**Desarrollado por Vicente Romero Sáiz para los módulos DWEC y DIW**