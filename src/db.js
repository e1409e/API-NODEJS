/**
 * @file Este archivo configura la conexión a la base de datos PostgreSQL utilizando el cliente Neon.
 * @description Se encarga de cargar las variables de entorno y establecer la instancia de conexión
 * que será utilizada por el resto de la aplicación para interactuar con la base de datos.
 * @author Eric
 * @version 1.0.0
 * @module db
 */

// Importaciones y configuración de la base de datos
// -------------------------------------------------

import { neon } from '@neondatabase/serverless'; // Se importa el cliente Neon, necesario para interactuar con bases de datos alojadas en Neon.
import dotenv from 'dotenv'; // Se importa dotenv, un módulo que permite cargar variables de entorno desde el archivo .env del proyecto.

// Cargar variables de entorno
// ---------------------------
/**
 * @description La función `dotenv.config()` es invocada para cargar todas las variables definidas
 * en el archivo `.env` del directorio raíz del proyecto en `process.env`.
 * Esto es crucial para acceder de forma segura a la URL de conexión de la base de datos,
 * evitando que credenciales sensibles se codifiquen directamente en el código fuente.
 * @function
 */
dotenv.config();

// Inicializar y exportar la conexión a la base de datos
// ----------------------------------------------------
/**
 * @description Se crea una instancia de conexión a la base de datos de Neon.
 * La URL de conexión se obtiene de `process.env.DATABASE_URL`, la cual debe estar
 * configurada en el archivo `.env` (ejemplo: `DATABASE_URL="postgres://usuario:contraseña@host:puerto/bd"`).
 * Esta instancia de conexión, nombrada `sql`, se exporta para que pueda ser
 * importada y utilizada por otros módulos de la aplicación que necesiten
 * realizar consultas o interacciones con la base de datos.
 * @type {function}
 * @constant
 * @see {@link https://neon.tech/} Para más información sobre Neon Database.
 */
export const sql = neon(process.env.DATABASE_URL);