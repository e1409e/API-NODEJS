/**
 * @file Este archivo contiene los controladores para la gestión de facultades.
 * @description Implementa la lógica de negocio para obtener, crear, actualizar y eliminar
 * información sobre las facultades, interactuando con la base de datos. Incluye
 * la integración con las validaciones definidas y el formato de los datos de entrada
 * para asegurar la consistencia.
 * @author Eric
 * @version 1.0.0
 * @module controllers/facultades.controller
 * @see {@link module:validations/facultades.validations} Para las reglas de validación de datos.
 * @see {@link module:db} Para la conexión a la base de datos.
 */

import { sql } from '../db.js'; // Importa la conexión a la base de datos
import { validationResult } from 'express-validator'; // Para la validación de datos
import { facultadesValidations } from '../validations/facultades.validations.js'; // Importa las validaciones de facultades

/**
 * @description Convierte una cadena de texto a formato "Título de Caso" (primera letra de cada palabra en mayúscula).
 * Se utiliza para dar un formato consistente al nombre de la facultad.
 * @param {string} str - La cadena de texto a formatear.
 * @returns {string|null} La cadena formateada o null si la entrada es nula/indefinida.
 */
const toTitleCase = (str) => {
  if (str === null || str === undefined) return null;
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

/**
 * @description Convierte una cadena de texto a mayúsculas.
 * Se utiliza para dar un formato consistente a las siglas de la facultad.
 * @param {string} str - La cadena de texto a formatear.
 * @returns {string|null} La cadena en mayúsculas o null si la entrada es nula/indefinida.
 */
const toUpperCase = (str) => {
  if (str === null || str === undefined) return null;
  return str.toUpperCase();
};

/**
 * @description Obtiene todas las facultades registradas en el sistema.
 * Los resultados se devuelven ordenados alfabéticamente por el nombre de la facultad.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de facultad o un mensaje de error.
 * @method GET
 * @route /facultades
 */
export const obtenerFacultades = async (req, res) => {
  try {
    const facultades = await sql`SELECT * FROM facultades ORDER BY facultad ASC`;
    res.json(facultades);
  } catch (error) {
    console.error('Error al obtener facultades:', error);
    res.status(500).json({ error: 'Error al obtener facultades' });
  }
};

/**
 * @description Obtiene la información de una facultad específica por su ID.
 * Aplica validación al parámetro de ID.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_facultad`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de facultad o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /facultades/:id_facultad
 */
export const obtenerFacultadPorId = async (req, res) => {
  // Se utiliza una validación de 'eliminar' o 'editar' porque ambas validan solo el 'id_facultad' del parámetro.
  await Promise.all(facultadesValidations.eliminarFacultadValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_facultad } = req.params;
    const facultad = await sql`SELECT * FROM facultades WHERE id_facultad = ${id_facultad}`;
    if (facultad.length === 0) {
      return res.status(404).json({ error: 'Facultad no encontrada' });
    }
    res.json(facultad[0]);
  } catch (error) {
    console.error('Error al obtener facultad por ID:', error);
    res.status(500).json({ error: 'Error al obtener facultad por ID' });
  }
};

/**
 * @description Crea una nueva facultad en la base de datos.
 * Aplica validaciones y formatea los campos `facultad` y `siglas` antes de la inserción.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.body.facultad` y `req.body.siglas`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con el ID de la facultad creada y un mensaje de éxito, o con errores de validación/servidor.
 * @method POST
 * @route /facultades
 */
