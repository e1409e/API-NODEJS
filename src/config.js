/**
 * @file config.js
 * @module config
 * @description Define y exporta las variables de configuración global de la aplicación, incluyendo parámetros de conexión a la base de datos y variables de entorno.
 * @author Eric
 * @version 1.1.0
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * Origen de la base de datos ("neon" o "local").
 * @type {string}
 */
export const DB_SOURCE = process.env.DB_SOURCE || "neon";

/**
 * URL de conexión a NeonDB.
 * @type {string}
 */
export const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL;

/**
 * Host de la base de datos local.
 * @type {string}
 */
export const DB_HOST = process.env.LOCAL_DB_HOST;

/**
 * Usuario de la base de datos local.
 * @type {string}
 */
export const DB_USER = process.env.LOCAL_DB_USER;

/**
 * Contraseña de la base de datos local.
 * @type {string}
 */
export const DB_PASSWORD = process.env.LOCAL_DB_PASSWORD;

/**
 * Nombre de la base de datos local.
 * @type {string}
 */
export const DB_DATABASE = process.env.LOCAL_DB_NAME;

/**
 * Puerto de la base de datos local.
 * @type {string}
 */
export const DB_PORT = process.env.LOCAL_DB_PORT;

/**
 * Puerto en el que se ejecuta la API.
 * @type {string|number}
 */
export const PORT = process.env.PORT || 3000;

/**
 * Clave secreta para JWT.
 * @type {string}
 */
export const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Construye y retorna la URL de conexión a la base de datos según el origen configurado.
 * @function
 * @returns {string} URL de conexión a la base de datos.
 */
export function getDatabaseUrl() {
  if ((DB_SOURCE || '').trim().toLowerCase() === "neon") {
    return NEON_DATABASE_URL;
  }
  // Construye la URL para PostgreSQL local usando los nombres consistentes
  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
}