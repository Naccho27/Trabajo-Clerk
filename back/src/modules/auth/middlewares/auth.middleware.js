import {
  getAuth
} from "@clerk/express";

import Usuario from
  "../../ciudadano/models/Usuario.js";

const authMiddleware =
  async (req, res, next) => {

    console.log("ENTRO A authMiddleware");

    try {

      const auth =
        getAuth(req);

        console.log("AUTH MIDDLEWARE:", auth);

      if (!auth.userId) {

        return res.status(401).json({
          ok: false,
          mensaje:
            "No autorizado"
        });

      }

      const usuario =
        await Usuario.findOne({
          clerkId: auth.userId
        });

      if (!usuario) {

        return res.status(404).json({
          ok: false,
          mensaje:
            "Usuario no encontrado"
        });

      }

      req.clerkAuth = auth;
req.user = usuario;

return next();

    } catch (error) {

      return res.status(500).json({
        ok: false,
        mensaje:
          error.message
      });

    }

  };

export default authMiddleware;