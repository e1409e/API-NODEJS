/**
 * @file Este archivo define las rutas para la gestión de facultades en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre las facultades, enlazando cada ruta con su controlador correspondiente.
 * Integra validaciones de datos de entrada utilizando `express-validator` para asegurar
 * la integridad y el formato correcto de la información recibida.
 * Incorpora autenticación JWT para asegurar que solo usuarios válidos puedan acceder a los recursos.
 * @author Eric
 * @version 1.0.0
 * @module routes/facultades.routes
 * @see {@link module:controllers/facultades.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/facultades.validations} Para las reglas de validación de datos.
 * @see {@link module:middlewares/auth.middleware} Para el middleware de autenticación.
 */

import express from 'express';
import {
    obtenerFacultades,
    obtenerFacultadPorId,
    crearFacultad,
    editarFacultad,
    eliminarFacultad,
    obtenerFacultadesConCarreras
} from '../controllers/facultades.controller.js';

import { facultadesValidations } from '../validations/facultades.validations.js';
import { validationResult } from 'express-validator';

// Importar el middleware de autenticación
import { authenticateToken } from '../middlewares/auth.middleware.js';

/**
 * @description Instancia de Express Router para gestionar las rutas de facultades.
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
 * @description Ruta para obtener todas las facultades registradas en el sistema.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * @method GET
 * @route /facultades
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} obtenerFacultades - Controlador que maneja la lógica para obtener todas las facultades.
 */
router.get('/', authenticateToken, obtenerFacultades);

/**
 * @description Ruta para obtener la información de una facultad específica por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica validación al parámetro `id_facultad`.
 * @method GET
 * @route /facultades/:id_facultad
 * @param {string} :id_facultad - ID único de la facultad a buscar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} facultadesValidations.eliminarFacultadValidations - Middlewares de validación para el ID de la facultad.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} obtenerFacultadPorId - Controlador que maneja la lógica para obtener una facultad por ID.
 */
router.get('/:id_facultad', authenticateToken, facultadesValidations.eliminarFacultadValidations, validar, obtenerFacultadPorId);

/**
 * @description Ruta para crear una nueva facultad.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica las validaciones definidas en `crearFacultadValidations` antes de ejecutar el controlador.
 * @method POST
 * @route /facultades
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} facultadesValidations.crearFacultadValidations - Middlewares de validación para la creación de facultades.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} crearFacultad - Controlador que maneja la lógica para crear una nueva facultad.
 */
router.post('/', authenticateToken, facultadesValidations.crearFacultadValidations, validar, crearFacultad);

/**
 * @description Ruta para editar una facultad existente por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica las validaciones definidas en `editarFacultadValidations` antes de ejecutar el controlador.
 * @method PUT
 * @route /facultades/:id_facultad
 * @param {string} :id_facultad - ID único de la facultad a editar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} facultadesValidations.editarFacultadValidations - Middlewares de validación para la edición de facultades.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} editarFacultad - Controlador que maneja la lógica para editar una facultad.
 */
router.put('/:id_facultad', authenticateToken, facultadesValidations.editarFacultadValidations, validar, editarFacultad);

/**
 * @description Ruta para eliminar una facultad del sistema por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica las validaciones definidas en `eliminarFacultadValidations` antes de ejecutar el controlador.
 * @method DELETE
 * @route /facultades/:id_facultad
 * @param {string} :id_facultad - ID único de la facultad a eliminar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} facultadesValidations.eliminarFacultadValidations - Middlewares de validación para la eliminación de facultades.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} eliminarFacultad - Controlador que maneja la lógica para eliminar una facultad.
 */
router.delete('/:id_facultad', authenticateToken, facultadesValidations.eliminarFacultadValidations, validar, eliminarFacultad);

/**
 * @description Ruta para obtener todas las facultades con sus carreras asociadas.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * @method GET
 * @route /facultades/carreras
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} obtenerFacultadesConCarreras - Controlador que maneja la lógica para obtener facultades con sus carreras.
 */
router.get('/carreras', authenticateToken, obtenerFacultadesConCarreras);

export default router;