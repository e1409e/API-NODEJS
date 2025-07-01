/**
 * @file Este archivo contiene funciones de utilidad para el formateo de cadenas de texto.
 * @description Proporciona funciones para convertir texto a minúsculas y a formato "Capital Case" (primera letra de cada palabra en mayúscula).
 * @author Eric
 * @version 1.0.0
 * @module utilities/formatters
 */

/**
 * @description Convierte una cadena de texto a minúsculas.
 * Si el valor de entrada no es una cadena, se devuelve el valor original sin modificar.
 * @param {string} text - La cadena de texto a convertir.
 * @returns {string} La cadena de texto convertida a minúsculas.
 * Retorna el valor original si el tipo de `text` no es `string`.
 */
export const toLowerCase = (text) => {
  if (typeof text !== 'string') {
    return text;
  }
  return text.toLowerCase();
};

/**
 * @description Convierte una cadena de texto a formato "Capital Case", donde la primera letra de cada palabra se convierte en mayúscula
 * y el resto de la palabra en minúscula. Maneja múltiples espacios entre palabras.
 * Si el valor de entrada no es una cadena, se devuelve el valor original sin modificar.
 * @param {string} text - La cadena de texto a convertir.
 * @returns {string} La cadena de texto formateada en "Capital Case".
 * Retorna el valor original si el tipo de `text` no es `string`.
 */
export const toCapitalCase = (text) => {
  if (typeof text !== 'string') {
    return text;
  }
  return text
    .toLowerCase() // Primero convierte toda la cadena a minúsculas
    .split(' ')    // Divide la cadena en un array de palabras usando el espacio como delimitador
    .map(word => {
      // Para cada palabra en el array:
      if (word.length === 0) return ''; // Si la palabra está vacía (debido a espacios dobles), devuelve una cadena vacía.
      // Convierte la primera letra de la palabra a mayúscula y concatena el resto de la palabra (desde el segundo carácter).
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' '); // Une todas las palabras de nuevo en una sola cadena, separadas por un espacio.
};