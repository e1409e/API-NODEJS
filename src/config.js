/**
 * @file Este archivo contiene las variables de configuración global de la aplicación.
 * @description Exporta las variables de entorno relacionadas con la conexión a la base de datos
 * y el puerto en el que la aplicación Express escuchará las peticiones.
 * @author Eric
 * @version 1.0.0
 * @module config
 */

/**
 * @description Usuario de la base de datos.
 * Se obtiene de la variable de entorno `DB_USER`.
 * @type {string}
 * @constant
 */
export const DB_USER = process.env.DB_USER;

/**
 * @description Host de la base de datos.
 * Se obtiene de la variable de entorno `DB_HOST`.
 * @type {string}
 * @constant
 */
export const DB_HOST = process.env.DB_HOST;

/**
 * @description Contraseña de la base de datos.
 * Se obtiene de la variable de entorno `DB_PASSWORD`.
 * @type {string}
 * @constant
 */
export const DB_PASSWORD = process.env.DB_PASSWORD;

/**
 * @description Nombre de la base de datos.
 * Se obtiene de la variable de entorno `DB_DATABASE`.
 * @type {string}
 * @constant
 */
export const DB_DATABASE = process.env.DB_DATABASE;

/**
 * @description Puerto de la base de datos.
 * Se obtiene de la variable de entorno `DB_PORT`.
 * @type {string} | {number}
 * @constant
 */
export const DB_PORT = process.env.DB_PORT;

/**
 * @description Puerto en el que la aplicación Express escuchará las peticiones.
 * Se obtiene de la variable de entorno `PORT`. Si `PORT` no está definida,
 * por defecto se utilizará el puerto `3000`.
 * @type {string} | {number}
 * @constant
 */
export const PORT = process.env.PORT || 3000;