import express from 'express';
import {
    obtenerHistorialesMedicos,
    obtenerHistorialMedicoPorId,
    crearHistorialMedico,
    editarHistorialMedico,
    eliminarHistorialMedico,
    obtenerHistorialMedicoPorEstudiante
} from '../controllers/HistorialMedico.controller.js';

const router = express.Router();

// GET /historial_medico - Obtiene todos los historiales médicos
router.get('/', obtenerHistorialesMedicos);

// GET /historial_medico/:id_historialmedico - Obtiene un historial médico por su ID
router.get('/:id_historialmedico', obtenerHistorialMedicoPorId);

// GET /historial_medico/estudiante/:id_estudiante - Obtiene el historial médico por id_estudiante
router.get('/estudiante/:id_estudiante', obtenerHistorialMedicoPorEstudiante);

// POST /historial_medico - Crea un nuevo historial médico (solo texto)
router.post('/', crearHistorialMedico);

// PUT /historial_medico/:id_historialmedico - Edita un historial médico existente (solo texto)
router.put('/:id_historialmedico', editarHistorialMedico);

// DELETE /historial_medico/:id_historialmedico - Elimina un historial médico
router.delete('/:id_historialmedico', eliminarHistorialMedico);

export default router;