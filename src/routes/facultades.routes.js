import express from 'express';
import {
    obtenerFacultades,
    obtenerFacultadPorId,
    crearFacultad,
    editarFacultad,
    eliminarFacultad,
    obtenerFacultadesConCarreras
} from '../controllers/facultades.controller.js';

const router = express.Router();

router.get('/', obtenerFacultades);
router.get('/:id_facultad', obtenerFacultadPorId);
router.post('/', crearFacultad);
router.put('/:id_facultad', editarFacultad);
router.delete('/:id_facultad', eliminarFacultad);
router.get('/carreras', obtenerFacultadesConCarreras);

export default router;