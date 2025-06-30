import { body, param } from "express-validator";

export const estudianteValidations = {
  crearEstudianteValidations: [
    body("nombres")
      .notEmpty()
      .withMessage("Los nombres son requeridos")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los nombres solo pueden contener letras y espacios (no mas de dos espacios en blanco).")
      .isString()
      .withMessage("Nombres deben ser texto."),
    body("apellidos")
      .notEmpty()
      .withMessage("Los apellidos son requeridos")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage("Los apellidos solo pueden contener letras y espacios (no mas de dos espacios en blanco).")
      .isString()
      .withMessage("Apellidos deben ser texto."),
    body("cedula")
      .notEmpty()
      .withMessage("La cédula es requerida")
      .matches(/^[VE]-\d{7,15}$/)
      .withMessage("La cédula no puede contener letras ni carácteres especiales que no sean '-'")
      .isString()
      .withMessage("Cédula debe ser texto.")
      .isLength({ min: 5, max: 15 })
      .withMessage("La cédula debe tener entre 5 y 15 carácteres."),
    body("telefono")
      .optional({ nullable: true, checkFalsy: true }) // Permite que sea null, undefined, o string vacío
      .isString()
      .withMessage("Teléfono debe ser texto.")
      .isLength({ min: 7, max: 15 })
      .withMessage("El teléfono debe tener entre 7 y 15 carácteres.")
      .matches(/^\d+$/)
      .withMessage("El teléfono solo puede contener dígitos sin carácteres especiales ni espacios."),
    body("correo")
      .optional({ nullable: true, checkFalsy: true })
      .isEmail()
      .withMessage("El correo debe ser una dirección de correo válida."),
    body("discapacidad_id")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Debe colocar una discapacidad válida."),
    body("fecha_nacimiento")
      .notEmpty()
      .withMessage("La fecha de nacimiento es requerida.") // Considero que es un campo importante
      .isISO8601()
      .toDate()
      .withMessage(
        "La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD."
      ),
    body("observaciones")
      .optional({ nullable: true, checkFalsy: true })
      .isString(),
    body("seguimiento")
      .optional({ nullable: true, checkFalsy: true })
      .isString(),
    body("direccion")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("La dirección debe ser texto."), // Coherente con el valor por defecto en la base de datos
    body("id_carrera")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Debe colocar una carrera válida.")
      .default(1), // Coherente con el valor por defecto en la base de datos
    body("posee_conapdis")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 0, max: 1 })
      .default(0), // Coherente con el valor por defecto en la base de datos
    body("otro_telefono")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("Otro teléfono debe ser texto.")
      .isLength({ min: 7, max: 15 })
      .withMessage("Otro teléfono debe tener entre 7 y 15 caracteres.")
      .matches(/^\d*$/)
      .withMessage("Otro teléfono solo puede contener dígitos (o estar vacío).") // Permitir vacío si se envía
      .default(""), // Coherente con el valor por defecto en la base de datos
  ],
  editarEstudianteValidations: [
    param("id_estudiante")
      .isInt({ min: 1 })
      .withMessage(
        "El ID del estudiante debe ser un entero positivo válido para la edición."
      ),
    // Todos los campos en edición deben ser opcionales ya que se puede actualizar parcialmente
    body("nombres")
      .optional({ nullable: true, checkFalsy: true })
      .notEmpty()
      .withMessage("Los nombres no pueden estar vacíos.")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) 
      .withMessage("Los nombres solo pueden contener letras y espacios (no mas de dos espacios en blanco).") 
      .isString()
      .withMessage("Nombres deben ser texto."),
    body("apellidos")
      .optional({ nullable: true, checkFalsy: true })
      .notEmpty()
      .withMessage("Los apellidos no pueden estar vacíos.")
      .matches(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) 
      .withMessage("Los apellidos solo pueden contener letras y espacios (no mas de dos espacios en blanco).") 
      .isString()
      .withMessage("Apellidos deben ser texto."),
   body("cedula")
    .optional({ nullable: true, checkFalsy: true }) // Sigue siendo opcional en la edición
    .notEmpty()
    .withMessage("La cédula no puede estar vacía si se proporciona.") // Mensaje si se envía pero está vacío
    .matches(/^[VE]-\d{7,15}$/) // ¡Ahora coincide con la validación de creación!
    .withMessage("La cédula debe seguir el formato V/E-XXXXXXXX (ej. V-12345678).") // Mensaje ajustado para el formato específico
    .isString()
    .withMessage("Cédula debe ser texto.")
    .isLength({ min: 5, max: 15 }) // Asegura la longitud total (V-Dígitos)
    .withMessage("La cédula debe tener entre 5 y 15 caracteres (incluyendo V/E y el guion)."), // Mensaje de longitud ajustado
    body("telefono")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("Teléfono debe ser texto.")
      .isLength({ min: 7, max: 15 })
      .withMessage("El teléfono debe tener entre 7 y 15 caracteres.")
      .matches(/^\d+$/)
      .withMessage("El teléfono solo puede contener dígitos sin carácteres especiales."), 
    body("correo")
      .optional({ nullable: true, checkFalsy: true })
      .isEmail()
      .withMessage("El correo debe ser una dirección de correo válida."),
    body("discapacidad_id")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Debe colocar una discapacidad válida."), 
    body("fecha_nacimiento")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .toDate()
      .withMessage(
        "La fecha de nacimiento debe ser una fecha válida en formato YYYY-MM-DD."
      ), 
    body("observaciones")
      .optional({ nullable: true, checkFalsy: true })
      .isString(),
    body("seguimiento")
      .optional({ nullable: true, checkFalsy: true })
      .isString(),
    body("direccion")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("La dirección debe ser texto."),
    body("id_carrera")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Debe colocar una carrera válida."), 
    body("posee_conapdis")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 0, max: 1 })
      .withMessage("Posee CONAPDIS debe ser 0 o 1."), 
    body("otro_telefono")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("Otro teléfono debe ser texto.")
      .isLength({ min: 7, max: 15 })
      .withMessage("Otro teléfono debe tener entre 7 y 15 caracteres.")
      .matches(/^\d*$/)
      .withMessage(
        "Otro teléfono solo puede contener dígitos (o estar vacío) si se proporciona."
      ),
  ],
};