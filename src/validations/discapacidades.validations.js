/**
 * @file Este archivo define las validaciones para las rutas relacionadas con las discapacidades.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y edición de discapacidades cumplan con los requisitos
 * de formato, presencia y valores válidos. Incluye validaciones para el nombre de la discapacidad
 * y el ID de la misma.
 * @author Eric
 * @version 1.0.0
 * @module validations/discapacidades.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from 'express-validator';

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de discapacidades.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace discapacidadValidations
 */
export const discapacidadValidations = {
    /**
     * @description Validaciones para la creación de una nueva discapacidad.
     * Asegura que el campo `discapacidad` esté presente y cumpla con el formato esperado.
     * @type {Array<import('express-validator').ValidationChain>}
     */
    crearDiscapacidadValidations: [
        /**
         * @description Valida el campo `discapacidad`.
         * - Es requerido (no vacío).
         * - Debe ser una cadena de texto.
         * - Solo puede contener letras (incluyendo acentos y 'ñ'), números, espacios y paréntesis `()`.
         * @name discapacidad
         * @memberof discapacidadValidations.crearDiscapacidadValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('discapacidad')
            .notEmpty().withMessage('El nombre de la discapacidad es requerido.')
            .isString().withMessage('El nombre de la discapacidad debe ser una cadena de texto.')
            .matches(/^[a-zA-Z0-9\s()ñÑ]+$/).withMessage('El nombre de la discapacidad contiene caracteres no permitidos.')
    ],

    /**
     * @description Validaciones para la edición de una discapacidad existente.
     * Valida el ID de la discapacidad en los parámetros de ruta y el campo `discapacidad` en el cuerpo.
     * @type {Array<import('express-validator').ValidationChain>}
     */
    editarDiscapacidadValidations: [
        /**
         * @description Valida el parámetro de ruta `discapacidad_id`.
         * - Debe ser un número entero positivo (mayor o igual a 1).
         * @name discapacidad_id
         * @memberof discapacidadValidations.editarDiscapacidadValidations
         * @type {import('express-validator').ValidationChain}
         */
        param('discapacidad_id')
            .isInt({ min: 1 }).withMessage('El ID de la discapacidad debe ser un entero positivo.'),

        /**
         * @description Valida el campo `discapacidad`.
         * - Es requerido (no vacío).
         * - Debe ser una cadena de texto.
         * - Solo puede contener letras (incluyendo acentos y 'ñ'), números, espacios y paréntesis `()`.
         * @name discapacidad
         * @memberof discapacidadValidations.editarDiscapacidadValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('discapacidad')
            .notEmpty().withMessage('El nombre de la discapacidad es requerido.')
            .isString().withMessage('El nombre de la discapacidad debe ser una cadena de texto.')
            .matches(/^[a-zA-Z0-9\s()ñÑ]+$/).withMessage('El nombre de la discapacidad contiene caracteres no permitidos.')
    ]
};