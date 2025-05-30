import { body, param } from 'express-validator';

export const estudianteValidations = {
    crearEstudianteValidations: [
        body('nombres').notEmpty().withMessage('Los nombres son requeridos'),
        body('apellidos').notEmpty().withMessage('Los apellidos son requeridos'),
        body('cedula').notEmpty().withMessage('La cédula es requerida'),
        body('telefono').optional(),
        body('correo').optional().isEmail().withMessage('El correo debe ser válido'),
        body('discapacidad_id').optional().isInt().withMessage('El ID de discapacidad debe ser un entero'),
        body('fecha_nacimiento').optional().isISO8601().toDate().withMessage('La fecha de nacimiento debe ser una fecha válida'),
        body('observaciones').optional(),
        body('seguimiento').optional(),
        body('fecha_registro').optional().isISO8601().toDate().withMessage('La fecha de registro debe ser una fecha válida'),
        body('direccion').optional().isString(),
    ],
    editarEstudianteValidations: [
        param('id_estudiante').isInt().withMessage('El ID del estudiante debe ser un entero'),
        body('nombres').optional().notEmpty().withMessage('Los nombres son requeridos'),
        body('apellidos').optional().notEmpty().withMessage('Los apellidos son requeridos'),
        body('cedula').optional().notEmpty().withMessage('La cédula es requerida'),
        body('telefono').optional(),
        body('correo').optional().isEmail().withMessage('El correo debe ser válido'),
        body('discapacidad_id').optional().isInt().withMessage('El ID de discapacidad debe ser un entero'),
        body('fecha_nacimiento').optional().isISO8601().toDate().withMessage('La fecha de nacimiento debe ser una fecha válida'),
        body('observaciones').optional(),
        body('seguimiento').optional(),
        body('fecha_registro').optional().isISO8601().toDate().withMessage('La fecha de registro debe ser una fecha válida'),
        body('direccion').optional().isString(),
    ],
};