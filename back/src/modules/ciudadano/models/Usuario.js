import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    nombreUsuario: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    imagenPerfil: {
      type: String,
      default: "",
    },

    rol: {
      type: String,

      enum: ["ciudadano", "supervisor", "operador", "admin"],

      default: "ciudadano",
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Usuario", usuarioSchema);
