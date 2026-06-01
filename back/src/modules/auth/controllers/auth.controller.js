import Usuario from "../../ciudadano/models/Usuario.js";

export const sincronizarUsuario = async (req, res) => {
  console.log("================================");
  console.log("ENTRO A /api/auth/sync");
  console.log("BODY:", req.body);
  console.log("AUTH:", req.auth);
  console.log("================================");

  console.log(req.body);

  console.log(req.auth);

  try {
    const { clerkId, nombreUsuario, email, imagenPerfil } = req.body;

    // Email fallback seguro
    const emailFinal = email || `${clerkId}@no-email.com`;

    let usuario = await Usuario.findOne({
      clerkId,
    });

    // Si no existe lo crea
    if (!usuario) {
      console.log("CREANDO USUARIO EN MONGO");

      usuario = await Usuario.create({
        clerkId,
        nombreUsuario,
        email: emailFinal,
        imagenPerfil,
        roles: ["ciudadano"],
      });
    }
    console.log("USUARIO CREADO");
    console.log(usuario);
    res.status(200).json({
      ok: true,

      usuario,
    });
  } catch (error) {
    console.log("ERROR MONGO:");

    console.log(error);

    res.status(500).json({
      ok: false,

      mensaje: error.message,
    });
  }
};

export const obtenerMiPerfil = async (req, res) => {
  try {
    res.status(200).json({
      ok: true,

      usuario: req.user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,

      mensaje: error.message,
    });
  }
};
