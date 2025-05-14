import express from 'express';
import {
    obtenerTodasLasCitas,
    obtenerCitaPorId,
    crearCita,
    actualizarCita,
    eliminarCita
} from '../controllers/citas.controller.js';

import { citaValidations } from '../validations/citas.validations.js'; //  Si tienes un archivo de validaciones

const router = express.Router();

router.get('/', obtenerTodasLasCitas); //  Obtener todas las citas
router.get('/:id_citas', obtenerCitaPorId); //  Obtener una cita por ID
router.post('/', citaValidations.crearCitaValidations, crearCita); //  Crear una nueva cita
router.put('/:id_citas', citaValidations.actualizarCitaValidations, actualizarCita); //  Actualizar una cita
router.delete('/:id_citas', citaValidations.eliminarCitaValidations, eliminarCita); //  Eliminar una cita

export default router;