import express from 'express';
import {
    obtenerReportesPsicologicos,
    obtenerReportePsicologicoPorId,
    crearReportePsicologico,
    editarReportePsicologico,
    eliminarReportePsicologico
} from '../controllers/reportePsicologico.controller.js'; // Ajusta la ruta

const router = express.Router();

router.get('/', obtenerReportesPsicologicos);
router.get('/:id_psicologico', obtenerReportePsicologicoPorId);
router.post('/', crearReportePsicologico);
router.put('/:id_psicologico', editarReportePsicologico);
router.delete('/:id_psicologico', eliminarReportePsicologico);

export default router;