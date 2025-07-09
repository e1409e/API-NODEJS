/**
 * @file Este archivo contiene los controladores para la gestión de usuarios.
 * @description Cada función implementa la lógica de negocio para registrar, autenticar,
 * consultar, editar y eliminar usuarios, así como obtener información específica
 * como la contraseña o el nombre por cédula.
 * @author Eric
 * @version 1.0.0
 * @see {@link ../db.js} Para la configuración de la conexión a la base de datos.
 * @see {@link module:config} Para la clave secreta JWT.
 * @WARNING: Las contraseñas NO están hasheadas en este ambiente. Esto es EXCLUSIVAMENTE para fines demostrativos.
 * En producción, se DEBE usar bcrypt para hashear las contraseñas.
 */

import { sql } from "../db.js";
import { toCapitalCase } from "../utilities/formatters.js"; // Importa la función de formateo
import jwt from 'jsonwebtoken'; // ¡Importamos jsonwebtoken!
import { JWT_SECRET } from '../config.js'; // ¡Importamos la clave secreta JWT!

/**
 * @description Controlador para registrar un nuevo usuario en el sistema.
 * Valida la existencia previa del usuario por cédula y el rol proporcionado antes de la inserción.
 * Aplica formato "Capital Case" a los campos `nombre` y `apellido`.
 * **NOTA DE SEGURIDAD:** La contraseña se almacenará en texto plano. En un ambiente de producción, DEBE ser hasheada.
 * @param {object} req - Objeto de solicitud de Express. Se espera que contenga en `req.body`:
 * - `nombre` (string): El nombre del usuario.
 * - `apellido` (string): El apellido del usuario.
 * - `cedula_usuario` (string): La cédula de identidad única del usuario.
 * - `password` (string): La contraseña del usuario.
 * - `rol` (string): El rol asignado al usuario (ej. "administrador", "psicologo", "docente").
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un estado HTTP y un mensaje JSON.
 * @throws {Error} Si ocurre un error durante la interacción con la base de datos o la validación.
 * @method POST
 * @route /api/usuarios/registrar
 */
