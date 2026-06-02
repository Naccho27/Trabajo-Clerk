import Usuario
from "../../ciudadano/models/Usuario.js";

export const sincronizarUsuario =
  async (req, res) => {

    console.log(
      "ENTRO AL AUTH"
    );

    console.log(req.body);

    console.log(req.auth);

    try {

      const {

        clerkId,
        nombreUsuario,
        email,
        imagenPerfil

      } = req.body;

      // Email fallback seguro
      const emailFinal =
        email ||
        `${clerkId}@no-email.com`;

      let usuario =
        await Usuario.findOne({
          clerkId
        });

      // Si no existe lo crea
      if (!usuario) {

        usuario =
          await Usuario.create({

            clerkId,

            nombreUsuario,

            email: emailFinal,

            imagenPerfil,

            rol: "ciudadano"
          });
      }

      res.status(200).json({

        ok: true,

        usuario
      });

    } catch (error) {

      console.log(
        "ERROR MONGO:"
      );

      console.log(error);

      res.status(500).json({

        ok: false,

        mensaje:
          error.message
      });
    }
  };

  export const obtenerUsuarioActual = async (req, res) => {
  try {
    const auth = req.auth();
    const usuario = await Usuario.findOne({ clerkId: auth.userId });
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }
    res.json({ ok: true, usuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};