import { body, param } from 'express-validator';

export const historialMedicoValidations = {
    crearHistorialMedicoValidations: [
        body('id_estudiante').isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('certificado_conapdis').optional().isString().withMessage('Certificado CONAPDIS debe ser una cadena'),
        body('informe_medico').optional().isString().withMessage('Informe médico debe ser una cadena'),
        body('tratamiento').optional().isString().withMessage('Tratamiento debe ser una cadena')
    ],
    editarHistorialMedicoValidations: [
        param('id_historialmedico').isInt({ min: 1 }).withMessage('ID de historial médico debe ser un entero positivo'),
        body('id_estudiante').isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
        body('certificado_conapdis').optional().isString().withMessage('Certificado CONAPDIS debe ser una cadena'),
        body('informe_medico').optional().isString().withMessage('Informe médico debe ser una cadena'),
        body('tratamiento').optional().isString().withMessage('Tratamiento debe ser una cadena')
    ]
};