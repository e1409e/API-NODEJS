import express from 'express';
import {
    obtenerHistorialesMedicos,
    obtenerHistorialMedicoPorId,
    crearHistorialMedico,
    editarHistorialMedico,
    eliminarHistorialMedico
} from '../controllers/HistorialMedico.controller.js'; // Asegúrate de que la ruta al controlador sea correcta

const router = express.Router();

// GET /historial_medico - Obtiene todos los historiales médicos
router.get('/', obtenerHistorialesMedicos);

// GET /historial_medico/:id_historialmedico - Obtiene un historial médico por su ID
router.get('/:id_historialmedico', obtenerHistorialMedicoPorId);

// POST /historial_medico - Crea un nuevo historial médico
router.post('/', crearHistorialMedico);

// PUT /historial_medico/:id_historialmedico - Edita un historial médico existente
router.put('/:id_historialmedico', editarHistorialMedico);

// DELETE /historial_medico/:id_historialmedico - Elimina un historial médico
router.delete('/:id_historialmedico', eliminarHistorialMedico);

export default router;