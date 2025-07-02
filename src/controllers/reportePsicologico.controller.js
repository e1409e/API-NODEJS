/**
 * @file Este archivo contiene los controladores para la gestión de reportes psicológicos.
 * @description Implementa la lógica de negocio para obtener, crear, actualizar y eliminar
 * registros de reportes psicológicos, interactuando con la base de datos y utilizando
 * las validaciones definidas para asegurar la integridad de los datos.
 * @author Eric
 * @version 1.0.0
 * @module controllers/reportePsicologico.controller
 * @see {@link module:validations/reportePsicologico.validations} Para las reglas de validación de datos.
 * @see {@link module:db} Para la conexión a la base de datos.
 */

import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { reportePsicologicoValidations } from '../validations/reportePsicologico.validations.js';

/**
 * @description Obtiene todos los reportes psicológicos registrados en el sistema.
 * Los resultados se ordenan por `id_psicologico` de forma descendente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de reporte psicológico o un mensaje de error.
 * @method GET
 * @route /reportes_psicologicos
 */
export const obtenerReportesPsicologicos = async (req, res) => {
    try {
        const reportesPsicologicos = await sql`
            SELECT * FROM reporte_psicologico
            ORDER BY id_psicologico DESC
        `;
        res.json(reportesPsicologicos);
    } catch (error) {
        console.error('Error al obtener reportes psicológicos:', error);
        res.status(500).json({ error: 'Error al obtener reportes psicológicos' });
    }
};

/**
 * @description Obtiene un reporte psicológico específico por su ID.
 * Antes de la consulta, valida el `id_psicologico` del parámetro de ruta.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_psicologico`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de reporte psicológico o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /reportes_psicologicos/:id_psicologico
 */
export const obtenerReportePsicologicoPorId = async (req, res) => {
    // Ejecuta la validación del parámetro id_psicologico
    await Promise.all(reportePsicologicoValidations.editarReportePsicologicoValidations.filter(v => v.builder.fields.includes('id_psicologico')).map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_psicologico } = req.params;
        const reportePsicologico = await sql`
            SELECT * FROM reporte_psicologico WHERE id_psicologico = ${id_psicologico}
        `;

        if (reportePsicologico.length === 0) {
            return res.status(404).json({ error: 'Reporte psicológico no encontrado' });
        }

        res.json(reportePsicologico[0]);
    } catch (error) {
        console.error('Error al obtener reporte psicológico por ID:', error);
        res.status(500).json({ error: 'Error al obtener reporte psicológico por ID' });
    }
};

/**
 * @description Crea un nuevo registro de reporte psicológico en la base de datos.
 * Aplica las validaciones definidas en `reportePsicologicoValidations.crearReportePsicologicoValidations`
 * para asegurar la integridad de los datos recibidos.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.body.id_estudiante`, `req.body.motivo_consulta` (opcional), `req.body.sintesis_diagnostica` (opcional), `req.body.recomendaciones` (opcional).
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con el ID del reporte psicológico creado o con errores de validación/servidor.
 * @method POST
 * @route /reportes_psicologicos
 */
