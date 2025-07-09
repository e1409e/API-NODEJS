/**
 * @file Este archivo define las rutas para la gestión de discapacidades en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre las discapacidades. Integra validaciones de datos de entrada utilizando `express-validator`
 * para asegurar la integridad y el formato correcto de la información recibida en las peticiones.
 * Incorpora autenticación JWT para asegurar que solo usuarios válidos puedan acceder a los recursos.
 * @author Eric
 * @version 1.0.0
 * @module routes/discapacidades.routes
 * @see {@link module:controllers/discapacidades.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/discapacidades.validations} Para las reglas de validación de datos.
 * @see {@link module:middlewares/auth.middleware} Para el middleware de autenticación.
 */

import express from 'express';
import { validationResult } from 'express-validator'; // Se importa la función 'validationResult' para recopilar errores de validación.

import {
    obtenerDiscapacidades,
    obtenerDiscapacidadPorId,
    crearDiscapacidad,
    editarDiscapacidad,
    eliminarDiscapacidad
} from '../controllers/discapacidades.controller.js';

import { discapacidadValidations } from '../validations/discapacidades.validations.js'; // Importa las validaciones de discapacidades

// Importar el middleware de autenticación
import { authenticateToken } from '../middlewares/auth.middleware.js';

/**
 * @description Instancia de Express Router para gestionar las rutas de discapacidades.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * @description Middleware personalizado para manejar los errores de validación de `express-validator`.
 * Si existen errores de validación en la solicitud, intercepta la petición y responde con
 * un estado 400 (Bad Request) y un array de los errores encontrados.
 * Si no hay errores de validación, pasa el control al siguiente middleware o controlador.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware o controlador.
 * @returns {void} Responde con errores de validación o pasa al siguiente middleware.
 * @function
 */
const validar = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
};

/**
 * @description Ruta para obtener todas las discapacidades registradas en el sistema.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * @method GET
 * @route /discapacidades
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} obtenerDiscapacidades - Controlador que maneja la lógica para obtener todas las discapacidades.
 */
router.get('/', authenticateToken, obtenerDiscapacidades);

/**
 * @description Ruta para obtener la información de una discapacidad específica por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica validación al parámetro `discapacidad_id`.
 * @method GET
 * @route /discapacidades/:discapacidad_id
 * @param {string} :discapacidad_id - ID único de la discapacidad a buscar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} discapacidadValidations.editarDiscapacidadValidations - Middlewares de validación para el ID de la discapacidad (solo el parámetro).
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} obtenerDiscapacidadPorId - Controlador que maneja la lógica para obtener una discapacidad por ID.
 */
router.get(
    '/:discapacidad_id',
    authenticateToken, // Agregado el middleware de autenticación
    discapacidadValidations.editarDiscapacidadValidations.filter(v => v.builder.fields.includes('discapacidad_id')), // Filtra para solo validar el parámetro
    validar,
    obtenerDiscapacidadPorId
);

/**
 * @description Ruta para crear una nueva discapacidad.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica las validaciones definidas en `crearDiscapacidadValidations` antes de ejecutar el controlador.
 * @method POST
 * @route /discapacidades
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} discapacidadValidations.crearDiscapacidadValidations - Middlewares de validación para la creación de discapacidades.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} crearDiscapacidad - Controlador que maneja la lógica de creación de discapacidad.
 */
router.post(
    '/',
    authenticateToken, // Agregado el middleware de autenticación
    discapacidadValidations.crearDiscapacidadValidations,
    validar,
    crearDiscapacidad
);

/**
 * @description Ruta para editar una discapacidad existente por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica las validaciones definidas en `editarDiscapacidadValidations` antes de ejecutar el controlador.
 * @method PUT
 * @route /discapacidades/:discapacidad_id
 * @param {string} :discapacidad_id - ID único de la discapacidad a editar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} discapacidadValidations.editarDiscapacidadValidations - Middlewares de validación para la edición de discapacidades.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} editarDiscapacidad - Controlador que maneja la lógica de edición de discapacidad.
 */
router.put(
    '/:discapacidad_id',
    authenticateToken, // Agregado el middleware de autenticación
    discapacidadValidations.editarDiscapacidadValidations,
    validar,
    editarDiscapacidad
);

/**
 * @description Ruta para eliminar una discapacidad del sistema por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica validación al parámetro `discapacidad_id`.
 * @method DELETE
 * @route /discapacidades/:discapacidad_id
 * @param {string} :discapacidad_id - ID único de la discapacidad a eliminar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} discapacidadValidations.editarDiscapacidadValidations - Middlewares de validación para el ID de la discapacidad (solo el parámetro).
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} eliminarDiscapacidad - Controlador que maneja la lógica de eliminación de discapacidad.
 */
router.delete(
    '/:discapacidad_id',
    authenticateToken, // Agregado el middleware de autenticación
    discapacidadValidations.editarDiscapacidadValidations.filter(v => v.builder.fields.includes('discapacidad_id')), // Filtra para solo validar el parámetro
    validar,
    eliminarDiscapacidad
);

export default router;