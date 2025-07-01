/**
 * @file Este archivo contiene los controladores para la gestión de citas.
 * @description Implementa la lógica de negocio para obtener, crear, actualizar y eliminar
 * información sobre las citas, interactuando con la base de datos y utilizando
 * las validaciones definidas para asegurar la integridad de los datos.
 * @author Eric
 * @version 1.0.0
 * @module controllers/citas.controller
 * @see {@link module:validations/citas.validations} Para las reglas de validación de datos.
 * @see {@link module:db} Para la conexión a la base de datos.
 */

import { sql } from '../db.js'; // Importa la conexión a la base de datos
import { validationResult } from 'express-validator'; // Para la validación de datos
import { citaValidations } from '../validations/citas.validations.js'; // Importaciones de las validaciones

/**
 * @description Obtiene todas las citas registradas en el sistema.
 * Realiza una unión con la tabla de estudiantes para incluir el nombre completo del estudiante
 * asociado a cada cita y ordena los resultados por fecha de cita de forma descendente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de cita o un mensaje de error.
 * @method GET
 * @route /citas
 */
export const obtenerTodasLasCitas = async (req, res) => {
  try {
    const citas = await sql`
      SELECT c.*, CONCAT(e.nombres,' ',e.apellidos) as nombres 
      FROM citas c 
      JOIN estudiantes e ON c.id_estudiante = e.id_estudiante
      ORDER BY c.fecha_cita DESC
    `;
    res.json(citas);
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
};

/**
 * @description Obtiene la información de una cita específica por su ID.
 * Incluye el nombre completo del estudiante asociado a la cita.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_citas`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de cita o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /citas/:id_citas
 */
export const obtenerCitaPorId = async (req, res) => {
  try {
    const { id_citas } = req.params;
    const cita = await sql`
      SELECT c.*, CONCAT(e.nombres,' ',e.apellidos) as nombres 
      FROM citas c 
      JOIN estudiantes e ON c.id_estudiante = e.id_estudiante 
      WHERE id_citas = ${id_citas}
    `;
    if (cita.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }
    res.json(cita[0]);
  } catch (error) {
    console.error("Error al obtener la cita:", error);
    res.status(500).json({ error: "Error al obtener la cita" });
  }
};

/**
 * @description Crea una nueva cita en la base de datos.
 * Antes de la inserción, aplica las validaciones definidas en `citaValidations.crearCitaValidations`
 * para asegurar la integridad de los datos recibidos.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.body.id_estudiante`, `req.body.fecha_cita` y `req.body.motivo_cita` (opcional).
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con el ID de la cita creada y un mensaje de éxito, o con errores de validación/servidor.
 * @method POST
 * @route /citas
 */
export const crearCita = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la creación de citas.
  await Promise.all(citaValidations.crearCitaValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_estudiante, fecha_cita, motivo_cita } = req.body;

    // Llama a una función almacenada en la base de datos para insertar la nueva cita.
    const nuevaCita = await sql`
      SELECT insertar_cita(${id_estudiante}, ${fecha_cita}, ${motivo_cita}) as cita;
    `;
    // Responde con un estado 201 (Created) y el ID de la nueva cita.
    res.status(201).json({ id_citas: nuevaCita[0].cita, message: "Cita creada correctamente" });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).json({ error: "Error al crear la cita" });
  }
};

/**
 * @description Actualiza una cita existente en la base de datos por su ID.
 * Aplica las validaciones definidas en `citaValidations.actualizarCitaValidations`
 * para el ID de la cita y los campos a actualizar.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_citas` y campos opcionales en `req.body`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method PUT
 * @route /citas/:id_citas
 */
export const actualizarCita = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la actualización de citas.
  await Promise.all(citaValidations.actualizarCitaValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_citas } = req.params;
    const { id_estudiante, fecha_cita, motivo_cita, pendiente } = req.body;

    // Llama a una función almacenada en la base de datos para editar la cita.
    // Se pasan `null` si los campos no están presentes en el cuerpo de la solicitud.
    const citaActualizada = await sql`
      SELECT editar_cita(${id_citas}, ${id_estudiante || null}, ${fecha_cita || null}, ${motivo_cita || null}, ${pendiente || null}) as success;
    `;

    // Si la función de la DB indica que no se pudo actualizar (ej. cita no encontrada), devuelve 404.
    if (citaActualizada.length === 0 || !citaActualizada[0].success) {
      return res.status(404).json({ error: "Cita no encontrada o no se pudo actualizar" });
    }

    // Responde con el valor booleano de éxito de la operación.
    res.send(citaActualizada[0].success.toString());

  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).json({ error: "Error al actualizar la cita" });
  }
};

/**
 * @description Elimina una cita de la base de datos por su ID.
 * Aplica las validaciones definidas en `citaValidations.eliminarCitaValidations`
 * para el ID de la cita antes de proceder con la eliminación.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_citas`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method DELETE
 * @route /citas/:id_citas
 */
export const eliminarCita = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la eliminación de citas.
  await Promise.all(citaValidations.eliminarCitaValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_citas } = req.params;
    // Llama a una función almacenada en la base de datos para eliminar la cita.
    const citaEliminada = await sql`
      SELECT eliminar_cita(${id_citas}) as success;
    `;

    // Si la función de la DB indica que no se pudo eliminar (ej. cita no encontrada), devuelve 404.
    if (citaEliminada.length === 0 || !citaEliminada[0].success) {
      return res.status(404).json({ error: "Cita no encontrada o no se pudo eliminar" });
    }
    res.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    res.status(500).json({ error: "Error al eliminar la cita" });
  }
};

/**
 * @description Marca una cita como realizada (estableciendo el campo `pendiente` a `0`).
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_citas`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un valor booleano de éxito o un mensaje de error.
 * @method PUT
 * @route /citas/:id_citas/realizada
 */
export const marcarCitaComoRealizada = async (req, res) => {
  try {
    const { id_citas } = req.params;

    // Llama a la función `editar_cita` en la base de datos, pasando `null` para los campos
    // que no se desean actualizar y `0` para el campo `pendiente` para marcarla como realizada.
    const result = await sql`
      SELECT editar_cita(${id_citas}, NULL, NULL, NULL, 0) as success; 
    `;

    // Si la función de la DB no devuelve éxito o la cita no fue encontrada/actualizada, devuelve 404.
    if (result.length === 0 || !result[0].success) {
      return res.status(404).json({ error: "Cita no encontrada o ya marcada como realizada" });
    }

    // Responde con "true" si la operación fue exitosa.
    res.send("true");

  } catch (error) {
    console.error("Error al marcar la cita como realizada:", error);
    res.status(500).json({ error: "Error al marcar la cita como realizada" });
  }
};