import { sql } from "../db.js";

// Registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, cedula_usuario, password, rol } = req.body; // <-- ¡Añadir 'rol' aquí!

    // **Opcional pero recomendado:** Validar que el rol sea uno de los permitidos por tu CHECK constraint
    if (!["administrador", "psicologo", "docente"].includes(rol)) {
      return res.status(400).json({ error: "Rol inválido proporcionado." });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE cedula_usuario = ${cedula_usuario}
        `;

    if (usuarioExistente.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Insertar el nuevo usuario en la base de datos, incluyendo el rol
    await sql`
            INSERT INTO usuarios (nombre, apellido, cedula_usuario, password, rol)
            VALUES (${nombre}, ${apellido}, ${cedula_usuario}, ${password}, ${rol})
        `;

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Iniciar sesión
export const iniciarSesion = async (req, res) => {
    try {
        const { cedula_usuario, password } = req.body;

        // Buscar al usuario por cedula_usuario y password (ahora seleccionaremos también el rol)
        const usuario = await sql`
            SELECT id_usuario, nombre, apellido, cedula_usuario, rol FROM usuarios WHERE cedula_usuario = ${cedula_usuario} AND password = ${password} 
        `;

        if (usuario.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas', success: false });
        }

        // Si las credenciales son correctas, el usuario está en `usuario[0]`
        const usuarioLogueado = usuario[0]; // Acceder al primer (y único) resultado

        res.json({
            message: 'Inicio de sesión exitoso',
            success: true,
            // ¡Incluir el rol en la respuesta!
            rol: usuarioLogueado.rol,
            // Opcional: Podrías devolver también el id_usuario si lo necesitas en el frontend para algo
            // id_usuario: usuarioLogueado.id_usuario,
            // cedula_usuario: usuarioLogueado.cedula_usuario,
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión', success: false });
    }
};

// Obtener todos los usuarios
export const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await sql`SELECT * FROM usuarios`;
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Editar un usuario
export const editarUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        // ¡Añadir 'rol' aquí también si tu frontend puede editarlo!
        const { nombre, apellido, cedula_usuario, password, rol } = req.body; 

        // Verificar si el usuario existe
        const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

        if (usuarioExistente.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // **Opcional pero recomendado:** Validar que el rol sea uno de los permitidos por tu CHECK constraint
        if (rol && !['administrador', 'psicologo', 'docente'].includes(rol)) { // Solo valida si 'rol' se proporciona
            return res.status(400).json({ error: 'Rol inválido proporcionado para actualización.' });
        }

        // Actualizar el usuario en la base de datos
        // Asegúrate de que tu función editar_usuario() en PostgreSQL también acepte el parámetro 'rol'
        await sql`
            SELECT editar_usuario(
                ${id_usuario},
                ${nombre},
                ${apellido},
                ${cedula_usuario},
                ${password},
                ${rol}
            )
        `;

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar usuario:', error);
        res.status(500).json({ error: 'Error al editar usuario' });
    }
};

// Eliminar un usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    // Verificar si el usuario existe
    const usuarioExistente = await sql`
            SELECT * FROM usuarios WHERE id_usuario = ${id_usuario}
        `;

    if (usuarioExistente.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Eliminar el usuario de la base de datos
    await sql`
            SELECT eliminar_usuario(${id_usuario})
        `;

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
