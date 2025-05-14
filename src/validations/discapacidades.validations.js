import { body, param } from 'express-validator';

export const discapacidadValidations = {
    crearDiscapacidadValidations: [
        body('discapacidad').notEmpty().withMessage('Discapacidad es requerida').isString().withMessage('Discapacidad debe ser una cadena')
    ],
    editarDiscapacidadValidations: [
        param('discapacidad_id').isInt({ min: 1 }).withMessage('ID de discapacidad debe ser un entero positivo'),
        body('discapacidad').notEmpty().withMessage('Discapacidad es requerida').isString().withMessage('Discapacidad debe ser una cadena')
    ]
};