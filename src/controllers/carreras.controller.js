import { validationResult } from 'express-validator';
import { sql } from '../db.js'; // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { carrerasValidations } from '../validations/carreras.validations.js';

// Función para obtener todas las carreras
export const obtenerCarreras = async (req, res) => {
    try {
        const carreras = await req.sql`
            SELECT  ca.* FROM carreras ca 
        `;
        res.json(carreras);
    } catch (error) {
        console.error('Error al obtener las carreras:', error);
        res.status(500).json({ error: 'Error al obtener las carreras' });
    }
};

// Función para obtener carreras por ID
export const obtenerCarreraPorId = async (req, res) => {
    try {
        const { id_carrera } = req.params;
        const carrera = await req.sql`
            SELECT  ca.* FROM carreras ca
            WHERE ca.id_carrera = ${id_carrera}
        `;

        if (carrera.length === 0) {
            return res.status(404).json({ error: 'Carrera no encontrada' });
        }

        res.json(carrera[0]);
    } catch (error) {
        console.error('Error al obtener carrera por ID:', error);
        res.status(500).json({ error: 'Error al obtener carrera por ID' });
    }
};

