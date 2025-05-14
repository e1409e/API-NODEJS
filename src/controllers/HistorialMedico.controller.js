import { validationResult } from 'express-validator';
import { sql } from '../db.js';  // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { historialMedicoValidations } from '../validations/historialMedico.validations.js'; //  Asegúrate de crear este archivo de validaciones

// Función para obtener todos los historiales médicos
export const obtenerHistorialesMedicos = async (req, res) => {
    try {
        const historialesMedicos = await req.sql`SELECT * FROM historial_medico`;
        res.json(historialesMedicos);
    } catch (error) {
        console.error('Error al obtener historiales médicos:', error);
        res.status(500).json({ error: 'Error al obtener historiales médicos' });
    }
};

// Función para obtener un historial médico por ID
export const obtenerHistorialMedicoPorId = async (req, res) => {
    try {
        const { id_historialmedico } = req.params;
        const historialMedico = await req.sql`
            SELECT * FROM historial_medico WHERE id_historialmedico = ${id_historialmedico}
        `;

        if (historialMedico.length === 0) {
            return res.status(404).json({ error: 'Historial médico no encontrado' });
        }

        res.json(historialMedico[0]);
    } catch (error) {
        console.error('Error al obtener historial médico por ID:', error);
        res.status(500).json({ error: 'Error al obtener historial médico por ID' });
    }
};

// Función para crear un nuevo historial médico
export const crearHistorialMedico = async (req, res) => {
    // Validaciones
    await Promise.all(historialMedicoValidations.crearHistorialMedicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            id_estudiante,
            certificado_conapdis,
            informe_medico,
            tratamiento
        } = req.body;

        // Verificar que la conexión SQL está correctamente definida
        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Ejecutar la consulta SQL
        const nuevoHistorialMedico = await req.sql`
            SELECT insertar_historial_medico(
                ${id_estudiante},
                ${certificado_conapdis},
                ${informe_medico},
                ${tratamiento}
            ) as historial_medico;
        `;

        // Verificar que se haya retornado un historial médico válido
        if (!nuevoHistorialMedico.length || !nuevoHistorialMedico[0].historial_medico) {
            throw new Error("Error al guardar el historial médico en la base de datos");
        }

        res.status(201).json(nuevoHistorialMedico[0].historial_medico);
    } catch (error) {
        console.error("Error al crear historial médico:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Función para editar un historial médico existente
export const editarHistorialMedico = async (req, res) => {
    await Promise.all(historialMedicoValidations.editarHistorialMedicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_historialmedico } = req.params;
        const {
            id_estudiante,
            certificado_conapdis,
            informe_medico,
            tratamiento
        } = req.body;

        const historialMedicoEditado = await req.sql`
            SELECT editar_historial_medico(
                ${id_historialmedico},
                ${id_estudiante},
                ${certificado_conapdis},
                ${informe_medico},
                ${tratamiento}
            )
        `;

        if (historialMedicoEditado.length === 0) {
            return res.status(404).json({ error: 'Historial médico no encontrado' });
        }

        res.json(historialMedicoEditado[0]);  // Devuelve el historial médico editado
    } catch (error) {
        console.error('Error al editar historial médico:', error);
        res.status(500).json({ error: 'Error al editar historial médico' });
    }
};

// Función para eliminar un historial médico
export const eliminarHistorialMedico = async (req, res) => {
    try {
        const { id_historialmedico } = req.params;

        const historialMedicoEliminado = await req.sql`
            SELECT eliminar_historial_medico(${id_historialmedico})
        `;

        if (historialMedicoEliminado.length === 0) {
            return res.status(404).json({ error: 'Historial médico no encontrado' });
        }

        res.json({ message: 'Historial médico eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar historial médico:', error);
        res.status(500).json({ error: 'Error al eliminar historial médico' });
    }
};