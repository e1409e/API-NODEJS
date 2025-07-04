/**
 * @file Este archivo contiene los controladores para la gestión de incidencias.
 * @description Implementa la lógica de negocio para obtener, crear, actualizar y eliminar
 * información sobre las incidencias, interactuando con la base de datos y utilizando
 * las validaciones definidas para asegurar la integridad de los datos.
 * @author Eric
 * @version 1.0.0
 * @module controllers/incidencias.controller
 * @see {@link module:validations/incidencias.validations} Para las reglas de validación de datos.
 * @see {@link module:db} Para la conexión a la base de datos.
 * @see {@link module:utilities/formatters} Para las funciones de formateo de texto.
 */

import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { incidenciasValidations } from '../validations/incidencias.validations.js';
import { toCapitalCase } from '../utilities/formatters.js'; // Importa la función de formateo

/**
 * @description Obtiene todas las incidencias registradas en el sistema.
 * Realiza una unión con la tabla de estudiantes para incluir el nombre completo y la cédula
 * del estudiante asociado a cada incidencia y ordena los resultados por fecha de incidente de forma descendente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de incidencia o un mensaje de error.
 * @method GET
 * @route /incidencias
 */
export const obtenerIncidencias = async (req, res) => {
  try {
    const incidencias = await sql`
      SELECT 
        i.*, 
        e.nombres AS nombre_estudiante, 
        e.apellidos AS apellido_estudiante, 
        e.cedula AS cedula_estudiante
      FROM incidencias i
      JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
      ORDER BY i.fecha_incidente DESC
    `;
    res.json(incidencias);
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    res.status(500).json({ error: 'Error al obtener incidencias' });
  }
};

/**
 * @description Obtiene la información de una incidencia específica por su ID.
 * Incluye el nombre completo y la cédula del estudiante asociado.
 * Antes de la consulta, valida el `id_incidencia` del parámetro.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_incidencia`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de incidencia o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /incidencias/:id_incidencia
 */
export const obtenerIncidenciaPorId = async (req, res) => {
  // Ejecuta la validación del parámetro id_incidencia
  await Promise.all(incidenciasValidations.eliminarIncidenciaValidations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_incidencia } = req.params;
    const incidencia = await sql`
      SELECT 
        i.*, 
        e.nombres AS nombre_estudiante, 
        e.apellidos AS apellido_estudiante, 
        e.cedula AS cedula_estudiante
      FROM incidencias i
      JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
      WHERE i.id_incidencia = ${id_incidencia}
      ORDER BY i.fecha_incidente DESC
    `;

    if (incidencia.length === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    res.json(incidencia[0]);
  } catch (error) {
    console.error('Error al obtener incidencia por ID:', error);
    res.status(500).json({ error: 'Error al obtener incidencia por ID' });
  }
};

/**
 * @description Obtiene las incidencias de un estudiante específico por su ID de estudiante.
 * Incluye el nombre completo y la cédula del estudiante asociado.
 * Los resultados se ordenan por fecha de incidente de forma descendente.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_estudiante`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de incidencia o un array vacío si no hay incidencias.
 * @method GET
 * @route /incidencias/estudiante/:id_estudiante
 */
export const obtenerIncidenciasPorEstudiante = async (req, res) => {
  try {
    const { id_estudiante } = req.params;
    const incidencias = await sql`
      SELECT 
        i.*, 
        e.nombres AS nombre_estudiante, 
        e.apellidos AS apellido_estudiante, 
        e.cedula AS cedula_estudiante
      FROM incidencias i
      JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
      WHERE i.id_estudiante = ${id_estudiante}
      ORDER BY i.fecha_incidente DESC
    `;

    if (incidencias.length === 0) {
      return res.json([]); // Si no hay incidencias, devolver un array vacío
    }

    res.json(incidencias);
  } catch (error) {
    console.error('Error al obtener incidencias por estudiante:', error);
    res.status(500).json({ error: 'Error al obtener incidencias por estudiante' });
  }
};

/**
 * @description Crea una nueva incidencia en la base de datos.
 * Aplica las validaciones definidas en `incidenciasValidations.crearIncidenciaValidations`
 * y formatea los campos de texto (`lugar_incidente`, `descripcion_incidente`, `acuerdos`)
 * a "Capital Case" antes de la inserción.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.body` con los campos de incidencia.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con el objeto de la incidencia creada o con errores de validación/servidor.
 * @method POST
 * @route /incidencias
 */
