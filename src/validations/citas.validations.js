import { body, param } from 'express-validator';

export const citaValidations = {
    crearCitaValidations: [
        body('id_estudiante')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('El ID del estudiante es requerido y debe ser un entero positivo'),
        body('fecha_cita')
            .notEmpty()
            .isISO8601()
            .withMessage('La fecha de la cita es requerida y debe tener el formato YYYY-MM-DD'),
        body('motivo_cita')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 255 })
            .withMessage('El motivo de la cita debe ser una cadena de texto de máximo 255 caracteres'),
    ],
    actualizarCitaValidations: [
        param('id_citas')
            .isInt({ min: 1 })
            .withMessage('El ID de la cita debe ser un entero positivo'),
        body('id_estudiante')
            .optional()
            .isInt({ min: 1 })
            .withMessage('El ID del estudiante debe ser un entero positivo'),
        body('fecha_cita')
            .optional()
            .isISO8601()
            .withMessage('La fecha de la cita debe tener el formato YYYY-MM-DD'),
        body('motivo_cita')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 255 })
            .withMessage('El motivo de la cita debe ser una cadena de texto de máximo 255 caracteres'),
    ],
    eliminarCitaValidations: [
        param('id_citas')
            .isInt({ min: 1 })
            .withMessage('El ID de la cita debe ser un entero positivo'),
    ],
};