import { sql } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { usuarioValidations } from '../validations/usuarios.validations.js';

const secretKey = process.env.JWT_SECRET || 'miSecreto'; // ¡Cambia 'miSecreto' en producción!

// Función para registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
    await Promise.all(usuarioValidations.registrarUsuarioValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, apellido, cedula_usuario, password } = req.body;

        // 1. Verificar si el usuario ya existe
        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE cedula_usuario = ${cedula_usuario}
        `;

        if (usuarioExistente.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // 2. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el "salt rounds"

        // 3. Insertar el nuevo usuario en la base de datos
        await sql`
            INSERT INTO usuarios (nombre, apellido, cedula_usuario, password)
            VALUES (${nombre}, ${apellido}, ${cedula_usuario}, ${hashedPassword})
        `;

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Función para iniciar sesión
export const iniciarSesion = async (req, res) => {
    await Promise.all(usuarioValidations.iniciarSesionValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { cedula_usuario, password } = req.body;

        // 1. Buscar al usuario por cedula_usuario
        const usuario = await sql`
            SELECT * FROM usuarios WHERE cedula_usuario = ${cedula_usuario}
        `;

        if (usuario.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' }); // 401 Unauthorized
        }

        // 2. Comparar la contraseña hasheada
        const validPassword = await bcrypt.compare(password, usuario[0].password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Generar un JWT
        const token = jwt.sign(
            { userId: usuario[0].id_usuario, cedula_usuario: usuario[0].cedula_usuario },
            secretKey,
            { expiresIn: '1h' } // El token expira en 1 hora (ajusta según tus necesidades)
        );

        res.json({ token }); // Enviar solo el token
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// Función para obtener todos los usuarios (Ejemplo de ruta protegida)
export const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const usuarios = await sql`SELECT * FROM usuarios`;
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Función para editar un usuario
export const editarUsuario = async (req, res) => {
    await Promise.all(usuarioValidations.editarUsuarioValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_usuario } = req.params;
        const { nombre, apellido, cedula_usuario, password } = req.body;

        // 1. Verificar si el usuario existe
        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

        if (usuarioExistente.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Hashear la nueva contraseña (si se proporciona)
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // 3. Actualizar el usuario en la base de datos
        await sql`
            SELECT editar_usuario(
                ${id_usuario},
                ${nombre},
                ${apellido},
                ${cedula_usuario},
                ${hashedPassword || usuarioExistente[0].password}
            )
        `;

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar usuario:', error);
        res.status(500).json({ error: 'Error al editar usuario' });
    }
};

// Función para eliminar un usuario
export const eliminarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        // 1. Verificar si el usuario existe
        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

        if (usuarioExistente.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Eliminar el usuario de la base de datos
        await sql`
            SELECT eliminar_usuario(${id_usuario})
        `;

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};