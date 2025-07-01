/**
 * @file Este archivo define las validaciones para las rutas relacionadas con usuarios.
 * @description Utiliza la librería `express-validator` para asegurar que los datos enviados
 * en las peticiones HTTP para el registro, inicio de sesión y edición de usuarios
 * cumplan con los requisitos de formato, presencia y valores permitidos.
 * Esto incluye la validación específica para el campo 'rol'.
 * @author Eric
 * @version 1.0.0
 * @module validations/usuarios.validations
 * @see {@link https://express-validator.github.io/docs/} Para la documentación oficial de express-validator.
 */

import { body } from "express-validator";

/**
 * @description Objeto que agrupa todas las validaciones relacionadas con las operaciones de usuario.
 * Cada propiedad es un array de middlewares de validación de `express-validator`
 * que se pueden aplicar a rutas específicas.
 * @namespace usuarioValidations
 */
export const usuarioValidations = {
  /**
   * @description Validaciones para el registro de un nuevo usuario.
   * Asegura que todos los campos requeridos estén presentes y cumplan con los formatos esperados.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  registrarUsuarioValidations: [
    /**
     * @description Valida el campo `nombre`.
     * - Es requerido (no vacío).
     * - Solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Debe ser una cadena de texto.
     */
    body("nombre")
      .notEmpty().withMessage("Los nombres son requeridos")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los nombres solo pueden contener letras y espacios (no más de dos espacios en blanco).")
      .isString().withMessage("Nombres deben ser texto."),
    /**
     * @description Valida el campo `apellido`.
     * - Es requerido (no vacío).
     * - Solo puede contener letras (incluyendo acentos y 'ñ') y espacios simples.
     * - Debe ser una cadena de texto.
     */
    body("apellido")
      .notEmpty().withMessage("Los apellidos son requeridos")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los apellidos solo pueden contener letras y espacios (no más de dos espacios en blanco).")
      .isString().withMessage("Apellidos deben ser texto."),
    /**
     * @description Valida el campo `cedula_usuario`.
     * - Es requerido (no vacío).
     * - Debe seguir el formato `V-XXXXXXXX` o `E-XXXXXXXX` (donde X son dígitos).
     * - Debe ser una cadena de texto.
     * - Debe tener una longitud entre 5 y 15 caracteres.
     */
    body("cedula_usuario")
      .notEmpty().withMessage("La cédula es requerida")
      .matches(/^[VE]-\d{7,15}$/)
      .withMessage("La cédula debe tener el formato V-XXXXXXXX o E-XXXXXXXX.")
      .isString().withMessage("Cédula debe ser texto.")
      .isLength({ min: 5, max: 15 })
      .withMessage("La cédula debe tener entre 5 y 15 caracteres."),
    /**
     * @description Valida el campo `password`.
     * - Es requerido (no vacío).
     * - Debe tener al menos 6 caracteres.
     */
    body("password")
      .notEmpty().withMessage("La contraseña es requerida")
      .isLength({ min: 6, max: 15 })
      .withMessage("La contraseña debe tener al entre 6 y 15 caracteres"),
    /**
     * @description Valida el campo `rol`.
     * - Es requerido (no vacío).
     * - Debe ser uno de los valores permitidos: "administrador", "psicologo", o "docente".
     */
    body("rol")
      .notEmpty().withMessage("El rol es requerido")
      .isIn(["administrador", "psicologo", "docente"])
      .withMessage("El rol debe ser uno de: administrador, psicologo, docente"),
  ],
  /**
   * @description Validaciones para el inicio de sesión de un usuario.
   * Asegura que la cédula y la contraseña estén presentes.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  iniciarSesionValidations: [
    /**
     * @description Valida el campo `cedula_usuario`.
     * - Es requerido (no vacío).
     */
    body("cedula_usuario").notEmpty().withMessage("La cédula es requerida"),
    /**
     * @description Valida el campo `password`.
     * - Es requerido (no vacío).
     */
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ],
  /**
   * @description Validaciones para la edición de un usuario.
   * Todos los campos son opcionales, pero si se proporcionan, deben cumplir con los formatos esperados.
   * @type {Array<import('express-validator').ValidationChain>}
   */
  editarUsuarioValidations: [
    /**
     * @description Valida el campo `nombre` (opcional).
     * - Si está presente, solo puede contener letras y espacios simples.
     * - Si está presente, debe ser una cadena de texto.
     */
    body("nombre")
      .optional()
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los nombres solo pueden contener letras y espacios (no más de dos espacios en blanco).")
      .isString().withMessage("Nombres deben ser texto."),
    /**
     * @description Valida el campo `apellido` (opcional).
     * - Si está presente, solo puede contener letras y espacios simples.
     * - Si está presente, debe ser una cadena de texto.
     */
    body("apellido")
      .optional()
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los apellidos solo pueden contener letras y espacios (no más de dos espacios en blanco).")
      .isString().withMessage("Apellidos deben ser texto."),
    /**
     * @description Valida el campo `cedula_usuario` (opcional).
     * - Si está presente, debe seguir el formato `V-XXXXXXXX` o `E-XXXXXXXX`.
     * - Si está presente, debe ser una cadena de texto.
     * - Si está presente, debe tener una longitud entre 5 y 15 caracteres.
     */
    body("cedula_usuario")
      .optional()
      .matches(/^[VE]-\d{7,15}$/)
      .withMessage("La cédula debe tener el formato V-XXXXXXXX o E-XXXXXXXX.")
      .isString().withMessage("Cédula debe ser texto.")
      .isLength({ min: 5, max: 15 })
      .withMessage("La cédula debe tener entre 5 y 15 caracteres."),
    /**
     * @description Valida el campo `password` (opcional).
     * - Si está presente, debe tener al menos 6 caracteres.
     */
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
    /**
     * @description Valida el campo `rol` (opcional).
     * - Si está presente, debe ser uno de los valores permitidos: "administrador", "psicologo", o "docente".
     */
    body("rol")
      .optional()
      .isIn(["administrador", "psicologo", "docente"])
      .withMessage("El rol debe ser uno de: administrador, psicologo, docente"),
  ],
};
