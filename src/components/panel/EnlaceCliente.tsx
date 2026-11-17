'use client'

import { useState, useTransition } from 'react'

import { regenerarEnlace } from '@/app/(panel)/panel/(app)/acciones'
import { Button, Modal, Notice } from '@/components/ui'

/**
 * Enlace personal del tutor (reemplaza al login del cliente).
 * Se copia para mandarlo por WhatsApp; si se filtró, se genera uno nuevo y el anterior deja de andar.
 */
export function EnlaceCliente({
  tutorId,
  tutor,
  inicial,
}: {
  tutorId: number
  tutor: string
  inicial: string
}) {
  const [enlace, setEnlace] = useState(inicial)
  const [aviso, setAviso] = useState<{ tono: 'exito' | 'peligro'; texto: string } | null>(null)
  const [confirmar, setConfirmar] = useState(false)
  const [pending, startTransition] = useTransition()

  async function copiar() {
    try {
      await navigator.clipboard.writeText(enlace)
      setAviso({ tono: 'exito', texto: 'Enlace copiado.' })
    } catch {
      setAviso({
        tono: 'peligro',
        texto: 'No se pudo copiar: seleccioná el enlace y copialo a mano.',
      })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-texto-suave">
        Con este enlace {tutor} ve la libreta y los turnos de sus perros, sin contraseña. Ya va
        incluido en la confirmación y en el resumen por WhatsApp.
      </p>
      <input
        readOnly
        aria-label={`Enlace personal de ${tutor}`}
        value={enlace}
        onFocus={(e) => e.currentTarget.select()}
        className="cifras min-h-11 w-full rounded-sm border-2 border-tinta bg-superficie-alt px-3 text-sm"
      />
      <div className="flex flex-wrap gap-3">
        <Button size="small" variant="secondary" icon="check" onClick={copiar}>
          Copiar enlace
        </Button>
        <Button size="small" variant="ghost" onClick={() => setConfirmar(true)}>
          Generar enlace nuevo
        </Button>
      </div>
      {aviso && <Notice tone={aviso.tono} role="status" title={aviso.texto} />}

      <Modal
        open={confirmar}
        onClose={() => setConfirmar(false)}
        title="¿generar un enlace nuevo?"
        footer={
          <>
            <Button size="small" variant="ghost" onClick={() => setConfirmar(false)}>
              Volver
            </Button>
            <Button
              size="small"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const r = await regenerarEnlace(tutorId)
                  setConfirmar(false)
                  if (r.ok) {
                    setEnlace(r.enlace)
                    setAviso({
                      tono: 'exito',
                      texto: 'Enlace nuevo listo. Mandáselo a ' + tutor + '.',
                    })
                  } else setAviso({ tono: 'peligro', texto: r.error })
                })
              }
            >
              Generar
            </Button>
          </>
        }
      >
        <p className="text-sm">
          El enlace actual deja de funcionar en todos los teléfonos. Usalo si el enlace se compartió
          por error.
        </p>
      </Modal>
    </div>
  )
}
