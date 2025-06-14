import { validationResult } from 'express-validator';
import { sql } from '../db.js';  // Asegúrate de que la ruta a tu conexión a la base de datos es correcta
import { representanteValidations } from '../validations/representantes.validations.js'; //  Asegúrate de crear este archivo de validaciones

// Función para obtener todos los representantes
export const obtenerRepresentantes = async (req, res) => {
    try {
        const representantes = await req.sql`SELECT * FROM representantes`;
        res.json(representantes);
    } catch (error) {
        console.error('Error al obtener representantes:', error);
        res.status(500).json({ error: 'Error al obtener representantes' });
    }
};

// Función para obtener un representante por ID
export const obtenerRepresentantePorId = async (req, res) => {
    try {
        const { id_representante } = req.params;
        const representante = await req.sql`
            SELECT * FROM representantes WHERE id_representante = ${id_representante}
        `;

        if (representante.length === 0) {
            return res.status(404).json({ error: 'Representante no encontrado' });
        }

        res.json(representante[0]);
    } catch (error) {
        console.error('Error al obtener representante por ID:', error);
        res.status(500).json({ error: 'Error al obtener representante por ID' });
    }
};

// Función para crear un nuevo representante
export const crearRepresentante = async (req, res) => {
    // Validaciones
    await Promise.all(representanteValidations.crearRepresentanteValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            id_estudiante,
            nombre_repre,
            parentesco,
            cedula_repre,
            telefono_repre,
            correo_repre,
            lugar_nacimiento,
            fecha_nacimiento,
            direccion,
            ocupacion,
            lugar_trabajo,
            estado,
            municipio,
            departamento,
            estado_civil
        } = req.body;

        // Verificar que la conexión SQL está correctamente definida
        if (!req.sql) {
            throw new Error("No se encontró la conexión SQL en req.sql");
        }

        // Ejecutar la consulta SQL
        const nuevoRepresentante = await req.sql`
            SELECT insertar_representante(
                ${id_estudiante},
                ${nombre_repre},
                ${parentesco},
                ${cedula_repre},
                ${telefono_repre},
                ${correo_repre},
                ${lugar_nacimiento},
                ${fecha_nacimiento}::date,
                ${direccion},
                ${ocupacion},
                ${lugar_trabajo},
                ${estado},
                ${municipio},
                ${departamento},
                ${estado_civil}
            ) as representante;
        `;

        // Verificar que se haya retornado un representante válido
        if (!nuevoRepresentante.length || !nuevoRepresentante[0].representante) {
            throw new Error("Error al guardar el representante en la base de datos");
        }

        res.status(201).json(nuevoRepresentante[0].representante);
    } catch (error) {
        console.error("Error al crear representante:", error.message);
        res.status(500).json({ error: error.message || "Error interno del servidor" });
    }
};

// Función para editar un representante existente
export const editarRepresentante = async (req, res) => {
    await Promise.all(representanteValidations.editarRepresentanteValidations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id_representante } = req.params;
        const {
            id_estudiante,
            nombre_repre,
            parentesco,
            cedula_repre,
            telefono_repre,
            correo_repre,
            lugar_nacimiento,
            fecha_nacimiento,
            direccion,
            ocupacion,
            lugar_trabajo,
            estado,
            municipio,
            departamento,
            estado_civil
        } = req.body;

        const representanteEditado = await req.sql`
            SELECT editar_representante(
                ${id_representante},
                ${id_estudiante},
                ${nombre_repre},
                ${parentesco},
                ${cedula_repre},
                ${telefono_repre},
                ${correo_repre},
                ${lugar_nacimiento},
                ${fecha_nacimiento},
                ${direccion},
                ${ocupacion},
                ${lugar_trabajo},
                ${estado},
                ${municipio},
                ${departamento},
                ${estado_civil}
            )
        `;

        if (representanteEditado.length === 0) {
            return res.status(404).json({ error: 'Representante no encontrado' });
        }

        res.json(representanteEditado[0]);  // Devuelve el representante editado
    } catch (error) {
        console.error('Error al editar representante:', error);
        res.status(500).json({ error: 'Error al editar representante' });
    }
};

// Función para eliminar un representante
export const eliminarRepresentante = async (req, res) => {
    try {
        const { id_representante } = req.params;

        const representanteEliminado = await req.sql`
            SELECT eliminar_representante(${id_representante})
        `;

        if (representanteEliminado.length === 0) {
            return res.status(404).json({ error: 'Representante no encontrado' });
        }

        res.json({ message: 'Representante eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar representante:', error);
        res.status(500).json({ error: 'Error al eliminar representante' });
    }
};