/**
 * @file Este archivo contiene los controladores para la gestión de representantes.
 * @description Implementa la lógica de negocio para obtener, crear, actualizar y eliminar
 * registros de representantes, interactuando con la base de datos y utilizando
 * las validaciones definidas para asegurar la integridad de los datos.
 * @author Eric
 * @version 1.0.0
 * @module controllers/representantes.controller
 * @see {@link module:validations/representantes.validations} Para las reglas de validación de datos.
 * @see {@link module:db} Para la conexión a la base de datos.
 */

import { validationResult } from 'express-validator';
import { sql } from '../db.js';
import { representanteValidations } from '../validations/representantes.validations.js';
import { toCapitalCase } from '../utilities/formatters.js'; // <-- Importa el formateador

/**
 * @description Obtiene todos los representantes registrados en el sistema.
 * Los resultados se ordenan por `nombre_repre` de forma ascendente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un array de objetos de representante o un mensaje de error.
 * @method GET
 * @route /representantes
 */
export const obtenerRepresentantes = async (req, res) => {
    try {
        const representantes = await sql`
            SELECT * FROM representantes
            ORDER BY nombre_repre ASC
        `;
        res.json(representantes);
    } catch (error) {
        console.error('Error al obtener representantes:', error);
        res.status(500).json({ error: 'Error al obtener representantes' });
    }
};

/**
 * @description Obtiene un representante específico por su ID.
 * Aplica validación al parámetro `id_representante` antes de la consulta.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_representante`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de representante o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /representantes/:id_representante
 */
export const obtenerRepresentantePorId = async (req, res) => {
    // Ejecuta la validación del parámetro id_representante
    await Promise.all(representanteValidations.editarRepresentanteValidations.filter(v => v.builder.fields.includes('id_representante')).map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_representante } = req.params;
        const representante = await sql`
            SELECT * FROM representantes WHERE id_representante = ${id_representante}
        `;

        if (representante.length === 0) {
            return res.status(404).json({ error: 'Representante no encontrado' });
        }

        res.json(representante[0]);
    } catch (error) {
        console.error('Error al obtener representante por ID:', error);
        res.status(500).json({ error: 'Error al obtener representante por ID' });
    }
};

/**
 * @description Obtiene un representante asociado a un estudiante específico por el ID del estudiante.
 * Incluye el nombre y apellido del estudiante asociado. Aplica validación al parámetro `id_estudiante`.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_estudiante`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un objeto de representante o un mensaje de error 404 si no se encuentra.
 * @method GET
 * @route /representantes/estudiante/:id_estudiante
 */
export const obtenerRepresentantePorEstudiante = async (req, res) => {
    // Si quieres validar que el parámetro es un entero positivo, hazlo aquí manualmente:
    const { id_estudiante } = req.params;
    if (!id_estudiante || isNaN(id_estudiante) || parseInt(id_estudiante) < 1) {
        return res.status(400).json({
            errors: [
                {
                    type: "field",
                    msg: "El ID del estudiante debe ser un entero positivo.",
                    path: "id_estudiante",
                    location: "params"
                }
            ]
        });
    }

    try {
        const representante = await sql`
            SELECT r.*, e.nombres AS nombre_estudiante, e.apellidos AS apellido_estudiante
            FROM representantes r
            JOIN estudiantes e ON r.id_estudiante = e.id_estudiante
            WHERE r.id_estudiante = ${id_estudiante}
        `;

        if (representante.length === 0) {
            return res.status(404).json({ error: 'Representante no encontrado para este estudiante' });
        }

        res.json(representante[0]);
    } catch (error) {
        console.error('Error al obtener representante por id_estudiante:', error);
        res.status(500).json({ error: 'Error al obtener representante por id_estudiante' });
    }
};

/**
 * @description Crea un nuevo registro de representante en la base de datos.
 * Aplica las validaciones definidas en `representanteValidations.crearRepresentanteValidations`
 * para asegurar la integridad de los datos recibidos.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.body` con los datos del representante.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con el objeto del representante creado o con errores de validación/servidor.
 * @method POST
 * @route /representantes
 */
