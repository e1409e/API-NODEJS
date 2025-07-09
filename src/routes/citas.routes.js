/**
 * @file Este archivo define las rutas para la gestión de citas en la API.
 * @description Configura los endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * sobre las citas, así como una operación para marcar citas como realizadas. Enlaza cada ruta
 * con su controlador correspondiente. Las validaciones de los datos de entrada se manejan
 * directamente dentro de los controladores de citas.
 * Incorpora autenticación JWT para asegurar que solo usuarios válidos puedan acceder a los recursos.
 * @author Eric
 * @version 1.0.0
 * @module routes/citas.routes
 * @see {@link module:controllers/citas.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/citas.validations} Para las reglas de validación de datos.
 * @see {@link module:middlewares/auth.middleware} Para el middleware de autenticación.
 */

import express from 'express';
import {
    obtenerTodasLasCitas,
    obtenerCitaPorId,
    crearCita,
    actualizarCita,
    eliminarCita,
    marcarCitaComoRealizada
} from '../controllers/citas.controller.js';

// Importar el middleware de autenticación
import { authenticateToken } from '../middlewares/auth.middleware.js';

/**
 * @description Instancia de Express Router para gestionar las rutas de citas.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * @description Ruta para obtener todas las citas registradas en el sistema.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * @method GET
 * @route /citas
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} obtenerTodasLasCitas - Controlador que maneja la lógica para obtener todas las citas.
 */
router.get('/', authenticateToken, obtenerTodasLasCitas);

/**
 * @description Ruta para obtener la información de una cita específica por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * @method GET
 * @route /citas/:id_citas
 * @param {string} :id_citas - ID único de la cita a buscar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} obtenerCitaPorId - Controlador que maneja la lógica para obtener una cita por ID.
 */
router.get('/:id_citas', authenticateToken, obtenerCitaPorId);

/**
 * @description Ruta para crear una nueva cita.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Los datos esperados en el cuerpo de la solicitud son `id_estudiante`, `fecha_cita` y `motivo_cita` (opcional).
 * Las validaciones de estos campos se realizan dentro del controlador `crearCita`.
 * @method POST
 * @route /citas
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} crearCita - Controlador que maneja la lógica para crear una nueva cita.
 */
router.post('/', authenticateToken, crearCita);

/**
 * @description Ruta para actualizar una cita existente por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Los datos que pueden ser actualizados en el cuerpo de la solicitud son `id_estudiante`, `fecha_cita`, `motivo_cita` y `pendiente` (todos opcionales).
 * Las validaciones para el ID de la cita y los campos del cuerpo se realizan dentro del controlador `actualizarCita`.
 * @method PUT
 * @route /citas/:id_citas
 * @param {string} :id_citas - ID único de la cita a actualizar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} actualizarCita - Controlador que maneja la lógica para actualizar una cita.
 */
router.put('/:id_citas', authenticateToken, actualizarCita);

/**
 * @description Ruta para eliminar una cita del sistema por su ID.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * La validación del `id_citas` se realiza dentro del controlador `eliminarCita`.
 * @method DELETE
 * @route /citas/:id_citas
 * @param {string} :id_citas - ID único de la cita a eliminar.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} eliminarCita - Controlador que maneja la lógica para eliminar una cita.
 */
router.delete('/:id_citas', authenticateToken, eliminarCita);

/**
 * @description Ruta para marcar una cita específica como realizada.
 * Requiere autenticación JWT: solo usuarios válidos pueden acceder.
 * Esta es una actualización parcial de un recurso existente, por lo que se utiliza el método PATCH.
 * @method PATCH
 * @route /citas/marcar-realizada/:id_citas
 * @param {string} :id_citas - ID único de la cita a marcar como realizada.
 * @param {function} authenticateToken - Middleware para verificar el token JWT.
 * @param {function} marcarCitaComoRealizada - Controlador que maneja la lógica para marcar una cita como realizada.
 */
router.patch('/marcar-realizada/:id_citas', authenticateToken, marcarCitaComoRealizada);

export default router;