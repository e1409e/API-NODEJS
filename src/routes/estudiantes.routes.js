import express from 'express';
import {
    obtenerEstudiantes,
    obtenerEstudiantePorId, //  Añadida la nueva función
    crearEstudiante,
    editarEstudiante,
    eliminarEstudiante
} from '../controllers/estudiantes.controller.js';

const router = express.Router();

router.get('/', obtenerEstudiantes);
router.get('/:id_estudiante', obtenerEstudiantePorId); //  Añadida la nueva ruta
router.post('/', crearEstudiante);
router.put('/:id_estudiante', editarEstudiante);
router.delete('/:id_estudiante', eliminarEstudiante);

export default router;