/**
 * @file Este archivo define las validaciones para las rutas relacionadas con las facultades.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y edición de facultades cumplan con los requisitos
 * de formato, presencia y valores válidos. También valida los parámetros de ruta para operaciones
 * como la edición y eliminación.
 * @author Eric
 * @version 1.0.0
 * @module validations/facultades.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from 'express-validator';

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de facultades.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace facultadesValidations
 */
export const facultadesValidations = {
  /**
   * @description Validaciones para la creación de una nueva facultad.
   * Asegura que el nombre de la facultad y las siglas estén presentes y cumplan con los formatos esperados.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  crearFacultadValidations: [
    /**
     * @description Valida el campo `facultad` (nombre completo de la facultad).
     * - Es requerido (no vacío).
     * - Solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Debe ser una cadena de texto.
     */
    body('facultad')
      .notEmpty().withMessage('El nombre de la facultad es requerido')
      .isString().withMessage('El nombre de la facultad debe ser texto.')
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('Solo se pueden colocar letras'),
    /**
     * @description Valida el campo `siglas`.
     * - Es requerido (no vacío).
     * - Solo puede contener letras mayúsculas y números.
     * - Debe ser una cadena de texto.
     */
    body('siglas')
      .notEmpty().withMessage('Las siglas son requeridas')
      .isString().withMessage('Las siglas deben ser texto.')
      .matches(/^[A-Z0-9]+$/).withMessage('Las siglas solo pueden contener letras mayúsculas y números.'),
  ],
  /**
   * @description Validaciones para la edición de una facultad existente.
   * Valida el ID de la facultad en los parámetros de ruta y los campos opcionales en el cuerpo.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  editarFacultadValidations: [
    /**
     * @description Valida el parámetro de ruta `id_facultad`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    param('id_facultad').isInt({ min: 1 }).withMessage('El ID de la facultad debe ser un entero positivo'),
    /**
     * @description Valida el campo `facultad` (nombre completo de la facultad) si está presente.
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     */
    body('facultad')
      .optional()
      .isString().withMessage('El nombre de la facultad debe ser texto.')
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('Solo se pueden colocar letras'),
    /**
     * @description Valida el campo `siglas` si está presente.
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Si está presente, solo puede contener letras mayúsculas y números.
     */
    body('siglas')
      .optional()
      .isString().withMessage('Las siglas deben ser texto.')
      .matches(/^[A-Z0-9]+$/).withMessage('Las siglas solo pueden contener letras mayúsculas y números.'),
  ],
  /**
   * @description Validaciones para la eliminación de una facultad.
   * Asegura que el ID de la facultad proporcionado en los parámetros de ruta sea válido.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  eliminarFacultadValidations: [
    /**
     * @description Valida el parámetro de ruta `id_facultad`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    param('id_facultad').isInt({ min: 1 }).withMessage('El ID de la facultad debe ser un entero positivo'),
  ],
};