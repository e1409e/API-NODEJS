import { validationResult } from 'express-validator'; // Se importa 'validationResult' para manejar los resultados de las validaciones.
import { sql } from '../db.js'; // Se importa el objeto de conexión a la base de datos.

// Se importan las funciones de utilidad para el formateo de cadenas de texto.
import { toCapitalCase, toLowerCase } from '../utilities/formatters.js';

/**
 * @function obtenerEstudiantes
 * @description Obtiene y devuelve una lista de todos los estudiantes, incluyendo información
 * relacionada de tablas como discapacidades, representantes, carreras y facultades.
 * Los resultados son ordenados alfabéticamente por los nombres de los estudiantes.
 * @param {object} req - El objeto de la petición (request) de Express.
 * @param {object} res - El objeto de la respuesta (response) de Express.
 * @returns {void} Envía una respuesta JSON con la lista de estudiantes o un mensaje de error.
 */
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
            ORDER BY e.nombres ASC
        `;
        res.json(estudiantes);
    } catch (error) {
        // Se registra el error en la consola del servidor para depuración.
        console.error('Error al obtener estudiantes:', error);
        // Se envía una respuesta de error 500 (Internal Server Error) al cliente.
        res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
};

/**
 * @function obtenerEstudiantePorId
 * @description Obtiene y devuelve la información detallada de un estudiante específico
 * basándose en su ID, incluyendo datos relacionados de otras tablas.
 * Esta función espera que el 'id_estudiante' haya sido validado previamente
 * en el middleware de rutas.
 * @param {object} req - El objeto de la petición de Express, que contiene 'id_estudiante' en `req.params`.
 * @param {object} res - El objeto de la respuesta de Express.
 * @returns {void} Envía una respuesta JSON con los datos del estudiante o un mensaje de error.
 */
export const obtenerEstudiantePorId = async (req, res) => {
    try {
        const { id_estudiante } = req.params; // Se extrae el ID del estudiante de los parámetros de la URL.
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

        // Si no se encuentra ningún estudiante con el ID proporcionado, se envía un 404.
        if (estudiante.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        // Se envía el primer (y único) resultado como respuesta JSON.
        res.json(estudiante[0]);
    } catch (error) {
        console.error('Error al obtener estudiante por ID:', error);
        res.status(500).json({ error: 'Error al obtener estudiante por ID' });
    }
};

/**
 * @function crearEstudiante
 * @description Crea un nuevo registro de estudiante en la base de datos.
 * Antes de la inserción, los campos de texto relevantes son formateados
 * para asegurar la consistencia de los datos. Se espera que los datos
 * ya hayan sido validados por el middleware de rutas.
 * @param {object} req - El objeto de la petición de Express, que contiene los datos del estudiante en `req.body`.
 * @param {object} res - El objeto de la respuesta de Express.
 * @returns {void} Envía una respuesta JSON con el ID del nuevo estudiante y sus datos formateados.
 */
export const crearEstudiante = async (req, res) => {
    try {
        // Se extraen los datos del cuerpo de la petición. Se usa 'let' para permitir la reasignación tras el formateo.
        let { 
            nombres, apellidos, cedula, telefono, correo, direccion,
            discapacidad_id, fecha_nacimiento, observaciones, seguimiento,
            id_carrera, posee_conapdis, otro_telefono 
        } = req.body;

        // Se aplican las funciones de formateo a los campos de texto pertinentes.
        // Nombres y apellidos se convierten a "Capital Case".
        nombres = toCapitalCase(nombres);
        apellidos = toCapitalCase(apellidos);
        
        // El correo se convierte a minúsculas, solo si está presente.
        if (correo) { 
            correo = toLowerCase(correo);
        }
        
        // La cédula se convierte a mayúsculas y se eliminan espacios extra, asumiendo el formato V/E-XXXX.
        if (cedula) { // Asegúrate de que cedula existe antes de intentar su método
            cedula = cedula.toUpperCase().replace(/\s/g, ''); 
        }

        // Se verifica la disponibilidad del objeto de conexión SQL inyectado en el request.
        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Se llama a la función `insertar_estudiante` de la base de datos para guardar el nuevo registro.
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

        // Se valida que la inserción haya retornado un ID válido.
        if (!nuevoEstudiante.length || nuevoEstudiante[0].id_estudiante === null) {
            throw new Error("Error al guardar el estudiante en la base de datos o ID no retornado");
        }

        // --- Lógica para enriquecer la respuesta con datos de tablas relacionadas ---
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
        // --- Fin de lógica de enriquecimiento ---

        // Se construye el objeto de respuesta final con los datos del estudiante, incluyendo los formateados.
        const responseData = {
            id_estudiante: nuevoEstudiante[0].id_estudiante,
            nombres,
            apellidos,
            cedula,
            telefono,
            correo,
            direccion,
            discapacidad_id,
            fecha_nacimiento: new Date(fecha_nacimiento).toISOString(), // Asegura formato ISO para la fecha
            observaciones,
            seguimiento,
            fecha_registro: new Date().toISOString(), // Se añade timestamp de registro
            fecha_actualizacion: new Date().toISOString(), // Se añade timestamp de actualización
            id_carrera: id_carrera,
            posee_conapdis: posee_conapdis,
            otro_telefono: otro_telefono,
            discapacidad: discapacidadNombre,
            nombre_repre: null, // Si el representante se asocia después, se deja en null aquí
            facultad: facultadData.facultad,
            siglas: facultadData.siglas,
            carrera: carreraNombre
        };

        // Se envía una respuesta de éxito 201 (Created) con los datos del nuevo estudiante.
        res.status(201).json(responseData); 

    } catch (error) {
        console.error("Error al crear estudiante:", error.message);
        // Se envía una respuesta de error 500 si ocurre un problema durante el proceso.
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

/**
 * @function editarEstudiante
 * @description Actualiza un registro de estudiante existente en la base de datos.
 * Los campos de texto que se envían en la petición son formateados
 * antes de la actualización para mantener la consistencia.
 * Esta función espera que los datos, incluyendo el ID del estudiante,
 * hayan sido validados previamente en el middleware de rutas.
 * @param {object} req - El objeto de la petición de Express, con 'id_estudiante' en `req.params`
 * y los datos a actualizar en `req.body`.
 * @param {object} res - El objeto de la respuesta de Express.
 * @returns {void} Envía una respuesta JSON indicando el éxito de la operación.
 */
export const editarEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params; // Se extrae el ID del estudiante a editar.
        let { // Se extraen los datos del cuerpo de la petición.
            nombres, apellidos, cedula, telefono, correo, direccion,
            discapacidad_id, fecha_nacimiento, observaciones, seguimiento,
            id_carrera, posee_conapdis, otro_telefono
        } = req.body;

        // Se aplican las funciones de formateo a los campos de texto SI estos están presentes
        // en la petición de actualización (permitiendo actualizaciones parciales).
        if (nombres !== undefined) {
            nombres = toCapitalCase(nombres);
        }
        if (apellidos !== undefined) {
            apellidos = toCapitalCase(apellidos);
        }
        if (correo !== undefined) {
            correo = toLowerCase(correo);
        }
        if (cedula !== undefined) { 
            cedula = cedula.toUpperCase().replace(/\s/g, '');
        }

        // Se llama a la función `editar_estudiante` de la base de datos para realizar la actualización.
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
            ) as success_edit; 
        `;

        // Se verifica si la función de la base de datos indicó que la edición fue exitosa.
        if (estudianteEditado.length === 0 || estudianteEditado[0].success_edit === false) {
            return res.status(404).json({ error: 'Estudiante no encontrado o no se pudo actualizar' });
        }

        // Se envía una respuesta de éxito 200 (OK) al cliente.
        res.json({ message: 'Estudiante actualizado correctamente' }); 

    } catch (error) {
        console.error('Error al editar estudiante:', error);
        res.status(500).json({ error: 'Error al editar estudiante' });
    }
};

/**
 * @function eliminarEstudiante
 * @description Elimina un registro de estudiante de la base de datos basándose en su ID.
 * Esta función espera que el 'id_estudiante' haya sido validado previamente
 * en el middleware de rutas.
 * @param {object} req - El objeto de la petición de Express, que contiene 'id_estudiante' en `req.params`.
 * @param {object} res - El objeto de la respuesta de Express.
 * @returns {void} Envía una respuesta JSON indicando el éxito de la eliminación.
 */
export const eliminarEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params; // Se extrae el ID del estudiante a eliminar.

        // Se llama a la función `eliminar_estudiante` de la base de datos.
        const estudianteEliminado = await req.sql`
            SELECT eliminar_estudiante(${id_estudiante}) as success
        `;

        // Se verifica si la eliminación fue exitosa (la función devuelve 'true').
        if (!estudianteEliminado.length || estudianteEliminado[0].success === false) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        // Se envía una respuesta de éxito 200 (OK).
        res.json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
};