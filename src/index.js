// Importaciones de módulos y configuración
// ----------------------------------------

import express from 'express'; // Importa el framework Express para construir la aplicación web.
import { PORT } from './config.js'; // Importa la variable de entorno PORT desde el archivo de configuración.
// Importa variables de entorno relacionadas con la base de datos desde config.js.
// Aunque no se usan directamente aquí para la conexión con Neon, es buena práctica mantenerlas si son parte de la configuración general.
import { DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE, DB_PORT } from './config.js';
import { neon } from '@neondatabase/serverless'; // Importa el cliente Neon para conectar con la base de datos de Neon.
import dotenv from 'dotenv'; // Importa dotenv para cargar variables de entorno desde el archivo .env.
import cors from 'cors'; // Importa CORS (Cross-Origin Resource Sharing) para manejar las políticas de seguridad de origen cruzado.

// Importar las rutas de la API
// ----------------------------
// Cada importación representa un conjunto de rutas para una entidad específica de tu aplicación.
import citasRoutes from './routes/citas.routes.js';
import representantesRoutes from './routes/representantes.routes.js';
import estudiantesRoutes from './routes/estudiantes.routes.js';
import historialMedicoRoutes from './routes/historialMedico.routes.js';
import discapacidadesRoutes from './routes/discapacidades.routes.js';
import reportePsicologicoRoutes from './routes/reporte_psicologico.routes.js';
import incidenciasRoutes from './routes/incidencias.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import universidadRoutes from './routes/universidad.routes.js';
import carrerasRoutes from './routes/carreras.routes.js';
import facultadesRoutes from './routes/facultades.routes.js';

// Cargar variables de entorno
// ---------------------------
// Configura dotenv para cargar las variables de entorno definidas en el archivo .env
// al objeto `process.env`.
dotenv.config();

// Inicialización de la aplicación Express y la conexión a la base de datos
// -----------------------------------------------------------------------
const app = express(); // Crea una instancia de la aplicación Express.
// Inicializa la conexión a la base de datos de Neon usando la URL de conexión del entorno.
const sql = neon(process.env.DATABASE_URL);

// Configuración de Middlewares
// ---------------------------

// Middleware para CORS
// Habilita CORS para permitir que la aplicación web (especialmente útil para Flutter Web)
// realice solicitudes al backend desde un origen diferente.
// Esto es crucial para evitar errores de seguridad del navegador.
app.use(cors());

// Middleware para parsear JSON
// Habilita el parsing del cuerpo de las peticiones entrantes como JSON.
// Esto permite que la aplicación entienda los datos JSON enviados en las solicitudes POST/PUT.
app.use(express.json());

// Middleware para inyectar la conexión a la base de datos en el objeto de solicitud (req)
// Este middleware personalizado añade la instancia de conexión `sql` (Neon) al objeto `req`.
// De esta manera, cada ruta puede acceder fácilmente a la conexión a la base de datos
// a través de `req.sql` sin necesidad de importarla en cada archivo de ruta.
app.use((req, res, next) => {
    req.sql = sql; // Asigna la instancia de conexión de Neon a `req.sql`.
    next(); // Pasa el control al siguiente middleware o a la función de ruta.
});

// Definición de Rutas de la API
// -----------------------------
// Monta los diferentes conjuntos de rutas en sus respectivas bases URL.
// Por ejemplo, todas las rutas definidas en `citasRoutes` serán accesibles bajo `/citas`.
app.use('/citas', citasRoutes);
app.use('/representantes', representantesRoutes);
app.use('/estudiantes', estudiantesRoutes);
app.use('/historial_medico', historialMedicoRoutes);
app.use('/discapacidades', discapacidadesRoutes);
app.use('/reporte-psicologico', reportePsicologicoRoutes);
app.use('/incidencias', incidenciasRoutes);
app.use('/usuarios', usuariosRoutes); // Incluye rutas como /usuarios/login.
app.use('/universidad', universidadRoutes);
app.use('/carreras', carrerasRoutes);
app.use('/facultades', facultadesRoutes);

// Ruta de ejemplo: Obtener la versión de la base de datos
// -----------------------------------------------------
// Define un endpoint GET para `/api/version` que consulta la versión de la base de datos.
app.get('/api/version', async (req, res) => {
    try {
        // Ejecuta una consulta SQL para obtener la versión de la base de datos.
        const result = await req.sql`SELECT version()`;
        // Extrae la versión del primer resultado.
        const { version } = result[0];
        // Responde con la versión en formato JSON.
        res.json({ version });
    } catch (error) {
        // En caso de error, lo registra en la consola y envía una respuesta de error 500.
        console.error("Error al obtener la versión de la base de datos:", error);
        res.status(500).json({ error: "Error al conectar con la base de datos" });
    }
});

// Inicio del Servidor
// ------------------
// Inicia el servidor Express para que escuche las peticiones en el puerto especificado.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`); // Muestra un mensaje en la consola cuando el servidor se inicia.
});