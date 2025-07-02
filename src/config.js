import dotenv from 'dotenv';
dotenv.config();

/**
 * @file Este archivo contiene las variables de configuración global de la aplicación.
 * @description Permite alternar entre diferentes orígenes de base de datos (Neon o local)
 * según la variable de entorno DB_SOURCE.
 * @author Eric
 * @version 1.1.0
 * @module config
 */

export const DB_SOURCE = process.env.DB_SOURCE || "neon";

// NeonDB
export const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL;

// Local (usa nombres consistentes)
export const DB_HOST = process.env.LOCAL_DB_HOST;
export const DB_USER = process.env.LOCAL_DB_USER;
export const DB_PASSWORD = process.env.LOCAL_DB_PASSWORD;
export const DB_DATABASE = process.env.LOCAL_DB_NAME;
export const DB_PORT = process.env.LOCAL_DB_PORT;

// Puerto de la API
export const PORT = process.env.PORT || 3000;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;

// Exporta la URL de conexión final según el origen
export function getDatabaseUrl() {
  if ((DB_SOURCE || '').trim().toLowerCase() === "neon") {
    return NEON_DATABASE_URL;
  }
  // Construye la URL para PostgreSQL local usando los nombres consistentes
  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
}