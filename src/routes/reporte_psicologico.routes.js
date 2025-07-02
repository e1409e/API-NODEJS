/**
 * @file Este archivo define las rutas para la gestión de reportes psicológicos en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre los reportes psicológicos. Integra validaciones de datos de entrada utilizando `express-validator`
 * para asegurar la integridad y el formato correcto de la información recibida en las peticiones.
 * @author Eric
 * @version 1.0.0
 * @module routes/reportePsicologico.routes
 * @see {@link module:controllers/reportePsicologico.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/reportePsicologico.validations} Para las reglas de validación de datos.
 */

import express from 'express';
import { validationResult } from 'express-validator'; // Se importa la función 'validationResult' para recopilar errores de validación.

import {
    obtenerReportesPsicologicos,
    obtenerReportePsicologicoPorId,
    crearReportePsicologico,
    editarReportePsicologico,
    eliminarReportePsicologico,
    obtenerReportesPsicologicosPorEstudiante
} from '../controllers/reportePsicologico.controller.js';

import { reportePsicologicoValidations } from '../validations/reportePsicologico.validations.js'; // Importa las validaciones de reportes psicológicos

/**
 * @description Instancia de Express Router para gestionar las rutas de reportes psicológicos.
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
 * @description Ruta para obtener todos los reportes psicológicos registrados en el sistema.
 * @method GET
 * @route /reportes_psicologicos
 * @param {function} obtenerReportesPsicologicos - Controlador que maneja la lógica para obtener todos los reportes.
 */
router.get('/', obtenerReportesPsicologicos);

/**
 * @description Ruta para obtener la información de un reporte psicológico específico por su ID.
 * Aplica validación al parámetro `id_psicologico`.
 * @method GET
 * @route /reportes_psicologicos/:id_psicologico
 * @param {string} :id_psicologico - ID único del reporte psicológico a buscar.
 * @param {Array<import('express-validator').ValidationChain>} reportePsicologicoValidations.editarReportePsicologicoValidations[0] - Middleware de validación para el ID del reporte psicológico (solo el parámetro).
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} obtenerReportePsicologicoPorId - Controlador que maneja la lógica para obtener un reporte por ID.
 */
router.get(
    '/:id_psicologico',
    reportePsicologicoValidations.editarReportePsicologicoValidations.filter(v => v.builder.fields.includes('id_psicologico')), // Filtra para solo validar el parámetro
    validar,
    obtenerReportePsicologicoPorId
);

/**
 * @description Ruta para obtener los reportes psicológicos de un estudiante específico por su ID.
 * Aplica validación al parámetro `id_estudiante`.
 * @method GET
 * @route /reportes_psicologicos/estudiante/:id_estudiante
 * @param {string} :id_estudiante - ID único del estudiante cuyos reportes psicológicos se desean obtener.
 * @param {Array<import('express-validator').ValidationChain>} reportePsicologicoValidations.crearReportePsicologicoValidations[0] - Middleware de validación para el ID del estudiante (solo el parámetro).
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} obtenerReportesPsicologicosPorEstudiante - Controlador que maneja la lógica para obtener reportes por ID de estudiante.
 */
router.get(
    '/estudiante/:id_estudiante',
    obtenerReportesPsicologicosPorEstudiante
);

/**
 * @description Ruta para crear un nuevo reporte psicológico.
 * Aplica las validaciones definidas en `crearReportePsicologicoValidations` antes de ejecutar el controlador.
 * @method POST
 * @route /reportes_psicologicos
 * @param {Array<import('express-validator').ValidationChain>} reportePsicologicoValidations.crearReportePsicologicoValidations - Middlewares de validación para la creación de reportes.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} crearReportePsicologico - Controlador que maneja la lógica de creación de reporte.
 */
router.post(
    '/',
    reportePsicologicoValidations.crearReportePsicologicoValidations,
    validar,
    crearReportePsicologico
);

/**
 * @description Ruta para editar un reporte psicológico existente por su ID.
 * Aplica las validaciones definidas en `editarReportePsicologicoValidations` antes de ejecutar el controlador.
 * @method PUT
 * @route /reportes_psicologicos/:id_psicologico
 * @param {string} :id_psicologico - ID único del reporte psicológico a editar.
 * @param {Array<import('express-validator').ValidationChain>} reportePsicologicoValidations.editarReportePsicologicoValidations - Middlewares de validación para la edición de reportes.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} editarReportePsicologico - Controlador que maneja la lógica de edición de reporte.
 */
router.put(
    '/:id_psicologico',
    reportePsicologicoValidations.editarReportePsicologicoValidations,
    validar,
    editarReportePsicologico
);

/**
 * @description Ruta para eliminar un reporte psicológico del sistema por su ID.
 * Aplica validación al parámetro `id_psicologico`.
 * @method DELETE
 * @route /reportes_psicologicos/:id_psicologico
 * @param {string} :id_psicologico - ID único del reporte psicológico a eliminar.
 * @param {Array<import('express-validator').ValidationChain>} reportePsicologicoValidations.editarReportePsicologicoValidations[0] - Middleware de validación para el ID del reporte psicológico (solo el parámetro).
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} eliminarReportePsicologico - Controlador que maneja la lógica de eliminación de reporte.
 */
router.delete(
    '/:id_psicologico',
    reportePsicologicoValidations.editarReportePsicologicoValidations.filter(v => v.builder.fields.includes('id_psicologico')), // Filtra para solo validar el parámetro
    validar,
    eliminarReportePsicologico
);

export default router;