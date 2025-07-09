/**
 * @file Este archivo define las rutas para la gestión de incidencias en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre las incidencias. Integra validaciones de datos de entrada utilizando `express-validator`
 * para asegurar la integridad y el formato correcto de la información recibida en las peticiones.
 * Incorpora autenticación JWT para asegurar que solo usuarios válidos puedan acceder a los recursos.
 * @author Eric
 * @version 1.0.0
 * @module routes/incidencias.routes
 * @see {@link module:controllers/incidencias.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/incidencias.validations} Para las reglas de validación de datos.
 * @see {@link module:middlewares/auth.middleware} Para el middleware de autenticación.
 */

import express from 'express';
import { validationResult } from 'express-validator'; // Se importa la función 'validationResult' para recopilar errores de validación.

import {
    obtenerIncidencias,
    obtenerIncidenciaPorId,
    obtenerIncidenciasPorEstudiante,
    crearIncidencia,
    editarIncidencia,
    eliminarIncidencia
} from '../controllers/incidencias.controller.js';

import { incidenciasValidations } from '../validations/incidencias.validations.js'; // Importa las validaciones de incidencias

// Importar el middleware de autenticación
import { authenticateToken } from '../middlewares/auth.middleware.js';

/**
 * @description Instancia de Express Router para gestionar las rutas de incidencias.
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
 * @description Ruta para obtener todas las incidencias registradas en el sistema.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * @method GET
 * @route /incidencias
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} obtenerIncidencias - Controlador que maneja la lógica para obtener todas las incidencias.
 */
router.get('/', authenticateToken, obtenerIncidencias);

/**
 * @description Ruta para obtener la información de una incidencia específica por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica validación al parámetro `id_incidencia`.
 * @method GET
 * @route /incidencias/:id_incidencia
 * @param {string} :id_incidencia - ID único de la incidencia a buscar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} incidenciasValidations.eliminarIncidenciaValidations[0] - Middleware de validación para el ID de la incidencia.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} obtenerIncidenciaPorId - Controlador que maneja la lógica para obtener una incidencia por ID.
 */
router.get(
    '/:id_incidencia',
    authenticateToken, // Agregado el middleware de autenticación
    incidenciasValidations.eliminarIncidenciaValidations[0], // Valida el `param('id_incidencia')`
    validar,
    obtenerIncidenciaPorId
);

/**
 * @description Ruta para obtener las incidencias de un estudiante específico por su ID de estudiante.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * @method GET
 * @route /incidencias/estudiante/:id_estudiante
 * @param {string} :id_estudiante - ID único del estudiante cuyas incidencias se desean obtener.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} obtenerIncidenciasPorEstudiante - Controlador que maneja la lógica para obtener incidencias por ID de estudiante.
 */
router.get('/estudiante/:id_estudiante', authenticateToken, obtenerIncidenciasPorEstudiante); // No se aplica validación de ID de estudiante en la ruta, se asume que el controlador lo maneja o que la ruta que lleva a este endpoint lo valida.

/**
 * @description Ruta para crear una nueva incidencia.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica las validaciones definidas en `crearIncidenciaValidations` antes de ejecutar el controlador.
 * @method POST
 * @route /incidencias
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} incidenciasValidations.crearIncidenciaValidations - Middlewares de validación para la creación de incidencias.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} crearIncidencia - Controlador que maneja la lógica de creación de incidencia.
 */
router.post(
    '/',
    authenticateToken, // Agregado el middleware de autenticación
    incidenciasValidations.crearIncidenciaValidations,
    validar,
    crearIncidencia
);

/**
 * @description Ruta para editar una incidencia existente por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica las validaciones definidas en `editarIncidenciaValidations` antes de ejecutar el controlador.
 * @method PUT
 * @route /incidencias/:id_incidencia
 * @param {string} :id_incidencia - ID único de la incidencia a editar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} incidenciasValidations.editarIncidenciaValidations - Middlewares de validación para la edición de incidencias.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} editarIncidencia - Controlador que maneja la lógica de edición de incidencia.
 */
router.put(
    '/:id_incidencia',
    authenticateToken, // Agregado el middleware de autenticación
    incidenciasValidations.editarIncidenciaValidations,
    validar,
    editarIncidencia
);

/**
 * @description Ruta para eliminar una incidencia del sistema por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Aplica validación al parámetro `id_incidencia`.
 * @method DELETE
 * @route /incidencias/:id_incidencia
 * @param {string} :id_incidencia - ID único de la incidencia a eliminar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} incidenciasValidations.eliminarIncidenciaValidations[0] - Middleware de validación para el ID de la incidencia.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} eliminarIncidencia - Controlador que maneja la lógica de eliminación de incidencia.
 */
router.delete(
    '/:id_incidencia',
    authenticateToken, // Agregado el middleware de autenticación
    incidenciasValidations.eliminarIncidenciaValidations[0], // Valida el `param('id_incidencia')`
    validar,
    eliminarIncidencia
);

export default router;