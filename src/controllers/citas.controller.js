import { sql } from '../db.js'; // Importa la conexión a la base de datos
import { validationResult } from 'express-validator'; // Para la validación de datos
import { citaValidations } from '../validations/citas.validations.js'; // Importaciones de las validaciones

// Función para obtener todas las citas
export const obtenerTodasLasCitas = async (req, res) => {
    try {
        const citas = await sql`SELECT * FROM citas`;
        res.json(citas);
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        res.status(500).json({ error: "Error al obtener las citas" });
    }
};

// Función para obtener una cita por ID
export const obtenerCitaPorId = async (req, res) => {
    try {
        const { id_citas } = req.params;
        const cita = await sql`SELECT * FROM citas WHERE id_citas = ${id_citas}`;
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
        res.status(201).json(nuevaCita[0].cita);
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
        const { id_estudiante, fecha_cita, motivo_cita } = req.body;
        const citaActualizada = await sql`
            SELECT editar_cita(${id_citas}, ${id_estudiante}, ${fecha_cita}, ${motivo_cita}) as cita;
        `;
        if (!citaActualizada[0].cita) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }
        res.json(citaActualizada[0].cita);
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
            SELECT eliminar_cita(${id_citas}) as cita;
        `;
        if (!citaEliminada[0].cita) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }
        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        res.status(500).json({ error: "Error al eliminar la cita" });
    }
};