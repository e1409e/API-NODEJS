// utilities/formatters.js

/**
 * Convierte una cadena de texto a minúsculas.
 * @param {string} text - La cadena de texto a convertir.
 * @returns {string} La cadena en minúsculas o el valor original si no es una cadena.
 */
export const toLowerCase = (text) => {
    if (typeof text !== 'string') {
        return text;
    }
    return text.toLowerCase();
};

/**
 * Convierte una cadena de texto a formato "Capital Case" (primera letra de cada palabra en mayúscula).
 * @param {string} text - La cadena de texto a convertir.
 * @returns {string} La cadena formateada o el valor original si no es una cadena.
 */
export const toCapitalCase = (text) => {
    if (typeof text !== 'string') {
        return text;
    }
    return text
        .toLowerCase()
        .split(' ')
        .map(word => {
            if (word.length === 0) return ''; // Maneja espacios dobles o palabras vacías
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};