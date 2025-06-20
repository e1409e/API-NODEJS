import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { incidenciasValidations } from '../validations/incidencias.validations.js';

// Obtener todas las incidencias con nombre del estudiante
export const obtenerIncidencias = async (req, res) => {
    try {
        const incidencias = await sql`
            SELECT 
                i.*, 
                e.nombres AS nombre_estudiante, 
                e.apellidos AS apellido_estudiante, 
                e.cedula AS cedula_estudiante
            FROM incidencias i
            JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
        `;
        res.json(incidencias);
    } catch (error) {
        console.error('Error al obtener incidencias:', error);
        res.status(500).json({ error: 'Error al obtener incidencias' });
    }
};

// Obtener una incidencia por ID
export const obtenerIncidenciaPorId = async (req, res) => {
    try {
        const { id_incidencia } = req.params;
        const incidencia = await sql`
            SELECT 
                i.*, 
                e.nombres AS nombre_estudiante, 
                e.apellidos AS apellido_estudiante, 
                e.cedula AS cedula_estudiante
            FROM incidencias i
            JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
            WHERE i.id_incidencia = ${id_incidencia}
        `;

        if (incidencia.length === 0) {
            return res.status(404).json({ error: 'Incidencia no encontrada' });
        }

        res.json(incidencia[0]);
    } catch (error) {
        console.error('Error al obtener incidencia por ID:', error);
        res.status(500).json({ error: 'Error al obtener incidencia por ID' });
    }
};

// Obtener incidencias por ID de estudiante
export const obtenerIncidenciasPorEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;
        const incidencias = await sql`
            SELECT 
                i.*, 
                e.nombres AS nombre_estudiante, 
                e.apellidos AS apellido_estudiante, 
                e.cedula AS cedula_estudiante
            FROM incidencias i
            JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
            WHERE i.id_estudiante = ${id_estudiante}
        `;

        if (incidencias.length === 0) {
            return res.json([]); // Si no hay incidencias, devolver un array vacío
        }

        res.json(incidencias);
    } catch (error) {
        console.error('Error al obtener incidencias por estudiante:', error);
        res.status(500).json({ error: 'Error al obtener incidencias por estudiante' });
    }
};

// Función para crear una nueva incidencia
export const crearIncidencia = async (req, res) => {
    // Validaciones
    await Promise.all(incidenciasValidations.crearIncidenciaValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            id_estudiante,
            hora_incidente,
            fecha_incidente,
            lugar_incidente,
            descripcion_incidente,
            acuerdos,
            observaciones
        } = req.body;

        // Verificar que la conexión SQL está correctamente definida
        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Ejecutar la consulta SQL
        const nuevaIncidencia = await req.sql`
            SELECT insertar_incidencia(
                ${id_estudiante},
                ${hora_incidente},
                ${fecha_incidente},
                ${lugar_incidente},
                ${descripcion_incidente},
                ${acuerdos},
                ${observaciones}
            ) as incidencia;
        `;

        // Verificar que se haya retornado una incidencia válida
        if (!nuevaIncidencia.length || !nuevaIncidencia[0].incidencia) {
            throw new Error("Error al guardar la incidencia en la base de datos");
        }

        res.status(201).json(nuevaIncidencia[0].incidencia);
    } catch (error) {
        console.error("Error al crear incidencia:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Función para editar una incidencia existente
export const editarIncidencia = async (req, res) => {
    await Promise.all(incidenciasValidations.editarIncidenciaValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_incidencia } = req.params;
        const {
            id_estudiante,
            hora_incidente,
            fecha_incidente,
            lugar_incidente,
            descripcion_incidente,
            acuerdos,
            observaciones
        } = req.body;

        const incidenciaEditada = await req.sql`
            SELECT editar_incidencia(
                ${id_incidencia},
                ${id_estudiante},
                ${hora_incidente},
                ${fecha_incidente},
                ${lugar_incidente},
                ${descripcion_incidente},
                ${acuerdos},
                ${observaciones}
            )
        `;

        if (incidenciaEditada.length === 0) {
            return res.status(404).json({ error: 'Incidencia no encontrada' });
        }

        res.json(incidenciaEditada[0]);  // Devuelve la incidencia editada
    } catch (error) {
        console.error('Error al editar incidencia:', error);
        res.status(500).json({ error: 'Error al editar incidencia' });
    }
};

// Función para eliminar una incidencia
export const eliminarIncidencia = async (req, res) => {
    try {
        const { id_incidencia } = req.params;

        const incidenciaEliminada = await req.sql`
            SELECT eliminar_incidencia(${id_incidencia})
        `;

        if (incidenciaEliminada.length === 0) {
            return res.status(404).json({ error: 'Incidencia no encontrada' });
        }

        res.json({ message: 'Incidencia eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar incidencia:', error);
        res.status(500).json({ error: 'Error al eliminar incidencia' });
    }
};