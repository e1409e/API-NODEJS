import { validationResult } from 'express-validator';
import { sql } from '../db.js'; //  Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { estudianteValidations } from '../validations/estudiantes.validations.js';

// Función para obtener todos los estudiantes
export const obtenerEstudiantes = async (req, res) => {
    try {
        const estudiantes = await req.sql`SELECT e.id_estudiante, e.nombres, e.apellidos, e.cedula, e.telefono, e.correo ,d.discapacidad, e.fecha_nacimiento, e.observaciones, e.seguimiento, e.fecha_registro FROM estudiantes e LEFT JOIN discapacidades d ON e.discapacidad_id = d.discapacidad_id`;
        res.json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
};

// Función para obtener un estudiante por ID
export const obtenerEstudiantePorId = async (req, res) => {
    try {
        const { id_estudiante } = req.params;
        const estudiante = await req.sql`
            SELECT * FROM estudiantes WHERE id_estudiante = ${id_estudiante}
        `;

        if (estudiante.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        res.json(estudiante[0]);
    } catch (error) {
        console.error('Error al obtener estudiante por ID:', error);
        res.status(500).json({ error: 'Error al obtener estudiante por ID' });
    }
};



// Función para crear un nuevo estudiante
export const crearEstudiante = async (req, res) => {
    // Validaciones
    await Promise.all(estudianteValidations.crearEstudianteValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            nombres,
            apellidos,
            cedula,
            telefono,
            correo,
            discapacidad_id,
            fecha_nacimiento,
            observaciones,
            seguimiento
        } = req.body;

        // Verificar que la conexión SQL está correctamente definida
        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Ejecutar la consulta SQL
        const nuevoEstudiante = await req.sql`
            SELECT guardar_estudiantes(
                ${nombres},
                ${apellidos},
                ${cedula},
                ${telefono},
                ${correo},
                ${discapacidad_id},
                ${fecha_nacimiento}::date,
                ${observaciones},
                ${seguimiento}
            ) as estudiante;
        `;

        // Verificar que se haya retornado un estudiante válido
        if (!nuevoEstudiante.length || !nuevoEstudiante[0].estudiante) {
            throw new Error("Error al guardar el estudiante en la base de datos");
        }

        res.status(201).json(nuevoEstudiante[0].estudiante);
    } catch (error) {
        console.error("Error al crear estudiante:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Función para editar un estudiante existente
export const editarEstudiante = async (req, res) => {
    await Promise.all(estudianteValidations.editarEstudianteValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_estudiante } = req.params;
        const {
            nombres,
            apellidos,
            cedula,
            telefono,
            correo,
            discapacidad_id,
            fecha_nacimiento,
            observaciones,
            seguimiento,
            
        } = req.body;

        const estudianteEditado = await req.sql`
            SELECT editar_estudiante(
                ${id_estudiante},
                ${nombres},
                ${apellidos},
                ${cedula},
                ${telefono},
                ${correo},
                ${discapacidad_id},
                ${fecha_nacimiento},
                ${observaciones},
                ${seguimiento}
            )
        `;

        if (estudianteEditado.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        res.json(estudianteEditado[0]); //  Devuelve el estudiante editado
    } catch (error) {
        console.error('Error al editar estudiante:', error);
        res.status(500).json({ error: 'Error al editar estudiante' });
    }
};

// Función para eliminar un estudiante
export const eliminarEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;

        const estudianteEliminado = await req.sql`
            SELECT eliminar_estudiante(${id_estudiante})
        `;

        if (estudianteEliminado.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        res.json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
};