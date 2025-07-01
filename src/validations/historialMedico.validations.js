/**
 * @file Este archivo define las validaciones para las rutas relacionadas con el historial médico.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y edición de historiales médicos cumplan con los requisitos
 * de formato, presencia y valores válidos.
 * @author Eric
 * @version 1.0.0
 * @module validations/historialMedico.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from 'express-validator';

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de historial médico.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace historialMedicoValidations
 */
export const historialMedicoValidations = {
  /**
   * @description Validaciones para la creación de un nuevo registro de historial médico.
   * Asegura que el ID del estudiante sea válido y que los campos opcionales cumplan con sus formatos.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  crearHistorialMedicoValidations: [
    /**
     * @description Valida el campo `id_estudiante`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    body('id_estudiante').isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
    /**
     * @description Valida el campo `certificado_conapdis` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Solo puede contener caracteres alfanuméricos (letras y números).
     */
    body('certificado_conapdis')
      .optional()
      .isString().withMessage('Certificado CONAPDIS debe ser una cadena')
      .matches(/^[a-zA-Z0-9]*$/).withMessage('El certificado CONAPDIS solo puede contener letras y números.'),
    /**
     * @description Valida el campo `informe_medico` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     */
    body('informe_medico').optional().isString().withMessage('Informe médico debe ser una cadena'),
    /**
     * @description Valida el campo `tratamiento` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     */
    body('tratamiento').optional().isString().withMessage('Tratamiento debe ser una cadena')
  ],
  /**
   * @description Validaciones para la edición de un registro de historial médico existente.
   * Valida el ID del historial médico en los parámetros de ruta y los campos opcionales en el cuerpo.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  editarHistorialMedicoValidations: [
    /**
     * @description Valida el parámetro de ruta `id_historialmedico`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    param('id_historialmedico').isInt({ min: 1 }).withMessage('ID de historial médico debe ser un entero positivo'),
    /**
     * @description Valida el campo `id_estudiante` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser un número entero positivo.
     */
    body('id_estudiante').optional().isInt({ min: 1 }).withMessage('ID de estudiante debe ser un entero positivo'),
    /**
     * @description Valida el campo `certificado_conapdis` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Solo puede contener caracteres alfanuméricos (letras y números).
     */
    body('certificado_conapdis')
      .optional()
      .isString().withMessage('Certificado CONAPDIS debe ser una cadena')
      .matches(/^[a-zA-Z0-9]*$/).withMessage('El certificado CONAPDIS solo puede contener letras y números.'),
    /**
     * @description Valida el campo `informe_medico` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     */
    body('informe_medico').optional().isString().withMessage('Informe médico debe ser una cadena'),
    /**
     * @description Valida el campo `tratamiento` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     */
    body('tratamiento').optional().isString().withMessage('Tratamiento debe ser una cadena')
  ]
};