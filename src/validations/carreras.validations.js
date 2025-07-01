/**
 * @file Este archivo define las validaciones para las rutas relacionadas con las carreras.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y edición de carreras cumplan con los requisitos
 * de formato y presencia. También valida los parámetros de ruta para operaciones como la edición y eliminación.
 * @author Eric
 * @version 1.0.0
 * @module validations/carreras.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from 'express-validator';

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de carreras.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace carrerasValidations
 */
export const carrerasValidations = {
  /**
   * @description Validaciones para la creación de una nueva carrera.
   * Asegura que el nombre de la carrera y el ID de la facultad estén presentes y sean válidos.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  crearCarreraValidations: [
    /**
     * @description Valida el campo `carrera` (nombre de la carrera).
     * - Es requerido (no vacío).
     * - Solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Debe ser una cadena de texto.
     */
    body('carrera')
      .notEmpty().withMessage('La carrera es requerida')
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('La carrera solo puede contener letras y espacios (no más de dos espacios en blanco).')
      .isString().withMessage('La carrera debe ser texto'),
    /**
     * @description Valida el campo `id_facultad`.
     * - Es requerido (no vacío).
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    body('id_facultad')
      .notEmpty().withMessage('El id_facultad es requerido')
      .isInt({ min: 1 }).withMessage('El id_facultad debe ser un entero positivo'),
  ],
  /**
   * @description Validaciones para la edición de una carrera existente.
   * Valida el ID de la carrera en los parámetros de ruta y los campos opcionales en el cuerpo.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  editarCarreraValidations: [
    /**
     * @description Valida el parámetro de ruta `id_carrera`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    param('id_carrera').isInt({ min: 1 }).withMessage('El ID de la carrera debe ser un entero positivo'),
    /**
     * @description Valida el campo `carrera` (nombre de la carrera) si está presente.
     * - Es opcional.
     * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Si está presente, debe ser una cadena de texto.
     */
    body('carrera')
      .optional()
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('La carrera solo puede contener letras y espacios (no más de dos espacios en blanco).')
      .isString().withMessage('La carrera debe ser texto'),
    /**
     * @description Valida el campo `id_facultad` si está presente.
     * - Es opcional.
     * - Si está presente, debe ser un número entero positivo (mayor o igual a 1).
     */
    body('id_facultad')
      .optional()
      .isInt({ min: 1 }).withMessage('El id_facultad debe ser un entero positivo'),
  ],
  /**
   * @description Validaciones para la eliminación de una carrera.
   * Asegura que el ID de la carrera proporcionado en los parámetros de ruta sea válido.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  eliminarCarreraValidations: [
    /**
     * @description Valida el parámetro de ruta `id_carrera`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    param('id_carrera').isInt({ min: 1 }).withMessage('El ID de la carrera debe ser un entero positivo'),
  ],
};