export const registrarUsuario = async (req, res) => {
    try {
        let { nombre, apellido, cedula_usuario, password, rol } = req.body;

        nombre = toCapitalCase(nombre);
        apellido = toCapitalCase(apellido);

        if (!["administrador", "psicologo", "docente"].includes(rol)) {
            return res.status(400).json({ error: "Rol inválido proporcionado." });
        }

        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE cedula_usuario = ${cedula_usuario}
        `;

        if (usuarioExistente.length > 0) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        // **¡ADVERTENCIA! Contraseña almacenada en texto plano para fines demostrativos.**
        // En producción: const hashedPassword = await bcrypt.hash(password, saltRounds);
        // INSERT INTO ... VALUES (${hashedPassword}, ${rol})
        await sql`
            INSERT INTO usuarios (nombre, apellido, cedula_usuario, password, rol)
            VALUES (${nombre}, ${apellido}, ${cedula_usuario}, ${password}, ${rol})
        `;

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

/**
 * @description Controlador para el inicio de sesión de un usuario.
 * Autentica al usuario verificando su cédula y contraseña **en texto plano**.
 * Si las credenciales son válidas, **genera un token JWT** y lo devuelve.
 * @param {object} req - Objeto de solicitud de Express. Se espera que contenga en `req.body`:
 * - `cedula_usuario` (string): La cédula de identidad del usuario.
 * - `password` (string): La contraseña proporcionada por el usuario.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un estado HTTP y un mensaje JSON con el resultado del inicio de sesión y un token JWT.
 * @throws {Error} Si ocurre un error durante la interacción con la base de datos.
 * @method POST
 * @route /api/usuarios/login
 */
export const iniciarSesion = async (req, res) => {
    try {
        const { cedula_usuario, password } = req.body;

        // **¡ADVERTENCIA! Comparación de contraseña en texto plano para fines demostrativos.**
        // En producción, aquí se usaría bcrypt.compare(password, usuarioEncontrado.password);
        const usuarioResult = await sql`
            SELECT id_usuario, nombre, apellido, cedula_usuario, password, rol
            FROM usuarios WHERE cedula_usuario = ${cedula_usuario} AND password = ${password}
        `;

        if (usuarioResult.length === 0) {
            // Usuario no encontrado o contraseña incorrecta
            return res.status(401).json({ error: 'Credenciales inválidas', success: false });
        }

        const usuarioEncontrado = usuarioResult[0];

        // Si las credenciales son válidas, generar un JWT
        const payload = {
            id: usuarioEncontrado.id_usuario,
            cedula_usuario: usuarioEncontrado.cedula_usuario,
            rol: usuarioEncontrado.rol
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // Token expira en 1 hora

        // Responde con el token y la información necesaria
        res.json({
            message: 'Inicio de sesión exitoso',
            success: true,
            rol: usuarioEncontrado.rol,
            id_usuario: usuarioEncontrado.id_usuario,
            token: token // ¡Enviar el token al cliente!
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión', success: false });
    }
};

/**
 * @description Controlador para obtener una lista de todos los usuarios registrados en el sistema.
 * @param {object} req - Objeto de solicitud de Express (no se esperan parámetros específicos).
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un estado HTTP y un array JSON de objetos de usuario.
 * @throws {Error} Si ocurre un error durante la interacción con la base de datos.
 * @method GET
 * @route /api/usuarios
 */
export const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    // Realiza una consulta SQL para seleccionar todos los registros de la tabla `usuarios`.
    const usuarios = await sql`SELECT * FROM usuarios`;
    // Responde con un estado 200 (OK) y la lista de usuarios.
    res.json(usuarios);
  } catch (error) {
    // Captura y registra cualquier error.
    console.error("Error al obtener usuarios:", error);
    // Responde con un estado 500 (Internal Server Error).
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

/**
 * @description Controlador para obtener la contraseña (en texto plano) de un usuario específico por su ID.
 * **ADVERTENCIA DE SEGURIDAD CRÍTICA:** Esta función expone la contraseña en texto plano.
 * Esto es EXTREMADAMENTE peligroso y solo se permite aquí para un entorno demostrativo con tu conocimiento expreso.
 * En producción, esta función DEBE ser eliminada o reemplazada por un sistema de restablecimiento de contraseña seguro.
 * @param {object} req - Objeto de solicitud de Express. Se espera que contenga en `req.params`:
 * - `id_usuario` (string | number): El ID del usuario cuya contraseña se desea obtener.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un estado HTTP y un JSON que contiene la contraseña en texto plano o un mensaje de error.
 * @throws {Error} Si ocurre un error durante la interacción con la base de datos.
 * @method GET
 * @route /api/usuarios/password/:id_usuario
 */
export const obtenerPasswordUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        // La protección de esta ruta con `authenticateToken` y `authorizeRoles('admin')`
        // ya se implementó en `usuarios.routes.js`. Esto asegura que solo los
        // administradores autenticados puedan acceder a esta función.

        const usuario = await sql`
            SELECT password FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

        if (usuario.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        // Se responde con la contraseña en texto plano
        // ¡ADVERTENCIA: ESTO ES INSEGURO EN PRODUCCIÓN!
        res.json({ password: usuario[0].password });
    } catch (error) {
        console.error("Error al obtener contraseña:", error);
        res.status(500).json({ error: "Error al obtener contraseña" });
    }
};

/**
 * @description Controlador para editar la información de un usuario existente.
 * Permite actualizar el nombre, apellido, cédula, **contraseña (en texto plano si se proporciona)** y/o rol del usuario.
 * Aplica formato "Capital Case" a los campos `nombre` y `apellido` si se proporcionan.
 * @param {object} req - Objeto de solicitud de Express. Se espera que contenga:
 * - `req.params.id_usuario` (string | number): El ID del usuario a editar.
 * - `req.body`: Puede incluir cualquiera de los siguientes campos para actualizar:
 * - `nombre` (string, opcional)
 * - `apellido` (string, opcional)
 * - `cedula_usuario` (string, opcional)
 * - `password` (string, opcional) // Si se proporciona, se usará en texto plano
 * - `rol` (string, opcional)
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un estado HTTP y un mensaje JSON.
 * @throws {Error} Si ocurre un error durante la interacción con la base de datos o la validación.
 * @method PUT
 * @route /api/usuarios/:id_usuario
 */
export const editarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        let { nombre, apellido, cedula_usuario, password, rol } = req.body;

        if (nombre) nombre = toCapitalCase(nombre);
        if (apellido) apellido = toCapitalCase(apellido);

        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

        if (usuarioExistente.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (rol && !['administrador', 'psicologo', 'docente'].includes(rol)) {
            return res.status(400).json({ error: 'Rol inválido proporcionado para actualización.' });
        }

        // **¡ADVERTENCIA! Contraseña actualizada en texto plano para fines demostrativos.**
        // En producción: const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Y pasar hashedPassword al SELECT editar_usuario
        let updatedPassword = password; // Se usa la contraseña tal cual si se proporciona

        await sql`
            SELECT editar_usuario(
                ${id_usuario},
                ${nombre},
                ${apellido},
                ${cedula_usuario},
                ${updatedPassword}, // Pasa la contraseña en texto plano si fue proporcionada
                ${rol}
            )
        `;

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar usuario:', error);
        res.status(500).json({ error: 'Error al editar usuario' });
    }
};

