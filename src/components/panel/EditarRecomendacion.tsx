'use client'

import { useState, useTransition } from 'react'

import { Button, TextareaField } from '@/components/ui'

/** La recomendación para la próxima visita siempre se puede editar. Se guarda en la última atención. */
export function EditarRecomendacion({
  atencionId,
  inicial,
  sugerida,
  guardar,
}: {
  atencionId: number
  inicial: string
  sugerida: string
  guardar: (
    atencionId: number,
    texto: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>
}) {
  const [texto, setTexto] = useState(inicial || sugerida)
  const [guardado, setGuardado] = useState(inicial || sugerida)
  const [estado, setEstado] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const cambios = texto !== guardado

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        startTransition(async () => {
          const r = await guardar(atencionId, texto)
          if (r.ok) {
            setGuardado(texto)
            setEstado({ tipo: 'ok', texto: 'Recomendación guardada.' })
          } else setEstado({ tipo: 'error', texto: r.error })
        })
      }}
    >
      <TextareaField
        label="Recomendación para la próxima visita"
        rows={3}
        value={texto}
        optional
        onChange={(e) => {
          setTexto(e.target.value)
          setEstado(null)
        }}
        hint={
          !inicial && sugerida ? 'Propuesta a partir de la ficha. Cambiala si querés.' : undefined
        }
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="small" variant="secondary" disabled={pending || !cambios}>
          {pending ? 'Guardando…' : 'Guardar recomendación'}
        </Button>
        {sugerida && texto !== sugerida && (
          <Button size="small" variant="ghost" onClick={() => setTexto(sugerida)}>
            Usar la propuesta
          </Button>
        )}
        <p
          role="status"
          className={
            estado?.tipo === 'error' ? 'text-sm font-bold text-peligro' : 'text-sm text-exito'
          }
        >
          {estado?.texto}
        </p>
      </div>
    </form>
  )
}
