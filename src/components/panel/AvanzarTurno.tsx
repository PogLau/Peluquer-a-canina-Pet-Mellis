'use client'

import { avanzarTurno } from '@/app/(panel)/panel/(app)/acciones'
import type { AccionTurno } from '@/components/panel/TurnoCard'

import { BotonAvanzar } from './BotonAvanzar'

/** Pasar el turno al estado siguiente con la acción del servidor. */
export function AvanzarTurno({ id, estado, accion, variant, sinRegistro }: AccionTurno) {
  return (
    <BotonAvanzar
      accion={accion}
      variant={variant}
      sinRegistro={sinRegistro}
      avanzar={() => avanzarTurno(id, estado)}
    />
  )
}
