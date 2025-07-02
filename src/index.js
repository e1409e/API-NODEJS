/**
 * @file Este es el archivo principal de la aplicación API RESTful.
 * @description Configura el servidor Express, establece la conexión con la base de datos PostgreSQL (Neon o local),
 * configura los middlewares necesarios (CORS, JSON parsing), inyecta la conexión a la base de datos
 * en el objeto de solicitud, y define y monta todas las rutas de la API.
 * También incluye un endpoint de ejemplo para verificar la conexión a la base de datos.
 * @author Eric
 * @version 1.0.0
 * @see {@link module:config} Para la configuración global de la aplicación.
 * @see {@link module:db} Para la configuración específica de la conexión a la base de datos.
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

// Cargar variables de entorno
// ---------------------------
/**
 * @description Configura dotenv para cargar las variables de entorno definidas en el archivo `.env`
 * al objeto `process.env`. Esto permite que la aplicación acceda a configuraciones sensibles
 * o específicas del entorno sin codificarlas directamente en el código.
 * @function
 */
dotenv.config();

// Inicialización de la aplicación Express
// -----------------------------------------------------------------------
/**
 * @description Instancia principal de la aplicación Express.
 * @type {express.Application}
 */
const app = express();

// Configuración de Middlewares
// ---------------------------

/**
 * @description Middleware para CORS (Cross-Origin Resource Sharing).
 * Habilita el acceso a la API desde diferentes orígenes, lo cual es esencial
 * para aplicaciones cliente (como una aplicación Flutter Web) que se ejecutan
 * en un dominio diferente al de la API. Esto previene errores de seguridad del navegador.
 * @function
 * @see {@link https://expressjs.com/en/resources/middleware/cors.html} Para más detalles sobre el middleware CORS.
 */
app.use(cors());

/**
 * @description Middleware para parsear el cuerpo de las peticiones entrantes como JSON.
 * Permite que la aplicación Express comprenda y procese los datos enviados en formato JSON
 * en las solicitudes HTTP (especialmente para métodos POST y PUT). Los datos parsedos
 * estarán disponibles en `req.body`.
 * @function
 */
app.use(express.json());

/**
 * @description Middleware personalizado para inyectar la instancia de conexión a la base de datos (`sql`)
 * en el objeto de solicitud (`req`).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 * @returns {void} Asigna la instancia `sql` a `req.sql` y continúa con la cadena de middlewares.
 */
app.use((req, res, next) => {
  req.sql = sql; // Asigna la instancia de conexión de Neon a `req.sql`.
  next(); // Pasa el control al siguiente middleware o a la función de ruta.
});

// Definición de Rutas de la API
// -----------------------------
/**
 * @description Monta las rutas relacionadas con las citas bajo el prefijo `/citas`.
 * @see {@link module:routes/citas.routes}
 */
app.use('/citas', citasRoutes);
/**
 * @description Monta las rutas relacionadas con los representantes bajo el prefijo `/representantes`.
 * @see {@link module:routes/representantes.routes}
 */
app.use('/representantes', representantesRoutes);
/**
 * @description Monta las rutas relacionadas con los estudiantes bajo el prefijo `/estudiantes`.
 * @see {@link module:routes/estudiantes.routes}
 */
app.use('/estudiantes', estudiantesRoutes);
/**
 * @description Monta las rutas relacionadas con el historial médico bajo el prefijo `/historial_medico`.
 * @see {@link module:routes/historialMedico.routes}
 */
app.use('/historial_medico', historialMedicoRoutes);
/**
 * @description Monta las rutas relacionadas con las discapacidades bajo el prefijo `/discapacidades`.
 * @see {@link module:routes/discapacidades.routes}
 */
app.use('/discapacidades', discapacidadesRoutes);
/**
 * @description Monta las rutas relacionadas con los reportes psicológicos bajo el prefijo `/reporte-psicologico`.
 * @see {@link module:routes/reporte_psicologico.routes}
 */
app.use('/reporte-psicologico', reportePsicologicoRoutes);
/**
 * @description Monta las rutas relacionadas con las incidencias bajo el prefijo `/incidencias`.
 * @see {@link module:routes/incidencias.routes}
 */
app.use('/incidencias', incidenciasRoutes);
/**
 * @description Monta las rutas relacionadas con los usuarios bajo el prefijo `/usuarios`.
 * Esto incluye rutas como `/usuarios/login`, `/usuarios/registrar`, etc.
 * @see {@link module:routes/usuarios.routes}
 */
app.use('/usuarios', usuariosRoutes);
/**
 * @description Monta las rutas relacionadas con las carreras bajo el prefijo `/carreras`.
 * @see {@link module:routes/carreras.routes}
 */
app.use('/carreras', carrerasRoutes);
/**
 * @description Monta las rutas relacionadas con las facultades bajo el prefijo `/facultades`.
 * @see {@link module:routes/facultades.routes}
 */
app.use('/facultades', facultadesRoutes);

// Ruta de ejemplo: Obtener la versión de la base de datos
// -----------------------------------------------------
/**
 * @description Define un endpoint GET para `/api/version` que permite verificar la conexión
 * a la base de datos y obtener su versión.
 * @param {object} req - Objeto de solicitud de Express. Se espera que `req.sql` contenga la instancia de conexión a la DB.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto JSON que contiene la versión de la base de datos o un mensaje de error.
 * @throws {Error} Si ocurre un error al ejecutar la consulta SQL.
 * @method GET
 * @route /api/version
 */
app.get('/api/version', async (req, res) => {
  try {
    // Ejecuta una consulta SQL para obtener la versión de la base de datos.
    const result = await req.sql`SELECT version()`;
    // Extrae la versión del primer resultado de la consulta.
    const { version } = result[0];
    // Responde con la versión en formato JSON.
    res.json({ version });
  } catch (error) {
    // En caso de error al conectar o consultar la base de datos, lo registra en la consola.
    console.error("Error al obtener la versión de la base de datos:", error);
    // Envía una respuesta de error 500 (Internal Server Error) al cliente.
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});

// Inicio del Servidor
// ------------------
/**
 * @description Inicia el servidor Express para que escuche las peticiones entrantes
 * en el puerto especificado en la configuración (`PORT`).
 * Al iniciar el servidor, se imprime un mensaje en la consola indicando el puerto de escucha.
 * @function
 */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`); // Muestra un mensaje en la consola cuando el servidor se inicia.
});
