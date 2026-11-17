'use client'

import { useState, useTransition } from 'react'

import { cancelarTurno } from '@/app/(cliente)/acciones'
import { Button, Modal, Notice } from '@/components/ui'

/** Cancelar desde la web (solo si faltan más de 24 h). Pide confirmación antes. */
export function CancelarTurno({ id, descripcion }: { id: number; descripcion: string }) {
  const [abierto, setAbierto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <>
      <Button variant="ghost" size="small" onClick={() => setAbierto(true)}>
        Cancelar turno
      </Button>
      {error && <Notice tone="peligro" role="alert" title={error} />}
      <Modal
        open={abierto}
        onClose={() => setAbierto(false)}
        title="¿cancelar el turno?"
        footer={
          <>
            <Button variant="ghost" size="small" onClick={() => setAbierto(false)}>
              No, volver
            </Button>
            <Button
              size="small"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const r = await cancelarTurno(id)
                  setAbierto(false)
                  setError(r.ok ? null : r.error)
                })
              }
            >
              {pending ? 'Cancelando…' : 'Sí, cancelar'}
            </Button>
          </>
        }
      >
        <p className="text-sm">
          Se cancela el turno de {descripcion}. Si después querés otro, podés reservar de nuevo.
        </p>
      </Modal>
    </>
  )
}
