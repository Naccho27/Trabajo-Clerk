import Usuario from "../../modules/ciudadano/models/Usuario.js";

const permitirRoles = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      const clerkId = req.auth.userId;

      const usuario = await Usuario.findOne({
        clerkId
      });

      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: "Usuario no encontrado"
        });
      }

      if (
        !rolesPermitidos.includes(
          usuario.rol
        )
      ) {
        return res.status(403).json({
          ok: false,
          mensaje:
            "No tienes permisos para esta acción"
        });
      }

      req.usuarioDB = usuario;

      next();
    } catch (error) {
      res.status(500).json({
        ok: false,
        mensaje: error.message
      });
    }
  };
};

export default permitirRoles;