/**
 * @file index.js
 * @module index
 * @description Punto de entrada principal de la API RESTful. Configura y arranca el servidor Express, establece middlewares, inyecta la conexión a la base de datos y monta las rutas principales.
 * @author Eric
 * @version 1.0.0
 * @see module:config
 * @see module:db
 */

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

// Importar la instancia de conexión a la base de datos según configuración
import { sql } from './db.js';

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
import carrerasRoutes from './routes/carreras.routes.js';
import facultadesRoutes from './routes/facultades.routes.js';

/**
 * Carga las variables de entorno desde el archivo `.env` al objeto `process.env`.
 * @function
 */
dotenv.config();

/**
 * Instancia principal de la aplicación Express.
 * @type {import('express').Application}
 */
const app = express();

/**
 * Middleware para habilitar CORS (Cross-Origin Resource Sharing).
 * @function
 */
app.use(cors());

/**
 * Middleware para parsear el cuerpo de las peticiones entrantes como JSON.
 * @function
 */
app.use(express.json());

/**
 * Middleware personalizado para inyectar la instancia de conexión a la base de datos (`sql`) en el objeto de solicitud (`req`).
 * @function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
app.use((req, res, next) => {
  req.sql = sql;
  next();
});

/**
 * Monta las rutas de la API bajo sus respectivos prefijos.
 * @name RutasAPI
 * @memberof module:index
 */
app.use('/citas', citasRoutes);
app.use('/representantes', representantesRoutes);
app.use('/estudiantes', estudiantesRoutes);
app.use('/historial_medico', historialMedicoRoutes);
app.use('/discapacidades', discapacidadesRoutes);
app.use('/reporte-psicologico', reportePsicologicoRoutes);
app.use('/incidencias', incidenciasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/carreras', carrerasRoutes);
app.use('/facultades', facultadesRoutes);

/**
 * Endpoint para verificar la conexión a la base de datos y obtener su versión.
 * @route GET /api/version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error al ejecutar la consulta SQL.
 */
app.get('/api/version', async (req, res) => {
  try {
    const result = await req.sql`SELECT version()`;
    const { version } = result[0];
    res.json({ version });
  } catch (error) {
    console.error("Error al obtener la versión de la base de datos:", error);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});

/**
 * Inicia el servidor Express en el puerto especificado.
 * @function
 */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
