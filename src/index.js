import express from 'express';
import { PORT } from './config.js';
import { DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE, DB_PORT } from './config.js'; // Aunque no se usen directamente aquí, los mantengo
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import cors from 'cors'; 

// Importar las rutas
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

dotenv.config();

const app = express();
const sql = neon(process.env.DATABASE_URL);

// --- Middleware para CORS ---
// ¡ESTO ES CRUCIAL PARA FLUTTER WEB!
// Asegúrate de que esto esté ANTES de cualquier `app.use` de tus rutas.
app.use(cors());

// Middleware para parsear el body de las peticiones a JSON
app.use(express.json()); 

app.use((req, res, next) => {
    req.sql = sql;
    next();
});

// Usar las rutas
app.use('/citas', citasRoutes);
app.use('/representantes', representantesRoutes);
app.use('/estudiantes', estudiantesRoutes);
app.use('/HistorialMedico', historialMedicoRoutes);
app.use('/discapacidades', discapacidadesRoutes);
app.use('/reporte-psicologico', reportePsicologicoRoutes);
app.use('/incidencias', incidenciasRoutes);
app.use('/usuarios', usuariosRoutes); // Aquí es donde se montan tus rutas de usuarios, incluyendo /usuarios/login
app.use('/universidad', universidadRoutes);
app.use('/carreras', carrerasRoutes);

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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});