export const crearReportePsicologico = async (req, res) => {
    // Ejecuta todas las validaciones definidas para la creación de reporte psicológico.
    await Promise.all(reportePsicologicoValidations.crearReportePsicologicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            id_estudiante,
            motivo_consulta,
            sintesis_diagnostica,
            recomendaciones
        } = req.body;

        // Llama a una función almacenada en la base de datos para insertar el nuevo reporte psicológico.
        const result = await sql`
            SELECT insertar_reporte_psicologico(
                ${id_estudiante},
                ${motivo_consulta || null},
                ${sintesis_diagnostica || null},
                ${recomendaciones || null}
            ) AS id_psicologico;
        `;

        // Verifica si la inserción fue exitosa y se devolvió un ID válido.
        if (!result.length || result[0].id_psicologico === null) {
            throw new Error("Error al guardar el reporte psicológico en la base de datos");
        }

        res.status(201).json({ id_psicologico: result[0].id_psicologico });
    } catch (error) {
        console.error("Error al crear reporte psicológico:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

/**
 * @description Actualiza un registro de reporte psicológico existente en la base de datos por su ID.
 * Aplica las validaciones definidas en `reportePsicologicoValidations.editarReportePsicologicoValidations`
 * para el ID del reporte psicológico y los campos a actualizar.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_psicologico` y campos opcionales en `req.body`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method PUT
 * @route /reportes_psicologicos/:id_psicologico
 */
export const editarReportePsicologico = async (req, res) => {
    // Ejecuta todas las validaciones definidas para la edición de reporte psicológico.
    await Promise.all(reportePsicologicoValidations.editarReportePsicologicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_psicologico } = req.params;
        const {
            id_estudiante,
            motivo_consulta,
            sintesis_diagnostica,
            recomendaciones
        } = req.body;

        // Llama a una función almacenada en la base de datos para editar el reporte psicológico.
        const result = await sql`
            SELECT editar_reporte_psicologico(
                ${id_psicologico},
                ${id_estudiante || null},
                ${motivo_consulta || null},
                ${sintesis_diagnostica || null},
                ${recomendaciones || null}
            ) AS success;
        `;

        // Si la función de la DB indica que no se pudo actualizar (ej. reporte psicológico no encontrado), devuelve 404.
        if (!result.length || !result[0].success) {
            return res.status(404).json({ error: 'Reporte psicológico no encontrado o no se pudo actualizar' });
        }

        res.json({ success: true, message: 'Reporte psicológico actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar reporte psicológico:', error);
        res.status(500).json({ error: 'Error al editar reporte psicológico' });
    }
};

/**
 * @description Elimina un registro de reporte psicológico de la base de datos por su ID.
 * Aplica validación al parámetro `id_psicologico`.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_psicologico`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method DELETE
 * @route /reportes_psicologicos/:id_psicologico
 */
export const eliminarReportePsicologico = async (req, res) => {
    // Ejecuta la validación del parámetro id_psicologico
    await Promise.all(reportePsicologicoValidations.editarReportePsicologicoValidations.filter(v => v.builder.fields.includes('id_psicologico')).map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_psicologico } = req.params;

        const result = await sql`
            SELECT eliminar_reporte_psicologico(${id_psicologico}) AS success;
        `;

        // Si la función de la DB indica que no se pudo eliminar (ej. reporte psicológico no encontrado), devuelve 404.
        if (!result.length || !result[0].success) {
            return res.status(404).json({ error: 'Reporte psicológico no encontrado o no se pudo eliminar' });
        }

        res.json({ message: 'Reporte psicológico eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar reporte psicológico:', error);
        res.status(500).json({ error: 'Error al eliminar reporte psicológico' });
    }
};

/**
 * @description Obtiene los reportes psicológicos de un estudiante específico por su ID de estudiante.
 * Incluye el nombre y apellido del estudiante asociado. Los resultados se ordenan por `id_psicologico` de forma descendente.
 * Aplica validación al parámetro `id_estudiante`.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_estudiante`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de reporte psicológico o un mensaje de error 404 si no se encuentran.
 * @method GET
 * @route /reportes_psicologicos/estudiante/:id_estudiante
 */
export const obtenerReportesPsicologicosPorEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;
        const reportes = await sql`
            SELECT rp.*, e.nombres, e.apellidos
            FROM reporte_psicologico rp
            INNER JOIN estudiantes e ON rp.id_estudiante = e.id_estudiante
            WHERE rp.id_estudiante = ${id_estudiante}
            ORDER BY rp.id_psicologico DESC
        `;
        if (!reportes.length) {
            return res.status(404).json({ error: 'No se encontraron reportes psicológicos para este estudiante' });
        }
        res.json(reportes);
    } catch (error) {
        console.error('Error al obtener reportes psicológicos por estudiante:', error);
        res.status(500).json({ error: 'Error al obtener reportes psicológicos por estudiante' });
    }
};