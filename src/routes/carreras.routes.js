/**
 * @file Este archivo define las rutas para la gestión de carreras en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre las carreras, enlazando cada ruta con su controlador correspondiente.
 * Las validaciones de los datos de entrada se manejan directamente dentro de los controladores
 * de carrera, utilizando las funciones de validación de `express-validator`.
 * @author Eric
 * @version 1.0.0
 * @module routes/carreras.routes
 * @see {@link module:controllers/carreras.controller} Para la lógica de negocio de cada ruta.
 */

import express from 'express';
import {
    obtenerCarreras,
    obtenerCarreraPorId,
    crearCarrera,
    editarCarrera,
    eliminarCarrera
} from '../controllers/carreras.controller.js';

/**
 * @description Instancia de Express Router para gestionar las rutas de carreras.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * @description Ruta para obtener todas las carreras registradas en el sistema.
 * @method GET
 * @route /carreras
 * @param {function} obtenerCarreras - Controlador que maneja la lógica para obtener todas las carreras.
 */
router.get('/', obtenerCarreras);

/**
 * @description Ruta para obtener la información de una carrera específica por su ID.
 * @method GET
 * @route /carreras/:id_carrera
 * @param {string} :id_carrera - ID único de la carrera a buscar.
 * @param {function} obtenerCarreraPorId - Controlador que maneja la lógica para obtener una carrera por ID.
 */
router.get('/:id_carrera', obtenerCarreraPorId);

/**
 * @description Ruta para crear una nueva carrera.
 * Los datos esperados en el cuerpo de la solicitud son `carrera` (nombre de la carrera) e `id_facultad`.
 * Las validaciones de estos campos se realizan dentro del controlador `crearCarrera`.
 * @method POST
 * @route /carreras
 * @param {function} crearCarrera - Controlador que maneja la lógica para crear una nueva carrera.
 */
router.post('/', crearCarrera);

/**
 * @description Ruta para editar una carrera existente por su ID.
 * Los datos que pueden ser actualizados en el cuerpo de la solicitud son `carrera` e `id_facultad` (ambos opcionales).
 * Las validaciones para el ID de la carrera y los campos del cuerpo se realizan dentro del controlador `editarCarrera`.
 * @method PUT
 * @route /carreras/:id_carrera
 * @param {string} :id_carrera - ID único de la carrera a editar.
 * @param {function} editarCarrera - Controlador que maneja la lógica para editar una carrera.
 */
router.put('/:id_carrera', editarCarrera);

/**
 * @description Ruta para eliminar una carrera por su ID.
 * La validación del `id_carrera` se realiza dentro del controlador `eliminarCarrera`.
 * @method DELETE
 * @route /carreras/:id_carrera
 * @param {string} :id_carrera - ID único de la carrera a eliminar.
 * @param {function} eliminarCarrera - Controlador que maneja la lógica para eliminar una carrera.
 */
router.delete('/:id_carrera', eliminarCarrera);

export default router;