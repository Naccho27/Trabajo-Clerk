import Usuario from "../../modules/ciudadano/models/Usuario.js";

export const requireRole = (...rolesPermitidos) => {

  return async (req, res, next) => {

    try {

      const auth = req.auth();

      if (!auth?.userId) {

        return res.status(401).json({
          ok: false,
          mensaje: "No autenticado",
        });
      }

      const usuario = await Usuario.findOne({
        clerkId: auth.userId,
      });

      if (!usuario) {

        return res.status(404).json({
          ok: false,
          mensaje: "Usuario no encontrado",
        });
      }

      if (
        !rolesPermitidos.includes(
          usuario.rol
        )
      ) {

        return res.status(403).json({
          ok: false,
          mensaje: "No autorizado",
        });
      }

      req.usuario = usuario;

      next();

    } catch (error) {

      res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };
};