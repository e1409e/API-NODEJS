import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { historialMedicoValidations } from '../validations/historialMedico.validations.js';
import { uploadFileToDrive, getOrCreateFolder } from '../utils/googleDrive.js';
import fs from 'fs';

// Helper para subir y limpiar archivos
async function subirArchivoDriveYLimpiar(file, folderId) {
    if (!file) return null;
    const driveFile = await uploadFileToDrive({
        filePath: file.path,
        fileName: file.originalname,
        mimeType: file.mimetype,
        folderId
    });
    fs.unlinkSync(file.path);
    return driveFile.webViewLink;
}

// Obtener todos los historiales médicos
export const obtenerHistorialesMedicos = async (req, res) => {
    try {
        const historialesMedicos = await sql`
            SELECT 
                h.*, 
                e.nombres AS nombre_estudiante, 
                e.apellidos AS apellido_estudiante, 
                e.cedula AS cedula_estudiante
            FROM historial_medico h
            JOIN estudiantes e ON h.id_estudiante = e.id_estudiante
        `;
        res.json(historialesMedicos);
    } catch (error) {
        console.error('Error al obtener historiales médicos:', error);
        res.status(500).json({ error: 'Error al obtener historiales médicos' });
    }
};

// Obtener un historial médico por ID
export const obtenerHistorialMedicoPorId = async (req, res) => {
    try {
        const { id_historialmedico } = req.params;
        const historialMedico = await sql`
            SELECT 
                h.*, 
                e.nombres AS nombre_estudiante, 
                e.apellidos AS apellido_estudiante, 
                e.cedula AS cedula_estudiante
            FROM historial_medico h
            JOIN estudiantes e ON h.id_estudiante = e.id_estudiante
            WHERE h.id_historialmedico = ${id_historialmedico}
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

// Obtener historial médico por id_estudiante
export const obtenerHistorialMedicoPorEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;
        const historialMedico = await sql`
            SELECT 
                h.*, 
                e.nombres AS nombre_estudiante, 
                e.apellidos AS apellido_estudiante, 
                e.cedula AS cedula_estudiante
            FROM historial_medico h
            JOIN estudiantes e ON h.id_estudiante = e.id_estudiante
            WHERE h.id_estudiante = ${id_estudiante}
        `;

        if (historialMedico.length === 0) {
            return res.status(404).json({ error: 'Historial médico no encontrado' });
        }

        res.json(historialMedico[0]);
    } catch (error) {
        console.error('Error al obtener historial médico por estudiante:', error);
        res.status(500).json({ error: 'Error al obtener historial médico por estudiante' });
    }
};

// Crear un nuevo historial médico
export const crearHistorialMedico = async (req, res) => {
    // Validaciones
    await Promise.all(historialMedicoValidations.crearHistorialMedicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_estudiante } = req.body;
        // Espera los archivos en req.files con los nombres exactos de los campos
        // Por ejemplo: certificado_conapdis, informe_medico, tratamiento
        const files = req.files || {};

        // Crea una carpeta por estudiante en Drive
        const folderId = await getOrCreateFolder(`estudiante_${id_estudiante}`);

        // Sube cada archivo y guarda la URL
        const certificado_conapdis = await subirArchivoDriveYLimpiar(files.certificado_conapdis?.[0], folderId);
        const informe_medico = await subirArchivoDriveYLimpiar(files.informe_medico?.[0], folderId);
        const tratamiento = await subirArchivoDriveYLimpiar(files.tratamiento?.[0], folderId);

        // Inserta en la base de datos
        const nuevoHistorialMedico = await sql`
            SELECT insertar_historial_medico(
                ${id_estudiante},
                ${certificado_conapdis},
                ${informe_medico},
                ${tratamiento}
            ) as id_historialmedico;
        `;

        if (!nuevoHistorialMedico.length || nuevoHistorialMedico[0].id_historialmedico === null) {
            throw new Error("Error al guardar el historial médico en la base de datos");
        }

        // Obtener los datos del estudiante para la respuesta
        const estudiante = await sql`
            SELECT nombres AS nombre_estudiante, apellidos AS apellido_estudiante, cedula AS cedula_estudiante
            FROM estudiantes
            WHERE id_estudiante = ${id_estudiante}
        `;

        res.status(201).json({
            id_historialmedico: nuevoHistorialMedico[0].id_historialmedico,
            id_estudiante,
            certificado_conapdis,
            informe_medico,
            tratamiento,
            ...estudiante[0]
        });
    } catch (error) {
        console.error("Error al crear historial médico:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Editar un historial médico existente
export const editarHistorialMedico = async (req, res) => {
    await Promise.all(historialMedicoValidations.editarHistorialMedicoValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_historialmedico } = req.params;
        const { id_estudiante } = req.body;
        const files = req.files || {};

        // Crea una carpeta por estudiante en Drive
        const folderId = await getOrCreateFolder(`estudiante_${id_estudiante}`);

        // Sube cada archivo y guarda la URL
        const certificado_conapdis = await subirArchivoDriveYLimpiar(files.certificado_conapdis?.[0], folderId);
        const informe_medico = await subirArchivoDriveYLimpiar(files.informe_medico?.[0], folderId);
        const tratamiento = await subirArchivoDriveYLimpiar(files.tratamiento?.[0], folderId);

        const historialMedicoEditado = await sql`
            SELECT editar_historial_medico(
                ${id_historialmedico},
                ${id_estudiante},
                ${certificado_conapdis},
                ${informe_medico},
                ${tratamiento}
            ) AS success;
        `;

        if (!historialMedicoEditado.length || !historialMedicoEditado[0].success) {
            return res.status(404).json({ error: 'Historial médico no encontrado' });
        }

        // Obtener los datos del estudiante para la respuesta
        const estudiante = await sql`
            SELECT nombres AS nombre_estudiante, apellidos AS apellido_estudiante, cedula AS cedula_estudiante
            FROM estudiantes
            WHERE id_estudiante = ${id_estudiante}
        `;

        res.json({
            id_historialmedico: Number(id_historialmedico),
            id_estudiante,
            certificado_conapdis,
            informe_medico,
            tratamiento,
            ...estudiante[0]
        });
    } catch (error) {
        console.error('Error al editar historial médico:', error);
        res.status(500).json({ error: 'Error al editar historial médico' });
    }
};

// Eliminar un historial médico
export const eliminarHistorialMedico = async (req, res) => {
    try {
        const { id_historialmedico } = req.params;

        const historialMedicoEliminado = await sql`
            SELECT eliminar_historial_medico(${id_historialmedico}) AS success
        `;

        if (!historialMedicoEliminado.length || !historialMedicoEliminado[0].success) {
            return res.status(404).json({ error: 'Historial médico no encontrado' });
        }

        res.json({ message: 'Historial médico eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar historial médico:', error);
        res.status(500).json({ error: 'Error al eliminar historial médico' });
    }
};