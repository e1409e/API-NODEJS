import { sql } from '../db.js'; // Importa la conexión a la base de datos
import { validationResult } from 'express-validator'; // Para la validación de datos
import { citaValidations } from '../validations/citas.validations.js'; // Importaciones de las validaciones

// Función para obtener todas las citas
export const obtenerTodasLasCitas = async (req, res) => {
    try {
        const citas = await sql`SELECT c.*, CONCAT(e.nombres,' ' ,e.apellidos) as nombres FROM citas c JOIN estudiantes e ON c.id_estudiante = e.id_estudiante;`;
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
        const cita = await sql`SELECT c.*, CONCAT(e.nombres,' ' ,e.apellidos) as nombres FROM citas c JOIN estudiantes e ON c.id_estudiante = e.id_estudiante WHERE id_citas = ${id_citas}`;
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
        // En tu función insertar_cita, p_pendiente tiene DEFAULT 1, así que no necesitas enviarlo aquí
        // a menos que quieras permitir la creación de citas ya "no pendientes"
        const { id_estudiante, fecha_cita, motivo_cita } = req.body; 
        
        // Si quisieras permitir enviar 'pendiente' al crear:
        // const { id_estudiante, fecha_cita, motivo_cita, pendiente } = req.body;
        // const nuevaCita = await sql`SELECT insertar_cita(${id_estudiante}, ${fecha_cita}, ${motivo_cita}, ${pendiente || null}) as cita;`;
        
        const nuevaCita = await sql`
            SELECT insertar_cita(${id_estudiante}, ${fecha_cita}, ${motivo_cita}) as cita;
        `;
        // La función `insertar_cita` devuelve el ID de la nueva cita.
        // Respondemos con el ID insertado y un mensaje de éxito.
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
        // Extrae 'pendiente' del cuerpo de la solicitud
        const { id_estudiante, fecha_cita, motivo_cita, pendiente } = req.body; 

        // Convertir el valor de 'pendiente' a un entero (0 o 1) si es necesario.
        // Si 'pendiente' viene como booleano de Flutter, se puede convertir a 0 o 1.
        // Si ya viene como 0 o 1, no es necesaria la conversión.
        // Asegúrate de que tu frontend envíe 'pendiente' como 0 o 1, o un booleano.
        // Ejemplo si Flutter envía booleano y la BD espera int:
        // const pendienteInt = typeof pendiente === 'boolean' ? (pendiente ? 1 : 0) : pendiente;

        // Si 'pendiente' no es enviado en el body, 'undefined' se convertirá a NULL en SQL
        // gracias a COALESCE en la función `editar_cita`.
        const citaActualizada = await sql`
            SELECT editar_cita(${id_citas}, ${id_estudiante || null}, ${fecha_cita || null}, ${motivo_cita || null}, ${pendiente || null}) as success;
        `;

        // La función editar_cita devuelve un BOOLEAN (FOUND), mapeado a 'success'
        // Responde directamente con el valor booleano o un mensaje de éxito.
        if (citaActualizada.length === 0 || !citaActualizada[0].success) {
            return res.status(404).json({ error: "Cita no encontrada o no se pudo actualizar" });
        }
        
        // Enviar la respuesta booleana "true" o "false" como texto plano
        // Esto es lo que espera tu Flutter al actualizar
        res.send(citaActualizada[0].success.toString()); // Envía "true" o "false" como string
        
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
        // Asumiendo que tienes una función eliminar_cita en tu base de datos
        const citaEliminada = await sql`
            SELECT eliminar_cita(${id_citas}) as success;
        `;

        // La función eliminar_cita debería devolver un BOOLEAN (FOUND)
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
        const { id_citas } = req.params; // Obtenemos el ID de la cita de los parámetros de la URL

        // Utiliza la función editar_cita con pendiente=0 para marcar como realizada
        const result = await sql`
            SELECT editar_cita(${id_citas}, NULL, NULL, NULL, 0) as success; 
        `;

        // Verificamos si se actualizó alguna fila
        if (result.length === 0 || !result[0].success) {
            return res.status(404).json({ error: "Cita no encontrada o ya marcada como realizada" });
        }

        // Devolvemos una respuesta de éxito como cadena "true" para Flutter
        res.send("true"); 

    } catch (error) {
        console.error("Error al marcar la cita como realizada:", error);
        res.status(500).json({ error: "Error al marcar la cita como realizada" });
    }
};