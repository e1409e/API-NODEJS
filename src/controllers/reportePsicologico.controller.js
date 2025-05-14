import { validationResult } from 'express-validator';
import { sql } from '../db.js';  // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { reportePsicologicoValidations } from '../validations/reportePsicologico.validations.js';

// Función para obtener todos los reportes psicológicos
export const obtenerReportesPsicologicos = async (req, res) => {
    try {
        const reportesPsicologicos = await req.sql`SELECT * FROM reporte_psicologico`;
        res.json(reportesPsicologicos);
    } catch (error) {
        console.error('Error al obtener reportes psicológicos:', error);
        res.status(500).json({ error: 'Error al obtener reportes psicológicos' });
    }
};

// Función para obtener un reporte psicológico por ID
export const obtenerReportePsicologicoPorId = async (req, res) => {
    try {
        const { id_psicologico } = req.params;
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
    // Validaciones
    await Promise.all(reportePsicologicoValidations.crearReportePsicologicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            nombre,
            apellido,
            lugar_nacimiento,
            fecha_nacimiento,
            nivel_instruccion,
            motivo_consulta,
            sintesis_diagnostica,
            recomendaciones,
            id_estudiante
        } = req.body;

        // Verificar que la conexión SQL está correctamente definida
        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Ejecutar la consulta SQL
        const nuevoReportePsicologico = await req.sql`
            SELECT insertar_reporte_psicologico(
                ${id_estudiante},
                ${nombre},
                ${apellido},
                ${lugar_nacimiento},
                ${fecha_nacimiento},
                ${nivel_instruccion},
                ${motivo_consulta},
                ${sintesis_diagnostica},
                ${recomendaciones}                
            ) as reporte_psicologico;
        `;

        // Verificar que se haya retornado un reporte psicológico válido
        if (!nuevoReportePsicologico.length || !nuevoReportePsicologico[0].reporte_psicologico) {
            throw new Error("Error al guardar el reporte psicológico en la base de datos");
        }

        res.status(201).json(nuevoReportePsicologico[0].reporte_psicologico);
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
            nombre,
            apellido,
            lugar_nacimiento,
            fecha_nacimiento,
            nivel_instruccion,
            motivo_consulta,
            sintesis_diagnostica,
            recomendaciones,
            id_estudiante
        } = req.body;

        const reportePsicologicoEditado = await req.sql`
            SELECT editar_reporte_psicologico(
                ${id_psicologico},
                ${id_estudiante},
                ${nombre},
                ${apellido},
                ${lugar_nacimiento},
                ${fecha_nacimiento},
                ${nivel_instruccion},
                ${motivo_consulta},
                ${sintesis_diagnostica},
                ${recomendaciones}                
            )
        `;

        if (reportePsicologicoEditado.length === 0) {
            return res.status(404).json({ error: 'Reporte psicológico no encontrado' });
        }

        res.json(reportePsicologicoEditado[0]);  // Devuelve el reporte psicológico editado
    } catch (error) {
        console.error('Error al editar reporte psicológico:', error);
        res.status(500).json({ error: 'Error al editar reporte psicológico' });
    }
};

// Función para eliminar un reporte psicológico
export const eliminarReportePsicologico = async (req, res) => {
    try {
        const { id_psicologico } = req.params;

        const reportePsicologicoEliminado = await req.sql`
            SELECT eliminar_reporte_psicologico(${id_psicologico})
        `;

        if (reportePsicologicoEliminado.length === 0) {
            return res.status(404).json({ error: 'Reporte psicológico no encontrado' });
        }

        res.json({ message: 'Reporte psicológico eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar reporte psicológico:', error);
        res.status(500).json({ error: 'Error al eliminar reporte psicológico' });
    }
};