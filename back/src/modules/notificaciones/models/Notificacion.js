import mongoose from "mongoose";

const notificacionSchema =
  new mongoose.Schema(

    {
      usuarioId: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Usuario",

        required: true,
      },

      titulo: {
        type: String,

        required: true,
      },

      mensaje: {
        type: String,

        required: true,
      },

      tipo: {
        type: String,

        enum: [
          "reporte",
          "estado",
          "prioridad",
          "sistema",
        ],

        default: "sistema",
      },

      leida: {
        type: Boolean,

        default: false,
      },

      reporteId: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Reporte",

        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Notificacion",
  notificacionSchema
);