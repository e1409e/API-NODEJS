import express from 'express';
import {
    obtenerIncidencias,
    obtenerIncidenciaPorId,
    obtenerIncidenciasPorEstudiante,
    crearIncidencia, 
    editarIncidencia,
    eliminarIncidencia
} from '../controllers/incidencias.controller.js';

const router = express.Router();

router.get('/', obtenerIncidencias);
router.get('/:id_incidencia', obtenerIncidenciaPorId);
router.get('/estudiante/:id_estudiante', obtenerIncidenciasPorEstudiante);
router.post('/', crearIncidencia);
router.put('/:id_incidencia', editarIncidencia);
router.delete('/:id_incidencia', eliminarIncidencia);

export default router;