import {
  getAuth
} from "@clerk/express";

const authMiddleware =
  (req, res, next) => {

    const auth =
      getAuth(req);

    if (!auth.userId) {

      return res.status(401).json({
        ok: false,
        mensaje:
          "No autorizado"
      });
    }

    req.auth = auth;

    next();
  };

export default authMiddleware;