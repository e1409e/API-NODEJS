import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de cargar las variables de entorno desde .env

export const sql = neon(process.env.DATABASE_URL);

