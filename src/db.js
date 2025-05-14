import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de cargar las variables de entorno desde .env

export const sql = neon(process.env.DATABASE_URL);

// Nota: Con @neondatabase/serverless, no necesitas crear explícitamente un pool
// de la misma manera que con 'pg'. La biblioteca maneja la conexión
// de manera eficiente para el entorno serverless de Neon.
