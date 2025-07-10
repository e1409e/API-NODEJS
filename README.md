# 🎓 API de Gestión de Estudiantes con Discapacidad para SMGED

## 📄 Descripción General

API RESTful para el sistema SMGED que permite gestionar información de estudiantes con discapacidad: datos personales, académicos y de contacto.  
Desarrollada con **Node.js** y **Express**, utiliza **PostgreSQL** y un diseño modular, con validaciones y saneamiento de datos para garantizar la integridad de la información.

---

## 📁 Estructura del Proyecto

```
API-NODEJS/
├── src/
│   ├── controllers/      # Lógica de negocio (CRUD)
│   ├── routes/           # Endpoints y validaciones
│   ├── utilities/        # Funciones reutilizables
│   ├── validations/      # Reglas de validación (express-validator)
│   ├── config.js         # Configuración global
│   ├── db.js             # Conexión a PostgreSQL
│   └── index.js          # Punto de entrada principal
├── .env.example          # Variables de entorno
├── .dockerignore         # Archivos a ignorar por Docker
├── Dockerfile            # Definición de la imagen Docker
├── package-lock.json     # Registro exacto de dependencias
├── package.json          # Metadatos y scripts del proyecto
└── README.md             # Documentación del proyecto
```
---

## 🛠️ Tecnologías Utilizadas

-   **Node.js**: Entorno de ejecución JavaScript para construir aplicaciones de servidor escalables.
-   **Express.js**: Framework web rápido y minimalista para Node.js, utilizado para construir la API RESTful.
-   **PostgreSQL**: Sistema de gestión de bases de datos relacionales robusto y de código abierto.
-   **@neondatabase/serverless**: Cliente para la integración serverless con Neon DB, permitiendo una conexión eficiente y escalable a la base de datos en la nube.
-   **pg**: Cliente PostgreSQL para Node.js, utilizado para interactuar con la base de datos.
-   **Docker**: Plataforma de contenedores que permite empaquetar la aplicación y sus dependencias en un entorno aislado, garantizando consistencia y portabilidad en cualquier entorno de ejecución.
-   **express-validator**: Middleware para Express.js que facilita la validación y saneamiento de datos de entrada.
-   **dotenv**: Módulo para cargar variables de entorno desde un archivo `.env`, manteniendo las configuraciones sensibles fuera del código fuente.
-   **cors**: Middleware para Express.js que habilita el Cross-Origin Resource Sharing, permitiendo que la API sea accesible desde diferentes orígenes.
-   **jsonwebtoken**: Implementación de JSON Web Tokens (JWT) para la autenticación y autorización segura de usuarios.
-   **morgan**: Middleware de registro de peticiones HTTP para Express.js, útil para el monitoreo y la depuración.

---

## ⚙️ Configuración del Entorno

1. **Clona el repositorio:**
    ```sh
    git clone [https://github.com/e1409e/API-NODEJS](https://github.com/e1409e/API-NODEJS)
    cd API-NODEJS
    ```

2. **Instala las dependencias:**  
    ```sh
    npm install
    ```

3. **Configura las variables de entorno:**  
    Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido (ejemplo basado en `.env.example`):

    ```env
    # Selecciona el origen de la base de datos: "neon" o "local"
    DB_SOURCE=neon

    # URL de conexión a NeonDB
    NEON_DATABASE_URL="postgresql://usuario:contraseña@host:puerto/base_de_datos?sslmode=require&channel_binding=require"

    # Parámetros para base de datos local (ejemplo, si usas DB_SOURCE=local)
    LOCAL_DB_HOST=localhost
    LOCAL_DB_USER=postgres
    LOCAL_DB_PASSWORD=root
    LOCAL_DB_NAME=FLUNIPDIS
    LOCAL_DB_PORT=5432

    # Puerto de la API
    PORT=3000

    # Clave secreta para JWT
    JWT_SECRET=your_jwt_secret_key
    ```

    > ⚠️ **Importante:** Nunca subas tu archivo `.env` a sistemas de control de versiones.

---

## 🐳 Dockerización de la API

Para desplegar la API usando Docker, sigue estos pasos:

1.  **Asegúrate de tener Docker instalado** en tu sistema.
2.  **Crea el archivo `.dockerignore`** en la raíz de tu proyecto para excluir archivos y directorios innecesarios de la imagen Docker. Esto ayuda a reducir el tamaño de la imagen y mejorar la seguridad.
    ```
    node_modules
    npm-debug.log
    .git
    .gitignore
    .env
    Dockerfile
    docker-compose.yml
    jsdoc.json
    docs/
    ```
3.  **Crea el `Dockerfile`** en la raíz de tu proyecto. Este archivo contiene las instrucciones para construir la imagen de tu aplicación.

    ```dockerfile
    # Usa una imagen base de Node.js.
    # La versión 20-alpine es ligera y adecuada para producción.
    FROM node:20-alpine

    # Establece el directorio de trabajo dentro del contenedor.
    # Este será el directorio raíz de tu aplicación.
    WORKDIR /app

    # Copia los archivos de definición de dependencias (package.json y package-lock.json).
    # Esto permite a Docker aprovechar la caché de capas.
    # Si estos archivos no cambian, las dependencias no se reinstalarán en cada build.
    COPY package*.json ./

    # Instala todas las dependencias del proyecto.
    RUN npm install --omit=dev

    # Copia el resto del código fuente de tu aplicación al directorio de trabajo.
    COPY . .

    # Expone el puerto en el que la aplicación Node.js escuchará.
    # Utiliza la variable de entorno PORT que tu aplicación usa, con un valor por defecto.
    ARG PORT=3000
    EXPOSE ${PORT}

    # Define el comando que se ejecutará cuando se inicie el contenedor.
    # Esto iniciará tu aplicación en modo de producción según tu script 'start' en package.json.
    CMD [ "npm", "start" ]
    ```

