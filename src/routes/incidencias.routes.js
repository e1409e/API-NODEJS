import express from 'express';
import {
    obtenerIncidencias,
    obtenerIncidenciaPorId,
    crearIncidencia,
    editarIncidencia,
    eliminarIncidencia
} from '../controllers/incidencias.controller.js'; // Ajusta la ruta

const router = express.Router();

router.get('/', obtenerIncidencias);
router.get('/:id_incidencia', obtenerIncidenciaPorId);
router.post('/', crearIncidencia);
router.put('/:id_incidencia', editarIncidencia);
router.delete('/:id_incidencia', eliminarIncidencia);

export default router;