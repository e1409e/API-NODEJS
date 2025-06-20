import express from 'express';
import multer from 'multer';
import {
    obtenerHistorialesMedicos,
    obtenerHistorialMedicoPorId,
    crearHistorialMedico,
    editarHistorialMedico,
    eliminarHistorialMedico,
    obtenerHistorialMedicoPorEstudiante
} from '../controllers/HistorialMedico.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal local

// Define los campos que esperas recibir como archivos
const fields = [
    { name: 'certificado_conapdis', maxCount: 1 },
    { name: 'informe_medico', maxCount: 1 },
    { name: 'tratamiento', maxCount: 1 }
    // Agrega aquí más campos si tu tabla tiene más archivos
];

// GET /historial_medico - Obtiene todos los historiales médicos
router.get('/', obtenerHistorialesMedicos);

// GET /historial_medico/:id_historialmedico - Obtiene un historial médico por su ID
router.get('/:id_historialmedico', obtenerHistorialMedicoPorId);
// GET /historial_medico/estudiante/:id_estudiante - Obtiene el historial médico por id_estudiante
router.get('/estudiante/:id_estudiante', obtenerHistorialMedicoPorEstudiante);

// POST /historial_medico - Crea un nuevo historial médico (recibe varios archivos)
router.post('/', upload.fields(fields), crearHistorialMedico);

// PUT /historial_medico/:id_historialmedico - Edita un historial médico existente (recibe varios archivos)
router.put('/:id_historialmedico', upload.fields(fields), editarHistorialMedico);

// DELETE /historial_medico/:id_historialmedico - Elimina un historial médico
router.delete('/:id_historialmedico', eliminarHistorialMedico);

export default router;