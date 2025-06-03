import express from 'express';
import {
    obtenerCarreras,
    obtenerCarreraPorId, 
} from '../controllers/carreras.controller.js';

const router = express.Router();

router.get('/', obtenerCarreras);
router.get('/:id_carrera', obtenerCarreraPorId); //  Añadida la nueva ruta
// router.post('/', crearCarrera);
// router.put('/:id_estudiante', editarCarrera);
// router.delete('/:id_estudiante', eliminarCarrera);

export default router;