/**
 * @file Este archivo define las rutas para la gestión de representantes en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre los representantes. Integra validaciones de datos de entrada utilizando `express-validator`
 * para asegurar la integridad y el formato correcto de la información recibida en las peticiones.
 * @author Eric
 * @version 1.0.0
 * @module routes/representantes.routes
 * @see {@link module:controllers/representantes.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/representantes.validations} Para las reglas de validación de datos.
 */

import express from 'express';
import { validationResult } from 'express-validator';

import {
    obtenerRepresentantes,
    obtenerRepresentantePorId,
    crearRepresentante,
    editarRepresentante,
    eliminarRepresentante,
    obtenerRepresentantePorEstudiante
} from '../controllers/representantes.controller.js';

import { representanteValidations } from '../validations/representantes.validations.js';

const router = express.Router();

/**
 * @description Middleware personalizado para manejar los errores de validación de `express-validator`.
 * Si existen errores de validación en la solicitud, intercepta la petición y responde con
 * un estado 400 (Bad Request) y un array de los errores encontrados.
 * Si no hay errores de validación, pasa el control al siguiente middleware o controlador.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware o controlador.
 * @returns {void} Responde con errores de validación o pasa al siguiente middleware.
 * @function
 */
const validar = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
};

/**
 * @description Ruta para obtener todos los representantes registrados en el sistema.
 * @method GET
 * @route /representantes
 * @param {function} obtenerRepresentantes - Controlador que maneja la lógica para obtener todos los representantes.
 */
router.get('/', obtenerRepresentantes);

/**
 * @description Ruta para obtener la información de un representante específico por su ID.
 * @method GET
 * @route /representantes/:id_representante
 * @param {string} :id_representante - ID único del representante a buscar.
 * @param {function} obtenerRepresentantePorId - Controlador que maneja la lógica para obtener un representante por ID.
 */
router.get(
    '/:id_representante',
    obtenerRepresentantePorId
);

/**
 * @description Ruta para obtener un representante por el ID del estudiante asociado.
 * @method GET
 * @route /representantes/estudiante/:id_estudiante
 * @param {string} :id_estudiante - ID único del estudiante para buscar su representante.
 * @param {function} obtenerRepresentantePorEstudiante - Controlador que maneja la lógica para obtener un representante por ID de estudiante.
 */
router.get(
    '/estudiante/:id_estudiante',
    obtenerRepresentantePorEstudiante
);

/**
 * @description Ruta para crear un nuevo representante.
 * Aplica las validaciones definidas en `crearRepresentanteValidations` antes de ejecutar el controlador.
 * @method POST
 * @route /representantes
 * @param {Array<import('express-validator').ValidationChain>} representanteValidations.crearRepresentanteValidations - Middlewares de validación para la creación de representantes.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} crearRepresentante - Controlador que maneja la lógica de creación de representante.
 */
router.post(
    '/',
    representanteValidations.crearRepresentanteValidations,
    validar,
    crearRepresentante
);

/**
 * @description Ruta para editar un representante existente por su ID.
 * Aplica las validaciones definidas en `editarRepresentanteValidations` antes de ejecutar el controlador.
 * @method PUT
 * @route /representantes/:id_representante
 * @param {string} :id_representante - ID único del representante a editar.
 * @param {Array<import('express-validator').ValidationChain>} representanteValidations.editarRepresentanteValidations - Middlewares de validación para la edición de representantes.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} editarRepresentante - Controlador que maneja la lógica de edición de representante.
 */
router.put(
    '/:id_representante',
    representanteValidations.editarRepresentanteValidations,
    validar,
    editarRepresentante
);

/**
 * @description Ruta para eliminar un representante del sistema por su ID.
 * Aplica validación al parámetro `id_representante`.
 * @method DELETE
 * @route /representantes/:id_representante
 * @param {string} :id_representante - ID único del representante a eliminar.
 * @param {Array<import('express-validator').ValidationChain>} representanteValidations.editarRepresentanteValidations - Middlewares de validación para el ID del representante (solo el parámetro).
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} eliminarRepresentante - Controlador que maneja la lógica de eliminación de representante.
 */
router.delete(
    '/:id_representante',
    representanteValidations.editarRepresentanteValidations.filter(v => v.builder.fields.includes('id_representante')),
    validar,
    eliminarRepresentante
);

export default router;