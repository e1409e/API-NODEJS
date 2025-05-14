# Node.js Api con Postgres para SMGED

<!-- * **Uso de Procedimientos Almacenados:** Estamos llamando a los procedimientos almacenados (`insertar_cita`, `editar_cita`, `eliminar_cita`) en lugar de realizar las operaciones SQL directamente en el controlador. Esto tiene varias ventajas:
    * **Seguridad:** Ayuda a prevenir inyecciones SQL, ya que la lógica SQL está definida en la base de datos y no en el código de la aplicación.
    * **Mantenibilidad:** Si la lógica de la base de datos cambia, solo necesitas modificar el procedimiento almacenado y no el código de la aplicación.
    * **Rendimiento:** Los procedimientos almacenados se ejecutan directamente en el servidor de la base de datos, lo que puede ser más eficiente que enviar múltiples consultas desde la aplicación.
* **Validación de Datos:** La validación de datos es crucial para garantizar la integridad de los datos.  `express-validator` nos permite definir reglas de validación y verificar si los datos de la petición cumplen con esas reglas.  Si la validación falla, enviamos un error 400 al cliente, indicando qué campos son inválidos.
* **Manejo de Errores:** Utilizamos bloques `try...catch` para capturar cualquier error que pueda ocurrir durante la ejecución de las funciones del controlador.  Es importante registrar los errores (`console.error`) y enviar una respuesta adecuada al cliente (generalmente un código de estado 500 para errores del servidor).
* **Códigos de Estado HTTP:** Utilizamos códigos de estado HTTP para indicar el resultado de la petición al cliente.  Por ejemplo:
    * 200 (OK):  Éxito.
    * 201 (Created):  Recurso creado con éxito.
    * 400 (Bad Request):  Error del cliente (por ejemplo, datos inválidos).
    * 404 (Not Found):  Recurso no encontrado.
    * 500 (Internal Server Error):  Error del servidor. -->

