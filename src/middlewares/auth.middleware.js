import jwt from 'jsonwebtoken';
import { sql } from '../db.js';

const secretKey = process.env.JWT_SECRET || 'miSecreto';

export const verificarToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Adjunta la información del usuario al objeto 'req'

        // Opcional: Verificar si el usuario existe en la base de datos (por si fue eliminado)
        const user = await sql`SELECT * FROM usuarios WHERE id_usuario = ${decoded.userId}`;
        if (user.length === 0) {
            return res.status(401).json({ error: 'Acceso denegado: Usuario no encontrado' });
        }

        next(); // Continúa con la siguiente función (el controlador)
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(401).json({ error: 'Acceso denegado: Token inválido' });
    }
};