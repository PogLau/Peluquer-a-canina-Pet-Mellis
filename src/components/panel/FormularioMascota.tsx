'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'

import { guardarMascota } from '@/app/(panel)/panel/(app)/acciones-gestion'
import { Button, ChipGroup, Notice, TextareaField, TextField, Ticket } from '@/components/ui'
import type { ErroresCampos, MascotaEditable } from '@/lib/panel/clientes'
import { coatLabels, coats, sizeLabels, sizes, type Coat, type Size } from '@/lib/pricing'

const vacia: MascotaEditable = {
  id: null,
  nombre: '',
  raza: '',
  tamano: 'chico',
  manto: 'corto',
  pesoKg: '',
  cuidadosEspeciales: '',
}

/** Un perro del cliente, editable en el lugar. Sin `inicial` es el alta de un perro nuevo. */
export function FormularioMascota({
  tutorId,
  inicial,
  ultimaVisita,
}: {
  tutorId: number
  inicial?: MascotaEditable
  ultimaVisita?: string | null
}) {
  const [m, setM] = useState<MascotaEditable>(inicial ?? vacia)
  const [abierto, setAbierto] = useState(!inicial)
  const [errores, setErrores] = useState<ErroresCampos>({})
  const [aviso, setAviso] = useState<{ tono: 'exito' | 'peligro'; texto: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const set = (patch: Partial<MascotaEditable>) => {
    setM((prev) => ({ ...prev, ...patch }))
    setAviso(null)
  }
  const prefijo = m.id ? `m${m.id}` : 'nueva'

  if (!abierto) {
    return (
      <Ticket size="small" className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex flex-col">
          <span className="font-display text-xl titulo">{m.nombre}</span>
          <span className="text-sm text-texto-suave">
            {[m.raza, sizeLabels[m.tamano].label, `manto ${coatLabels[m.manto].toLowerCase()}`]
              .filter(Boolean)
              .join(' · ')}
            {ultimaVisita !== undefined &&
              ` · ${ultimaVisita ? `última visita ${ultimaVisita}` : 'sin visitas'}`}
          </span>
        </span>
        <span className="flex flex-wrap gap-2">
          {m.id && (
            <Link
              href={`/panel/mascotas/${m.id}`}
              className="inline-flex min-h-10 items-center px-2 text-sm font-bold underline underline-offset-4"
            >
              Ficha
            </Link>
          )}
          <Button size="small" variant="secondary" onClick={() => setAbierto(true)}>
            Editar
          </Button>
        </span>
      </Ticket>
    )
  }

  return (
    <Ticket size="small">
      <form
        noValidate
        className="flex flex-col gap-4 p-1"
        onSubmit={(e) => {
          e.preventDefault()
          startTransition(async () => {
            const r = await guardarMascota(tutorId, m)
            if (!r.ok) {
              setErrores(r.errores ?? {})
              setAviso({ tono: 'peligro', texto: r.error })
              return
            }
            setErrores({})
            if (!m.id) {
              setM(vacia)
              setAviso({ tono: 'exito', texto: 'Perro agregado.' })
            } else {
              setAbierto(false)
            }
          })
        }}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id={`${prefijo}-nombre`}
            label="Nombre"
            value={m.nombre}
            onChange={(e) => set({ nombre: e.target.value })}
            error={errores.nombre}
          />
          <TextField
            id={`${prefijo}-raza`}
            label="Raza"
            optional
            value={m.raza}
            onChange={(e) => set({ raza: e.target.value })}
            error={errores.raza}
          />
          <TextField
            id={`${prefijo}-peso`}
            label="Peso (kg)"
            optional
            inputMode="decimal"
            value={m.pesoKg}
            onChange={(e) => set({ pesoKg: e.target.value })}
            error={errores.pesoKg}
          />
        </div>
        <ChipGroup
          legend="Tamaño"
          name={`${prefijo}-tamano`}
          options={sizes.map((s) => ({
            value: s,
            label: sizeLabels[s].label,
            detail: sizeLabels[s].detail,
          }))}
          value={m.tamano}
          onChange={(v) => set({ tamano: v as Size })}
        />
        <ChipGroup
          legend="Manto"
          name={`${prefijo}-manto`}
          options={coats.map((c) => ({ value: c, label: coatLabels[c] }))}
          value={m.manto}
          onChange={(v) => set({ manto: v as Coat })}
        />
        <TextareaField
          id={`${prefijo}-cuidados`}
          label="Cuidados especiales"
          optional
          rows={2}
          value={m.cuidadosEspeciales}
          onChange={(e) => set({ cuidadosEspeciales: e.target.value })}
          hint="Se ve en la agenda antes de empezar."
          error={errores.cuidadosEspeciales}
        />
        {aviso && (
          <Notice
            tone={aviso.tono}
            role={aviso.tono === 'peligro' ? 'alert' : 'status'}
            title={aviso.texto}
          />
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="small" icon={m.id ? 'check' : 'mas'} disabled={pending}>
            {pending ? 'Guardando…' : m.id ? 'Guardar perro' : 'Agregar perro'}
          </Button>
          {inicial && (
            <Button
              size="small"
              variant="ghost"
              onClick={() => {
                setM(inicial)
                setErrores({})
                setAbierto(false)
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Ticket>
  )
}
