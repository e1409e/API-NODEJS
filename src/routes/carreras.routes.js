import express from 'express';
import {
    obtenerCarreras,
    obtenerCarreraPorId,
    crearCarrera,
    editarCarrera,
    eliminarCarrera
} from '../controllers/carreras.controller.js';

const router = express.Router();

// Obtener todas las carreras
router.get('/', obtenerCarreras);

// Obtener una carrera por ID
router.get('/:id_carrera', obtenerCarreraPorId);

// Crear una nueva carrera (requiere: carrera, id_facultad)
router.post('/', crearCarrera);

// Editar una carrera (puede recibir: carrera, id_facultad)
router.put('/:id_carrera', editarCarrera);

// Eliminar una carrera
router.delete('/:id_carrera', eliminarCarrera);

export default router;