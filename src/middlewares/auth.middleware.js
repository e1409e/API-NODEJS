/**
 * @file Middleware de autenticación y autorización JWT.
 * @description Contiene funciones middleware para verificar tokens JWT en las solicitudes
 * y para autorizar el acceso basado en roles de usuario.
 * @author Eric
 * @version 1.0.0
 * @module middlewares/auth.middleware
 * @see {@link module:config} Para la clave secreta JWT.
 */

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

/**
 * @function authenticateToken
 * @description Middleware para verificar la validez de un token JWT presente en el encabezado de autorización.
 * Si el token es válido, decodifica la información del usuario y la adjunta al objeto `req.user`.
 * Si el token no es válido o está ausente, responde con un error 401 (Unauthorized) o 403 (Forbidden).
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware o controlador.
 * @returns {void} Responde con errores de autenticación o pasa al siguiente middleware.
 */
export const authenticateToken = (req, res, next) => {
    // Obtener el encabezado de autorización
    const authHeader = req.headers['authorization'];
    // El token se espera en el formato "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Si no hay token, el usuario no está autorizado
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    // Verificar el token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Si el token no es válido (ej. expirado, firma incorrecta)
            return res.status(403).json({ mensaje: 'Token no válido o expirado.' });
        }
        // Si el token es válido, adjuntar la información del usuario al objeto de solicitud
        // Asegúrate de que el payload del JWT contenga la información necesaria (ej. id, rol)
        req.user = user;
        next(); // Pasar al siguiente middleware o ruta
    });
};

/**
 * @function authorizeRoles
 * @description Middleware factory que devuelve un middleware para restringir el acceso basado en los roles de usuario.
 * Solo permite que la solicitud continúe si el rol del usuario autenticado (adjunto en `req.user.role`)
 * coincide con alguno de los roles permitidos.
 * @param {...string} allowedRoles - Uno o más roles permitidos (ej. 'admin', 'editor', 'user').
 * @returns {function} Un middleware de Express.
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Verificar si la información del usuario (del JWT) está disponible
        if (!req.user || !req.user.role) {
            return res.status(403).json({ mensaje: 'No autorizado. Información de rol no disponible.' });
        }

        // Verificar si el rol del usuario está incluido en los roles permitidos
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ mensaje: 'Acceso denegado. No tienes los permisos necesarios.' });
        }

        next(); // El usuario tiene el rol permitido, pasar al siguiente middleware o ruta
    };
};