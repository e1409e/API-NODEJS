import { sql } from '../db.js';

// Obtener todas las facultades
// Se agrega ORDER BY facultad ASC para devolver los registros en orden alfabético
export const obtenerFacultades = async (req, res) => {
    try {
        const facultades = await sql`SELECT * FROM facultades ORDER BY facultad ASC`;
        res.json(facultades);
    } catch (error) {
        console.error('Error al obtener facultades:', error);
        res.status(500).json({ error: 'Error al obtener facultades' });
    }
};

// Obtener una facultad por ID
export const obtenerFacultadPorId = async (req, res) => {
    try {
        const { id_facultad } = req.params;
        const facultad = await sql`SELECT * FROM facultades WHERE id_facultad = ${id_facultad}`;
        if (facultad.length === 0) {
            return res.status(404).json({ error: 'Facultad no encontrada' });
        }
        res.json(facultad[0]);
    } catch (error) {
        console.error('Error al obtener facultad por ID:', error);
        res.status(500).json({ error: 'Error al obtener facultad por ID' });
    }
};

// Crear una nueva facultad
export const crearFacultad = async (req, res) => {
    try {
        const { facultad, siglas } = req.body;
        const result = await sql`
            SELECT insertar_facultad(${facultad}, ${siglas}) AS id_facultad
        `;
        res.status(201).json({ id_facultad: result[0].id_facultad, message: 'Facultad creada correctamente' });
    } catch (error) {
        console.error('Error al crear facultad:', error);
        res.status(500).json({ error: 'Error al crear facultad' });
    }
};

// Editar una facultad existente
export const editarFacultad = async (req, res) => {
    try {
        const { id_facultad } = req.params;
        const { facultad, siglas } = req.body;
        const result = await sql`
            SELECT editar_facultad(${id_facultad}, ${facultad || null}, ${siglas || null}) AS success
        `;
        if (!result[0].success) {
            return res.status(404).json({ error: 'Facultad no encontrada o no se pudo actualizar' });
        }
        res.json({ message: 'Facultad actualizada correctamente' });
    } catch (error) {
        console.error('Error al editar facultad:', error);
        res.status(500).json({ error: 'Error al editar facultad' });
    }
};

// Eliminar una facultad
export const eliminarFacultad = async (req, res) => {
    try {
        const { id_facultad } = req.params;
        const result = await sql`
            SELECT eliminar_facultad(${id_facultad}) AS success
        `;
        if (!result[0].success) {
            return res.status(404).json({ error: 'Facultad no encontrada o no se pudo eliminar' });
        }
        res.json({ message: 'Facultad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar facultad:', error);
        res.status(500).json({ error: 'Error al eliminar facultad' });
    }
};

// Obtener todas las facultades con sus carreras asociadas
// Se agrega ORDER BY facultad ASC y ORDER BY carrera ASC para devolver los registros en orden alfabético
export const obtenerFacultadesConCarreras = async (req, res) => {
  try {
    // Obtén todas las facultades ordenadas alfabéticamente
    const facultades = await sql`SELECT * FROM facultades ORDER BY facultad ASC`;

    // Obtén todas las carreras ordenadas alfabéticamente
    const carreras = await sql`SELECT * FROM carreras ORDER BY carrera ASC`;

    // Asocia carreras a cada facultad
    const resultado = facultades.map(facultad => ({
      ...facultad,
      carreras: carreras.filter(c => c.id_facultad === facultad.id_facultad)
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener facultades con carreras" });
  }
};