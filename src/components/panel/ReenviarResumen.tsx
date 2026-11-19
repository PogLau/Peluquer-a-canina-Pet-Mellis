'use client'

import { useState, useTransition } from 'react'

import { resumenDeAtencion } from '@/app/(panel)/panel/(app)/acciones'
import { Button, Modal, Notice } from '@/components/ui'

import { EnviarResumen } from './EnviarResumen'

/** Desde la ficha: arma de nuevo el resumen de una atención y deja revisarlo antes de abrir WhatsApp. */
export function ReenviarResumen({ atencionId, mascota }: { atencionId: number; mascota: string }) {
  const [datos, setDatos] = useState<{ telefono: string; mensaje: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <>
      <Button
        size="small"
        variant="secondary"
        icon="whatsapp"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await resumenDeAtencion(atencionId)
            if (r.ok) setDatos({ telefono: r.telefono, mensaje: r.mensaje })
            else setError(r.error)
          })
        }
      >
        {pending ? 'Armando…' : 'Enviar resumen'}
      </Button>
      {error && <Notice tone="peligro" role="alert" title={error} />}
      <Modal
        open={!!datos}
        onClose={() => setDatos(null)}
        title={
          <>
            resumen de {mascota}
          </>
        }
      >
        {datos && <EnviarResumen telefono={datos.telefono} mensajeInicial={datos.mensaje} />}
      </Modal>
    </>
  )
}
