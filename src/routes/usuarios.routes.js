/**
 * @file Este archivo define las rutas para la gestión de usuarios en la API.
 * @description Cada ruta está asociada a una función controladora que maneja la lógica de negocio,
 * y en los casos donde se requiere, se aplica un middleware de validación para asegurar
 * la integridad y el formato correcto de los datos recibidos en las peticiones.
 * Utiliza `express.Router()` para modularizar y organizar las rutas de usuarios.
 * @author Eric
 * @version 1.0.0
 * @module routes/usuarios.routes
 * @see {@link module:controllers/usuarios.controller} Para la lógica de negocio de cada ruta.
 * @see {@link module:validations/usuarios.validations} Para las reglas de validación de datos.
 */

import express from 'express';
import {
    registrarUsuario,
    iniciarSesion,
    obtenerTodosLosUsuarios,
    editarUsuario,
    eliminarUsuario,
    obtenerPasswordUsuario,
    obtenerUsuarioPorId,
    obtenerNombrePorCedula
} from '../controllers/usuarios.controller.js';

import { usuarioValidations } from '../validations/usuarios.validations.js';
import { validationResult } from 'express-validator';

/**
 * @description Instancia de Express Router para gestionar las rutas de usuarios.
 * @type {express.Router}
 */
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
 * @description Ruta para registrar un nuevo usuario.
 * Aplica las validaciones definidas en `registrarUsuarioValidations` antes de ejecutar el controlador.
 * @method POST
 * @route /usuarios/registrar
 * @param {Array<import('express-validator').ValidationChain>} usuarioValidations.registrarUsuarioValidations - Middlewares de validación para el registro.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} registrarUsuario - Controlador que maneja la lógica de registro de usuario.
 */
router.post('/registrar', usuarioValidations.registrarUsuarioValidations, validar, registrarUsuario);

/**
 * @description Ruta para iniciar sesión de un usuario.
 * Aplica las validaciones definidas en `iniciarSesionValidations` antes de ejecutar el controlador.
 * @method POST
 * @route /usuarios/login
 * @param {Array<import('express-validator').ValidationChain>} usuarioValidations.iniciarSesionValidations - Middlewares de validación para el inicio de sesión.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} iniciarSesion - Controlador que maneja la lógica de inicio de sesión.
 */
router.post('/login', usuarioValidations.iniciarSesionValidations, validar, iniciarSesion);

/**
 * @description Ruta para obtener todos los usuarios registrados en el sistema.
 * @method GET
 * @route /usuarios
 * @param {function} obtenerTodosLosUsuarios - Controlador que devuelve todos los usuarios.
 */
router.get('/', obtenerTodosLosUsuarios);

/**
 * @description Ruta para obtener la información de un usuario específico por su ID.
 * @method GET
 * @route /usuarios/:id_usuario
 * @param {string} :id_usuario - ID único del usuario.
 * @param {function} obtenerUsuarioPorId - Controlador que busca y devuelve un usuario por ID.
 */
router.get('/:id_usuario', obtenerUsuarioPorId);

/**
 * @description Ruta para editar la información de un usuario existente.
 * Aplica las validaciones definidas en `editarUsuarioValidations` antes de ejecutar el controlador.
 * @method PUT
 * @route /usuarios/:id_usuario
 * @param {string} :id_usuario - ID único del usuario a editar.
 * @param {Array<import('express-validator').ValidationChain>} usuarioValidations.editarUsuarioValidations - Middlewares de validación para la edición.
 * @param {function} validar - Middleware para manejar los resultados de la validación.
 * @param {function} editarUsuario - Controlador que maneja la lógica de edición de usuario.
 */
router.put('/:id_usuario', usuarioValidations.editarUsuarioValidations, validar, editarUsuario);

/**
 * @description Ruta para eliminar un usuario del sistema por su ID.
 * @method DELETE
 * @route /usuarios/:id_usuario
 * @param {string} :id_usuario - ID único del usuario a eliminar.
 * @param {function} eliminarUsuario - Controlador que maneja la lógica de eliminación de usuario.
 */
router.delete('/:id_usuario', eliminarUsuario);

/**
 * @description Ruta para obtener la contraseña de un usuario específico por su ID.
 * **Nota de Seguridad:** En un entorno de producción, esta ruta debería estar protegida
 * con autenticación y autorización para administradores, ya que expone información sensible.
 * @method GET
 * @route /usuarios/:id_usuario/password
 * @param {string} :id_usuario - ID único del usuario cuya contraseña se desea obtener.
 * @param {function} obtenerPasswordUsuario - Controlador que devuelve la contraseña de un usuario.
 */
router.get('/:id_usuario/password', obtenerPasswordUsuario);

/**
 * @description Ruta para obtener el nombre y apellido de un usuario a partir de su cédula.
 * @method GET
 * @route /usuarios/cedula/:cedula_usuario
 * @param {string} :cedula_usuario - Cédula de identidad del usuario.
 * @param {function} obtenerNombrePorCedula - Controlador que devuelve el nombre y apellido del usuario por cédula.
 */
router.get('/cedula/:cedula_usuario', obtenerNombrePorCedula);

export default router;