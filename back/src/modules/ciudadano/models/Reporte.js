import mongoose from "mongoose";

import { CATEGORIAS_INCIDENTES } from "../../../shared/constants/categorias.js";

/*
|------------------------------------------------------------------
| Historial de estados
|------------------------------------------------------------------
*/

const historialEstadoSchema = new mongoose.Schema({
  estado: {
    type: String,
    required: true,
  },

  fechaInicio: {
    type: Date,
    default: Date.now,
  },

  fechaFin: {
    type: Date,
    default: null,
  },

  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null,
  },

  comentario: {
    type: String,
    default: "",
  },
});

/*
|------------------------------------------------------------------
| Historial de acciones
|------------------------------------------------------------------
*/

const historialAccionSchema = new mongoose.Schema({
  accion: {
    type: String,
    required: true,
  },

  valorAnterior: {
    type: String,
    default: "",
  },

  valorNuevo: {
    type: String,
    default: "",
  },

  realizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null,
  },

  fecha: {
    type: Date,
    default: Date.now,
  },
});

/*
|------------------------------------------------------------------
| Reporte
|------------------------------------------------------------------
*/

const reporteSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------
    | Usuario
    |--------------------------------------------------------------
    */

    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    modoAnonimo: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------
    | Contenido
    |--------------------------------------------------------------
    */

    titulo: {
      type: String,
      required: true,
    },

    descripcion: {
      type: String,
      required: true,
    },

    /*
    |--------------------------------------------------------------
    | Categoría
    |--------------------------------------------------------------
    */

    categoria: {
      type: String,

      enum: CATEGORIAS_INCIDENTES,

      required: true,
    },

    categoriaIA: {
      type: String,
      default: null,
    },

    scoreCategoriaIA: {
      type: Number,
      default: 0,
    },

    /*
    |--------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------
    */

    estado: {
      type: String,

      enum: [
        "open",
        "validated",
        "in_progress",
        "resolved",
        "rejected",
      ],

      default: "open",
    },

    historialEstados: [
      historialEstadoSchema
    ],

    /*
    |--------------------------------------------------------------
    | Prioridad
    |--------------------------------------------------------------
    */

    prioridad: {
      type: String,

      enum: [
        "low",
        "medium",
        "high",
        "critical",
      ],

      default: "medium",
    },

    prioridadIA: {
      type: String,
      default: null,
    },

    scorePrioridadIA: {
      type: Number,
      default: 0,
    },

    /*
    |--------------------------------------------------------------
    | IA / Duplicados
    |--------------------------------------------------------------
    */

    esDuplicado: {
      type: Boolean,
      default: false,
    },

    reporteDuplicadoDe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reporte",
      default: null,
    },

    /*
    |--------------------------------------------------------------
    | Multimedia
    |--------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------
    | Ubicación
    |--------------------------------------------------------------
    */

    ubicacion: {
      direccion: {
        type: String,
      },

      barrio: {
        type: String,
        default: "",
      },

      ciudad: {
        type: String,
        default: "Villa María",
      },

      provincia: {
        type: String,
        default: "Córdoba",
      },

      pais: {
        type: String,
        default: "Argentina",
      },

      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },
    },

    /*
    |--------------------------------------------------------------
    | Validación supervisor
    |--------------------------------------------------------------
    */

    validacionSupervisor: {
      validadoPor: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Usuario",

        default: null,
      },

      fechaValidacion: {
        type: Date,

        default: null,
      },

      motivoRechazo: {
        type: String,

        default: "",
      },

      contenidoValido: {
        type: Boolean,

        default: true,
      },
    },

    /*
    |--------------------------------------------------------------
    | Historial acciones
    |--------------------------------------------------------------
    */

    historial: [
      historialAccionSchema
    ],

    /*
    |--------------------------------------------------------------
    | Métricas BI
    |--------------------------------------------------------------
    */

    fechaResolucion: {
      type: Date,
      default: null,
    },

    tiempoResolucionHoras: {
      type: Number,
      default: null,
    },

    cantidadVisualizaciones: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model(
  "Reporte",
  reporteSchema
);