import { validationResult } from 'express-validator';
import { sql } from '../db.js';  // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { universidadValidations } from '../validations/universidad.validations.js'; //  Asegúrate de crear este archivo de validaciones

// Función para obtener todos los registros de universidad
export const obtenerUniversidades = async (req, res) => {
    try {
        const universidades = await req.sql`SELECT * FROM universidad`;
        res.json(universidades);
    } catch (error) {
        console.error('Error al obtener registros de universidad:', error);
        res.status(500).json({ error: 'Error al obtener registros de universidad' });
    }
};

// Función para obtener un registro de universidad por ID
export const obtenerUniversidadPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const universidad = await req.sql`
            SELECT * FROM universidad WHERE id = ${id}
        `;

        if (universidad.length === 0) {
            return res.status(404).json({ error: 'Registro de universidad no encontrado' });
        }

        res.json(universidad[0]);
    } catch (error) {
        console.error('Error al obtener registro de universidad por ID:', error);
        res.status(500).json({ error: 'Error al obtener registro de universidad por ID' });
    }
};

// Función para crear un nuevo registro de universidad
export const crearUniversidad = async (req, res) => {
    // Validaciones
    await Promise.all(universidadValidations.crearUniversidadValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            id_estudiante,
            id_carrera,
            id_facultad,
            id_periodo
        } = req.body;

        // Verificar que la conexión SQL está correctamente definida
        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Ejecutar la consulta SQL
        const nuevaUniversidad = await req.sql`
            SELECT insertar_universidad(
                ${id_estudiante},
                ${id_carrera},
                ${id_facultad},
                ${id_periodo}
            ) as universidad;
        `;

        // Verificar que se haya retornado un registro válido
        if (!nuevaUniversidad.length || !nuevaUniversidad[0].universidad) {
            throw new Error("Error al guardar el registro de universidad en la base de datos");
        }

        res.status(201).json(nuevaUniversidad[0].universidad);
    } catch (error) {
        console.error("Error al crear registro de universidad:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Función para editar un registro de universidad existente
export const editarUniversidad = async (req, res) => {
    await Promise.all(universidadValidations.editarUniversidadValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const {
            id_estudiante,
            id_carrera,
            id_facultad,
            id_periodo
        } = req.body;

        const universidadEditada = await req.sql`
            SELECT editar_universidad(
                ${id},
                ${id_estudiante},
                ${id_carrera},
                ${id_facultad},
                ${id_periodo}
            )
        `;

        if (universidadEditada.length === 0) {
            return res.status(404).json({ error: 'Registro de universidad no encontrado' });
        }

        res.json(universidadEditada[0]);  // Devuelve el registro editado
    } catch (error) {
        console.error('Error al editar registro de universidad:', error);
        res.status(500).json({ error: 'Error al editar registro de universidad' });
    }
};

// Función para eliminar un registro de universidad
export const eliminarUniversidad = async (req, res) => {
    try {
        const { id } = req.params;

        const universidadEliminada = await req.sql`
            SELECT eliminar_universidad(${id})
        `;

        if (universidadEliminada.length === 0) {
            return res.status(404).json({ error: 'Registro de universidad no encontrado' });
        }

        res.json({ message: 'Registro de universidad eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar registro de universidad:', error);
        res.status(500).json({ error: 'Error al eliminar registro de universidad' });
    }
};