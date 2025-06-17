import { body, param } from 'express-validator';

export const carrerasValidations = {
    crearCarreraValidations: [
        body('carrera')
            .notEmpty().withMessage('La carrera es requerida')
            .isString().withMessage('La carrera debe ser texto'),
        body('id_facultad')
            .notEmpty().withMessage('El id_facultad es requerido')
            .isInt({ min: 1 }).withMessage('El id_facultad debe ser un entero positivo'),
    ],
    editarCarreraValidations: [
        param('id_carrera').isInt({ min: 1 }).withMessage('El ID de la carrera debe ser un entero positivo'),
        body('carrera')
            .optional()
            .isString().withMessage('La carrera debe ser texto'),
        body('id_facultad')
            .optional()
            .isInt({ min: 1 }).withMessage('El id_facultad debe ser un entero positivo'),
    ],
    eliminarCarreraValidations: [
        param('id_carrera').isInt({ min: 1 }).withMessage('El ID de la carrera debe ser un entero positivo'),
    ],
};