4.  **Construye la imagen Docker:**
    Abre tu terminal en la raíz del proyecto y ejecuta el siguiente comando. Esto creará una imagen Docker llamada `api-nodejs`.

    ```sh
    docker build -t api-nodejs .
    ```

5.  **Ejecuta el contenedor Docker:**
    Para iniciar tu API en un contenedor, usa el siguiente comando. Es **crucial** pasar la URL de tu base de datos Neon como una variable de entorno (`NEON_DATABASE_URL`) en este paso para mantener tus credenciales seguras.

    ```sh
    docker run -d -p 3000:3000 \
      -e PORT=3000 \
      -e NEON_DATABASE_URL="postgresql://usuario:contraseña@host:puerto/base_de_datos?sslmode=require&channel_binding=require" \
      -e DB_SOURCE=neon \
      -e JWT_SECRET="your_jwt_secret_key" \
      api-nodejs
    ```
    * `-d`: Ejecuta el contenedor en modo "detached" (en segundo plano).
    * `-p 3000:3000`: Mapea el puerto 3000 del host (tu máquina) al puerto 3000 del contenedor.
    * `-e PORT=3000`: Pasa la variable de entorno `PORT` al contenedor.
    * `-e NEON_DATABASE_URL="..."`: **Reemplaza `"`postgresql://usuario:contraseña@host:puerto/base_de_datos?sslmode=require&channel_binding=require"`" ` con la URL de conexión real de tu base de datos Neon.**
    * `-e DB_SOURCE=neon`: Pasa la variable de entorno `DB_SOURCE` para indicar el origen de la base de datos.
    * `-e JWT_SECRET="..."`: Pasa la clave secreta para JWT. **Reemplaza `"your_jwt_secret_key"` con tu clave secreta real.**

    Tu API estará accesible en `http://localhost:3000`.

---

## 📜 Scripts Disponibles

| Comando      | Descripción                                              |
|--------------|---------------------------------------------------------|
| `npm start`  | Inicia la aplicación en modo producción                 |
| `npm run dev`| Inicia en modo desarrollo con recarga automática        |
| `npm run docs`| Inicia jsdoc para crear la documentación HTML          |

---

## 📚 Ejemplos de Endpoints de la API (Modulo de Estudiantes)

### 1. Obtener todos los estudiantes

- **URL:** `/estudiantes`
- **Método:** `GET`
- **Descripción:** Lista todos los estudiantes registrados.
- **Respuestas:**
    - `200 OK`: Lista de estudiantes.
    - `500 Internal Server Error`: Error en el servidor o base de datos.

---

### 2. Obtener estudiante por ID

- **URL:** `/estudiantes/:id_estudiante`
- **Método:** `GET`
- **Parámetros:**  
    - `id_estudiante` (entero positivo, obligatorio)
- **Respuestas:**
    - `200 OK`: Detalles del estudiante.
    - `400 Bad Request`: ID inválido.
    - `404 Not Found`: No existe el estudiante.
    - `500 Internal Server Error`: Error en el servidor o base de datos.

---

### 3. Crear un nuevo estudiante

- **URL:** `/estudiantes`
- **Método:** `POST`
- **Descripción:** Registra un nuevo estudiante.  
  Los nombres y apellidos se formatean a "Capital Case", el correo a minúsculas.
- **Respuestas:**
    - `201 Created`: Estudiante creado.
    - `400 Bad Request`: Datos inválidos.
    - `500 Internal Server Error`: Error en el servidor o base de datos.

---

### 4. Actualizar un estudiante existente

- **URL:** `/estudiantes/:id_estudiante`
- **Método:** `PUT`
- **Descripción:** Actualiza información de un estudiante.  
  Permite actualización parcial y formatea los campos de texto.
- **Parámetros:**  
    - `id_estudiante` (obligatorio)
- **Respuestas:**
    - `200 OK`: Estudiante actualizado.
    - `400 Bad Request`: ID o datos inválidos.
    - `404 Not Found`: No existe el estudiante.
    - `500 Internal Server Error`: Error en el servidor o base de datos.

---

### 5. Eliminar un estudiante

- **URL:** `/estudiantes/:id_estudiante`
- **Método:** `DELETE`
- **Descripción:** Elimina un estudiante por su ID.
- **Parámetros:**  
    - `id_estudiante` (obligatorio)
- **Respuestas:**
    - `200 OK`: Estudiante eliminado.
    - `400 Bad Request`: ID inválido.
    - `404 Not Found`: No existe el estudiante.
    - `500 Internal Server Error`: Error en el servidor o base de datos.

---

## 📬 Contacto

¿Dudas o sugerencias?  
Abre un issue o contacta al [autor en GitHub](https://github.com/e1409e)
