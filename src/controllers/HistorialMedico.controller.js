/**
 * @file Este archivo contiene los controladores para la gestión del historial médico.
 * @description Implementa la lógica de negocio para obtener, crear, actualizar y eliminar
 * registros de historial médico, interactuando con la base de datos y utilizando
 * las validaciones definidas para asegurar la integridad de los datos.
 * @author Eric
 * @version 1.0.0
 * @module controllers/historialMedico.controller
 * @see {@link module:validations/historialMedico.validations} Para las reglas de validación de datos.
 * @see {@link module:db} Para la conexión a la base de datos.
 */

import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { historialMedicoValidations } from '../validations/historialMedico.validations.js';

/**
 * @description Obtiene todos los historiales médicos registrados en el sistema.
 * Realiza una unión con la tabla de estudiantes para incluir el nombre completo y la cédula
 * del estudiante asociado a cada historial.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de historial médico o un mensaje de error.
 * @method GET
 * @route /historial_medico
 */
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

/**
 * @description Obtiene un historial médico específico por su ID.
 * Incluye el nombre completo y la cédula del estudiante asociado.
 * Antes de la consulta, valida el `id_historialmedico` del parámetro.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_historialmedico`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de historial médico o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /historial_medico/:id_historialmedico
 */
export const obtenerHistorialMedicoPorId = async (req, res) => {
  // Ejecuta la validación del parámetro id_historialmedico
  await Promise.all(historialMedicoValidations.editarHistorialMedicoValidations.filter(v => v.builder.fields.includes('id_historialmedico')).map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

/**
 * @description Obtiene el historial médico de un estudiante específico por su ID de estudiante.
 * Incluye el nombre completo y la cédula del estudiante asociado.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_estudiante`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de historial médico o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /historial_medico/estudiante/:id_estudiante
 */
export const obtenerHistorialMedicoPorEstudiante = async (req, res) => {
  // Nota: No hay una validación específica en historialMedicoValidations para `id_estudiante` en params.
  // Podrías añadirla si es necesario, o confiar en que el ID ya fue validado en la ruta si viene de otro contexto.
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
      return res.status(404).json({ error: 'Historial médico no encontrado para este estudiante' });
    }

    res.json(historialMedico[0]);
  } catch (error) {
    console.error('Error al obtener historial médico por estudiante:', error);
    res.status(500).json({ error: 'Error al obtener historial médico por estudiante' });
  }
};

/**
 * @description Crea un nuevo registro de historial médico en la base de datos.
 * Aplica las validaciones definidas en `historialMedicoValidations.crearHistorialMedicoValidations`
 * para asegurar la integridad de los datos recibidos.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.body.id_estudiante`, `req.body.certificado_conapdis` (opcional), `req.body.informe_medico` (opcional), `req.body.tratamiento` (opcional).
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con el ID del historial médico creado y los datos asociados, o con errores de validación/servidor.
 * @method POST
 * @route /historial_medico
 */
export const crearHistorialMedico = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la creación de historial médico.
  await Promise.all(historialMedicoValidations.crearHistorialMedicoValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_estudiante, certificado_conapdis, informe_medico, tratamiento } = req.body;

    // Llama a una función almacenada en la base de datos para insertar el nuevo historial médico.
    const nuevoHistorialMedico = await sql`
      SELECT insertar_historial_medico(
        ${id_estudiante},
        ${certificado_conapdis || null},
        ${informe_medico || null},
        ${tratamiento || null}
      ) as id_historialmedico;
    `;

    // Verifica si la inserción fue exitosa y se devolvió un ID válido.
    if (!nuevoHistorialMedico.length || nuevoHistorialMedico[0].id_historialmedico === null) {
      throw new Error("Error al guardar el historial médico en la base de datos");
    }

    // Obtiene la información del estudiante para incluirla en la respuesta.
    const estudiante = await sql`
      SELECT nombres AS nombre_estudiante, apellidos AS apellido_estudiante, cedula AS cedula_estudiante
      FROM estudiantes
      WHERE id_estudiante = ${id_estudiante}
    `;

    // Responde con un estado 201 (Created) y los datos del historial médico creado, incluyendo los del estudiante.
    res.status(201).json({
      id_historialmedico: nuevoHistorialMedico[0].id_historialmedico,
      id_estudiante,
      certificado_conapdis: certificado_conapdis || null,
      informe_medico: informe_medico || null,
      tratamiento: tratamiento || null,
      ...estudiante[0]
    });
  } catch (error) {
    console.error("Error al crear historial médico:", error.message);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};

