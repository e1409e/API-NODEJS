import express from 'express';
import {
    registrarUsuario,
    iniciarSesion,
    obtenerTodosLosUsuarios,
    editarUsuario,
    eliminarUsuario,
    obtenerPasswordUsuario,
    obtenerUsuarioPorId,
    obtenerNombrePorCedula // <-- Importa la función
} from '../controllers/usuarios.controller.js';

const router = express.Router();

// POST /usuarios/registrar - Registrar un nuevo usuario
router.post('/registrar', registrarUsuario);

// POST /usuarios/login - Iniciar sesión
router.post('/login', iniciarSesion);

// GET /usuarios - Obtener todos los usuarios
router.get('/', obtenerTodosLosUsuarios);

// GET /usuarios/:id_usuario - Obtener un usuario por ID
router.get('/:id_usuario', obtenerUsuarioPorId);

// PUT /usuarios/:id_usuario - Editar un usuario
router.put('/:id_usuario', editarUsuario);

// DELETE /usuarios/:id_usuario - Eliminar un usuario
router.delete('/:id_usuario', eliminarUsuario);

// GET /usuarios/:id_usuario/password - Obtener la contraseña de un usuario
router.get('/:id_usuario/password', obtenerPasswordUsuario);

// GET /usuarios/cedula/:cedula_usuario - Obtener nombre y apellido por cédula
router.get('/cedula/:cedula_usuario', obtenerNombrePorCedula);

export default router;