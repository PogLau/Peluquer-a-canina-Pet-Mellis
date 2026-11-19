'use client'

import { useState, useTransition } from 'react'

import { Button, LinkButton, Modal, type ButtonVariant } from '@/components/ui'

type Resultado = { ok: true } | { ok: false; error: string }

export type SinRegistro = {
  /** Nombre del perro, para el texto del aviso. */
  nombre: string
  registrarHref: string
}

type Props = {
  accion: string
  variant?: ButtonVariant
  avanzar: () => Promise<Resultado>
  /**
   * Si el turno todavía no tiene su atención guardada, antes de avanzar se pide confirmación
   * y se ofrece registrarla: así ningún perro atendido queda sin su visita en la Ficha Evolutiva.
   */
  sinRegistro?: SinRegistro
}

/** Un toque para pasar el turno al estado siguiente (app real y demo). */
export function BotonAvanzar({ accion, variant = 'primary', avanzar, sinRegistro }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirmar, setConfirmar] = useState(false)

  function ejecutar() {
    setConfirmar(false)
    startTransition(async () => {
      const r = await avanzar()
      setError(r.ok ? null : r.error)
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant={variant}
        size="small"
        icon="check"
        disabled={pending}
        onClick={() => (sinRegistro ? setConfirmar(true) : ejecutar())}
      >
        {pending ? 'Guardando…' : accion}
      </Button>
      {error && (
        <p role="alert" className="text-sm font-bold text-peligro">
          {error}
        </p>
      )}
      {sinRegistro && (
        <Modal
          open={confirmar}
          onClose={() => setConfirmar(false)}
          title="falta registrar la atención"
          footer={
            <>
              <Button variant="ghost" onClick={ejecutar}>
                {accion} igual
              </Button>
              <LinkButton href={sinRegistro.registrarHref} icon="libreta">
                Registrar atención
              </LinkButton>
            </>
          }
        >
          <p>
            Todavía no guardaste cómo le fue a {sinRegistro.nombre}. Si seguís sin registrarla, esta visita no
            queda en su Ficha Evolutiva.
          </p>
        </Modal>
      )}
    </div>
  )
}
