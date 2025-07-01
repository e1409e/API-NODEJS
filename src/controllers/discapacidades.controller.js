/**
 * @file Este archivo contiene los controladores para la gestión de discapacidades.
 * @description Implementa la lógica de negocio para obtener, crear, actualizar y eliminar
 * registros de discapacidades, interactuando con la base de datos y utilizando
 * las validaciones definidas para asegurar la integridad de los datos.
 * @author Eric
 * @version 1.0.0
 * @module controllers/discapacidades.controller
 * @see {@link module:validations/discapacidades.validations} Para las reglas de validación de datos.
 * @see {@link module:db} Para la conexión a la base de datos.
 */

import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { discapacidadValidations } from '../validations/discapacidades.validations.js';

/**
 * @description Obtiene todas las discapacidades registradas en el sistema.
 * Los resultados se ordenan por `discapacidad` de forma ascendente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de discapacidad o un mensaje de error.
 * @method GET
 * @route /discapacidades
 */
export const obtenerDiscapacidades = async (req, res) => {
    try {
        const discapacidades = await sql`
            SELECT * FROM discapacidades
            ORDER BY discapacidad ASC
        `;
        res.json(discapacidades);
    } catch (error) {
        console.error('Error al obtener discapacidades:', error);
        res.status(500).json({ error: 'Error al obtener discapacidades' });
    }
};

/**
 * @description Obtiene una discapacidad específica por su ID.
 * Aplica validación al parámetro `discapacidad_id` antes de la consulta.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.discapacidad_id`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de discapacidad o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /discapacidades/:discapacidad_id
 */
export const obtenerDiscapacidadPorId = async (req, res) => {
    // Ejecuta la validación del parámetro discapacidad_id
    await Promise.all(discapacidadValidations.editarDiscapacidadValidations.filter(v => v.builder.fields.includes('discapacidad_id')).map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { discapacidad_id } = req.params;
        const discapacidad = await sql`
            SELECT * FROM discapacidades WHERE discapacidad_id = ${discapacidad_id}
        `;

        if (discapacidad.length === 0) {
            return res.status(404).json({ error: 'Discapacidad no encontrada' });
        }

        res.json(discapacidad[0]);
    } catch (error) {
        console.error('Error al obtener discapacidad por ID:', error);
        res.status(500).json({ error: 'Error al obtener discapacidad por ID' });
    }
};

/**
 * @description Crea una nueva discapacidad en la base de datos.
 * Aplica las validaciones definidas en `discapacidadValidations.crearDiscapacidadValidations`
 * para asegurar la integridad de los datos recibidos.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.body.discapacidad`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con el objeto de la discapacidad creada o con errores de validación/servidor.
 * @method POST
 * @route /discapacidades
 */
export const crearDiscapacidad = async (req, res) => {
    // Ejecuta todas las validaciones definidas para la creación de discapacidad.
    await Promise.all(discapacidadValidations.crearDiscapacidadValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { discapacidad } = req.body;

        const nuevaDiscapacidad = await sql`
            SELECT insertar_discapacidad(
                ${discapacidad}
            ) as discapacidad;
        `;

        // Verificar que se haya retornado una discapacidad válida
        if (!nuevaDiscapacidad.length || !nuevaDiscapacidad[0].discapacidad) {
            throw new Error("Error al guardar la discapacidad en la base de datos");
        }

        res.status(201).json(nuevaDiscapacidad[0].discapacidad);
    } catch (error) {
        console.error("Error al crear discapacidad:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

/**
 * @description Actualiza un registro de discapacidad existente en la base de datos por su ID.
 * Aplica las validaciones definidas en `discapacidadValidations.editarDiscapacidadValidations`
 * para el ID de la discapacidad y el campo a actualizar.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.discapacidad_id` y `req.body.discapacidad`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method PUT
 * @route /discapacidades/:discapacidad_id
 */
export const editarDiscapacidad = async (req, res) => {
    // Ejecuta todas las validaciones definidas para la edición de discapacidad.
    await Promise.all(discapacidadValidations.editarDiscapacidadValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { discapacidad_id } = req.params;
        const { discapacidad } = req.body;

        const discapacidadEditada = await sql`
            SELECT editar_discapacidad(
                ${discapacidad_id},
                ${discapacidad}
            ) as success
        `;

        // Si la función de la DB indica que no se pudo actualizar (ej. discapacidad no encontrada), devuelve 404.
        if (!discapacidadEditada.length || !discapacidadEditada[0].success) {
            return res.status(404).json({ error: 'Discapacidad no encontrada o no se pudo actualizar' });
        }

        res.json({ message: 'Discapacidad actualizada correctamente' });
    } catch (error) {
        console.error('Error al editar discapacidad:', error);
        res.status(500).json({ error: 'Error al editar discapacidad' });
    }
};

/**
 * @description Elimina un registro de discapacidad de la base de datos por su ID.
 * Aplica validación al parámetro `discapacidad_id`.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.discapacidad_id`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method DELETE
 * @route /discapacidades/:discapacidad_id
 */
export const eliminarDiscapacidad = async (req, res) => {
    // Ejecuta la validación del parámetro discapacidad_id
    await Promise.all(discapacidadValidations.editarDiscapacidadValidations.filter(v => v.builder.fields.includes('discapacidad_id')).map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { discapacidad_id } = req.params;

        const discapacidadEliminada = await sql`
            SELECT eliminar_discapacidad(${discapacidad_id}) as success
        `;

        // Si la función de la DB indica que no se pudo eliminar (ej. discapacidad no encontrada), devuelve 404.
        if (!discapacidadEliminada.length || !discapacidadEliminada[0].success) {
            return res.status(404).json({ error: 'Discapacidad no encontrada o no se pudo eliminar' });
        }

        res.json({ message: 'Discapacidad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar discapacidad:', error);
        res.status(500).json({ error: 'Error al eliminar discapacidad' });
    }
};