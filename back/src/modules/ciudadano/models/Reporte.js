import mongoose from "mongoose";

import { CATEGORIAS_INCIDENTES } from "../../../shared/constants/categorias.js";

const reporteSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    modoAnonimo: {
      type: Boolean,
      default: false,
    },

    titulo: {
      type: String,
      required: true,
    },

    descripcion: {
      type: String,
      required: true,
    },

    categoria: {
      type: String,

      enum: CATEGORIAS_INCIDENTES,

      required: true,
    },

    estado: {
      type: String,
      enum: ["open", "in_progress", "resolved", "rejected"],
      default: "open",
    },

    prioridad: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    imagenes: [
      {
        type: String,
      },
    ],

    videos: [
      {
        type: String,
      },
    ],

    ubicacion: {
      direccion: {
        type: String,
      },

      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },
    },
    respuestaOficial: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Reporte", reporteSchema);
