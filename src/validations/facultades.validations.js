// Validación para crear una facultad
export function validarFacultad(req, res, next) {
    const { facultad, siglas } = req.body;

    if (!facultad || typeof facultad !== 'string' || facultad.trim() === '') {
        return res.status(400).json({ error: 'El nombre de la facultad es requerido y debe ser un texto.' });
    }
    if (!siglas || typeof siglas !== 'string' || siglas.trim() === '') {
        return res.status(400).json({ error: 'Las siglas son requeridas y deben ser un texto.' });
    }
    next();
}

// Validación para editar una facultad
export function validarFacultadEdicion(req, res, next) {
    const { facultad, siglas } = req.body;

    if (
        (facultad === undefined || facultad === null || facultad === '') &&
        (siglas === undefined || siglas === null || siglas === '')
    ) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar (facultad o siglas).' });
    }
    next();
}