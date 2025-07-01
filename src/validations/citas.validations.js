/**
 * @file Este archivo define las validaciones para las rutas relacionadas con las citas.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y actualización de citas cumplan con los requisitos
 * de formato, presencia y valores válidos. También valida los parámetros de ruta para operaciones
 * como la actualización y eliminación.
 * @author Eric
 * @version 1.0.0
 * @module validations/citas.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from 'express-validator';

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de citas.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace citaValidations
 */
export const citaValidations = {
  /**
   * @description Validaciones para la creación de una nueva cita.
   * Asegura que el ID del estudiante, la fecha de la cita y el motivo (si se proporciona) sean válidos.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  crearCitaValidations: [
    /**
     * @description Valida el campo `id_estudiante`.
     * - Es requerido (no vacío).
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    body('id_estudiante')
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('El ID del estudiante es requerido y debe ser un entero positivo'),
    /**
     * @description Valida el campo `fecha_cita`.
     * - Es requerido (no vacío).
     * - Debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD).
     */
    body('fecha_cita')
      .notEmpty()
      .isISO8601()
      .withMessage('La fecha de la cita es requerida y debe tener el formato YYYY-MM-DD'),
    /**
     * @description Valida el campo `motivo_cita` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Se recorta el espacio en blanco al inicio y al final.
     * - Debe tener un máximo de 255 caracteres.
     */
    body('motivo_cita')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El motivo de la cita debe tener un máximo 255 de caracteres'),
  ],
  /**
   * @description Validaciones para la actualización de una cita existente.
   * Valida el ID de la cita en los parámetros de ruta y los campos opcionales en el cuerpo.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  actualizarCitaValidations: [
    /**
     * @description Valida el parámetro de ruta `id_citas`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    param('id_citas')
      .isInt({ min: 1 })
      .withMessage('El ID de la cita debe ser un entero positivo'),
    /**
     * @description Valida el campo `id_estudiante` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser un número entero positivo.
     */
    body('id_estudiante')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del estudiante debe ser un entero positivo'),
    /**
     * @description Valida el campo `fecha_cita` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD).
     */
    body('fecha_cita')
      .optional()
      .isISO8601()
      .withMessage('La fecha de la cita debe tener el formato YYYY-MM-DD'),
    /**
     * @description Valida el campo `motivo_cita` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Se recorta el espacio en blanco al inicio y al final.
     * - Debe tener un máximo de 255 caracteres.
     */
    body('motivo_cita')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El motivo de la cita debe tener un máximo 255 de caracteres'),
  ],
  /**
   * @description Validaciones para la eliminación de una cita.
   * Asegura que el ID de la cita proporcionado en los parámetros de ruta sea válido.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  eliminarCitaValidations: [
    /**
     * @description Valida el parámetro de ruta `id_citas`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    param('id_citas')
      .isInt({ min: 1 })
      .withMessage('El ID de la cita debe ser un entero positivo'),
  ],
};