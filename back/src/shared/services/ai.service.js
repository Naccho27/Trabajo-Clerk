import dotenv from "dotenv";

dotenv.config();

import { GoogleGenAI }
from "@google/genai";

console.log(
  "GEMINI API:",
  process.env.GEMINI_API_KEY
);

const ai =
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY
  });

const CATEGORIAS_VALIDAS = [
  "baches",
  "residuos",
  "alumbrado",
  "semaforo",
  "inundacion"
];

export const classifyIncident =
  async (texto) => {

    try {

      const prompt = `
Clasifica este incidente en UNA sola categoría.

Categorías válidas:
- baches
- residuos
- alumbrado
- semaforo
- inundacion

Responde únicamente JSON válido.

Ejemplo:
{
  "categoria": "baches",
  "confianza": 0.95
}

Texto:
${texto}
`;

      const response =
        await ai.models.generateContent({

          model:
            "gemini-2.5-flash",

          contents:
            prompt

        });

      const text =
        response.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      const resultado =
        JSON.parse(text);

      if (
        !CATEGORIAS_VALIDAS.includes(
          resultado.categoria
        )
      ) {

        throw new Error(
          "Categoría inválida"
        );

      }

      return {

        categoria:
          resultado.categoria,

        confianza:
          Number(
            resultado.confianza
          ) || 0

      };

    } catch (error) {

      console.error(
        "Error Gemini:",
        error.message
      );

      return {

        categoria: null,

        confianza: 0

      };

    }

  };
  export const normalizeIncident =
  async (texto) => {

    try {

      const prompt = `
Reescribe el siguiente reporte ciudadano.

Objetivos:
- Corregir ortografía.
- Corregir gramática.
- Mantener el significado.
- No inventar información.
- Responder únicamente el texto corregido.

Reporte:
${texto}
`;

      const response =
        await ai.models.generateContent({

          model:
            "gemini-2.5-flash",

          contents:
            prompt

        });

      return response.text.trim();

    } catch (error) {

      console.error(
        "Error normalizando:",
        error.message
      );

      return texto;

    }

  };
  export const detectDuplicateIncident =
  async (
    reporteNuevo,
    reporteExistente
  ) => {

    try {

      const prompt = `
Analiza si estos dos reportes describen el MISMO incidente físico.

Ten en cuenta:
- Descripción.
- Título.
- Contexto.
- Tipo de problema.

Responde únicamente JSON válido.

Formato:

{
  "duplicado": true,
  "confianza": 0.95
}

Reporte nuevo:

Título:
${reporteNuevo.titulo}

Descripción:
${reporteNuevo.descripcion}

Reporte existente:

Título:
${reporteExistente.titulo}

Descripción:
${reporteExistente.descripcion}
`;

      const response =
        await ai.models.generateContent({

          model:
            "gemini-2.5-flash",

          contents:
            prompt

        });

      const text =
        response.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      const resultado =
        JSON.parse(text);

      return {

        duplicado:
          Boolean(
            resultado.duplicado
          ),

        confianza:
          Number(
            resultado.confianza
          ) || 0

      };

    } catch (error) {

      console.error(
        "Error detectando duplicado:",
        error.message
      );

      return {

        duplicado: false,

        confianza: 0

      };

    }

  };
  export const prioritizeIncident =
  async (reporte) => {

    try {

      const prompt = `
Analiza este incidente urbano y asigna una prioridad.

Prioridades válidas:

- low
- medium
- high
- critical

Reglas generales:

low:
Problemas menores sin riesgo.

medium:
Problemas molestos que afectan el servicio.

high:
Problemas importantes que afectan tránsito,
seguridad o infraestructura.

critical:
Riesgo inmediato para personas o bienes.

Responde únicamente JSON válido.

Ejemplo:

{
  "prioridad": "high",
  "confianza": 0.92
}

Reporte:

Título:
${reporte.titulo}

Descripción:
${reporte.descripcion}

Categoría:
${reporte.categoria}
`;

      const response =
        await ai.models.generateContent({

          model:
            "gemini-2.5-flash",

          contents:
            prompt

        });

      const text =
        response.text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      const resultado =
        JSON.parse(text);

      return {

        prioridad:
          resultado.prioridad,

        confianza:
          Number(
            resultado.confianza
          ) || 0

      };

    } catch (error) {

      console.error(
        "Error priorizando:",
        error.message
      );

      return {

        prioridad:
          "medium",

        confianza: 0

      };

    }

  };
 export const generateCityInsights =
  async (estadisticas) => {

    try {

      const prompt = `
Eres un analista urbano.

Genera un resumen ejecutivo para administradores municipales.

Datos:

${JSON.stringify(
  estadisticas,
  null,
  2
)}

Genera:

- Resumen general.
- Principales problemas.
- Tendencias observadas.
- Recomendaciones.

Máximo 250 palabras.
`;

      const response =
        await ai.models.generateContent({

          model:
            "gemini-2.5-flash",

          contents:
            prompt

        });

      return response.text.trim();

    } catch (error) {

      console.error(
        "Error generando insights:",
        error.message
      );

      return "No fue posible generar el resumen.";

    }

  };
  