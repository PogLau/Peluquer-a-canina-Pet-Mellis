'use client'

import { BotonAvanzar } from '@/components/panel/BotonAvanzar'
import type { AccionTurno, RutasPanel } from '@/components/panel/TurnoCard'

import { avanzarTurno } from './acciones'

/** Rutas del panel en la demo estática: una sola página por sección, con ?id= (no hay páginas por perro). */
export const rutasDemo: RutasPanel = {
  mascota: (id) => `/panel/mascotas?id=${id}`,
  registrar: (turnoId) => `/panel/registrar?turno=${turnoId}`,
}

/** Un toque para pasar el turno al estado siguiente (versión de la demo de AvanzarTurno). */
export function AvanzarDemo({ id, estado, accion, variant, sinRegistro }: AccionTurno) {
  return (
    <BotonAvanzar
      accion={accion}
      variant={variant}
      sinRegistro={sinRegistro}
      avanzar={() => avanzarTurno(id, estado)}
    />
  )
}
