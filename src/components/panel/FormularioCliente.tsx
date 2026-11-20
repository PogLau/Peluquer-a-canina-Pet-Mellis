'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { guardarCliente } from '@/app/(panel)/panel/(app)/acciones-gestion'
import { Button, Notice, TextareaField, TextField } from '@/components/ui'
import type { ClienteEditable, ErroresCampos } from '@/lib/panel/clientes'

/** Alta y edición del tutor en la misma pantalla. Al crear, lleva a su ficha para cargar los perros. */
export function FormularioCliente({ inicial }: { inicial: ClienteEditable }) {
  const router = useRouter()
  const [c, setC] = useState(inicial)
  const [errores, setErrores] = useState<ErroresCampos>({})
  const [aviso, setAviso] = useState<{ tono: 'exito' | 'peligro'; texto: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const set = (patch: Partial<ClienteEditable>) => {
    setC((prev) => ({ ...prev, ...patch }))
    setAviso(null)
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        startTransition(async () => {
          const r = await guardarCliente(c)
          if (!r.ok) {
            setErrores(r.errores ?? {})
            setAviso({ tono: 'peligro', texto: r.error })
            return
          }
          setErrores({})
          if (!c.id && r.id) router.push(`/panel/clientes/${r.id}?nuevo=1`)
          else setAviso({ tono: 'exito', texto: 'Cambios guardados.' })
        })
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Nombre"
          value={c.nombre}
          onChange={(e) => set({ nombre: e.target.value })}
          error={errores.nombre}
        />
        <TextField
          label="WhatsApp"
          type="tel"
          inputMode="tel"
          value={c.whatsapp}
          onChange={(e) => set({ whatsapp: e.target.value })}
          hint="Con código de área. Se guarda en formato internacional."
          error={errores.whatsapp}
        />
        <TextField
          label="Zona"
          optional
          value={c.zona}
          onChange={(e) => set({ zona: e.target.value })}
          error={errores.zona}
        />
      </div>
      <TextareaField
        label="Notas"
        optional
        rows={2}
        value={c.notas}
        onChange={(e) => set({ notas: e.target.value })}
        hint="Solo las ve el salón."
        error={errores.notas}
      />
      {aviso && (
        <Notice
          tone={aviso.tono}
          role={aviso.tono === 'peligro' ? 'alert' : 'status'}
          title={aviso.texto}
        />
      )}
      <div>
        <Button type="submit" icon="check" disabled={pending}>
          {pending ? 'Guardando…' : c.id ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  )
}
