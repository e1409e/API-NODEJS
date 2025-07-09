/**
 * @file Este archivo define las rutas para la gestión de estudiantes en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre los estudiantes. Integra validaciones de datos de entrada utilizando `express-validator`
 * para asegurar la integridad y el formato correcto de la información recibida en las peticiones.
 * Incorpora autenticación JWT para asegurar que solo usuarios válidos puedan acceder a los recursos.
 * @author Eric
 * @version 1.0.0
 * @module routes/estudiantes.routes
 * @see {@link module:controllers/estudiantes.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/estudiantes.validations} Para las reglas de validación de datos.
 * @see {@link module:middlewares/auth.middleware} Para el middleware de autenticación.
 */

import express from 'express';
import { validationResult } from 'express-validator'; // Se importa la función 'validationResult' para recopilar errores de validación.

// Se importan las reglas de validación específicas para el modelo de estudiante.
import { estudianteValidations } from '../validations/estudiantes.validations.js';

import {
    obtenerEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    editarEstudiante,
    eliminarEstudiante
} from '../controllers/estudiantes.controller.js'; // Se importan las funciones controladoras que manejan la lógica de negocio.

// Importar el middleware de autenticación
import { authenticateToken } from '../middlewares/auth.middleware.js'; // Solo necesitamos authenticateToken

/**
 * @description Instancia del enrutador de Express para gestionar las rutas de estudiantes.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * @description Ruta para obtener todos los estudiantes.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * @method GET
 * @route /estudiantes
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} obtenerEstudiantes - Controlador que maneja la lógica para obtener todos los estudiantes.
 */
router.get('/', authenticateToken, obtenerEstudiantes);

/**
 * @description Ruta para obtener un estudiante específico por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Se aplica una validación para asegurar que el `id_estudiante` proporcionado en la URL es un entero válido.
 * @method GET
 * @route /estudiantes/:id_estudiante
 * @param {string} :id_estudiante - ID único del estudiante a buscar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} estudianteValidations.editarEstudianteValidations[0] - Middleware de validación para el ID del estudiante.
 * @param {function} middleware - Middleware para manejar los resultados de la validación.
 * @param {function} obtenerEstudiantePorId - Controlador que maneja la lógica para obtener un estudiante por ID.
 */
router.get('/:id_estudiante',
    authenticateToken,
    // La primera regla de 'editarEstudianteValidations' valida que 'id_estudiante' sea un entero positivo.
    estudianteValidations.editarEstudianteValidations[0],
    /**
     * @description Middleware para verificar los errores de validación del `id_estudiante`.
     * @param {object} req - Objeto de solicitud de Express.
     * @param {object} res - Objeto de respuesta de Express.
     * @param {function} next - Función para pasar el control al siguiente middleware (el controlador).
     * @returns {void} Responde con errores de validación o pasa al siguiente middleware.
     */
    (req, res, next) => {
        const errors = validationResult(req); // Se recopilan los errores de validación del request.
        if (!errors.isEmpty()) {
            // Si existen errores de validación, se envía una respuesta de error 400 (Bad Request).
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Si la validación es exitosa, se pasa el control al siguiente middleware (el controlador).
    },
    obtenerEstudiantePorId
);

/**
 * @description Ruta para crear un nuevo estudiante.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Se aplican todas las reglas de validación definidas en `crearEstudianteValidations`.
 * @method POST
 * @route /estudiantes
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} estudianteValidations.crearEstudianteValidations - Middlewares de validación para los datos del estudiante.
 * @param {function} middleware - Middleware para manejar los resultados de la validación.
 * @param {function} crearEstudiante - Controlador que maneja la lógica de creación del estudiante.
 */
router.post('/',
    authenticateToken,
    estudianteValidations.crearEstudianteValidations, // Middleware de validación para los datos del estudiante.
    /**
     * @description Middleware para verificar los errores de validación de los datos del cuerpo.
     * @param {object} req - Objeto de solicitud de Express.
     * @param {object} res - Objeto de respuesta de Express.
     * @returns {void} Responde con errores de validación o invoca el controlador.
     */
    (req, res) => {
        const errors = validationResult(req); // Se recopilan los errores de validación.
        if (!errors.isEmpty()) {
            // Si se encuentran errores, se detiene la ejecución y se responde con un estado 400 y los detalles de los errores.
            return res.status(400).json({ errors: errors.array() });
        }
        // Si los datos son válidos, se invoca la función controladora para procesar la creación del estudiante.
        crearEstudiante(req, res);
    }
);

/**
 * @description Ruta para editar un estudiante existente por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Se aplican las validaciones de `editarEstudianteValidations`.
 * @method PUT
 * @route /estudiantes/:id_estudiante
 * @param {string} :id_estudiante - ID único del estudiante a editar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} estudianteValidations.editarEstudianteValidations - Middlewares de validación para los datos de edición.
 * @param {function} middleware - Middleware para manejar los resultados de la validación.
 * @param {function} editarEstudiante - Controlador que maneja la lógica de edición del estudiante.
 */
router.put('/:id_estudiante',
    authenticateToken,
    estudianteValidations.editarEstudianteValidations, // Middleware de validación para los datos de edición.
    /**
     * @description Middleware para verificar los errores de validación de los datos del cuerpo y el ID.
     * @param {object} req - Objeto de solicitud de Express.
     * @param {object} res - Objeto de respuesta de Express.
     * @returns {void} Responde con errores de validación o invoca el controlador.
     */
    (req, res) => {
        const errors = validationResult(req); // Se recopilan los errores de validación.
        if (!errors.isEmpty()) {
            // Si existen errores, se responde con un estado 400 y los errores.
            return res.status(400).json({ errors: errors.array() });
        }
        // Si los datos son válidos, se procede a llamar al controlador para actualizar el estudiante.
        editarEstudiante(req, res);
    }
);

/**
 * @description Ruta para eliminar un estudiante por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Se valida el `id_estudiante` del parámetro de la URL.
 * @method DELETE
 * @route /estudiantes/:id_estudiante
 * @param {string} :id_estudiante - ID único del estudiante a eliminar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {Array<import('express-validator').ValidationChain>} estudianteValidations.editarEstudianteValidations[0] - Middleware de validación para el ID.
 * @param {function} middleware - Middleware para manejar los resultados de la validación.
 * @param {function} eliminarEstudiante - Controlador que maneja la lógica de eliminación del estudiante.
 */
router.delete('/:id_estudiante',
    authenticateToken,
    // Se reutiliza la primera regla de validación de 'editarEstudianteValidations' para el ID.
    estudianteValidations.editarEstudianteValidations[0],
    /**
     * @description Middleware para verificar los errores de validación del `id_estudiante`.
     * @param {object} req - Objeto de solicitud de Express.
     * @param {object} res - Objeto de respuesta de Express.
     * @param {function} next - Función para pasar el control al controlador.
     * @returns {void} Responde con errores de validación o pasa al siguiente middleware.
     */
    (req, res, next) => {
        const errors = validationResult(req); // Se recopilan los errores de validación.
        if (!errors.isEmpty()) {
            // Si hay errores de validación del ID, se envía una respuesta 400.
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Si el ID es válido, se pasa el control al controlador para ejecutar la eliminación.
    },
    eliminarEstudiante
);

export default router; // Se exporta el enrutador para ser utilizado en el archivo principal de la aplicación.