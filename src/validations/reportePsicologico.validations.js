/**
 * @file Este archivo define las validaciones para las rutas relacionadas con los reportes psicológicos.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y edición de reportes psicológicos cumplan con los requisitos
 * de formato, presencia y valores válidos. Incluye validaciones para campos como ID de estudiante,
 * motivo de consulta, síntesis diagnóstica y recomendaciones.
 * @author Eric
 * @version 1.0.0
 * @module validations/reportePsicologico.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from 'express-validator';

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de reportes psicológicos.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace reportePsicologicoValidations
 */
export const reportePsicologicoValidations = {
    /**
     * @description Validaciones para la creación de un nuevo reporte psicológico.
     * Asegura que todos los campos requeridos estén presentes y cumplan con los formatos esperados.
     * @type {Array<import('express-validator').ValidationChain>}
     */
    crearReportePsicologicoValidations: [
        /**
         * @description Valida el campo `id_estudiante`.
         * - Es requerido (no vacío).
         * - Debe ser un número entero positivo (mayor o igual a 1).
         * @name id_estudiante
         * @memberof reportePsicologicoValidations.crearReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('id_estudiante')
            .notEmpty().withMessage('El ID de estudiante es requerido.')
            .isInt({ min: 1 }).withMessage('El ID de estudiante debe ser un entero positivo.'),

        /**
         * @description Valida el campo `motivo_consulta`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), números, espacios, puntos y comas.
         * @name motivo_consulta
         * @memberof reportePsicologicoValidations.crearReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('motivo_consulta')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El motivo de consulta debe ser una cadena de texto.')
            .matches(/^[a-zA-Z0-9\s.,ñÑ]+$/).withMessage('El motivo de consulta contiene caracteres no permitidos. Solo se permiten letras, números, espacios, puntos, comas y la letra "ñ".'),

        /**
         * @description Valida el campo `sintesis_diagnostica`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), números, espacios, puntos y comas.
         * @name sintesis_diagnostica
         * @memberof reportePsicologicoValidations.crearReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('sintesis_diagnostica')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('La síntesis diagnóstica debe ser una cadena de texto.')
            .matches(/^[a-zA-Z0-9\s.,ñÑ]+$/).withMessage('La síntesis diagnóstica contiene caracteres no permitidos. Solo se permiten letras, números, espacios, puntos, comas y la letra "ñ".'),

        /**
         * @description Valida el campo `recomendaciones`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), números, espacios, puntos y comas.
         * @name recomendaciones
         * @memberof reportePsicologicoValidations.crearReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('recomendaciones')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('Las recomendaciones deben ser una cadena de texto.')
            .matches(/^[a-zA-Z0-9\s.,ñÑ]+$/).withMessage('Las recomendaciones contienen caracteres no permitidos. Solo se permiten letras, números, espacios, puntos, comas y la letra "ñ".')
    ],

    /**
     * @description Validaciones para la edición de un reporte psicológico existente.
     * Valida el ID del reporte psicológico en los parámetros de ruta y todos los campos del cuerpo
     * como opcionales, permitiendo actualizaciones parciales.
     * @type {Array<import('express-validator').ValidationChain>}
     */
    editarReportePsicologicoValidations: [
        /**
         * @description Valida el parámetro de ruta `id_psicologico`.
         * - Debe ser un número entero positivo (mayor o igual a 1).
         * @name id_psicologico
         * @memberof reportePsicologicoValidations.editarReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        param('id_psicologico')
            .isInt({ min: 1 }).withMessage('El ID de reporte psicológico debe ser un entero positivo.'),

        /**
         * @description Valida el campo `id_estudiante`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser un número entero positivo (mayor o igual a 1).
         * @name id_estudiante
         * @memberof reportePsicologicoValidations.editarReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('id_estudiante')
            .optional({ nullable: true, checkFalsy: true })
            .isInt({ min: 1 }).withMessage('El ID de estudiante debe ser un entero positivo.'),

        /**
         * @description Valida el campo `motivo_consulta`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), números, espacios, puntos y comas.
         * @name motivo_consulta
         * @memberof reportePsicologicoValidations.editarReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('motivo_consulta')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El motivo de consulta debe ser una cadena de texto.')
            .matches(/^[a-zA-Z0-9\s.,ñÑ]+$/).withMessage('El motivo de consulta contiene caracteres no permitidos. Solo se permiten letras, números, espacios, puntos, comas y la letra "ñ".'),

        /**
         * @description Valida el campo `sintesis_diagnostica`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), números, espacios, puntos y comas.
         * @name sintesis_diagnostica
         * @memberof reportePsicologicoValidations.editarReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('sintesis_diagnostica')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('La síntesis diagnóstica debe ser una cadena de texto.')
            .matches(/^[a-zA-Z0-9\s.,ñÑ]+$/).withMessage('La síntesis diagnóstica contiene caracteres no permitidos. Solo se permiten letras, números, espacios, puntos, comas y la letra "ñ".'),

        /**
         * @description Valida el campo `recomendaciones`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), números, espacios, puntos y comas.
         * @name recomendaciones
         * @memberof reportePsicologicoValidations.editarReportePsicologicoValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('recomendaciones')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('Las recomendaciones deben ser una cadena de texto.')
            .matches(/^[a-zA-Z0-9\s.,ñÑ]+$/).withMessage('Las recomendaciones contienen caracteres no permitidos. Solo se permiten letras, números, espacios, puntos, comas y la letra "ñ".')
    ]
};