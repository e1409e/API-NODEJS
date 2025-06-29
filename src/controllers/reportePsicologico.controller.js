import { validationResult } from 'express-validator';
import { sql } from '../db.js';  // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { reportePsicologicoValidations } from '../validations/reportePsicologico.validations.js';

// Función para obtener todos los reportes psicológicos
// de id mayor a menor
export const obtenerReportesPsicologicos = async (req, res) => {
    try {
        // Se agrega ORDER BY id_psicologico DESC para devolver los registros de mayor a menor
        const reportesPsicologicos = await req.sql`
            SELECT * FROM reporte_psicologico
            ORDER BY id_psicologico DESC
        `;
        res.json(reportesPsicologicos);
    } catch (error) {
        console.error('Error al obtener reportes psicológicos:', error);
        res.status(500).json({ error: 'Error al obtener reportes psicológicos' });
    }
};

// Función para obtener un reporte psicológico por ID
// de mayor a menor
export const obtenerReportePsicologicoPorId = async (req, res) => {
    try {
        const { id_psicologico } = req.params;
        // No es necesario ORDER BY aquí porque solo se busca por ID único
        const reportePsicologico = await req.sql`
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

// Función para crear un nuevo reporte psicológico
export const crearReportePsicologico = async (req, res) => {
    await Promise.all(reportePsicologicoValidations.crearReportePsicologicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
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

        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Ejecutar la función actualizada en la base de datos
        const result = await req.sql`
            SELECT insertar_reporte_psicologico(
                ${id_estudiante},
                ${motivo_consulta},
                ${sintesis_diagnostica},
                ${recomendaciones}
            ) AS id_psicologico;
        `;

        if (!result.length || !result[0].id_psicologico) {
            throw new Error("Error al guardar el reporte psicológico en la base de datos");
        }

        res.status(201).json({ id_psicologico: result[0].id_psicologico });
    } catch (error) {
        console.error("Error al crear reporte psicológico:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Función para editar un reporte psicológico existente
export const editarReportePsicologico = async (req, res) => {
    await Promise.all(reportePsicologicoValidations.editarReportePsicologicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
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

        const result = await req.sql`
            SELECT editar_reporte_psicologico(
                ${id_psicologico},
                ${id_estudiante || null},
                ${motivo_consulta || null},
                ${sintesis_diagnostica || null},
                ${recomendaciones || null}
            ) AS success;
        `;

        if (!result.length || !result[0].success) {
            return res.status(404).json({ error: 'Reporte psicológico no encontrado' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error al editar reporte psicológico:', error);
        res.status(500).json({ error: 'Error al editar reporte psicológico' });
    }
};

// Función para eliminar un reporte psicológico
export const eliminarReportePsicologico = async (req, res) => {
    try {
        const { id_psicologico } = req.params;

        const result = await req.sql`
            SELECT eliminar_reporte_psicologico(${id_psicologico}) AS success;
        `;

        if (!result.length || !result[0].success) {
            return res.status(404).json({ error: 'Reporte psicológico no encontrado' });
        }

        res.json({ message: 'Reporte psicológico eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar reporte psicológico:', error);
        res.status(500).json({ error: 'Error al eliminar reporte psicológico' });
    }
};

// Nueva función: obtener reportes psicológicos por estudiante
// de mayor a menor
export const obtenerReportesPsicologicosPorEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;
        // Se agrega ORDER BY rp.id_psicologico DESC para devolver los registros de mayor a menor
        const reportes = await req.sql`
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