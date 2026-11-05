# 🐾 HUELLA API

<!-- DESPLIEGUE (mañana): descomenta y pon tu URL
<p align="center">
  <a href="https://TU-URL.vercel.app">
    <img src="https://img.shields.io/badge/🐾_Demo_en_vivo-TU--URL.vercel.app-f2994a?style=for-the-badge" alt="Demo en vivo" />
  </a>
</p>

> ⏳ La API está en el plan gratuito de Render: si lleva un rato sin visitas, la primera carga puede tardar 30-50 segundos.
-->

API REST del proyecto **HUELLA**, una aplicación para gestionar mascotas. Los usuarios se registran, crean la ficha de sus mascotas, anotan su salud, peso, tareas, gastos y documentos, y generan una tarjeta pública de emergencia con QR.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6C37?style=for-the-badge)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white)

## 🛠️ Tecnologías

- **Node.js + Express**: servidor y rutas (módulos ES)
- **MongoDB Atlas + Mongoose**: base de datos y modelos
- **JWT en cookie `httpOnly`**: autenticación
- **bcryptjs**: contraseñas cifradas
- **helmet y CORS**: cabeceras de seguridad y origen permitido
- **Límites de peticiones**: protección de las rutas sensibles
- **Multer**: recepción de imágenes y documentos en memoria
- **Cloudinary**: almacenamiento de fotos, avatares y documentos
- **dotenv**: variables de entorno
- **Mocha, Chai y Supertest**: tests de integración

## 📁 Estructura

```
server/
├── src/
│   ├── controllers/      Lógica de cada recurso (auth, pets, tasks, health, documents…)
│   ├── middleware/       Autenticación, subida de archivos y errorHandler
│   ├── models/           User, Pet, HealthRecord, Task, Expense, Weight, Document
│   ├── routes/           Rutas de cada recurso (+ overviewRoutes: listados globales)
│   ├── services/         Lógica compartida (p. ej. accountService: borrado de cuenta)
│   ├── utils/            Utilidades (avatarPresets, pick…)
│   └── server.js         Arranque del servidor
├── test/
│   ├── setup.js          Conexión a la base de datos de test
│   └── *.test.js         Tests de integración
├── .env.example
├── package.json
└── README.md
```

## ⚙️ Instalación

```bash
cd server
npm install
```

Crea un archivo `.env` a partir del ejemplo y rellénalo:

```bash
cp .env.example .env
```

| Variable                | Descripción                                                |
| ----------------------- | ---------------------------------------------------------- |
| `PORT`                  | Puerto del servidor (por defecto `5000`)                   |
| `MONGO_URI`             | Cadena de conexión de MongoDB                              |
| `MONGO_URI_TEST`        | Base de datos separada para los tests                      |
| `CLIENT_URL`            | Origen permitido por CORS (`http://localhost:5173`)        |
| `JWT_SECRET`            | Clave secreta para firmar los tokens                       |
| `NODE_ENV`              | `development` o `production`                               |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de tu cuenta de Cloudinary                      |
| `CLOUDINARY_API_KEY`    | API Key de Cloudinary                                      |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary (privado, no se sube nunca a Git) |

## 📜 Scripts

| Comando       | Qué hace                                                    |
| ------------- | ----------------------------------------------------------- |
| `npm run dev` | Arranca el servidor con recarga automática (`node --watch`) |
| `npm start`   | Arranca el servidor con Node                                |
| `npm test`    | Ejecuta los tests con Mocha                                 |

El servidor queda en `http://localhost:5000`.

## 🧪 Tests

Tests de integración con **Mocha**, **Chai** y **Supertest**. Comprueban la API contra una base de datos de pruebas.

### Configuración

Define `MONGO_URI_TEST` en tu `.env`, apuntando a **otra base de datos** (por ejemplo `huella_test`). Los tests borran datos, así que nunca deben usar la base real.

### Ejecutar

```bash
npm test
```

### Qué se prueba

