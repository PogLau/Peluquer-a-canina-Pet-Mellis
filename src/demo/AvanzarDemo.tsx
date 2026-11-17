'use client'

import { useState } from 'react'

import type { AccionTurno, RutasPanel } from '@/components/panel/TurnoCard'
import { Button } from '@/components/ui'

import { avanzarTurno } from './acciones'

/** Rutas del panel en la demo estática: una sola página por sección, con ?id= (no hay páginas por perro). */
export const rutasDemo: RutasPanel = {
  mascota: (id) => `/panel/mascotas?id=${id}`,
  registrar: (turnoId) => `/panel/registrar?turno=${turnoId}`,
}

/** Un toque para pasar el turno al estado siguiente (versión de la demo de AvanzarTurno). */
export function AvanzarDemo({ id, estado, accion, variant }: AccionTurno) {
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant={variant}
        size="small"
        icon="check"
        onClick={async () => {
          const r = await avanzarTurno(id, estado)
          setError(r.ok ? null : r.error)
        }}
      >
        {accion}
      </Button>
      {error && (
        <p role="alert" className="text-sm font-bold text-peligro">
          {error}
        </p>
      )}
    </div>
  )
}
