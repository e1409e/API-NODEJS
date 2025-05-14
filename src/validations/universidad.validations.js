import { body, param } from 'express-validator';

export const universidadValidations = {
    crearUniversidadValidations: [
        body('id_estudiante').optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('id_carrera').optional().isInt({ min: 1 }).withMessage('ID de carrera debe ser un entero positivo'),
        body('id_facultad').optional().isInt({ min: 1 }).withMessage('ID de facultad debe ser un entero positivo'),
        body('id_periodo').optional().isInt({ min: 1 }).withMessage('ID de periodo debe ser un entero positivo')
    ],
    editarUniversidadValidations: [
        param('id').isInt({ min: 1 }).withMessage('ID debe ser un entero positivo'),
        body('id_estudiante').optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('id_carrera').optional().isInt({ min: 1 }).withMessage('ID de carrera debe ser un entero positivo'),
        body('id_facultad').optional().isInt({ min: 1 }).withMessage('ID de facultad debe ser un entero positivo'),
        body('id_periodo').optional().isInt({ min: 1 }).withMessage('ID de periodo debe ser un entero positivo')
    ]
};