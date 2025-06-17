import express from 'express';
import {
    registrarUsuario,
    iniciarSesion,
    obtenerTodosLosUsuarios,
    editarUsuario,
    eliminarUsuario,
    obtenerPasswordUsuario
} from '../controllers/usuarios.controller.js'; // Asegúrate de que la ruta al controlador sea correcta
import { verificarToken } from '../middlewares/auth.middleware.js'; // Si vas a usar middleware de autenticación

const router = express.Router();

// POST /usuarios/registrar - Registrar un nuevo usuario
router.post('/registrar', registrarUsuario);

// POST /usuarios/login - Iniciar sesión
router.post('/login', iniciarSesion);

// GET /usuarios - Obtener todos los usuarios (requiere autenticación como ejemplo)
router.get('/', obtenerTodosLosUsuarios); // Ejemplo de ruta protegida con middleware

// PUT /usuarios/:id_usuario - Editar un usuario
router.put('/:id_usuario', editarUsuario);

// DELETE /usuarios/:id_usuario - Eliminar un usuario
router.delete('/:id_usuario', eliminarUsuario);
// GET /usuarios/:id_usuario/password - Obtener la contraseña de un usuario
router.get('/:id_usuario/password', obtenerPasswordUsuario);

export default router;