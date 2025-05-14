import { body, param } from 'express-validator';

export const representanteValidations = {
    crearRepresentanteValidations: [
        body('id_estudiante').isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('nombre_repre').notEmpty().withMessage('Nombre es requerido'),
        body('parentesco').notEmpty().withMessage('Parentesco es requerido'),
        body('cedula_repre').notEmpty().withMessage('Cédula es requerida'),
        body('telefono_repre').optional().isString().withMessage('Teléfono debe ser una cadena'),
        body('correo_repre').optional().isEmail().withMessage('Correo debe ser un correo válido'),
        body('lugar_nacimiento').optional().isString().withMessage('Lugar de nacimiento debe ser una cadena'),
        body('fecha_nacimiento').optional().isISO8601().toDate().withMessage('Fecha de nacimiento debe ser una fecha válida'),
        body('direccion').optional().isString().withMessage('Dirección debe ser una cadena'),
        body('ocupacion').optional().isString().withMessage('Ocupación debe ser una cadena'),
        body('lugar_trabajo').optional().isString().withMessage('Lugar de trabajo debe ser una cadena'),
        body('estado').optional().isString().withMessage('Estado debe ser una cadena'),
        body('municipio').optional().isString().withMessage('Municipio debe ser una cadena'),
        body('departamento').optional().isString().withMessage('Departamento debe ser una cadena'),
        body('estado_civil').optional().isString().withMessage('Estado civil debe ser una cadena')
    ],
    editarRepresentanteValidations: [
        param('id_representante').isInt({ min: 1 }).withMessage('ID de representante debe ser un entero positivo'),
        body('id_estudiante').optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('nombre_repre').optional().notEmpty().withMessage('Nombre es requerido'),
        body('parentesco').optional().notEmpty().withMessage('Parentesco es requerido'),
        body('cedula_repre').optional().notEmpty().withMessage('Cédula es requerida'),
        body('telefono_repre').optional().isString().withMessage('Teléfono debe ser una cadena'),
        body('correo_repre').optional().isEmail().withMessage('Correo debe ser un correo válido'),
        body('lugar_nacimiento').optional().isString().withMessage('Lugar de nacimiento debe ser una cadena'),
        body('fecha_nacimiento').optional().isISO8601().toDate().withMessage('Fecha de nacimiento debe ser una fecha válida'),
        body('direccion').optional().isString().withMessage('Dirección debe ser una cadena'),
        body('ocupacion').optional().isString().withMessage('Ocupación debe ser una cadena'),
        body('lugar_trabajo').optional().isString().withMessage('Lugar de trabajo debe ser una cadena'),
        body('estado').optional().isString().withMessage('Estado debe ser una cadena'),
        body('municipio').optional().isString().withMessage('Municipio debe ser una cadena'),
        body('departamento').optional().isString().withMessage('Departamento debe ser una cadena'),
        body('estado_civil').optional().isString().withMessage('Estado civil debe ser una cadena')
    ]
};