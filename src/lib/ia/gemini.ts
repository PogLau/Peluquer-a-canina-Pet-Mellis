import { coats, knots, sizes } from '../pricing'

import { parseSugerencia, type ResultadoSugerencia } from './sugerencia'

/*
  Análisis real de la foto con Gemini. Solo del lado del servidor (se importa únicamente
  desde la server action de app/(cliente)/cotizar/actions.ts):
  - la clave va en el header x-goog-api-key, nunca en la URL ni en el navegador;
  - el modelo sale de GEMINI_MODEL (no se fija en el código: los modelos se retiran);
  - sin GEMINI_API_KEY y GEMINI_MODEL, la función no se usa y la interfaz lo dice.
*/

export function iaDisponible(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL)
}

const PROMPT = `Sos asistente de una peluquería canina. Mirá la foto y devolvé SOLO el JSON pedido.
- esPerro: false si la foto no muestra un perro con claridad.
- raza: raza probable en español (o "Mestizo").
- tamano: chico (hasta 10 kg), mediano (10 a 25 kg) o grande (más de 25 kg), según la raza. Una foto no tiene escala: la confianza del tamaño casi siempre es "baja" o "media".
- manto: corto, largo o rizado.
- nudos: sin, leves, moderados o severos, según lo que se vea del pelo.
- observaciones: una o dos frases cortas sobre el pelo (dónde hay nudos, estado del manto). Sin diagnósticos de salud.
- confianza: alta, media o baja para tamano, manto y nudos.`

const schema = {
  type: 'OBJECT',
  properties: {
    esPerro: { type: 'BOOLEAN' },
    raza: { type: 'STRING' },
    tamano: { type: 'STRING', enum: [...sizes] },
    manto: { type: 'STRING', enum: [...coats] },
    nudos: { type: 'STRING', enum: [...knots] },
    observaciones: { type: 'STRING' },
    confianza: {
      type: 'OBJECT',
      properties: {
        tamano: { type: 'STRING', enum: ['alta', 'media', 'baja'] },
        manto: { type: 'STRING', enum: ['alta', 'media', 'baja'] },
        nudos: { type: 'STRING', enum: ['alta', 'media', 'baja'] },
      },
      required: ['tamano', 'manto', 'nudos'],
    },
  },
  required: ['esPerro'],
}

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>
}

export async function analizarConGemini(
  base64: string,
  mimeType: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ResultadoSugerencia> {
  const key = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL
  if (!key || !model) {
    return { ok: false, motivo: 'sin-ia', mensaje: 'El análisis con IA no está activado en este servidor.' }
  }

  const fallo: ResultadoSugerencia = {
    ok: false,
    motivo: 'error',
    mensaje: 'No pudimos leer la foto. Elegí los datos a mano.',
  }

  let res: Response
  try {
    res = await fetchImpl(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts: [{ inlineData: { mimeType, data: base64 } }, { text: PROMPT }] }],
          generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.2 },
        }),
        signal: AbortSignal.timeout(20_000),
      },
    )
  } catch {
    return fallo
  }
  if (!res.ok) return fallo

  const data = (await res.json().catch(() => null)) as GeminiResponse | null
  const textOut = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
  let json: unknown
  try {
    json = JSON.parse(textOut)
  } catch {
    return fallo
  }

  const parsed = parseSugerencia(json)
  if (!parsed) return fallo
  if ('esPerro' in parsed) {
    return { ok: false, motivo: 'no-es-perro', mensaje: 'No vemos un perro en la foto. Probá con otra o elegí los datos a mano.' }
  }
  return { ok: true, sugerencia: { ...parsed, origen: 'ia' } }
}
