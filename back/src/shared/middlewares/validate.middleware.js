export const validate =
  (schema) =>
  async (req, res, next) => {
    try {
      req.body =
        await schema.parseAsync(req.body);

      next();
    } catch (error) {

      return res.status(400).json({
        ok: false,

        errores:
          error.errors?.map((e) => ({
            campo: e.path.join("."),
            mensaje: e.message,
          })),
      });
    }
  };