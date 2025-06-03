import { body, param } from 'express-validator';

export const carrerasValidations = {
    crearCarreraValidations: [
        body('carrera').notEmpty().withMessage('La carrera es requerida'),
        body('id_facultad').notEmpty().isInt().withMessage('El ID de discapacidad debe ser un entero'),
    ],
    editarCarreraValidations: [
        param('id_carreras').isInt().withMessage('El ID de la carrera debe ser un entero'),
        body('carrera').notEmpty().withMessage('La carrera es requerida'),
        body('id_facultad').notEmpty().isInt().withMessage('El ID de discapacidad debe ser un entero'),
    ],
};