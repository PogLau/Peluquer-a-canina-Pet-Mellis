'use server'

import { headers } from 'next/headers'

import { analizarConGemini, iaDisponible } from '@/lib/ia/gemini'
import type { ResultadoSugerencia } from '@/lib/ia/sugerencia'

const TIPOS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 4 * 1024 * 1024
const LIMITE_POR_HORA = 5

// Límite simple en memoria por IP. Alcanza para la demo; en producción, usar un almacén compartido.
const pedidos = new Map<string, number[]>()

function superaLimite(ip: string): boolean {
  const ahora = Date.now()
  const recientes = (pedidos.get(ip) ?? []).filter((t) => ahora - t < 60 * 60 * 1000)
  if (recientes.length >= LIMITE_POR_HORA) return true
  pedidos.set(ip, [...recientes, ahora])
  return false
}

/** Analiza la foto que sube el tutor. La foto no se guarda. */
export async function sugerirConFoto(formData: FormData): Promise<ResultadoSugerencia> {
  if (!iaDisponible()) {
    return {
      ok: false,
      motivo: 'sin-ia',
      mensaje: 'Por ahora no podemos leer fotos propias. Probá con un ejemplo o marcá los datos a mano.',
    }
  }

  const foto = formData.get('foto')
  if (!(foto instanceof File) || !TIPOS.includes(foto.type) || foto.size === 0 || foto.size > MAX_BYTES) {
    return { ok: false, motivo: 'archivo-invalido', mensaje: 'Subí una foto JPG, PNG o WEBP de hasta 4 MB.' }
  }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local'
  if (superaLimite(ip)) {
    return { ok: false, motivo: 'limite', mensaje: 'Llegaste al límite de fotos por hora. Elegí los datos a mano.' }
  }

  const base64 = Buffer.from(await foto.arrayBuffer()).toString('base64')
  return analizarConGemini(base64, foto.type)
}