export const crearFacultad = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la creación de facultades.
  await Promise.all(facultadesValidations.crearFacultadValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { facultad, siglas } = req.body;

    // Aplica el formato de título de caso a 'facultad' y mayúsculas a 'siglas'.
    const formattedFacultad = toTitleCase(facultad);
    const formattedSiglas = toUpperCase(siglas);

    // Llama a una función almacenada en la base de datos para insertar la nueva facultad.
    const result = await sql`
      SELECT insertar_facultad(${formattedFacultad}, ${formattedSiglas}) AS id_facultad
    `;
    // Responde con un estado 201 (Created) y el ID de la nueva facultad.
    res.status(201).json({ id_facultad: result[0].id_facultad, message: 'Facultad creada correctamente' });
  } catch (error) {
    console.error('Error al crear facultad:', error);
    res.status(500).json({ error: 'Error al crear facultad' });
  }
};

/**
 * @description Actualiza una facultad existente en la base de datos por su ID.
 * Aplica validaciones y formatea los campos `facultad` y `siglas` si se proporcionan.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_facultad` y campos opcionales en `req.body`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method PUT
 * @route /facultades/:id_facultad
 */
export const editarFacultad = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la edición de facultades.
  await Promise.all(facultadesValidations.editarFacultadValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_facultad } = req.params;
    const { facultad, siglas } = req.body;

    let formattedFacultad = null;
    if (facultad !== undefined && facultad !== null) {
      formattedFacultad = toTitleCase(facultad);
    }

    let formattedSiglas = null;
    if (siglas !== undefined && siglas !== null) {
      formattedSiglas = toUpperCase(siglas);
    }

    // Llama a una función almacenada en la base de datos para editar la facultad.
    const result = await sql`
      SELECT editar_facultad(${id_facultad}, ${formattedFacultad}, ${formattedSiglas}) AS success
    `;
    // Si la función de la DB indica que no se pudo actualizar (ej. facultad no encontrada), devuelve 404.
    if (!result[0].success) {
      return res.status(404).json({ error: 'Facultad no encontrada o no se pudo actualizar' });
    }
    res.json({ message: 'Facultad actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar facultad:', error);
    res.status(500).json({ error: 'Error al editar facultad' });
  }
};

/**
 * @description Elimina una facultad de la base de datos por su ID.
 * Aplica validaciones al parámetro de ID antes de proceder con la eliminación.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_facultad`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method DELETE
 * @route /facultades/:id_facultad
 */
export const eliminarFacultad = async (req, res) => {
  // Ejecuta todas las validaciones definidas para la eliminación de facultades.
  await Promise.all(facultadesValidations.eliminarFacultadValidations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id_facultad } = req.params;
    // Llama a una función almacenada en la base de datos para eliminar la facultad.
    const result = await sql`
      SELECT eliminar_facultad(${id_facultad}) AS success
    `;
    // Si la función de la DB indica que no se pudo eliminar (ej. facultad no encontrada), devuelve 404.
    if (!result[0].success) {
      return res.status(404).json({ error: 'Facultad no encontrada o no se pudo eliminar' });
    }
    res.json({ message: 'Facultad eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar facultad:', error);
    res.status(500).json({ error: 'Error al eliminar facultad' });
  }
};

/**
 * @description Obtiene todas las facultades con sus carreras asociadas.
 * Los resultados se devuelven ordenados alfabéticamente por el nombre de la facultad y luego por el nombre de la carrera.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de facultad, cada uno conteniendo un array de sus carreras asociadas, o un mensaje de error.
 * @method GET
 * @route /facultades/con-carreras
 */
export const obtenerFacultadesConCarreras = async (req, res) => {
  try {
    // Obtén todas las facultades ordenadas alfabéticamente
    const facultades = await sql`SELECT * FROM facultades ORDER BY facultad ASC`;

    // Obtén todas las carreras ordenadas alfabéticamente
    const carreras = await sql`SELECT * FROM carreras ORDER BY carrera ASC`;

    // Asocia carreras a cada facultad
    const resultado = facultades.map(facultad => ({
      ...facultad,
      carreras: carreras.filter(c => c.id_facultad === facultad.id_facultad)
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener facultades con carreras:", error); // Añadir log de error
    res.status(500).json({ error: "Error al obtener facultades con carreras" });
  }
};