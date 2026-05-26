import mongoose from "mongoose";

const historialEstadoSchema =
  new mongoose.Schema(
    {
      reporteId: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Reporte",

        required: true,
      },

      estadoAnterior: {
        type: String,
      },

      estadoNuevo: {
        type: String,

        required: true,
      },

      cambiadoPor: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Usuario",

        default: null,
      },

      observacion: {
        type: String,

        default: "",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "HistorialEstado",
  historialEstadoSchema
);