export const crearRepresentante = async (req, res) => {
    await Promise.all(representanteValidations.crearRepresentanteValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let {
            id_estudiante,
            nombre_repre,
            parentesco,
            cedula_repre,
            telefono_repre,
            correo_repre,
            lugar_nacimiento,
            fecha_nacimiento,
            direccion,
            ocupacion,
            lugar_trabajo,
            estado,
            municipio,
            departamento,
            estado_civil
        } = req.body;

        // Formatea los campos a Capital Case
        nombre_repre = toCapitalCase(nombre_repre);
        lugar_nacimiento = toCapitalCase(lugar_nacimiento);
        estado = toCapitalCase(estado);

        const nuevoRepresentante = await sql`
            SELECT insertar_representante(
                ${id_estudiante},
                ${nombre_repre},
                ${parentesco},
                ${cedula_repre},
                ${telefono_repre || null},
                ${correo_repre || null},
                ${lugar_nacimiento || null},
                ${fecha_nacimiento ? new Date(fecha_nacimiento) : null}::date,
                ${direccion || null},
                ${ocupacion || null},
                ${lugar_trabajo || null},
                ${estado || null},
                ${municipio || null},
                ${departamento || null},
                ${estado_civil || null}
            ) as representante;
        `;

        if (!nuevoRepresentante.length || !nuevoRepresentante[0].representante) {
            throw new Error("Error al guardar el representante en la base de datos");
        }

        res.status(201).json(nuevoRepresentante[0].representante);
    } catch (error) {
        console.error("Error al crear representante:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

/**
 * @description Actualiza un registro de representante existente en la base de datos por su ID.
 * Aplica las validaciones definidas en `representanteValidations.editarRepresentanteValidations`
 * para el ID del representante y los campos a actualizar.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_representante` y campos opcionales en `req.body`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method PUT
 * @route /representantes/:id_representante
 */
export const editarRepresentante = async (req, res) => {
    // Ejecuta todas las validaciones definidas para la edición de representante.
    await Promise.all(representanteValidations.editarRepresentanteValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    // Si hay errores de validación, devuelve una respuesta 400 con los detalles de los errores.
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_representante } = req.params;
        let {
            id_estudiante,
            nombre_repre,
            parentesco,
            cedula_repre,
            telefono_repre,
            correo_repre,
            lugar_nacimiento,
            fecha_nacimiento,
            direccion,
            ocupacion,
            lugar_trabajo,
            estado,
            municipio,
            departamento,
            estado_civil
        } = req.body;

        // Aplica formato solo si los campos existen en el body
        if (nombre_repre) nombre_repre = toCapitalCase(nombre_repre);
        if (lugar_nacimiento) lugar_nacimiento = toCapitalCase(lugar_nacimiento);
        if (estado) estado = toCapitalCase(estado);

        // Llama a una función almacenada en la base de datos para editar el representante.
        const representanteEditado = await sql`
            SELECT editar_representante(
                ${id_representante},
                ${id_estudiante || null},
                ${nombre_repre || null},
                ${parentesco || null},
                ${cedula_repre || null},
                ${telefono_repre || null},
                ${correo_repre || null},
                ${lugar_nacimiento || null},
                ${fecha_nacimiento ? new Date(fecha_nacimiento) : null}::date,
                ${direccion || null},
                ${ocupacion || null},
                ${lugar_trabajo || null},
                ${estado || null},
                ${municipio || null},
                ${departamento || null},
                ${estado_civil || null}
            ) as success
        `;

        // Si la función de la DB indica que no se pudo actualizar (ej. representante no encontrado), devuelve 404.
        if (!representanteEditado.length || !representanteEditado[0].success) {
            return res.status(404).json({ error: 'Representante no encontrado o no se pudo actualizar' });
        }

        res.json({ message: 'Representante actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar representante:', error);
        res.status(500).json({ error: 'Error al editar representante' });
    }
};

/**
 * @description Elimina un registro de representante de la base de datos por su ID.
 * Aplica validación al parámetro `id_representante`.
 * @param {object} req - Objeto de solicitud de Express. Se espera `req.params.id_representante`.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un mensaje de éxito o con errores de validación/servidor.
 * @method DELETE
 * @route /representantes/:id_representante
 */
export const eliminarRepresentante = async (req, res) => {
    // Ejecuta la validación del parámetro id_representante
    await Promise.all(representanteValidations.editarRepresentanteValidations.filter(v => v.builder.fields.includes('id_representante')).map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_representante } = req.params;

        const representanteEliminado = await sql`
            SELECT eliminar_representante(${id_representante}) as success
        `;

        // Si la función de la DB indica que no se pudo eliminar (ej. representante no encontrado), devuelve 404.
        if (!representanteEliminado.length || !representanteEliminado[0].success) {
            return res.status(404).json({ error: 'Representante no encontrado o no se pudo eliminar' });
        }

        res.json({ message: 'Representante eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar representante:', error);
        res.status(500).json({ error: 'Error al eliminar representante' });
    }
};