import { sql } from '../db.js';

// Registrar un nuevo usuario (sin hash)
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, apellido, cedula_usuario, password } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE cedula_usuario = ${cedula_usuario}
        `;

        if (usuarioExistente.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Insertar el nuevo usuario en la base de datos
        await sql`
            INSERT INTO usuarios (nombre, apellido, cedula_usuario, password)
            VALUES (${nombre}, ${apellido}, ${cedula_usuario}, ${password})
        `;

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Iniciar sesión (sin hash ni token)
export const iniciarSesion = async (req, res) => {
    try {
        const { cedula_usuario, password } = req.body;

        // Buscar al usuario por cedula_usuario y password
        const usuario = await sql`
            SELECT * FROM usuarios WHERE cedula_usuario = ${cedula_usuario} AND password = ${password}
        `;

        if (usuario.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas', success: false });
        }

        // Extraer datos básicos del usuario (sin password)
        const { id_usuario, nombre, apellido, cedula_usuario: cedula } = usuario[0];

        res.json({
            message: 'Inicio de sesión exitoso',
            success: true
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión', success: false });
    }
};

// Obtener todos los usuarios
export const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const usuarios = await sql`SELECT * FROM usuarios`;
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Editar un usuario (sin hash)
export const editarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { nombre, apellido, cedula_usuario, password } = req.body;

        // Verificar si el usuario existe
        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

        if (usuarioExistente.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar el usuario en la base de datos
        await sql`
            SELECT editar_usuario(
                ${id_usuario},
                ${nombre},
                ${apellido},
                ${cedula_usuario},
                ${password}
            )
        `;

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar usuario:', error);
        res.status(500).json({ error: 'Error al editar usuario' });
    }
};

// Eliminar un usuario
export const eliminarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        // Verificar si el usuario existe
        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

        if (usuarioExistente.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Eliminar el usuario de la base de datos
        await sql`
            SELECT eliminar_usuario(${id_usuario})
        `;

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};