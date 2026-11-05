# Roomix · Backend

Servidor de **Roomix**, un proyecto educativo de salas de estudio colaborativas. Proporciona la API para gestionar perfiles y salas, persiste los datos en Cloud Firestore y coordina el chat y la señalización de las videollamadas.

**[Probar Roomix](https://salon-estudio-frontend.vercel.app)** · [Proyecto completo](https://github.com/juzer1711/Roomix) · [Frontend](https://github.com/juzer1711/salon_estudio_frontend)

## Funcionalidades

- Validación de tokens de Firebase Authentication en las rutas protegidas.
- Consulta de disponibilidad de nombres de usuario y creación, consulta, actualización y eliminación del perfil.
- Creación, búsqueda, edición y eliminación de salas, con verificación del propietario para modificarlas.
- Gestión de membresías y consulta de salas propias y salas a las que pertenece el usuario.
- Chat en tiempo real con persistencia y recuperación del historial de mensajes.
- Eventos de conexión, desconexión y estado multimedia de los participantes.
- Señalización WebRTC para intercambiar ofertas, respuestas y candidatos ICE entre clientes.

El audio, el video y la pantalla compartida se transmiten mediante las conexiones WebRTC de los navegadores. Socket.IO coordina su establecimiento y sincroniza el estado de la sala.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Node.js y TypeScript | Entorno de ejecución y lógica del servidor. |
| Express | API HTTP y rutas. |
| Firebase Admin | Validación de identidad y acceso a Firebase desde el servidor. |
| Cloud Firestore | Perfiles, salas, membresías y mensajes. |
| Socket.IO | Chat, presencia y señalización WebRTC. |
| Zod | Validación de datos. |
| Nano ID | Generación de identificadores de salas. |
| CORS y dotenv | Orígenes permitidos y configuración del entorno. |
| Swagger UI y swagger-jsdoc | Documentación de la API. |

## Desarrollo local

El proyecto declara **Node.js 20.x** como entorno de ejecución. Necesitas npm, un proyecto de Firebase con Cloud Firestore y una cuenta de servicio con acceso a ese proyecto.

```bash
git clone https://github.com/juzer1711/salon_estudio_backend.git
cd salon_estudio_backend
npm install
```

Crea un archivo `.env` en la raíz:

```dotenv
PORT=4000
ALLOWED_ORIGINS=http://localhost:5173
```

Para las credenciales de Firebase, el servidor admite dos opciones:

- **Desarrollo local:** guardar el JSON de la cuenta de servicio como `serviceAccountKey.json` en la raíz del repositorio.
- **Entorno de despliegue:** definir `FIREBASE_SERVICE_ACCOUNT` con el contenido JSON completo de la cuenta de servicio.

Conserva estas credenciales fuera del control de versiones. El frontend debe utilizar el mismo proyecto de Firebase y tener habilitados los proveedores de autenticación que se vayan a usar.

```bash
npm run dev
```

Por defecto, la API se sirve en `http://localhost:4000/api`, Socket.IO en `http://localhost:4000` y Swagger UI en `http://localhost:4000/api-docs`.

## API HTTP

Las rutas protegidas reciben el token de identidad de Firebase en la cabecera `Authorization: Bearer <token>`.

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api/users/check-username/:username` | Consultar disponibilidad de un nombre de usuario; ruta pública. |
| POST | `/api/users/profile` | Crear el perfil del usuario autenticado. |
| GET | `/api/users/me` | Consultar el perfil actual. |
| PUT | `/api/users/me` | Actualizar el perfil. |
| DELETE | `/api/users/me` | Eliminar la cuenta. |
| POST | `/api/rooms` | Crear una sala. |
| GET | `/api/rooms/my-rooms` | Listar las salas propias. |
| GET | `/api/rooms/joined` | Listar las salas en las que participa el usuario. |
| GET | `/api/rooms/:roomId` | Consultar una sala por su identificador. |
| PATCH | `/api/rooms/:roomId` | Cambiar el nombre de una sala propia. |
| DELETE | `/api/rooms/:roomId` | Eliminar una sala propia. |
| POST | `/api/rooms/:roomId/join` | Unirse a una sala. |
| DELETE | `/api/rooms/:roomId/leave` | Abandonar una sala como miembro. |

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor con recarga durante el desarrollo. |
| `npm run build` | Compila TypeScript en `dist/`. |
| `npm start` | Ejecuta el servidor compilado. |
| `npm run lint` | Ejecuta ESLint sobre los archivos TypeScript. |

## Despliegue

El backend de la demo está desplegado en **Render**, con **Cloud Firestore** como base de datos y **Firebase Authentication** como proveedor de identidad. La interfaz está disponible en [Vercel](https://salon-estudio-frontend.vercel.app).

Para desplegar el servidor, utiliza `npm install && npm run build` como comando de compilación y `npm start` como comando de inicio. Configura `FIREBASE_SERVICE_ACCOUNT` y `ALLOWED_ORIGINS` en el servicio. Esta última variable admite varios orígenes separados por comas y se aplica tanto a Express como a Socket.IO; incluye el dominio de tu frontend.

## Estructura

- [api/index.ts](./api/index.ts): servidor HTTP, CORS, Swagger UI e inicialización de Socket.IO.
- [api/routes](./api/routes): rutas de usuarios y salas.
- [src/controllers](./src/controllers): lógica de las operaciones HTTP.
- [src/daos](./src/daos): acceso a los datos de Firestore.
- [src/middlewares](./src/middlewares): autenticación de las peticiones.
- [src/schemas](./src/schemas): esquemas de validación.
- [src/sockets](./src/sockets): eventos de salas, chat y señalización WebRTC.
- [src/config](./src/config): configuración de Firebase Admin y Swagger.

Este repositorio forma parte de [Roomix](https://github.com/juzer1711/Roomix), desarrollado con fines educativos para integrar autenticación, persistencia y colaboración en tiempo real.
