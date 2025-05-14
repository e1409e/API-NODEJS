import express from 'express';
import {
    obtenerDiscapacidades,
    obtenerDiscapacidadPorId,
    crearDiscapacidad,
    editarDiscapacidad,
    eliminarDiscapacidad
} from '../controllers/discapacidades.controller.js'; // Correct import path

const router = express.Router();

router.get('/', obtenerDiscapacidades);
router.get('/:discapacidad_id', obtenerDiscapacidadPorId);
router.post('/', crearDiscapacidad);
router.put('/:discapacidad_id', editarDiscapacidad);
router.delete('/:discapacidad_id', eliminarDiscapacidad);

export default router;