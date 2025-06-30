# API de Gestión de Estudiantes con discapacidad

# Descripción General
<!-- Esta API RESTful está diseñada para gestionar la información de estudiantes con discapacidad, incluyendo sus datos personales, información académica, y detalles de contacto. Desarrollada con Node.js y Express, utiliza PostgreSQL como base de datos y sigue un enfoque de diseño modular, incorporando validaciones robustas y funciones de saneamiento de datos para garantizar la integridad de la información. -->

# Estructura del Proyecto
<!-- 
API-NODEJS/
├── src/
│   ├── controllers/      # Contiene la lógica de negocio para cada ruta (CRUD).
│   ├── routes/           # Define los endpoints de la API y aplica las validaciones.
│   ├── utilities/        # Funciones de ayuda reutilizables.
│   ├── validations/      # Reglas de validación para los datos de entrada (express-validator).
│   ├── config.js         # Configuración global de la aplicación.
│   ├── db.js             # Configuración y conexión a la base de datos PostgreSQL.
│   └── index.js          # Punto de entrada principal de la aplicación.
├── .env                  # Variables de entorno (¡no subir a control de versiones!).
├── package-lock.json     # Registro de dependencias exactas.
├── package.json          # Metadatos del proyecto y scripts.
└── README.md             # Documentación del proyecto (este archivo). -->

# Tecnologías Utilizadas
<!-- 
- Node.js: Entorno de ejecución para JavaScript.
- Express.js: Framework web para construir la API.
- PostgreSQL: Base de datos relacional.
- @neondatabase/serverless: Para integración con Neon DB (servicios serverless de Postgres).
- pg: Cliente PostgreSQL para Node.js.
- express-validator: Middleware para la validación y saneamiento de datos.
- dotenv: Para cargar variables de entorno desde un archivo .env.
- cors: Para habilitar Cross-Origin Resource Sharing.
- jsonwebtoken: Para la implementación de autenticación basada en tokens (JWT).
- morgan: Middleware de registro de peticiones HTTP.  -->

# Configuración del Entorno
<!-- 
1. Clona el repositorio:
    git clone https://github.com/e1409e/API-NODEJS
    cd API-NODEJS 

2. Instala las dependencias: 
    npm install

3. Crea el archivo de variables de entorno:
    Crea un archivo .env en la raíz del proyecto y configura las variables necesarias para 
    tu base de datos y otras configuraciones. Aquí un ejemplo:

        PORT=3000
        DB_HOST=your_db_host
        DB_USER=your_db_user
        DB_PASSWORD=your_db_password
        DB_NAME=your_db_name
        DB_PORT=5432

    Importante: Nunca subas tu archivo .env a sistemas de control de versiones como Git.
-->

# Scripts Disponibles
<!-- 
Puedes ejecutar la API usando los siguientes comandos:
- npm start: Inicia la aplicación en modo de producción.
- npm dev: Inicia la aplicación en modo de desarrollo con node --watch, 
    lo que reinicia automáticamente el servidor al detectar cambios en los archivos. -->

# Endpoints de la API (Estudiantes)
<!--
1. Obtener todos los estudiantes
- URL: /estudiantes
- Método: GET
- Descripción: Recupera una lista de todos los estudiantes registrados.
- Respuesta Exitosa (200 OK):
- Errores Posibles:
    * 500 Internal Server Error: En caso de un fallo en el servidor o la base de datos.

2. Obtener estudiante por ID
- URL: /estudiantes/:id_estudiante
- Método: GET
- Descripción: Recupera los detalles de un estudiante específico por su ID.
- Parámetros de URL: id_estudiante (obligatorio): El ID único del estudiante (entero positivo).
- Respuesta Exitosa (200 OK):
- Errores Posibles:
    * 400 Bad Request: Si el id_estudiante no es un entero positivo.
    * 404 Not Found: Si el estudiante con el ID proporcionado no existe.
    * 500 Internal Server Error: En caso de un fallo en el servidor o la base de datos.


3. Crear un nuevo estudiante
- URL: /estudiantes
- Método: POST
- Descripción: Registra un nuevo estudiante en la base de datos. Los datos de texto como nombres y apellidos se formatearán automáticamente a "Capital Case", y correo a minúsculas.
- Respuesta Exitosa (201 Created):
- Errores Posibles:
    * 400 Bad Request: Si los datos enviados no cumplen con las validaciones (campos faltantes, formatos incorrectos, etc.).
    * 500 Internal Server Error: En caso de un fallo en el servidor o la base de datos.

4. Actualizar un estudiante existente
- URL: /estudiantes/:id_estudiante
- Método: PUT
- Descripción: Actualiza la información de un estudiante. Se pueden enviar uno o más campos para actualizar parcialmente el registro. Los campos de texto también se formatearán automáticamente.
- Parámetros de URL: id_estudiante (obligatorio): El ID del estudiante a actualizar.
- Respuesta Exitosa (200 OK):
- Errores Posibles:
    * 400 Bad Request: Si el id_estudiante no es válido o si los datos enviados no cumplen con las validaciones (ej. formato de correo incorrecto).
    * 404 Not Found: Si el estudiante con el id_estudiante proporcionado no existe o no se pudo actualizar.
    * 500 Internal Server Error: En caso de un fallo en el servidor o la base de datos.


5. Eliminar un estudiante
- URL: /estudiantes/:id_estudiante
- Método: DELETE
- Descripción: Elimina un estudiante de la base de datos por su ID.
- Parámetros de URL: id_estudiante (obligatorio): El ID del estudiante a eliminar.
- Respuesta Exitosa (200 OK):
- Errores Posibles:
    * 400 Bad Request: Si el id_estudiante no es un entero positivo válido.
    * 404 Not Found: Si el estudiante con el ID proporcionado no existe.
    * 500 Internal Server Error: En caso de un fallo en el servidor o la base de datos. -->