| Archivo              | Cubre                                                                           |
| -------------------- | ------------------------------------------------------------------------------- |
| `overview.test.js`   | Listados globales de salud y documentos, y que solo devuelvan datos del usuario |
| `avatar.test.js`     | Avatar predefinido, subida y borrado de foto, y validaciones                    |
| Resto de `*.test.js` | Autenticación, mascotas, tareas, salud, gastos y tarjeta de emergencia          |

## 🗃️ Modelos

### User

| Campo      | Tipo   | Notas                                                    |
| ---------- | ------ | -------------------------------------------------------- |
| `name`     | String | Obligatorio                                              |
| `email`    | String | Obligatorio, único, en minúsculas                        |
| `password` | String | Obligatorio, cifrada. No se devuelve en las consultas    |
| `avatar`   | Object | `preset` (p1 a p8), `url` y `publicId` de la foto subida |

### Pet

| Campo         | Tipo     | Notas                                                                                                                                                |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `owner`       | ObjectId | Referencia a `User`. Se asigna desde la sesión                                                                                                       |
| `name`        | String   | Obligatorio                                                                                                                                          |
| `species`     | String   | `dog`, `cat` u `other`                                                                                                                               |
| `breed`       | String   | Opcional                                                                                                                                             |
| `sex`         | String   | `male` o `female`                                                                                                                                    |
| `birthDate`   | Date     | Opcional                                                                                                                                             |
| `microchip`   | String   | Opcional                                                                                                                                             |
| `allergies`   | [String] | Lista de alergias                                                                                                                                    |
| `notes`       | String   | Observaciones                                                                                                                                        |
| `photo`       | Object   | `url` y `publicId` en Cloudinary                                                                                                                     |
| `inTreatment` | Boolean  | Se muestra en el Inicio                                                                                                                              |
| `emergency`   | Object   | `enabled`, `publicToken`, `ownerName`, `ownerPhone`, `vetContact`, `instructions`, `conditions`, `showAllergies`, `showMedication`, `showConditions` |

### HealthRecord

| Campo         | Tipo     | Notas                                         |
| ------------- | -------- | --------------------------------------------- |
| `owner`       | ObjectId | Referencia a `User`                           |
| `petId`       | ObjectId | Referencia a `Pet`                            |
| `type`        | String   | `vaccine`, `deworming`, `visit` o `treatment` |
| `date`        | Date     | Obligatorio                                   |
| `title`       | String   | Obligatorio                                   |
| `notes`       | String   | Opcional                                      |
| `nextDueDate` | Date     | Próxima fecha (revisión, refuerzo…)           |
| `treatment`   | Object   | `drug`, `dose`, `startDate`, `endDate`        |

### Otros

- **Task**: título, tipo (`walk`, `feeding`, `medication`, `grooming`, `vet`, `training`, `other`), fecha (`dueAt`), estado, mascota y repetición.
- **Expense**: importe **en céntimos**, categoría, fecha y mascota.
- **Weight**: `kg`, fecha y mascota.
- **Document**: archivo en Cloudinary, nombre y mascota.

Todos incluyen `createdAt` y `updatedAt`.

## 🔐 Autenticación

El login guarda un JWT en una cookie `httpOnly`, que el navegador envía solo en cada petición (el front usa `credentials: "include"`). Las rutas protegidas leen esa cookie. El cierre de sesión la borra.

## 📡 Endpoints

Base: `/api/v1`. Respuestas correctas: `{ "data": ... }`. Errores: `{ "error": { "message": "..." } }`.

