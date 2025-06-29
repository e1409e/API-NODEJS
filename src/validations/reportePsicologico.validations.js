import { body, param } from 'express-validator';

export const reportePsicologicoValidations = {
    crearReportePsicologicoValidations: [
        body('id_estudiante')
            .notEmpty().withMessage('ID de estudiante es requerido')
            .isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('motivo_consulta')
            .optional().isString().withMessage('Motivo de consulta debe ser una cadena'),
        body('sintesis_diagnostica')
            .optional().isString().withMessage('Síntesis diagnóstica debe ser una cadena'),
        body('recomendaciones')
            .optional().isString().withMessage('Recomendaciones debe ser una cadena')
    ],
    editarReportePsicologicoValidations: [
        param('id_psicologico')
            .isInt({ min: 1 }).withMessage('ID de reporte psicológico debe ser un entero positivo'),
        body('id_estudiante')
            .optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('motivo_consulta')
            .optional().isString().withMessage('Motivo de consulta debe ser una cadena'),
        body('sintesis_diagnostica')
            .optional().isString().withMessage('Síntesis diagnóstica debe ser una cadena'),
        body('recomendaciones')
            .optional().isString().withMessage('Recomendaciones debe ser una cadena')
    ]
};