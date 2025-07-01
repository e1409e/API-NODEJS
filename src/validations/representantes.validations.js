/**
 * @file Este archivo define las validaciones para las rutas relacionadas con los representantes.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y edición de representantes cumplan con los requisitos
 * de formato, presencia y valores válidos. Incluye validaciones detalladas para campos como
 * nombres, cédula, teléfono, correo, fechas, direcciones y otros datos personales y laborales.
 * @author Eric
 * @version 1.0.0
 * @module validations/representantes.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from 'express-validator';

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de representantes.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace representanteValidations
 */
export const representanteValidations = {
    /**
     * @description Validaciones para la creación de un nuevo representante.
     * Asegura que todos los campos requeridos estén presentes y cumplan con los formatos esperados.
     * @type {Array<import('express-validator').ValidationChain>}
     */
    crearRepresentanteValidations: [
        /**
         * @description Valida el campo `id_estudiante`.
         * - Es requerido (no vacío).
         * - Debe ser un número entero positivo (mayor o igual a 1).
         * @name id_estudiante
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('id_estudiante')
            .notEmpty().withMessage('El ID del estudiante es requerido.')
            .isInt({ min: 1 }).withMessage('El ID del estudiante debe ser un entero positivo.'),

        /**
         * @description Valida el campo `nombre_repre`.
         * - Es requerido (no vacío).
         * - Debe ser una cadena de texto.
         * - Solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
         * @name nombre_repre
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('nombre_repre')
            .notEmpty().withMessage('El nombre del representante es requerido.')
            .isString().withMessage('El nombre del representante debe ser texto.')
            .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre del representante solo puede contener letras y espacios (no más de un espacio consecutivo).'),

        /**
         * @description Valida el campo `parentesco`.
         * - Es requerido (no vacío).
         * - Debe ser una cadena de texto.
         * - Solo puede contener letras (incluyendo acentos y 'ñ'), espacios, puntos y comas.
         * @name parentesco
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('parentesco')
            .notEmpty().withMessage('El parentesco es requerido.')
            .isString().withMessage('El parentesco debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]+$/).withMessage('El parentesco contiene caracteres no permitidos. Solo se permiten letras, espacios, puntos y comas.'),

        /**
         * @description Valida el campo `cedula_repre`.
         * - Es requerido (no vacío).
         * - Debe ser una cadena de texto.
         * - Debe seguir el formato `V-XXXXXXXX` o `E-XXXXXXXX` (donde X son dígitos).
         * - La parte numérica debe tener entre 7 y 15 dígitos.
         * - La longitud total de la cédula (incluyendo prefijo y guion) debe ser entre 9 y 17 caracteres.
         * @name cedula_repre
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('cedula_repre')
            .notEmpty().withMessage('La cédula del representante es requerida.')
            .isString().withMessage('La cédula del representante debe ser texto.')
            .matches(/^[VE]-\d{7,15}$/).withMessage('La cédula debe seguir el formato V-XXXXXXXX o E-XXXXXXXX, con 7 a 15 dígitos.'),
            // La longitud total (prefijo + guion + dígitos) será entre 9 y 17.
            // No es necesario isLength si el regex ya lo valida implícitamente.

        /**
         * @description Valida el campo `telefono_repre`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener dígitos.
         * - Si está presente, debe tener entre 7 y 15 caracteres.
         * @name telefono_repre
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('telefono_repre')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El teléfono del representante debe ser texto.')
            .matches(/^\d+$/).withMessage('El teléfono del representante solo puede contener dígitos.')
            .isLength({ min: 7, max: 15 }).withMessage('El teléfono del representante debe tener entre 7 y 15 dígitos.'),

        /**
         * @description Valida el campo `correo_repre`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una dirección de correo electrónico válida.
         * @name correo_repre
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('correo_repre')
            .optional({ nullable: true, checkFalsy: true })
            .isEmail().withMessage('El correo del representante debe ser una dirección de correo válida.'),

        /**
         * @description Valida el campo `lugar_nacimiento`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras, números, espacios, puntos, comas, dos puntos, comillas y guiones.
         * @name lugar_nacimiento
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('lugar_nacimiento')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El lugar de nacimiento debe ser texto.')
            .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('El lugar de nacimiento contiene caracteres no permitidos.'),

        /**
         * @description Valida el campo `fecha_nacimiento`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD).
         * - Se convierte a un objeto `Date`.
         * @name fecha_nacimiento
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('fecha_nacimiento')
            .optional({ nullable: true, checkFalsy: true })
            .isISO8601().toDate().withMessage('La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD.'),

        /**
         * @description Valida el campo `direccion`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras, números, espacios, puntos, comas, dos puntos, comillas y guiones.
         * @name direccion
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('direccion')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('La dirección debe ser texto.')
            .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('La dirección contiene caracteres no permitidos.'),

        /**
         * @description Valida el campo `ocupacion`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), espacios, puntos y comas.
         * @name ocupacion
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('ocupacion')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('La ocupación debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]+$/).withMessage('La ocupación contiene caracteres no permitidos. Solo se permiten letras, espacios, puntos y comas.'),

        /**
         * @description Valida el campo `lugar_trabajo`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras, números, espacios, puntos, comas, dos puntos, comillas y guiones.
         * @name lugar_trabajo
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('lugar_trabajo')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El lugar de trabajo debe ser texto.')
            .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('El lugar de trabajo contiene caracteres no permitidos.'),

        /**
         * @description Valida el campo `estado`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios.
         * @name estado
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('estado')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El estado debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El estado contiene caracteres no permitidos. Solo se permiten letras y espacios.'),

        /**
         * @description Valida el campo `municipio`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios.
         * @name municipio
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('municipio')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El municipio debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El municipio contiene caracteres no permitidos. Solo se permiten letras y espacios.'),

        /**
         * @description Valida el campo `departamento`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios.
         * @name departamento
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('departamento')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El departamento debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El departamento contiene caracteres no permitidos. Solo se permiten letras y espacios.'),

        /**
         * @description Valida el campo `estado_civil`.
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios.
         * @name estado_civil
         * @memberof representanteValidations.crearRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('estado_civil')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El estado civil debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El estado civil contiene caracteres no permitidos. Solo se permiten letras y espacios.')
    ],

    /**
     * @description Validaciones para la edición de un representante existente.
     * Valida el ID del representante en los parámetros de ruta y todos los campos del cuerpo
     * como opcionales, permitiendo actualizaciones parciales.
     * @type {Array<import('express-validator').ValidationChain>}
     */
    editarRepresentanteValidations: [
        /**
         * @description Valida el parámetro de ruta `id_representante`.
         * - Debe ser un número entero positivo (mayor o igual a 1).
         * @name id_representante
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        param('id_representante')
            .isInt({ min: 1 }).withMessage('El ID del representante debe ser un entero positivo.'),

        /**
         * @description Valida el campo `id_estudiante` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser un número entero positivo.
         * @name id_estudiante
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('id_estudiante')
            .optional({ nullable: true, checkFalsy: true })
            .isInt({ min: 1 }).withMessage('El ID del estudiante debe ser un entero positivo.'),

        /**
         * @description Valida el campo `nombre_repre` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, no puede estar vacío.
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
         * @name nombre_repre
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('nombre_repre')
            .optional({ nullable: true, checkFalsy: true })
            .notEmpty().withMessage('El nombre del representante no puede estar vacío si se proporciona.')
            .isString().withMessage('El nombre del representante debe ser texto.')
            .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre del representante solo puede contener letras y espacios (no más de un espacio consecutivo).'),

        /**
         * @description Valida el campo `parentesco` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, no puede estar vacío.
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), espacios, puntos y comas.
         * @name parentesco
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('parentesco')
            .optional({ nullable: true, checkFalsy: true })
            .notEmpty().withMessage('El parentesco no puede estar vacío si se proporciona.')
            .isString().withMessage('El parentesco debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]+$/).withMessage('El parentesco contiene caracteres no permitidos. Solo se permiten letras, espacios, puntos y comas.'),

        /**
         * @description Valida el campo `cedula_repre` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, no puede estar vacío.
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, debe seguir el formato `V-XXXXXXXX` o `E-XXXXXXXX` (donde X son dígitos).
         * - La parte numérica debe tener entre 7 y 15 dígitos.
         * @name cedula_repre
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('cedula_repre')
            .optional({ nullable: true, checkFalsy: true })
            .notEmpty().withMessage('La cédula del representante no puede estar vacía si se proporciona.')
            .isString().withMessage('La cédula del representante debe ser texto.')
            .matches(/^[VE]-\d{7,15}$/).withMessage('La cédula debe seguir el formato V-XXXXXXXX o E-XXXXXXXX, con 7 a 15 dígitos.'),

        /**
         * @description Valida el campo `telefono_repre` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener dígitos.
         * - Si está presente, debe tener entre 7 y 15 caracteres.
         * @name telefono_repre
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('telefono_repre')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El teléfono del representante debe ser texto.')
            .matches(/^\d+$/).withMessage('El teléfono del representante solo puede contener dígitos.')
            .isLength({ min: 7, max: 15 }).withMessage('El teléfono del representante debe tener entre 7 y 15 dígitos.'),

        /**
         * @description Valida el campo `correo_repre` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una dirección de correo electrónico válida.
         * @name correo_repre
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('correo_repre')
            .optional({ nullable: true, checkFalsy: true })
            .isEmail().withMessage('El correo del representante debe ser una dirección de correo válida.'),

        /**
         * @description Valida el campo `lugar_nacimiento` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras, números, espacios, puntos, comas, dos puntos, comillas y guiones.
         * @name lugar_nacimiento
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('lugar_nacimiento')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El lugar de nacimiento debe ser texto.')
            .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('El lugar de nacimiento contiene caracteres no permitidos.'),

        /**
         * @description Valida el campo `fecha_nacimiento` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD).
         * - Se convierte a un objeto `Date`.
         * @name fecha_nacimiento
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('fecha_nacimiento')
            .optional({ nullable: true, checkFalsy: true })
            .isISO8601().toDate().withMessage('La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD.'),

        /**
         * @description Valida el campo `direccion` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras, números, espacios, puntos, comas, dos puntos, comillas y guiones.
         * @name direccion
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('direccion')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('La dirección debe ser texto.')
            .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('La dirección contiene caracteres no permitidos.'),

        /**
         * @description Valida el campo `ocupacion` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ'), espacios, puntos y comas.
         * @name ocupacion
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('ocupacion')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('La ocupación debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]+$/).withMessage('La ocupación contiene caracteres no permitidos. Solo se permiten letras, espacios, puntos y comas.'),

        /**
         * @description Valida el campo `lugar_trabajo` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras, números, espacios, puntos, comas, dos puntos, comillas y guiones.
         * @name lugar_trabajo
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('lugar_trabajo')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El lugar de trabajo debe ser texto.')
            .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:'"()\-]+$/).withMessage('El lugar de trabajo contiene caracteres no permitidos.'),

        /**
         * @description Valida el campo `estado` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios.
         * @name estado
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('estado')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El estado debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El estado contiene caracteres no permitidos. Solo se permiten letras y espacios.'),

        /**
         * @description Valida el campo `municipio` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios.
         * @name municipio
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('municipio')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El municipio debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El municipio contiene caracteres no permitidos. Solo se permiten letras y espacios.'),

        /**
         * @description Valida el campo `departamento` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios.
         * @name departamento
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('departamento')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El departamento debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El departamento contiene caracteres no permitidos. Solo se permiten letras y espacios.'),

        /**
         * @description Valida el campo `estado_civil` (opcional).
         * - Es opcional (permite `null`, `undefined` o cadena vacía).
         * - Si está presente, debe ser una cadena de texto.
         * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios.
         * @name estado_civil
         * @memberof representanteValidations.editarRepresentanteValidations
         * @type {import('express-validator').ValidationChain}
         */
        body('estado_civil')
            .optional({ nullable: true, checkFalsy: true })
            .isString().withMessage('El estado civil debe ser texto.')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El estado civil contiene caracteres no permitidos. Solo se permiten letras y espacios.')
    ]
};