import { validationResult } from 'express-validator';
import { sql } from '../db.js'; // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { estudianteValidations } from '../validations/estudiantes.validations.js';

// Función para obtener todos los estudiantes
export const obtenerEstudiantes = async (req, res) => {
    try {
        // CORREGIDO: Añadir LEFT JOIN para obtener el nombre de la discapacidad
        const estudiantes = await req.sql`
            SELECT 
                e.id_estudiante, 
                e.nombres, 
                e.apellidos, 
                e.cedula, 
                e.telefono, 
                e.correo, 
                e.direccion, -- Asegúrate de que este campo está en la tabla
                e.discapacidad_id, 
                d.discapacidad, -- Este es el nombre de la discapacidad desde la tabla 'discapacidades'
                e.fecha_nacimiento, 
                e.observaciones, 
                e.seguimiento, 
                e.fecha_registro 
            FROM estudiantes e 
            LEFT JOIN discapacidades d ON e.discapacidad_id = d.discapacidad_id
        `;
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
        // CORREGIDO: Añadir LEFT JOIN para obtener el nombre de la discapacidad
        const estudiante = await req.sql`
            SELECT 
                e.id_estudiante, 
                e.nombres, 
                e.apellidos, 
                e.cedula, 
                e.telefono, 
                e.correo, 
                e.direccion, -- Asegúrate de que este campo está en la tabla
                e.discapacidad_id, 
                d.discapacidad, -- Este es el nombre de la discapacidad desde la tabla 'discapacidades'
                e.fecha_nacimiento, 
                e.observaciones, 
                e.seguimiento, 
                e.fecha_registro 
            FROM estudiantes e 
            LEFT JOIN discapacidades d ON e.discapacidad_id = d.discapacidad_id
            WHERE e.id_estudiante = ${id_estudiante}
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
            direccion, // Campo nuevo
            discapacidad_id,
            fecha_nacimiento,
            observaciones,
            seguimiento
        } = req.body;

        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // CORREGIDO: Usar el nombre de la función SQL correcta 'insertar_estudiante'
        const nuevoEstudiante = await req.sql`
            SELECT insertar_estudiante(
                ${nombres},
                ${apellidos},
                ${cedula},
                ${telefono},
                ${correo},
                ${discapacidad_id},
                ${fecha_nacimiento}::date,
                ${observaciones},
                ${seguimiento},
                ${direccion} -- Pasar el campo direccion
            ) as id_estudiante; -- La función devuelve el ID directamente
        `;

        if (!nuevoEstudiante.length || nuevoEstudiante[0].id_estudiante === null) {
            throw new Error("Error al guardar el estudiante en la base de datos o ID no retornado");
        }

        // Si la función SQL devuelve directamente el ID, la respuesta será solo el ID.
        // Tu frontend espera un objeto Estudiante, por lo que puedes construirlo aquí
        // o ajustarlo en el frontend. Para que Flutter lo reciba como un Estudiante:
        const responseData = {
            id_estudiante: nuevoEstudiante[0].id_estudiante,
            nombres,
            apellidos,
            cedula,
            telefono,
            correo,
            direccion, // Incluir para que el frontend lo tenga
            discapacidad_id,
            fecha_nacimiento,
            observaciones,
            seguimiento,
            // Asumiendo que fecha_registro y fecha_actualizacion son generadas por la DB
            fecha_registro: new Date().toISOString(), 
            fecha_actualizacion: new Date().toISOString(),
            // Y el nombre de la discapacidad si lo necesitas inmediatamente
            discapacidad: null // O podrías buscarlo si es crítico para la respuesta
        };

        res.status(201).json(responseData); // Devolvemos el objeto que Flutter espera

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
            direccion, // Campo nuevo
            discapacidad_id,
            fecha_nacimiento,
            observaciones,
            seguimiento,
        } = req.body;

        // CORREGIDO: Asegurarse de que fecha_nacimiento se pasa como DATE si tu función lo espera así
        // Si fecha_nacimiento es un string, el backend de postgres lo convierte con ::date
        // pero si ya es un objeto Date en JS, puede que necesites formatearlo si el driver SQL lo requiere.
        // Aquí lo pasamos directamente, asumiendo que el driver lo maneja.

        // CORREGIDO: El nombre del campo que retorna tu función SQL es 'editar_estudiante' (boolean)
        const estudianteEditado = await req.sql`
            SELECT editar_estudiante(
                ${id_estudiante},
                ${nombres},
                ${apellidos},
                ${cedula},
                ${telefono},
                ${correo},
                ${discapacidad_id},
                ${fecha_nacimiento}, -- Asegúrate de que el tipo de dato sea compatible con DATE en SQL
                ${observaciones},
                ${seguimiento},
                ${direccion} -- Pasar el campo direccion
            ) as editar_estudiante; -- <-- Nombre del alias para el valor de retorno
        `;

        if (estudianteEditado.length === 0 || estudianteEditado[0].editar_estudiante === false) {
            return res.status(404).json({ error: 'Estudiante no encontrado o no se pudo actualizar' });
        }

        // Si la función SQL devuelve un booleano `true` al editar,
        // devolvemos el formato que tu frontend espera para la actualización exitosa:
        res.json({ editar_estudiante: true }); 

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