export const crearIncidencia = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la creación de incidencias.
  await Promise.all(incidenciasValidations.crearIncidenciaValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { // Usa 'let' para poder reasignar después del formateo
      id_estudiante,
      hora_incidente,
      fecha_incidente,
      lugar_incidente,
      descripcion_incidente,
      acuerdos,
      observaciones
    } = req.body;

    // Formatear campos de texto a Capital Case
    lugar_incidente = toCapitalCase(lugar_incidente);
    descripcion_incidente = toCapitalCase(descripcion_incidente);
    acuerdos = toCapitalCase(acuerdos);
    // Observaciones es opcional, solo formatear si está presente
    if (observaciones) {
      observaciones = toCapitalCase(observaciones);
    }


    // Llama a una función almacenada en la base de datos para insertar la nueva incidencia.
    const nuevaIncidencia = await sql`
      SELECT insertar_incidencia(
        ${id_estudiante},
        ${hora_incidente || null},
        ${fecha_incidente},
        ${lugar_incidente},
        ${descripcion_incidente},
        ${acuerdos},
        ${observaciones || null}
      ) as incidencia;
    `;

    // Verificar que se haya retornado una incidencia válida
    if (!nuevaIncidencia.length || !nuevaIncidencia[0].incidencia) {
      throw new Error("Error al guardar la incidencia en la base de datos");
    }

    res.status(201).json(nuevaIncidencia[0].incidencia);
  } catch (error) {
    console.error("Error al crear incidencia:", error.message);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};

/**
 * @description Edita una incidencia existente en la base de datos por su ID.
 * Aplica las validaciones definidas en `incidenciasValidations.editarIncidenciaValidations`
 * y formatea los campos de texto (`lugar_incidente`, `descripcion_incidente`, `acuerdos`)
 * a "Capital Case" si se proporcionan.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_incidencia` y campos opcionales en `req.body`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method PUT
 * @route /incidencias/:id_incidencia
 */
export const editarIncidencia = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la edición de incidencias.
  await Promise.all(incidenciasValidations.editarIncidenciaValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_incidencia } = req.params;
    let { // Usa 'let' para poder reasignar después del formateo
      id_estudiante,
      hora_incidente,
      fecha_incidente,
      lugar_incidente,
      descripcion_incidente,
      acuerdos,
      observaciones
    } = req.body;

    // Formatear campos de texto a Capital Case si están presentes
    if (lugar_incidente) lugar_incidente = toCapitalCase(lugar_incidente);
    if (descripcion_incidente) descripcion_incidente = toCapitalCase(descripcion_incidente);
    if (acuerdos) acuerdos = toCapitalCase(acuerdos);
    if (observaciones) observaciones = toCapitalCase(observaciones);

    // Llama a una función almacenada en la base de datos para editar la incidencia.
    const incidenciaEditada = await sql`
      SELECT editar_incidencia(
        ${id_incidencia},
        ${id_estudiante || null},
        ${hora_incidente || null},
        ${fecha_incidente || null},
        ${lugar_incidente || null},
        ${descripcion_incidente || null},
        ${acuerdos || null},
        ${observaciones || null}
      ) as success
    `;

    // Si la función de la DB indica que no se pudo actualizar (ej. incidencia no encontrada), devuelve 404.
    if (!incidenciaEditada.length || !incidenciaEditada[0].success) {
      return res.status(404).json({ error: 'Incidencia no encontrada o no se pudo actualizar' });
    }

    res.json({ message: 'Incidencia actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar incidencia:', error);
    res.status(500).json({ error: 'Error al editar incidencia' });
  }
};

/**
 * @description Elimina una incidencia de la base de datos por su ID.
 * Aplica validación al parámetro `id_incidencia`.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_incidencia`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method DELETE
 * @route /incidencias/:id_incidencia
 */
export const eliminarIncidencia = async (req, res) => {
  // Ejecuta la validación del parámetro id_incidencia
  await Promise.all(incidenciasValidations.eliminarIncidenciaValidations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_incidencia } = req.params;

    // Llama a una función almacenada en la base de datos para eliminar la incidencia.
    const incidenciaEliminada = await sql`
      SELECT eliminar_incidencia(${id_incidencia}) as success
    `;

    // Si la función de la DB indica que no se pudo eliminar (ej. incidencia no encontrada), devuelve 404.
    if (!incidenciaEliminada.length || !incidenciaEliminada[0].success) {
      return res.status(404).json({ error: 'Incidencia no encontrada o no se pudo eliminar' });
    }

    res.json({ message: 'Incidencia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar incidencia:', error);
    res.status(500).json({ error: 'Error al eliminar incidencia' });
  }
};