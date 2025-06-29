import { validationResult } from 'express-validator';
import { sql } from '../db.js';  // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { discapacidadValidations } from '../validations/discapacidades.validations.js'; //  Asegúrate de crear este archivo de validaciones

// Función para obtener todas las discapacidades
// Se agrega ORDER BY discapacidad ASC para devolver los registros en orden alfabético
export const obtenerDiscapacidades = async (req, res) => {
    try {
        const discapacidades = await req.sql`
            SELECT * FROM discapacidades
            ORDER BY discapacidad ASC
        `;
        res.json(discapacidades);
    } catch (error) {
        console.error('Error al obtener discapacidades:', error);
        res.status(500).json({ error: 'Error al obtener discapacidades' });
    }
};

// Función para obtener una discapacidad por ID
// No es necesario ORDER BY aquí porque solo se busca por ID único
export const obtenerDiscapacidadPorId = async (req, res) => {
    try {
        const { discapacidad_id } = req.params;
        const discapacidad = await req.sql`
            SELECT * FROM discapacidades WHERE discapacidad_id = ${discapacidad_id}
        `;

        if (discapacidad.length === 0) {
            return res.status(404).json({ error: 'Discapacidad no encontrada' });
        }

        res.json(discapacidad[0]);
    } catch (error) {
        console.error('Error al obtener discapacidad por ID:', error);
        res.status(500).json({ error: 'Error al obtener discapacidad por ID' });
    }
};

// Función para crear una nueva discapacidad
export const crearDiscapacidad = async (req, res) => {
    // Validaciones
    await Promise.all(discapacidadValidations.crearDiscapacidadValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { discapacidad } = req.body;

        // Verificar que la conexión SQL está correctamente definida
        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Ejecutar la consulta SQL
        const nuevaDiscapacidad = await req.sql`
            SELECT insertar_discapacidad(
                ${discapacidad}
            ) as discapacidad;
        `;

        // Verificar que se haya retornado una discapacidad válida
        if (!nuevaDiscapacidad.length || !nuevaDiscapacidad[0].discapacidad) {
            throw new Error("Error al guardar la discapacidad en la base de datos");
        }

        res.status(201).json(nuevaDiscapacidad[0].discapacidad);
    } catch (error) {
        console.error("Error al crear discapacidad:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Función para editar una discapacidad existente
export const editarDiscapacidad = async (req, res) => {
    await Promise.all(discapacidadValidations.editarDiscapacidadValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { discapacidad_id } = req.params;
        const { discapacidad } = req.body;

        const discapacidadEditada = await req.sql`
            SELECT editar_discapacidad(
                ${discapacidad_id},
                ${discapacidad}
            ) as success
        `;

        if (!discapacidadEditada.length || !discapacidadEditada[0].success) {
            return res.status(404).json({ error: 'Discapacidad no encontrada o no se pudo actualizar' });
        }

        res.json({ message: 'Discapacidad actualizada correctamente' });
    } catch (error) {
        console.error('Error al editar discapacidad:', error);
        res.status(500).json({ error: 'Error al editar discapacidad' });
    }
};

// Función para eliminar una discapacidad
export const eliminarDiscapacidad = async (req, res) => {
    try {
        const { discapacidad_id } = req.params;

        const discapacidadEliminada = await req.sql`
            SELECT eliminar_discapacidad(${discapacidad_id}) as success
        `;

        if (!discapacidadEliminada.length || !discapacidadEliminada[0].success) {
            return res.status(404).json({ error: 'Discapacidad no encontrada o no se pudo eliminar' });
        }

        res.json({ message: 'Discapacidad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar discapacidad:', error);
        res.status(500).json({ error: 'Error al eliminar discapacidad' });
    }
};