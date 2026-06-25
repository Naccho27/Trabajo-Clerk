import dotenv from "dotenv";

dotenv.config();

import { GoogleGenAI } from "@google/genai";
import Categoria from "../../modules/admin/models/admin.categories.js"; // ⚠️ confirmá esta ruta según tu estructura real

console.log("GEMINI API:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// --- Cache de categorías en memoria (evita consultar Mongo en cada clasificación) ---
let categoriasCache = null;
let categoriasCacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

async function getCategoriasActivas() {
  const ahora = Date.now();

  if (categoriasCache && ahora - categoriasCacheTimestamp < CACHE_TTL_MS) {
    return categoriasCache;
  }

  const categorias = await Categoria
    .find({ activa: true })
    .select("nombre -_id")
    .lean();

  categoriasCache = categorias.map((c) => c.nombre);
  categoriasCacheTimestamp = ahora;

  return categoriasCache;
}

// Se llama desde admin.service.js cada vez que se crea/edita/activa/desactiva
// una categoría, para que el cache no quede desactualizado hasta los 5 min.
export function invalidateCategoriasCache() {
  categoriasCache = null;
}

export const classifyIncident = async (texto) => {
  try {
    const nombresCategorias = await getCategoriasActivas();

    if (!nombresCategorias.length) {
      throw new Error("No hay categorías activas en la base de datos");
    }

    const listaCategoriasTexto = nombresCategorias
      .map((n) => `- ${n}`)
      .join("\n");

    const prompt = `
Clasifica este incidente en UNA sola categoría.

Categorías válidas (usa exactamente el nombre tal como aparece, en minúsculas):
${listaCategoriasTexto}

Si el incidente no tiene relación clara con ninguna categoría, elige la más cercana posible de la lista. No inventes categorías nuevas.

Responde únicamente JSON válido.

Ejemplo:
{
  "categoria": "${nombresCategorias[0]}",
  "confianza": 0.95
}

Texto:
${texto}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const resultado = JSON.parse(text);

    const categoriaNormalizada = String(resultado.categoria || "")
      .trim()
      .toLowerCase();

    if (!nombresCategorias.includes(categoriaNormalizada)) {
      throw new Error(`Categoría inválida devuelta por la IA: ${resultado.categoria}`);
    }

    return {
      categoria: categoriaNormalizada,
      confianza: Number(resultado.confianza) || 0,
    };

  } catch (error) {
    console.error("Error Gemini:", error.message);
    return { categoria: null, confianza: 0 };
  }
};

export const normalizeIncident = async (texto) => {
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();

  } catch (error) {
    console.error("Error normalizando:", error.message);
    return texto;
  }
};

export const detectDuplicateIncident = async (reporteNuevo, reporteExistente) => {
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const resultado = JSON.parse(text);

    return {
      duplicado: Boolean(resultado.duplicado),
      confianza: Number(resultado.confianza) || 0,
    };

  } catch (error) {
    console.error("Error detectando duplicado:", error.message);
    return { duplicado: false, confianza: 0 };
  }
};

export const prioritizeIncident = async (reporte) => {
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const resultado = JSON.parse(text);

    return {
      prioridad: resultado.prioridad,
      confianza: Number(resultado.confianza) || 0,
    };

  } catch (error) {
    console.error("Error priorizando:", error.message);
    return { prioridad: "medium", confianza: 0 };
  }
};

export const generateCityInsights = async (estadisticas) => {
  try {
    const prompt = `
Eres un analista urbano.

Genera un resumen ejecutivo para administradores municipales.

Datos:

${JSON.stringify(estadisticas, null, 2)}

Genera:

- Resumen general.
- Principales problemas.
- Tendencias observadas.
- Recomendaciones.

Máximo 250 palabras.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();

  } catch (error) {
    console.error("Error generando insights:", error.message);
    return "No fue posible generar el resumen.";
  }
};

export const validateReportContent = async (titulo, descripcion) => {
  try {
    const prompt = `
Analiza el siguiente reporte ciudadano y determina si es válido.

Un reporte es INVÁLIDO si:
- Contiene insultos o lenguaje ofensivo.
- Es incoherente o no tiene sentido.
- Es spam o contenido irrelevante.
- Contiene contenido inapropiado.
- Es demasiado vago para ser un reporte urbano real.

Un reporte es VÁLIDO si:
- Describe un problema urbano real.
- Tiene sentido aunque tenga errores ortográficos.
- Es comprensible aunque sea breve.

Responde únicamente JSON válido.

Ejemplo:
{
  "valido": true,
  "motivo": ""
}

Otro ejemplo:
{
  "valido": false,
  "motivo": "El reporte contiene insultos"
}

Título:
${titulo}

Descripción:
${descripcion}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const resultado = JSON.parse(text);

    return {
      valido: Boolean(resultado.valido),
      motivo: resultado.motivo || "",
    };

  } catch (error) {
    console.error("Error validando contenido:", error.message);
    return { valido: true, motivo: "" }; // si falla la IA, dejamos pasar
  }
};