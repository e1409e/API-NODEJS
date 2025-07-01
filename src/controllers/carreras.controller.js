/**
 * @file Este archivo contiene los controladores para la gestión de carreras.
 * @description Implementa la lógica de negocio para obtener, crear, editar y eliminar
 * información sobre las carreras, interactuando con la base de datos y utilizando
 * las validaciones definidas para asegurar la integridad de los datos.
 * @author Eric
 * @version 1.0.0
 * @module controllers/carreras.controller
 * @see {@link module:validations/carreras.validations} Para las reglas de validación de datos.
 * @see {@link module:db} Para la conexión a la base de datos.
 */

import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { carrerasValidations } from '../validations/carreras.validations.js';

/**
 * @description Obtiene todas las carreras registradas en el sistema.
 * Realiza una unión con la tabla de facultades para incluir el nombre de la facultad
 * a la que pertenece cada carrera y ordena los resultados alfabéticamente por el nombre de la carrera.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de carrera o un mensaje de error.
 * @method GET
 * @route /carreras
 */
export const obtenerCarreras = async (req, res) => {
  try {
    const carreras = await sql`
      SELECT c.*, f.facultad 
      FROM carreras c 
      JOIN facultades f ON c.id_facultad = f.id_facultad
      ORDER BY c.carrera ASC
    `;
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener las carreras:', error);
    res.status(500).json({ error: 'Error al obtener las carreras' });
  }
};

/**
 * @description Obtiene la información de una carrera específica por su ID.
 * Incluye el nombre de la facultad asociada a la carrera.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_carrera`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de carrera o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /carreras/:id_carrera
 */
export const obtenerCarreraPorId = async (req, res) => {
  try {
    const { id_carrera } = req.params;
    const carrera = await sql`
      SELECT c.*, f.facultad 
      FROM carreras c 
      JOIN facultades f ON c.id_facultad = f.id_facultad 
      WHERE id_carrera = ${id_carrera}
    `;
    if (carrera.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.json(carrera[0]);
  } catch (error) {
    console.error('Error al obtener carrera por ID:', error);
    res.status(500).json({ error: 'Error al obtener carrera por ID' });
  }
};

/**
 * @description Crea una nueva carrera en la base de datos.
 * Antes de la inserción, aplica las validaciones definidas en `carrerasValidations.crearCarreraValidations`
 * para asegurar la integridad de los datos recibidos.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.body.carrera` y `req.body.id_facultad`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con el ID de la carrera creada y un mensaje de éxito, o con errores de validación/servidor.
 * @method POST
 * @route /carreras
 */
export const crearCarrera = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la creación de carreras.
  await Promise.all(carrerasValidations.crearCarreraValidations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { carrera, id_facultad } = req.body;
    // Llama a una función almacenada en la base de datos para insertar la carrera.
    const result = await sql`SELECT insertar_carrera(${carrera}, ${id_facultad}) AS id_carrera`;
    // Responde con un estado 201 (Created) y el ID de la nueva carrera.
    res.status(201).json({ id_carrera: result[0].id_carrera, message: 'Carrera creada correctamente' });
  } catch (error) {
    console.error('Error al crear carrera:', error);
    res.status(500).json({ error: 'Error al crear carrera' });
  }
};

/**
 * @description Edita una carrera existente en la base de datos por su ID.
 * Aplica las validaciones definidas en `carrerasValidations.editarCarreraValidations`
 * para el ID de la carrera y los campos a actualizar.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_carrera` y campos opcionales en `req.body`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method PUT
 * @route /carreras/:id_carrera
 */
export const editarCarrera = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la edición de carreras.
  await Promise.all(carrerasValidations.editarCarreraValidations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id_carrera } = req.params;
    const { carrera, id_facultad } = req.body;
    // Llama a una función almacenada en la base de datos para editar la carrera.
    // Se pasan `null` si los campos no están presentes en el cuerpo de la solicitud.
    const result = await sql`SELECT editar_carrera(${id_carrera}, ${carrera || null}, ${id_facultad || null}) AS success`;
    // Si la función de la DB indica que no se pudo actualizar (ej. carrera no encontrada), devuelve 404.
    if (!result[0].success) {
      return res.status(404).json({ error: 'Carrera no encontrada o no se pudo actualizar' });
    }
    res.json({ message: 'Carrera actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar carrera:', error);
    res.status(500).json({ error: 'Error al editar carrera' });
  }
};

/**
 * @description Elimina una carrera de la base de datos por su ID.
 * Aplica las validaciones definidas en `carrerasValidations.eliminarCarreraValidations`
 * para el ID de la carrera antes de proceder con la eliminación.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_carrera`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method DELETE
 * @route /carreras/:id_carrera
 */
export const eliminarCarrera = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la eliminación de carreras.
  await Promise.all(carrerasValidations.eliminarCarreraValidations.map(validation => validation.run(req)));
  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id_carrera } = req.params;
    // Llama a una función almacenada en la base de datos para eliminar la carrera.
    const result = await sql`SELECT eliminar_carrera(${id_carrera}) AS success`;
    // Si la función de la DB indica que no se pudo eliminar (ej. carrera no encontrada), devuelve 404.
    if (!result[0].success) {
      return res.status(404).json({ error: 'Carrera no encontrada o no se pudo eliminar' });
    }
    res.json({ message: 'Carrera eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar carrera:', error);
    res.status(500).json({ error: 'Error al eliminar carrera' });
  }
};