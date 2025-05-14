import { body, param } from 'express-validator';

export const reportePsicologicoValidations = {
    crearReportePsicologicoValidations: [
        body('nombre').notEmpty().withMessage('Nombre es requerido').isString().withMessage('Nombre debe ser una cadena'),
        body('apellido').notEmpty().withMessage('Apellido es requerido').isString().withMessage('Apellido debe ser una cadena'),
        body('lugar_nacimiento').optional().isString().withMessage('Lugar de nacimiento debe ser una cadena'),
        body('fecha_nacimiento').optional().isISO8601().withMessage('Fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)'),
        body('nivel_instruccion').optional().isString().withMessage('Nivel de instrucción debe ser una cadena'),
        body('motivo_consulta').optional().isString().withMessage('Motivo de consulta debe ser una cadena'),
        body('sintesis_diagnostica').optional().isString().withMessage('Síntesis diagnóstica debe ser una cadena'),
        body('recomendaciones').optional().isString().withMessage('Recomendaciones debe ser una cadena'),
        body('id_estudiante').optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo')
    ],
    editarReportePsicologicoValidations: [
        param('id_psicologico').isInt({ min: 1 }).withMessage('ID de reporte psicológico debe ser un entero positivo'),
        body('nombre').optional().isString().withMessage('Nombre debe ser una cadena'),
        body('apellido').optional().isString().withMessage('Apellido debe ser una cadena'),
        body('lugar_nacimiento').optional().isString().withMessage('Lugar de nacimiento debe ser una cadena'),
        body('fecha_nacimiento').optional().isISO8601().withMessage('Fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)'),
        body('nivel_instruccion').optional().isString().withMessage('Nivel de instrucción debe ser una cadena'),
        body('motivo_consulta').optional().isString().withMessage('Motivo de consulta debe ser una cadena'),
        body('sintesis_diagnostica').optional().isString().withMessage('Síntesis diagnóstica debe ser una cadena'),
        body('recomendaciones').optional().isString().withMessage('Recomendaciones debe ser una cadena'),
        body('id_estudiante').optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo')
    ]
};