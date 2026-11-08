# 🐾 HUELLA Front end

<!-- DESPLIEGUE (mañana): descomenta y pon tu URL
<p align="center">
  <a href="https://TU-URL.vercel.app">
    <img src="https://img.shields.io/badge/🐾_Demo_en_vivo-TU--URL.vercel.app-f2994a?style=for-the-badge" alt="Demo en vivo" />
  </a>
</p>

> ⏳ La API está en el plan gratuito de Render: si lleva un rato sin visitas, la primera carga puede tardar 30-50 segundos.
-->

Interfaz de **HUELLA**, una aplicación para gestionar mascotas. Hecha con **React** y **Vite**, consume la API de [`../server`](../server/README.md): ficha de mascotas, salud, calendario de tareas, gastos y tarjeta de emergencia con QR.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

## 🛠️ Tecnologías

- **React + Vite**: interfaz y entorno de desarrollo
- **React Router**: rutas con `createBrowserRouter` y *loaders* para proteger las privadas
- **Context API**: sesión del usuario (`AuthProvider` y `useAuth`)
- **FullCalendar**: calendario con vistas de mes, semana y día
- **Recharts**: gráficos de peso y gastos
- **qrcode.react**: código QR de la tarjeta de emergencia
- **react-icons**: iconografía
- **CSS propio**: variables, grid, `color-mix()` y *container queries*
- **ESLint**: revisión del código

## 📁 Estructura

```
client/
├── public/                        Favicon, banner y fotos de la landing
├── src/
│   ├── components/
│   │   ├── pet/                   PetSummary, PetEmergency, PetExpenses…
│   │   ├── AppLayout / Topbar / Sidebar   Estructura de la app
│   │   ├── BottomNav / MobileMenu         Navegación móvil
│   │   ├── PageHeader.jsx         Cabecera con icono de cada página
│   │   ├── TaskItem / TaskDialog / TaskLegend
│   │   ├── ExpenseDonut.jsx       Gráfico de gastos por categoría
│   │   ├── ServiceCard / ServiceArt   Tarjeta de servicio e ilustraciones SVG por categoría
│   │   ├── Avatar / PresetAvatar  Avatar de usuario (foto, preset o inicial)
│   │   ├── ConfirmDialog.jsx      Confirmaciones con <dialog>
│   │   └── DeleteAccountDialog.jsx
│   ├── context/                   AuthContext (sesión, perfil, avatar)
│   ├── hooks/                     useAuth, usePets, useTaskActions
│   ├── loaders/                   requiredAuth y redirectIfAuth
│   ├── pages/                     Una página por ruta
│   ├── services/                  Llamadas a la API (api.js + un servicio por recurso)
│   ├── utils/                     Fechas, formatos, tipos de tarea, iconos, avatares
│   ├── App.jsx                    Router
│   ├── index.css                  Estilos globales y variables de diseño
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── README.md
```

## ⚙️ Instalación

Necesitas la API en marcha (ver el [README del servidor](../server/README.md)).

```bash
cd client
npm install
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API, incluido `/api/v1` (`http://localhost:5000/api/v1`) |

Vite solo lee el `.env` al arrancar: si lo cambias, reinicia `npm run dev`.

## 📜 Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca el servidor de desarrollo |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve el build para probarlo |
| `npm run lint` | Revisa el código con ESLint |

La web queda en `http://localhost:5173`.

## 🧭 Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Landing pública (redirige a `/dashboard` si hay sesión) | Pública |
| `/login` · `/register` | Acceso y registro | Pública |
| `/e/:token` | Tarjeta de emergencia de una mascota | Pública |
| `/dashboard` | Inicio | Privada |
| `/pets` · `/pets/new` | Mis mascotas | Privada |
| `/pets/:id` | Ficha: resumen, salud, peso, gastos, documentos y emergencia | Privada |
| `/calendar` | Calendario | Privada |
| `/tasks` | Tareas | Privada |
| `/health` | Salud de todas las mascotas | Privada |
| `/expenses` | Gastos de todas las mascotas | Privada |
| `/services` | Servicios cercanos | Privada |
| `/settings` | Perfil, avatar y borrado de cuenta | Privada |

Las rutas privadas usan el *loader* `requiredAuth`, que comprueba la sesión antes de pintar la página y redirige a `/login` si no existe.

## ✨ Funcionalidades

- **Landing** con collage de fotos, funciones destacadas y explicación de la tarjeta de emergencia.
- **Inicio** con tus mascotas, la próxima cita, tareas de hoy, gastos del mes, próximas tareas y una frase del día.
- **Ficha de mascota** con pestañas: resumen (información, próximas citas, alergias, peso, gastos y tareas), salud, peso, gastos, documentos y emergencia.
- **Calendario** con eventos de color translúcido, icono por tipo, nombre de la mascota y leyenda en el panel lateral.
- **Tareas** con repeticiones, completar, saltar y filtros.
- **Salud y Gastos globales** con filtro por mascota.
- **Servicios cercanos**: banner con buscador de ciudad o código postal (Madrid por defecto), radio de 10, 30 o 50 km, botón «Usar mi ubicación», filtros por categoría con contadores y flechas para desplazarlos en pantallas pequeñas, tarjetas con ilustración propia, distancia, ruta en Google Maps y llamada. Con indicador de carga y aviso de error con botón de reintento.
- **Tarjeta de emergencia**: formulario, QR en vivo, descarga, etiqueta imprimible y página pública pensada para móvil.
- **Configuración**: nombre, avatar (ocho predefinidos o foto propia) y borrado de cuenta con confirmación.

## ⚙️ Cómo funciona

- **Sesión:** la API guarda un JWT en una cookie `httpOnly`. `AuthProvider` pregunta quién eres al cargar y `useAuth()` lo expone a toda la app.
- **Servicios:** cada llamada vive en `services/` y pasa por un `request()` común que envía cookies, admite `FormData` y convierte los errores del servidor en excepciones con `status`.
- **Rutas privadas:** los *loaders* de React Router comprueban la sesión antes de renderizar, sin parpadeos.
- **Fechas:** los días se comparan por fecha de calendario, no por hora, para que "hoy" y "mañana" no cambien con la zona horaria.
- **Tarjeta de emergencia:** el QR apunta a `/e/:token`. Regenerar el enlace invalida el QR impreso.
- **Servicios:** la última ciudad buscada se recuerda en `localStorage` (las coordenadas del GPS se guardan redondeadas). Cada búsqueda cancela la anterior, y los filtros por categoría se aplican en el cliente sobre una sola consulta.
- **Calendario:** cada evento se pinta con su propio contenido (`eventContent`), y en pantallas estrechas pasa a mostrar solo el icono gracias a *container queries*.

## 🎨 Diseño

- Barra lateral verde oscuro, fondo crema con patrón de huellas y tarjetas blancas redondeadas.
- Paleta definida con variables CSS (`--green-900`, `--green-600`, `--cream`, `--orange`…).
- Tres tamaños: **escritorio** (barra lateral), **tablet** (barra de iconos, hasta 1023 px) y **móvil** (menú desplegable y barra inferior, hasta 767 px).
- Cabeceras de página con icono, gráficos adaptados al ancho y diálogos nativos accesibles.

## 🚀 Próximas versiones

- [ ] Botón "Probar demo"
- [ ] Modo oscuro
- [ ] Estados vacíos con ilustración
- [ ] Despliegue