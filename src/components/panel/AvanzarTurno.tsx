'use client'

import { useState, useTransition } from 'react'

import { avanzarTurno } from '@/app/(panel)/panel/(app)/acciones'
import { Button, type ButtonVariant } from '@/components/ui'
import type { AppointmentStatus } from '@/lib/estados'

/** Un toque para pasar el turno al estado siguiente. */
export function AvanzarTurno({
  id,
  estado,
  accion,
  variant = 'primary',
}: {
  id: number
  estado: AppointmentStatus
  accion: string
  variant?: ButtonVariant
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant={variant}
        size="small"
        icon="check"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await avanzarTurno(id, estado)
            setError(r.ok ? null : r.error)
          })
        }
      >
        {pending ? 'Guardando…' : accion}
      </Button>
      {error && (
        <p role="alert" className="text-sm font-bold text-peligro">
          {error}
        </p>
      )}
    </div>
  )
}