| Método                   | Ruta                              | Auth | Descripción                                       |
| ------------------------ | --------------------------------- | ---- | ------------------------------------------------- |
| POST                     | `/auth/register`                  | No   | Registrar usuario                                 |
| POST                     | `/auth/login`                     | No   | Iniciar sesión                                    |
| POST                     | `/auth/logout`                    | Sí   | Cerrar sesión                                     |
| GET                      | `/auth/me`                        | Sí   | Usuario actual                                    |
| PATCH                    | `/auth/me`                        | Sí   | Editar perfil y avatar predefinido                |
| DELETE                   | `/auth/me`                        | Sí   | Borrar cuenta y todos sus datos (pide contraseña) |
| POST                     | `/auth/me/avatar`                 | Sí   | Subir foto de avatar (campo `photo`)              |
| DELETE                   | `/auth/me/avatar`                 | Sí   | Quitar foto de avatar                             |
| GET, POST                | `/pets`                           | Sí   | Listar y crear mascotas                           |
| GET, PATCH, DELETE       | `/pets/:id`                       | Sí   | Ver, editar y borrar una mascota                  |
| PATCH                    | emergencia de la mascota          | Sí   | Activar y configurar la tarjeta                   |
| POST                     | `/regenerate` (de la mascota)     | Sí   | Regenerar el enlace público                       |
| GET                      | `/emergency/:token`               | No   | Datos públicos de la tarjeta                      |
| GET, POST, PATCH, DELETE | `/tasks`                          | Sí   | CRUD de tareas                                    |
| POST                     | `/tasks/:id/complete`             | Sí   | Marcar como hecha                                 |
| POST                     | `/tasks/:id/skip`                 | Sí   | Saltar esta ocurrencia                            |
| GET                      | `/health-records`                 | Sí   | Salud de todas tus mascotas                       |
| GET                      | `/documents`                      | Sí   | Documentos de todas tus mascotas                  |
| GET                      | `/expenses` · `/expenses/summary` | Sí   | Gastos y resumen mensual                          |
| GET                      | `/dashboard`                      | Sí   | Datos de la pantalla de inicio                    |
| GET                      | `/health`                         | No   | Comprobación de estado de la API                  |

Por mascota existen además las rutas anidadas de **peso, salud, gastos y documentos**.

### Ejemplos

**GET `/emergency/:token`** (pública)

```json
{
  "data": {
    "name": "Roco",
    "species": "dog",
    "breed": "Braco alemán",
    "photo": "https://res.cloudinary.com/.../huella/roco.jpg",
    "ownerName": "Sergio",
    "ownerPhone": "+34 600 000 000",
    "vetContact": "Clínica Veterinaria Centro · 910 000 000",
    "instructions": "Es tímido, ofrécele agua y llámame.",
    "allergies": ["Pollo"]
  }
}
```

Solo salen los campos que el dueño ha activado. Si la tarjeta está desactivada o el enlace se regeneró, responde `404`.

**POST `/auth/register`**

```json
{ "name": "Sergio", "email": "sergio@test.com", "password": "12345678" }
```

## 📋 Códigos de respuesta

| Código        | Cuándo                                                            |
| ------------- | ----------------------------------------------------------------- |
| `200` / `201` | Petición correcta / recurso creado                                |
| `400`         | Datos o ID no válidos, archivo ausente o con formato no permitido |
| `401`         | Sin sesión, sesión caducada o credenciales incorrectas            |
| `404`         | Recurso no encontrado (o que no es tuyo)                          |
| `429`         | Demasiadas peticiones                                             |
| `500`         | Error del servidor                                                |

## 📝 Notas

- Cada consulta filtra por `owner`: un recurso de otro usuario responde `404`, como si no existiera.
- Los campos aceptados en `body` pasan por una lista blanca (`pick`), nunca se guarda el body entero.
- Los importes se guardan **en céntimos** y las fechas en **UTC**.
- Un `errorHandler` central traduce errores de Mongoose a códigos HTTP (un `CastError` pasa a `400`).
- Los archivos se reciben en memoria (máximo 5 MB), se comprueba su firma real y se suben a Cloudinary.
- Al cambiar el avatar, borrar un documento o eliminar la cuenta, los archivos asociados también se borran de Cloudinary.
- El enlace de la tarjeta de emergencia se puede regenerar: el QR anterior deja de funcionar.
- Los listados globales (`/health-records`, `/documents`) viven en `overviewRoutes`. `/health` se reserva para el healthcheck.
- Limitación conocida: las tareas repetidas se calculan en UTC, por lo que pueden desplazarse una hora al cambiar el horario de verano.

## 🚀 Próximas versiones

- [ ] Endpoint de servicios cercanos (veterinarios, peluquerías, residencias)
- [ ] Cuenta demo con datos de ejemplo
- [ ] Despliegue
