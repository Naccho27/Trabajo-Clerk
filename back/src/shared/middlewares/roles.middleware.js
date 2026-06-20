import { getAuth } from "@clerk/express";
import Usuario from "../../modules/ciudadano/models/Usuario.js";

export const requireRole = (...rolesPermitidos) => {

  return async (req, res, next) => {

    try {

      const auth = getAuth(req);

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

      const tienePermiso = usuario.roles.some(
        (rol) => rolesPermitidos.includes(rol)
      );

      if (!tienePermiso) {

        return res.status(403).json({
          ok: false,
          mensaje: "Sin permisos",
        });
      }

      req.usuario = usuario;

      next();

    } catch (error) {

      return res.status(500).json({
        ok: false,
        mensaje: error.message,
      });
    }
  };
};