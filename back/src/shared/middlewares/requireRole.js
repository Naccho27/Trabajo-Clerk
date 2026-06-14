import Usuario from "../../modules/ciudadano/models/Usuario.js";
import { getAuth } from "@clerk/express";

export const requireRole = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {

      console.log("ENTRO A requireRole");

      const auth = getAuth(req);

      console.log("USER:", auth.userId);
console.log("ROLES:", usuario.roles);
console.log("PERMITIDOS:", rolesPermitidos);

      if (!auth?.userId) {
        return res.status(401).json({
          ok: false,
          mensaje: "No autenticado",
        });
      }

      const usuario = await Usuario.findOne({
        clerkId: auth.userId,
      });

      console.log("USUARIO ENCONTRADO:", usuario);

      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: "Usuario no encontrado",
        });
      }

      const tienePermiso = usuario.roles.some(
        rol => rolesPermitidos.includes(rol)
      );

      if (!tienePermiso) {
        return res.status(403).json({
          ok: false,
          mensaje: "No autorizado",
        });
      }

      req.usuario = usuario;

      next();

    } catch (error) {

      console.log("ERROR REQUIRE ROLE:", error);

      return res.status(500).json({
        ok: false,
        mensaje: error.message,
      });

    }
  };
};