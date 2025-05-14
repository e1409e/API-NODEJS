import express from 'express';
import {
    obtenerUniversidades,
    obtenerUniversidadPorId,
    crearUniversidad,
    editarUniversidad,
    eliminarUniversidad
} from '../controllers/universidad.controller.js'; // Ajusta la ruta

const router = express.Router();

router.get('/', obtenerUniversidades);
router.get('/:id', obtenerUniversidadPorId);
router.post('/', crearUniversidad);
router.put('/:id', editarUniversidad);
router.delete('/:id', eliminarUniversidad);

export default router;