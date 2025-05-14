import { body, param } from 'express-validator';

export const incidenciasValidations = {
    crearIncidenciaValidations: [
        body('id_estudiante').optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('hora_incidente').notEmpty().withMessage('Hora del incidente es requerida').isTime().withMessage('Hora del incidente debe tener el formato HH:MM:SS'),
        body('fecha_incidente').notEmpty().withMessage('Fecha del incidente es requerida').isISO8601().withMessage('Fecha del incidente debe ser una fecha válida (YYYY-MM-DD)'),
        body('lugar_incidente').notEmpty().withMessage('Lugar del incidente es requerido').isString().withMessage('Lugar del incidente debe ser una cadena'),
        body('descripcion_incidente').optional().isString().withMessage('Descripción del incidente debe ser una cadena'),
        body('acuerdos').optional().isString().withMessage('Acuerdos debe ser una cadena'),
        body('observaciones').optional().isString().withMessage('Observaciones debe ser una cadena')
    ],
    editarIncidenciaValidations: [
        param('id_incidencia').isInt({ min: 1 }).withMessage('ID de incidencia debe ser un entero positivo'),
        body('id_estudiante').optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('hora_incidente').optional().isTime().withMessage('Hora del incidente debe tener el formato HH:MM:SS'),
        body('fecha_incidente').optional().isISO8601().withMessage('Fecha del incidente debe ser una fecha válida (YYYY-MM-DD)'),
        body('lugar_incidente').optional().isString().withMessage('Lugar del incidente debe ser una cadena'),
        body('descripcion_incidente').optional().isString().withMessage('Descripción del incidente debe ser una cadena'),
        body('acuerdos').optional().isString().withMessage('Acuerdos debe ser una cadena'),
        body('observaciones').optional().isString().withMessage('Observaciones debe ser una cadena')
    ]
};