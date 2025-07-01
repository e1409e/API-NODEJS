/**
 * @file Este archivo define las validaciones para las rutas relacionadas con los estudiantes.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para la creación y edición de estudiantes cumplan con los requisitos
 * de formato, presencia y valores válidos. Incluye validaciones para campos como nombres,
 * apellidos, cédula, teléfono, correo, fechas y IDs de relaciones.
 * @author Eric
 * @version 1.0.0
 * @module validations/estudiantes.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body, param } from "express-validator";

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de estudiantes.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace estudianteValidations
 */
export const estudianteValidations = {
  /**
   * @description Validaciones para la creación de un nuevo estudiante.
   * Asegura que todos los campos requeridos estén presentes y cumplan con los formatos esperados.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  crearEstudianteValidations: [
    /**
     * @description Valida el campo `nombres`.
     * - Es requerido (no vacío).
     * - Solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Debe ser una cadena de texto.
     */
    body("nombres")
      .notEmpty()
      .withMessage("Los nombres son requeridos")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los nombres solo pueden contener letras y espacios (no mas de dos espacios en blanco).")
      .isString()
      .withMessage("Nombres deben ser texto."),
    /**
     * @description Valida el campo `apellidos`.
     * - Es requerido (no vacío).
     * - Solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Debe ser una cadena de texto.
     */
    body("apellidos")
      .notEmpty()
      .withMessage("Los apellidos son requeridos")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los apellidos solo pueden contener letras y espacios (no mas de dos espacios en blanco).")
      .isString()
      .withMessage("Apellidos deben ser texto."),
    /**
     * @description Valida el campo `cedula`.
     * - Es requerido (no vacío).
     * - Debe seguir el formato `V-XXXXXXXX` o `E-XXXXXXXX` (donde X son dígitos entre 7 y 15).
     * - Debe ser una cadena de texto.
     * - Debe tener entre 5 y 15 caracteres (incluyendo el prefijo y el guion).
     */
    body("cedula")
      .notEmpty()
      .withMessage("La cédula es requerida")
      .matches(/^[VE]-\d{7,15}$/)
      .withMessage("La cédula no puede contener letras ni carácteres especiales que no sean '-'")
      .isString()
      .withMessage("Cédula debe ser texto.")
      .isLength({ min: 5, max: 15 })
      .withMessage("La cédula debe tener entre 5 y 15 carácteres."),
    /**
     * @description Valida el campo `telefono` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     * - Si está presente, debe tener entre 7 y 15 caracteres.
     * - Si está presente, solo puede contener dígitos.
     */
    body("telefono")
      .optional({ nullable: true, checkFalsy: true }) // Permite que sea null, undefined, o string vacío
      .isString()
      .withMessage("Teléfono debe ser texto.")
      .isLength({ min: 7, max: 15 })
      .withMessage("El teléfono debe tener entre 7 y 15 carácteres.")
      .matches(/^\d+$/)
      .withMessage("El teléfono solo puede contener dígitos sin carácteres especiales ni espacios."),
    /**
     * @description Valida el campo `correo` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una dirección de correo electrónico válida.
     */
    body("correo")
      .optional({ nullable: true, checkFalsy: true })
      .isEmail()
      .withMessage("El correo debe ser una dirección de correo válida."),
    /**
     * @description Valida el campo `discapacidad_id` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser un número entero positivo (mayor o igual a 1).
     */
    body("discapacidad_id")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Debe colocar una discapacidad válida."),
    /**
     * @description Valida el campo `fecha_nacimiento`.
     * - Es requerido (no vacío).
     * - Debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD).
     * - Se convierte a un objeto `Date`.
     */
    body("fecha_nacimiento")
      .notEmpty()
      .withMessage("La fecha de nacimiento es requerida.") // Considero que es un campo importante
      .isISO8601()
      .toDate()
      .withMessage(
        "La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD."
      ),
    /**
     * @description Valida el campo `observaciones` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     */
    body("observaciones")
      .optional({ nullable: true, checkFalsy: true })
      .isString(),
    /**
     * @description Valida el campo `seguimiento` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     */
    body("seguimiento")
      .optional({ nullable: true, checkFalsy: true })
      .isString(),
    /**
     * @description Valida el campo `direccion` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     */
    body("direccion")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("La dirección debe ser texto."), // Coherente con el valor por defecto en la base de datos
    /**
     * @description Valida el campo `id_carrera` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser un número entero positivo (mayor o igual a 1).
     * - Tiene un valor por defecto de `1`.
     */
    body("id_carrera")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Debe colocar una carrera válida.")
      .default(1), // Coherente con el valor por defecto en la base de datos
    /**
     * @description Valida el campo `posee_conapdis` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser un número entero entre 0 y 1.
     * - Tiene un valor por defecto de `0`.
     */
    body("posee_conapdis")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 0, max: 1 })
      .default(0), // Coherente con el valor por defecto en la base de datos
    /**
     * @description Valida el campo `otro_telefono` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     * - Si está presente, debe tener entre 7 y 15 caracteres.
     * - Si está presente, solo puede contener dígitos (permite cadena vacía).
     * - Tiene un valor por defecto de `""`.
     */
    body("otro_telefono")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("Otro teléfono debe ser texto.")
      .isLength({ min: 7, max: 15 })
      .withMessage("Otro teléfono debe tener entre 7 y 15 caracteres.")
      .matches(/^\d*$/)
      .withMessage("Otro teléfono solo puede contener dígitos (o estar vacío).") // Permitir vacío si se envía
      .default(""), // Coherente con el valor por defecto en la base de datos
  ],
  /**
   * @description Validaciones para la edición de un estudiante existente.
   * Valida el ID del estudiante en los parámetros de ruta y todos los campos del cuerpo
   * como opcionales, permitiendo actualizaciones parciales.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  editarEstudianteValidations: [
    /**
     * @description Valida el parámetro de ruta `id_estudiante`.
     * - Debe ser un número entero positivo (mayor o igual a 1).
     */
    param("id_estudiante")
      .isInt({ min: 1 })
      .withMessage(
        "El ID del estudiante debe ser un entero positivo válido para la edición."
      ),
    /**
     * @description Valida el campo `nombres` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, no puede estar vacío.
     * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Si está presente, debe ser una cadena de texto.
     */
    body("nombres")
      .optional({ nullable: true, checkFalsy: true })
      .notEmpty()
      .withMessage("Los nombres no pueden estar vacíos.")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los nombres solo pueden contener letras y espacios (no mas de dos espacios en blanco).")
      .isString()
      .withMessage("Nombres deben ser texto."),
    /**
     * @description Valida el campo `apellidos` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, no puede estar vacío.
     * - Si está presente, solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Si está presente, debe ser una cadena de texto.
     */
    body("apellidos")
      .optional({ nullable: true, checkFalsy: true })
      .notEmpty()
      .withMessage("Los apellidos no pueden estar vacíos.")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los apellidos solo pueden contener letras y espacios (no mas de dos espacios en blanco).")
      .isString()
      .withMessage("Apellidos deben ser texto."),
    /**
     * @description Valida el campo `cedula` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, no puede estar vacío.
     * - Si está presente, debe seguir el formato `V-XXXXXXXX` o `E-XXXXXXXX`.
     * - Si está presente, debe ser una cadena de texto.
     * - Si está presente, debe tener entre 5 y 15 caracteres (incluyendo V/E y el guion).
     */
    body("cedula")
      .optional({ nullable: true, checkFalsy: true }) // Sigue siendo opcional en la edición
      .notEmpty()
      .withMessage("La cédula no puede estar vacía si se proporciona.") // Mensaje si se envía pero está vacío
      .matches(/^[VE]-\d{7,15}$/) // ¡Ahora coincide con la validación de creación!
      .withMessage("La cédula debe seguir el formato V/E-XXXXXXXX (ej. V-12345678).") // Mensaje ajustado para el formato específico
      .isString()
      .withMessage("Cédula debe ser texto.")
      .isLength({ min: 5, max: 15 }) // Asegura la longitud total (V-Dígitos)
      .withMessage("La cédula debe tener entre 5 y 15 caracteres (incluyendo V/E y el guion)."), // Mensaje de longitud ajustado
    /**
     * @description Valida el campo `telefono` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     * - Si está presente, debe tener entre 7 y 15 caracteres.
     * - Si está presente, solo puede contener dígitos.
     */
    body("telefono")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("Teléfono debe ser texto.")
      .isLength({ min: 7, max: 15 })
      .withMessage("El teléfono debe tener entre 7 y 15 caracteres.")
      .matches(/^\d+$/)
      .withMessage("El teléfono solo puede contener dígitos sin carácteres especiales."),
    /**
     * @description Valida el campo `correo` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una dirección de correo electrónico válida.
     */
    body("correo")
      .optional({ nullable: true, checkFalsy: true })
      .isEmail()
      .withMessage("El correo debe ser una dirección de correo válida."),
    /**
     * @description Valida el campo `discapacidad_id` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser un número entero positivo (mayor o igual a 1).
     */
    body("discapacidad_id")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Debe colocar una discapacidad válida."),
    /**
     * @description Valida el campo `fecha_nacimiento` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD).
     * - Se convierte a un objeto `Date`.
     */
    body("fecha_nacimiento")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .toDate()
      .withMessage(
        "La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD."
      ),
    /**
     * @description Valida el campo `observaciones` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     */
    body("observaciones")
      .optional({ nullable: true, checkFalsy: true })
      .isString(),
    /**
     * @description Valida el campo `seguimiento` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     */
    body("seguimiento")
      .optional({ nullable: true, checkFalsy: true })
      .isString(),
    /**
     * @description Valida el campo `direccion` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     */
    body("direccion")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("La dirección debe ser texto."),
    /**
     * @description Valida el campo `id_carrera` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser un número entero positivo (mayor o igual a 1).
     */
    body("id_carrera")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Debe colocar una carrera válida."),
    /**
     * @description Valida el campo `posee_conapdis` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser un número entero entre 0 y 1.
     */
    body("posee_conapdis")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 0, max: 1 })
      .withMessage("Posee CONAPDIS debe ser 0 o 1."),
    /**
     * @description Valida el campo `otro_telefono` (opcional).
     * - Es opcional (permite `null`, `undefined` o cadena vacía).
     * - Si está presente, debe ser una cadena de texto.
     * - Si está presente, debe tener entre 7 y 15 caracteres.
     * - Si está presente, solo puede contener dígitos (o estar vacío).
     */
    body("otro_telefono")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("Otro teléfono debe ser texto.")
      .isLength({ min: 7, max: 15 })
      .withMessage("Otro teléfono debe tener entre 7 y 15 caracteres.")
      .matches(/^\d*$/)
      .withMessage(
        "Otro teléfono solo puede contener dígitos (o estar vacío) si se proporciona."
      ),
  ],
};