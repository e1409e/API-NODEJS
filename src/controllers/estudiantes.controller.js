import { validationResult } from 'express-validator';
import { sql } from '../db.js'; // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { estudianteValidations } from '../validations/estudiantes.validations.js'; // Asumo que estas validaciones también se actualizarán

// Función para obtener todos los estudiantes
export const obtenerEstudiantes = async (req, res) => {
    try {
        
        const estudiantes = await req.sql`
            SELECT 
                e.*, 
                d.discapacidad,
                r.nombre_repre,
                f.facultad, f.siglas,
                ca.carrera
            FROM estudiantes e 
            LEFT JOIN discapacidades d ON e.discapacidad_id = d.discapacidad_id
            LEFT JOIN representantes r ON r.id_estudiante = e.id_estudiante
            LEFT JOIN carreras ca ON e.id_carrera = ca.id_carrera
            LEFT JOIN facultades f ON f.id_facultad = ca.id_facultad
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
                e.*, 
                d.discapacidad,
                r.nombre_repre,
                f.facultad, f.siglas,
                ca.carrera
            FROM estudiantes e 
            LEFT JOIN discapacidades d ON e.discapacidad_id = d.discapacidad_id
            LEFT JOIN representantes r ON r.id_estudiante = e.id_estudiante
            LEFT JOIN carreras ca ON e.id_carrera = ca.id_carrera
            LEFT JOIN facultades f ON f.id_facultad = ca.id_facultad
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
    // Asegúrate de que estudianteValidations.crearEstudianteValidations esté actualizado para los nuevos campos
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
            direccion,
            discapacidad_id,
            fecha_nacimiento,
            observaciones,
            seguimiento,
            id_carrera, 
            posee_conapdis, 
            otro_telefono 
        } = req.body;

        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

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
                ${direccion},
                ${id_carrera},
                ${posee_conapdis},
                ${otro_telefono}
            ) as id_estudiante; 
        `;

        if (!nuevoEstudiante.length || nuevoEstudiante[0].id_estudiante === null) {
            throw new Error("Error al guardar el estudiante en la base de datos o ID no retornado");
        }

        // Recuperar el nombre de la discapacidad, facultad y carrera si es crítico para la respuesta inmediata
        let discapacidadNombre = null;
        if (discapacidad_id) {
            const disc = await req.sql`SELECT discapacidad FROM discapacidades WHERE discapacidad_id = ${discapacidad_id}`;
            if (disc.length > 0) discapacidadNombre = disc[0].discapacidad;
        }

        let facultadData = { facultad: null, siglas: null };
        let carreraNombre = null;
        if (id_carrera) {
            const carr = await req.sql`SELECT carrera, id_facultad FROM carreras WHERE id_carrera = ${id_carrera}`;
            if (carr.length > 0) {
                carreraNombre = carr[0].carrera;
                if (carr[0].id_facultad) {
                    const fac = await req.sql`SELECT facultad, siglas FROM facultades WHERE id_facultad = ${carr[0].id_facultad}`;
                    if (fac.length > 0) {
                        facultadData = { facultad: fac[0].facultad, siglas: fac[0].siglas };
                    }
                }
            }
        }


        const responseData = {
            id_estudiante: nuevoEstudiante[0].id_estudiante,
            nombres,
            apellidos,
            cedula,
            telefono,
            correo,
            direccion,
            discapacidad_id,
            fecha_nacimiento: new Date(fecha_nacimiento).toISOString(), // Asegurarse de que el formato sea ISO
            observaciones,
            seguimiento,
            fecha_registro: new Date().toISOString(), 
            fecha_actualizacion: new Date().toISOString(),
            id_carrera: id_carrera,
            posee_conapdis: posee_conapdis,
            otro_telefono: otro_telefono,
            discapacidad: discapacidadNombre, // Incluir el nombre de la discapacidad
            nombre_repre: null, // Asumimos que no hay representante al crear, o se manejaría en otro endpoint
            facultad: facultadData.facultad,
            siglas: facultadData.siglas,
            carrera: carreraNombre
        };

        res.status(201).json(responseData); 

    } catch (error) {
        console.error("Error al crear estudiante:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Función para editar un estudiante existente
export const editarEstudiante = async (req, res) => {
    // Asegúrate de que estudianteValidations.editarEstudianteValidations esté actualizado para los nuevos campos
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
            direccion,
            discapacidad_id,
            fecha_nacimiento,
            observaciones,
            seguimiento,
            id_carrera, 
            posee_conapdis, 
            otro_telefono
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
                ${seguimiento},
                ${direccion},
                ${id_carrera},
                ${posee_conapdis},
                ${otro_telefono}
            ) as editar_estudiante; 
        `;

        if (estudianteEditado.length === 0 || estudianteEditado[0].editar_estudiante === false) {
            return res.status(404).json({ error: 'Estudiante no encontrado o no se pudo actualizar' });
        }

        // Opcional: Si quieres devolver el objeto completo actualizado como en crearEstudiante,
        // tendrías que volver a hacer un SELECT * FROM estudiantes WHERE id_estudiante = ${id_estudiante}
        // o construir el objeto con los datos enviados en el body.
        // Por ahora, devolvemos solo el indicador de éxito.
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