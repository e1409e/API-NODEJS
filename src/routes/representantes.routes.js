import express from 'express';
import {
    obtenerRepresentantes,
    obtenerRepresentantePorId,
    crearRepresentante,
    editarRepresentante,
    eliminarRepresentante
} from '../controllers/representantes.controller.js'; 

const router = express.Router();

// GET /representantes - Obtiene todos los representantes
router.get('/', obtenerRepresentantes);

// GET /representantes/:id_representante - Obtiene un representante por su ID
router.get('/:id_representante', obtenerRepresentantePorId);

// POST /representantes - Crea un nuevo representante
router.post('/', crearRepresentante);

// PUT /representantes/:id_representante - Edita un representante existente
router.put('/:id_representante', editarRepresentante);

// DELETE /representantes/:id_representante - Elimina un representante
router.delete('/:id_representante', eliminarRepresentante);

export default router;