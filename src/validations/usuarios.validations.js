import { body } from 'express-validator';

export const usuarioValidations = {
    registrarUsuarioValidations: [
        body('nombre').notEmpty().withMessage('El nombre es requerido'),
        body('apellido').notEmpty().withMessage('El apellido es requerido'),
        body('cedula_usuario').notEmpty().withMessage('La cédula es requerida'),
        body('password').notEmpty().isLength({ min: 6 }).withMessage('La contraseña es requerida y debe tener al menos 6 caracteres'),
    ],
    iniciarSesionValidations: [
        body('cedula_usuario').notEmpty().withMessage('La cédula es requerida'),
        body('password').notEmpty().withMessage('La contraseña es requerida'),
    ],
};