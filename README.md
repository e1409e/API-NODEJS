# 🎓 API de Gestión de Estudiantes con Discapacidad para SMGED

## 📄 Descripción General

Esta API RESTful permite gestionar información de estudiantes con discapacidad: datos personales, académicos y de contacto.  
Desarrollada con **Node.js** y **Express**, utiliza **PostgreSQL** y un diseño modular, con validaciones y saneamiento de datos para garantizar la integridad de la información.

---

## 📁 Estructura del Proyecto

```
API-NODEJS/
├── src/
│   ├── controllers/      # Lógica de negocio (CRUD)
│   ├── routes/           # Endpoints y validaciones
│   ├── utilities/        # Funciones reutilizables
│   ├── validations/      # Reglas de validación (express-validator)
│   ├── config.js         # Configuración global
│   ├── db.js             # Conexión a PostgreSQL
│   └── index.js          # Punto de entrada principal
├── .env                  # Variables de entorno (no subir a git)
├── package-lock.json     # Registro exacto de dependencias
├── package.json          # Metadatos y scripts del proyecto
└── README.md             # Documentación del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución JavaScript
- **Express.js**: Framework web
- **PostgreSQL**: Base de datos relacional
- **@neondatabase/serverless**: Integración serverless con Neon DB
- **pg**: Cliente PostgreSQL para Node.js
- **express-validator**: Validación y saneamiento de datos
- **dotenv**: Variables de entorno
- **cors**: Cross-Origin Resource Sharing
- **jsonwebtoken**: Autenticación JWT
- **morgan**: Registro de peticiones HTTP

---

## ⚙️ Configuración del Entorno

1. **Clona el repositorio:**
    ```sh
    git clone https://github.com/e1409e/API-NODEJS
    cd API-NODEJS
    ```

2. **Instala las dependencias:**  
    ```sh
    npm install
    ```

3. **Configura las variables de entorno:**  
    Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

    ```env
    PORT=3000
    DB_HOST=your_db_host
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_PORT=5432
    ```

    > ⚠️ **Importante:** Nunca subas tu archivo `.env` a sistemas de control de versiones.

---

## 📜 Scripts Disponibles

| Comando      | Descripción                                              |
|--------------|---------------------------------------------------------|
| `npm start`  | Inicia la aplicación en modo producción                 |
| `npm run dev`| Inicia en modo desarrollo con recarga automática        |

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