import dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { getDatabaseUrl, DB_SOURCE, NEON_DATABASE_URL, DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } from './config.js';

/**
 * @file Configura la conexión a la base de datos PostgreSQL usando Neon o local según configuración.
 * @description Permite alternar entre NeonDB y una base de datos local usando la función getDatabaseUrl().
 * @author Eric
 * @version 1.1.0
 * @module db
 */

const dbUrl = getDatabaseUrl();
if (!dbUrl) {
  throw new Error('No se ha definido la cadena de conexión a la base de datos. Verifica tu archivo .env');
}

export const sql = neon(dbUrl);

if ((DB_SOURCE || '').trim().toLowerCase() === 'neon') {
  console.log(`Conectado a NeonDB correctamente: ${NEON_DATABASE_URL}`);
} else {
  console.log(`Conectado a PostgreSQL local correctamente:`);
  console.log(`Host: ${DB_HOST}`);
  console.log(`Usuario: ${DB_USER}`);
  console.log(`Base de datos: ${DB_DATABASE}`);
  console.log(`Puerto: ${DB_PORT}`);
}