'use client'

import { useSyncExternalStore } from 'react'

import { initialState, VERSION_DEMO, type DemoState } from './estado'
import { DemoError } from './operaciones'

/*
  Estado de la demo en el navegador (localStorage). No hay servidor ni base de datos:
  cada visitante tiene su propia copia y «Reiniciar demo» la vuelve al estado inicial.
  En el HTML estático no hay datos: la primera vez se arman en el navegador.
*/

const CLAVE = 'pet-mellis-demo'
let estado: DemoState | null = null
const oyentes = new Set<() => void>()

function leer(): DemoState | null {
  try {
    const raw = localStorage.getItem(CLAVE)
    if (!raw) return null
    const s = JSON.parse(raw) as DemoState
    return s.version === VERSION_DEMO ? s : null
  } catch {
    return null
  }
}

function guardar(s: DemoState) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(s))
  } catch {
    // Navegación privada o almacenamiento bloqueado: la demo anda igual, solo que no recuerda nada al recargar
  }
}

function snapshot(): DemoState {
  if (!estado) {
    estado = leer() ?? initialState()
    guardar(estado)
  }
  return estado
}

function publicar(s: DemoState) {
  estado = s
  guardar(s)
  oyentes.forEach((o) => o())
}

function suscribir(o: () => void) {
  oyentes.add(o)
  // Otra pestaña con la demo abierta: se sincroniza
  const alCambiar = (e: StorageEvent) => {
    if (e.key === CLAVE) {
      estado = leer()
      o()
    }
  }
  window.addEventListener('storage', alCambiar)
  return () => {
    oyentes.delete(o)
    window.removeEventListener('storage', alCambiar)
  }
}

/** Aplica una operación. Devuelve el mensaje de error si no se pudo, o null. */
export function aplicar(op: (s: DemoState) => DemoState): string | null {
  try {
    publicar(op(snapshot()))
    return null
  } catch (e) {
    return e instanceof DemoError ? e.message : 'No se pudo hacer. Probá de nuevo.'
  }
}

export function reiniciarDemo() {
  publicar(initialState())
}

/** Estado actual de la demo. Null mientras se arma (en el HTML estático y en el primer render). */
export function useDemo(): DemoState | null {
  return useSyncExternalStore(suscribir, snapshot, () => null)
}

/** Estado actual fuera de React (para las acciones). Null en el servidor. */
export function leerEstado(): DemoState | null {
  return typeof window === 'undefined' ? null : snapshot()
}

/** Para las páginas de la demo: DemoShell solo las muestra cuando el estado ya está listo. */
export function useEstado(): DemoState {
  const s = useDemo()
  if (!s) throw new Error('La demo todavía no cargó sus datos')
  return s
}
