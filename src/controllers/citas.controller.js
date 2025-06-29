import { sql } from '../db.js'; // Importa la conexión a la base de datos
import { validationResult } from 'express-validator'; // Para la validación de datos
import { citaValidations } from '../validations/citas.validations.js'; // Importaciones de las validaciones

// Función para obtener todas las citas
// Se agrega ORDER BY c.fecha_cita DESC para devolver los registros de mayor a menor por fecha
export const obtenerTodasLasCitas = async (req, res) => {
    try {
        const citas = await sql`
            SELECT c.*, CONCAT(e.nombres,' ',e.apellidos) as nombres 
            FROM citas c 
            JOIN estudiantes e ON c.id_estudiante = e.id_estudiante
            ORDER BY c.fecha_cita DESC
        `;
        res.json(citas);
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        res.status(500).json({ error: "Error al obtener las citas" });
    }
};

// Función para obtener una cita por ID
// No es necesario ORDER BY aquí porque solo se busca por ID único
export const obtenerCitaPorId = async (req, res) => {
    try {
        const { id_citas } = req.params;
        const cita = await sql`
            SELECT c.*, CONCAT(e.nombres,' ',e.apellidos) as nombres 
            FROM citas c 
            JOIN estudiantes e ON c.id_estudiante = e.id_estudiante 
            WHERE id_citas = ${id_citas}
        `;
        if (cita.length === 0) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }
        res.json(cita[0]);
    } catch (error) {
        console.error("Error al obtener la cita:", error);
        res.status(500).json({ error: "Error al obtener la cita" });
    }
};

// Función para crear una nueva cita
export const crearCita = async (req, res) => {
    await Promise.all(citaValidations.crearCitaValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_estudiante, fecha_cita, motivo_cita } = req.body; 
        
        const nuevaCita = await sql`
            SELECT insertar_cita(${id_estudiante}, ${fecha_cita}, ${motivo_cita}) as cita;
        `;
        res.status(201).json({ id_citas: nuevaCita[0].cita, message: "Cita creada correctamente" });
    } catch (error) {
        console.error("Error al crear la cita:", error);
        res.status(500).json({ error: "Error al crear la cita" });
    }
};

// Función para actualizar una cita existente
export const actualizarCita = async (req, res) => {
    await Promise.all(citaValidations.actualizarCitaValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_citas } = req.params;
        const { id_estudiante, fecha_cita, motivo_cita, pendiente } = req.body; 

        const citaActualizada = await sql`
            SELECT editar_cita(${id_citas}, ${id_estudiante || null}, ${fecha_cita || null}, ${motivo_cita || null}, ${pendiente || null}) as success;
        `;

        if (citaActualizada.length === 0 || !citaActualizada[0].success) {
            return res.status(404).json({ error: "Cita no encontrada o no se pudo actualizar" });
        }
        
        res.send(citaActualizada[0].success.toString());
        
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).json({ error: "Error al actualizar la cita" });
    }
};

// Función para eliminar una cita
export const eliminarCita = async (req, res) => {
    await Promise.all(citaValidations.eliminarCitaValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_citas } = req.params;
        const citaEliminada = await sql`
            SELECT eliminar_cita(${id_citas}) as success;
        `;

        if (citaEliminada.length === 0 || !citaEliminada[0].success) {
            return res.status(404).json({ error: "Cita no encontrada o no se pudo eliminar" });
        }
        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        res.status(500).json({ error: "Error al eliminar la cita" });
    }
};

// Función para marcar una cita como realizada (pendiente = 0)
export const marcarCitaComoRealizada = async (req, res) => {
    try {
        const { id_citas } = req.params;

        const result = await sql`
            SELECT editar_cita(${id_citas}, NULL, NULL, NULL, 0) as success; 
        `;

        if (result.length === 0 || !result[0].success) {
            return res.status(404).json({ error: "Cita no encontrada o ya marcada como realizada" });
        }

        res.send("true"); 

    } catch (error) {
        console.error("Error al marcar la cita como realizada:", error);
        res.status(500).json({ error: "Error al marcar la cita como realizada" });
    }
};