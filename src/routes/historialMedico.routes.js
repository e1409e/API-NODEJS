/**
 * @file Este archivo define las rutas para la gestión del historial médico en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre los registros de historial médico, incluyendo la obtención por ID y por ID de estudiante.
 * Integra validaciones de datos de entrada utilizando `express-validator` para asegurar
 * la integridad y el formato correcto de la información recibida en las peticiones.
 * @author Eric
 * @version 1.0.0
 * @module routes/historialMedico.routes
 * @see {@link module:controllers/historialMedico.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/historialMedico.validations} Para las reglas de validación de datos.
 */

import express from 'express';
import { validationResult } from 'express-validator'; // Se importa la función 'validationResult' para recopilar errores de validación.

import {
    obtenerHistorialesMedicos,
    obtenerHistorialMedicoPorId,
    crearHistorialMedico,
    editarHistorialMedico,
    eliminarHistorialMedico,
    obtenerHistorialMedicoPorEstudiante
} from '../controllers/HistorialMedico.controller.js';

import { historialMedicoValidations } from '../validations/historialMedico.validations.js'; // Importa las validaciones de historial médico

/**
 * @description Instancia de Express Router para gestionar las rutas de historial médico.
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
 * @description Ruta para obtener todos los historiales médicos registrados en el sistema.
 * @method GET
 * @route /historial_medico
 * @param {function} obtenerHistorialesMedicos - Controlador que maneja la lógica para obtener todos los historiales médicos.
 */
router.get('/', obtenerHistorialesMedicos);

/**
 * @description Ruta para obtener un historial médico específico por su ID.
 * Aplica validación al parámetro `id_historialmedico`.
 * @method GET
 * @route /historial_medico/:id_historialmedico
 * @param {string} :id_historialmedico - ID único del historial médico a buscar.
 * @param {Array<import('express-validator').ValidationChain>} historialMedicoValidations.editarHistorialMedicoValidations[0] - Middleware de validación para el ID del historial médico.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} obtenerHistorialMedicoPorId - Controlador que maneja la lógica para obtener un historial médico por ID.
 */
router.get(
    '/:id_historialmedico',
    historialMedicoValidations.editarHistorialMedicoValidations[0], // Valida el `param('id_historialmedico')`
    validar,
    obtenerHistorialMedicoPorId
);

/**
 * @description Ruta para obtener el historial médico de un estudiante específico por su ID de estudiante.
 * @method GET
 * @route /historial_medico/estudiante/:id_estudiante
 * @param {string} :id_estudiante - ID único del estudiante cuyo historial médico se desea obtener.
 * @param {function} obtenerHistorialMedicoPorEstudiante - Controlador que maneja la lógica para obtener el historial médico por ID de estudiante.
 */
router.get('/estudiante/:id_estudiante', obtenerHistorialMedicoPorEstudiante); // Asume que la validación del ID del estudiante se hace en el controlador o no es crítica aquí.

/**
 * @description Ruta para crear un nuevo registro de historial médico.
 * Aplica las validaciones definidas en `crearHistorialMedicoValidations` antes de ejecutar el controlador.
 * @method POST
 * @route /historial_medico
 * @param {Array<import('express-validator').ValidationChain>} historialMedicoValidations.crearHistorialMedicoValidations - Middlewares de validación para la creación de historial médico.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} crearHistorialMedico - Controlador que maneja la lógica de creación de historial médico.
 */
router.post(
    '/',
    historialMedicoValidations.crearHistorialMedicoValidations,
    validar,
    crearHistorialMedico
);

/**
 * @description Ruta para editar un historial médico existente por su ID.
 * Aplica las validaciones definidas en `editarHistorialMedicoValidations` antes de ejecutar el controlador.
 * @method PUT
 * @route /historial_medico/:id_historialmedico
 * @param {string} :id_historialmedico - ID único del historial médico a editar.
 * @param {Array<import('express-validator').ValidationChain>} historialMedicoValidations.editarHistorialMedicoValidations - Middlewares de validación para la edición de historial médico.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} editarHistorialMedico - Controlador que maneja la lógica de edición de historial médico.
 */
router.put(
    '/:id_historialmedico',
    historialMedicoValidations.editarHistorialMedicoValidations,
    validar,
    editarHistorialMedico
);

/**
 * @description Ruta para eliminar un historial médico del sistema por su ID.
 * Aplica validación al parámetro `id_historialmedico`.
 * @method DELETE
 * @route /historial_medico/:id_historialmedico
 * @param {string} :id_historialmedico - ID único del historial médico a eliminar.
 * @param {Array<import('express-validator').ValidationChain>} historialMedicoValidations.editarHistorialMedicoValidations[0] - Middleware de validación para el ID del historial médico.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} eliminarHistorialMedico - Controlador que maneja la lógica de eliminación de historial médico.
 */
router.delete(
    '/:id_historialmedico',
    historialMedicoValidations.editarHistorialMedicoValidations[0], // Valida el `param('id_historialmedico')`
    validar,
    eliminarHistorialMedico
);

export default router;