/**
 * @description Actualiza un registro de historial médico existente en la base de datos por su ID.
 * Aplica las validaciones definidas en `historialMedicoValidations.editarHistorialMedicoValidations`
 * para el ID del historial médico y los campos a actualizar.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_historialmedico` y campos opcionales en `req.body`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method PUT
 * @route /historial_medico/:id_historialmedico
 */
export const editarHistorialMedico = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la edición de historial médico.
  await Promise.all(historialMedicoValidations.editarHistorialMedicoValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_historialmedico } = req.params;
    const { id_estudiante, certificado_conapdis, informe_medico, tratamiento } = req.body;

    // Llama a una función almacenada en la base de datos para editar el historial médico.
    const historialMedicoEditado = await sql`
      SELECT editar_historial_medico(
        ${id_historialmedico},
        ${id_estudiante || null},
        ${certificado_conapdis || null},
        ${informe_medico || null},
        ${tratamiento || null}
      ) AS success;
    `;

    // Si la función de la DB indica que no se pudo actualizar (ej. historial médico no encontrado), devuelve 404.
    if (!historialMedicoEditado.length || !historialMedicoEditado[0].success) {
      return res.status(404).json({ error: 'Historial médico no encontrado o no se pudo actualizar' });
    }

    // Obtiene la información del estudiante para incluirla en la respuesta.
    const estudiante = await sql`
      SELECT nombres AS nombre_estudiante, apellidos AS apellido_estudiante, cedula AS cedula_estudiante
      FROM estudiantes
      WHERE id_estudiante = ${id_estudiante}
    `;

    // Responde con un estado 200 (OK) y los datos actualizados del historial médico, incluyendo los del estudiante.
    res.json({
      id_historialmedico: Number(id_historialmedico),
      id_estudiante: id_estudiante || null,
      certificado_conapdis: certificado_conapdis || null,
      informe_medico: informe_medico || null,
      tratamiento: tratamiento || null,
      ...estudiante[0]
    });
  } catch (error) {
    console.error('Error al editar historial médico:', error);
    res.status(500).json({ error: 'Error al editar historial médico' });
  }
};

/**
 * @description Elimina un registro de historial médico de la base de datos por su ID.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_historialmedico`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method DELETE
 * @route /historial_medico/:id_historialmedico
 */
export const eliminarHistorialMedico = async (req, res) => {
  // Ejecuta la validación del parámetro id_historialmedico
  await Promise.all(historialMedicoValidations.editarHistorialMedicoValidations.filter(v => v.builder.fields.includes('id_historialmedico')).map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_historialmedico } = req.params;

    // Llama a una función almacenada en la base de datos para eliminar el historial médico.
    const historialMedicoEliminado = await sql`
      SELECT eliminar_historial_medico(${id_historialmedico}) AS success
    `;

    // Si la función de la DB indica que no se pudo eliminar (ej. historial médico no encontrado), devuelve 404.
    if (!historialMedicoEliminado.length || !historialMedicoEliminado[0].success) {
      return res.status(404).json({ error: 'Historial médico no encontrado o no se pudo eliminar' });
    }

    res.json({ message: 'Historial médico eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar historial médico:', error);
    res.status(500).json({ error: 'Error al eliminar historial médico' });
  }
};