/**
 * @description Controlador para eliminar un usuario existente del sistema.
 * @param {object} req - Objeto de solicitud de Express. Se espera que contenga en `req.params`:
 * - `id_usuario` (string | number): El ID del usuario a eliminar.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un estado HTTP y un mensaje JSON.
 * @throws {Error} Si ocurre un error durante la interacción con la base de datos.
 * @method DELETE
 * @route /api/usuarios/:id_usuario
 */
export const eliminarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

        if (usuarioExistente.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await sql`
            SELECT eliminar_usuario(${id_usuario})
        `;

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};

/**
 * @description Controlador para obtener la información detallada de un usuario por su ID.
 * @param {object} req - Objeto de solicitud de Express. Se espera que contenga en `req.params`:
 * - `id_usuario` (string | number): El ID del usuario a buscar.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un estado HTTP y un objeto JSON del usuario.
 * @throws {Error} Si ocurre un error durante la interacción con la base de datos.
 * @method GET
 * @route /api/usuarios/:id_usuario
 */
export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const usuario = await sql`
            SELECT id_usuario, nombre, apellido, cedula_usuario, rol
            FROM usuarios
            WHERE id_usuario = ${id_usuario}
        `;
        if (usuario.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(usuario[0]);
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        res.status(500).json({ error: "Error al obtener usuario por ID" });
    }
};

/**
 * @description Controlador para obtener el nombre y apellido de un usuario utilizando su cédula.
 * @param {object} req - Objeto de solicitud de Express. Se espera que contenga en `req.params`:
 * - `cedula_usuario` (string): La cédula del usuario cuyo nombre y apellido se desean obtener.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Responde con un estado HTTP y un objeto JSON con el nombre y apellido del usuario.
 * @throws {Error} Si ocurre un error durante la interacción con la base de datos.
 * @method GET
 * @route /api/usuarios/cedula/:cedula_usuario/nombre
 */
export const obtenerNombrePorCedula = async (req, res) => {
    try {
        const { cedula_usuario } = req.params;
        const usuario = await sql`
            SELECT nombre, apellido FROM usuarios WHERE cedula_usuario = ${cedula_usuario}
        `;
        if (usuario.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ nombre: usuario[0].nombre, apellido: usuario[0].apellido });
    } catch (error) {
        console.error("Error al obtener nombre por cédula:", error);
        res.status(500).json({ error: "Error al obtener nombre por cédula" });
    }
};