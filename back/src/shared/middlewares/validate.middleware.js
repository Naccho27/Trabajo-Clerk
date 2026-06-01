export const validate = (schema) => async (req, res, next) => {
  try {
    console.log("VALIDATE BODY:", req.body); 
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    console.log("VALIDATE ERROR:", error.errors);
    return res.status(400).json({
      ok: false,
      errores: error.errors?.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message,
      })),
    });
  }
};