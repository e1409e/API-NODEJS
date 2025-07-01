/**
 * @file Este archivo define las validaciones para las rutas relacionadas con las incidencias.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y edición de incidencias cumplan con los requisitos
 * de formato, presencia y valores válidos.
 * @author Eric
 * @version 1.0.0
 * @module validations/incidencias.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from 'express-validator';

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de incidencias.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace incidenciasValidations
 */
export const incidenciasValidations = {
  /**
   * @description Validaciones para la creación de una nueva incidencia.
   * Asegura que todos los campos requeridos estén presentes y cumplan con los formatos esperados.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  crearIncidenciaValidations: [
    /**
     * @description Valida el campo `id_estudiante`.
     * - Es requerido.
     * - Debe ser un número entero positivo.
     */
    body('id_estudiante')
      .notEmpty().withMessage('El ID del estudiante es requerido.')
      .isInt({ min: 1 }).withMessage('El ID del estudiante debe ser un entero positivo.'),
    /**
     * @description Valida el campo `fecha_incidente`.
     * - Es requerido.
     * - Debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD).
     */
    body('fecha_incidente')
      .notEmpty().withMessage('La fecha del incidente es requerida.')
      .isISO8601().withMessage('La fecha del incidente debe tener el formato YYYY-MM-DD.'),
    /**
     * @description Valida el campo `lugar_incidente`.
     * - Es requerido.
     * - Debe ser una cadena de texto.
     * - Solo puede contener letras, números, espacios y puntuación básica (.,;:'"-).
     */
    body('lugar_incidente')
      .notEmpty().withMessage('El lugar del incidente es requerido.')
      .isString().withMessage('El lugar del incidente debe ser texto.')
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('El lugar del incidente contiene caracteres especiales no permitidos.'),
    /**
     * @description Valida el campo `descripcion_incidente`.
     * - Es requerido.
     * - Debe ser una cadena de texto.
     * - Solo puede contener letras, números, espacios y puntuación básica (.,;:'"-).
     */
    body('descripcion_incidente')
      .notEmpty().withMessage('La descripción del incidente es requerida.')
      .isString().withMessage('La descripción del incidente debe ser texto.')
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('La descripción del incidente contiene caracteres especiales no permitidos.'),
    /**
     * @description Valida el campo `acuerdos`.
     * - Es requerido.
     * - Debe ser una cadena de texto.
     * - Solo puede contener letras, números, espacios y puntuación básica (.,;:'"-).
     */
    body('acuerdos')
      .notEmpty().withMessage('Los acuerdos son requeridos.')
      .isString().withMessage('Los acuerdos deben ser texto.')
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('Los acuerdos contienen caracteres especiales no permitidos.'),
  ],
  /**
   * @description Validaciones para la edición de una incidencia existente.
   * Valida el ID de la incidencia en los parámetros de ruta y los campos opcionales en el cuerpo.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  editarIncidenciaValidations: [
    /**
     * @description Valida el parámetro de ruta `id_incidencia`.
     * - Debe ser un número entero positivo.
     */
    param('id_incidencia')
      .isInt({ min: 1 }).withMessage('El ID de la incidencia debe ser un entero positivo.'),
    /**
     * @description Valida el campo `id_estudiante` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser un número entero positivo.
     */
    body('id_estudiante')
      .optional()
      .isInt({ min: 1 }).withMessage('El ID del estudiante debe ser un entero positivo.'),
    /**
     * @description Valida el campo `fecha_incidente` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD).
     */
    body('fecha_incidente')
      .optional()
      .isISO8601().withMessage('La fecha del incidente debe tener el formato YYYY-MM-DD.'),
    /**
     * @description Valida el campo `lugar_incidente` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Solo puede contener letras, números, espacios y puntuación básica (.,;:'"-).
     */
    body('lugar_incidente')
      .optional()
      .isString().withMessage('El lugar del incidente debe ser texto.')
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('El lugar del incidente contiene caracteres especiales no permitidos.'),
    /**
     * @description Valida el campo `descripcion_incidente` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Solo puede contener letras, números, espacios y puntuación básica (.,;:'"-).
     */
    body('descripcion_incidente')
      .optional()
      .isString().withMessage('La descripción del incidente debe ser texto.')
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('La descripción del incidente contiene caracteres especiales no permitidos.'),
    /**
     * @description Valida el campo `acuerdos` (opcional).
     * - Es opcional.
     * - Si está presente, debe ser una cadena de texto.
     * - Solo puede contener letras, números, espacios y puntuación básica (.,;:'"-).
     */
    body('acuerdos')
      .optional()
      .isString().withMessage('Los acuerdos deben ser texto.')
      .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('Los acuerdos contienen caracteres especiales no permitidos.'),
  ],
  /**
   * @description Validaciones para la eliminación de una incidencia.
   * Asegura que el ID de la incidencia proporcionado en los parámetros de ruta sea válido.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  eliminarIncidenciaValidations: [
    /**
     * @description Valida el parámetro de ruta `id_incidencia`.
     * - Debe ser un número entero positivo.
     */
    param('id_incidencia')
      .isInt({ min: 1 }).withMessage('El ID de la incidencia debe ser un entero positivo.'),
  ],
};