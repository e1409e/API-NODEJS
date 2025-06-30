import express from 'express';
import { validationResult } from 'express-validator'; // Se importa la función 'validationResult' para recopilar errores de validación.

// Se importan las reglas de validación específicas para el modelo de estudiante.
import { estudianteValidations } from '../validations/estudiantes.validations.js';

import {
    obtenerEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    editarEstudiante,
    eliminarEstudiante
} from '../controllers/estudiantes.controller.js'; // Se importan las funciones controladoras que manejan la lógica de negocio.

const router = express.Router(); // Se crea una instancia del enrutador de Express.

// --- Rutas GET (sin validación de cuerpo, pero con validación de ID para búsqueda específica) ---

// Ruta para obtener todos los estudiantes.
// Esta ruta no requiere validación de cuerpo o parámetros de URL, ya que solo recupera una lista completa.
router.get('/', obtenerEstudiantes);

// Ruta para obtener un estudiante por su ID.
// Se aplica una validación para asegurar que el 'id_estudiante' proporcionado en la URL es un entero válido.
router.get('/:id_estudiante',
    // La primera regla de 'editarEstudianteValidations' valida que 'id_estudiante' sea un entero positivo.
    estudianteValidations.editarEstudianteValidations[0],
    (req, res, next) => {
        const errors = validationResult(req); // Se recopilan los errores de validación del request.
        if (!errors.isEmpty()) {
            // Si existen errores de validación, se envía una respuesta de error 400 (Bad Request).
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Si la validación es exitosa, se pasa el control al siguiente middleware (el controlador).
    },
    obtenerEstudiantePorId
);

// --- Rutas con validación de cuerpo de petición (POST y PUT) ---

// Ruta para crear un nuevo estudiante.
// Se aplican todas las reglas de validación definidas en 'crearEstudianteValidations'
// para asegurar que los datos del cuerpo de la petición sean correctos y completos.
router.post('/',
    estudianteValidations.crearEstudianteValidations, // Middleware de validación para los datos del estudiante.
    (req, res) => {
        const errors = validationResult(req); // Se recopilan los errores de validación.
        if (!errors.isEmpty()) {
            // Si se encuentran errores, se detiene la ejecución y se responde con un estado 400 y los detalles de los errores.
            return res.status(400).json({ errors: errors.array() });
        }
        // Si los datos son válidos, se invoca la función controladora para procesar la creación del estudiante.
        crearEstudiante(req, res);
    }
);

// Ruta para editar un estudiante existente por su ID.
// Se aplican las validaciones de 'editarEstudianteValidations', que incluyen la validación del ID
// y de los campos opcionales del cuerpo de la petición para la actualización.
router.put('/:id_estudiante',
    estudianteValidations.editarEstudianteValidations, // Middleware de validación para los datos de edición.
    (req, res) => {
        const errors = validationResult(req); // Se recopilan los errores de validación.
        if (!errors.isEmpty()) {
            // Si existen errores, se responde con un estado 400 y los errores.
            return res.status(400).json({ errors: errors.array() });
        }
        // Si los datos son válidos, se procede a llamar al controlador para actualizar el estudiante.
        editarEstudiante(req, res);
    }
);

// Ruta para eliminar un estudiante por su ID.
// Se valida el 'id_estudiante' del parámetro de la URL para asegurar que es un valor válido antes de intentar la eliminación.
router.delete('/:id_estudiante',
    // Se reutiliza la primera regla de validación de 'editarEstudianteValidations' para el ID.
    estudianteValidations.editarEstudianteValidations[0],
    (req, res, next) => {
        const errors = validationResult(req); // Se recopilan los errores de validación.
        if (!errors.isEmpty()) {
            // Si hay errores de validación del ID, se envía una respuesta 400.
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Si el ID es válido, se pasa el control al controlador para ejecutar la eliminación.
    },
    eliminarEstudiante
);

export default router; // Se exporta el enrutador para ser utilizado en el archivo principal de la aplicación.