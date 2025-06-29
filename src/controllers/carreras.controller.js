import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { carrerasValidations } from '../validations/carreras.validations.js';

// Obtener todas las carreras
// Se agrega ORDER BY c.carrera ASC para devolver los registros en orden alfabético
export const obtenerCarreras = async (req, res) => {
    try {
        const carreras = await sql`
            SELECT c.*, f.facultad 
            FROM carreras c 
            JOIN facultades f ON c.id_facultad = f.id_facultad
            ORDER BY c.carrera ASC
        `;
        res.json(carreras);
    } catch (error) {
        console.error('Error al obtener las carreras:', error);
        res.status(500).json({ error: 'Error al obtener las carreras' });
    }
};

// Obtener una carrera por ID
// No es necesario ORDER BY aquí porque solo se busca por ID único
export const obtenerCarreraPorId = async (req, res) => {
    try {
        const { id_carrera } = req.params;
        const carrera = await sql`
            SELECT c.*, f.facultad 
            FROM carreras c 
            JOIN facultades f ON c.id_facultad = f.id_facultad 
            WHERE id_carrera = ${id_carrera}
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

// Crear una nueva carrera
export const crearCarrera = async (req, res) => {
    await Promise.all(carrerasValidations.crearCarreraValidations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { carrera, id_facultad } = req.body;
        const result = await sql`SELECT insertar_carrera(${carrera}, ${id_facultad}) AS id_carrera`;
        res.status(201).json({ id_carrera: result[0].id_carrera, message: 'Carrera creada correctamente' });
    } catch (error) {
        console.error('Error al crear carrera:', error);
        res.status(500).json({ error: 'Error al crear carrera' });
    }
};

// Editar una carrera existente
export const editarCarrera = async (req, res) => {
    await Promise.all(carrerasValidations.editarCarreraValidations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id_carrera } = req.params;
        const { carrera, id_facultad } = req.body;
        const result = await sql`SELECT editar_carrera(${id_carrera}, ${carrera || null}, ${id_facultad || null}) AS success`;
        if (!result[0].success) {
            return res.status(404).json({ error: 'Carrera no encontrada o no se pudo actualizar' });
        }
        res.json({ message: 'Carrera actualizada correctamente' });
    } catch (error) {
        console.error('Error al editar carrera:', error);
        res.status(500).json({ error: 'Error al editar carrera' });
    }
};

// Eliminar una carrera
export const eliminarCarrera = async (req, res) => {
    await Promise.all(carrerasValidations.eliminarCarreraValidations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id_carrera } = req.params;
        const result = await sql`SELECT eliminar_carrera(${id_carrera}) AS success`;
        if (!result[0].success) {
            return res.status(404).json({ error: 'Carrera no encontrada o no se pudo eliminar' });
        }
        res.json({ message: 'Carrera eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar carrera:', error);
        res.status(500).json({ error: 'Error al eliminar carrera' });
    }
};

