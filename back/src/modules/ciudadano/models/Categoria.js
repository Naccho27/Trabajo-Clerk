import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema(
  {
    reporteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reporte",
      required: true
    },

    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    },

    mensaje: {
      type: String,
      required: true,
      trim: true
    },

    esInterno: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Comentario",
  comentarioSchema
);