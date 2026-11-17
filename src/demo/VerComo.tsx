'use client'

import { useId } from 'react'

import { Notice } from '@/components/ui'

import { verComo } from './acciones'
import { useEstado } from './store'

/** «Ver como» un cliente: en la app real cada cliente entra con su enlace personal, sin contraseña. */
export function VerComo() {
  const s = useEstado()
  const id = useId()
  return (
    <Notice tone="info" title="En la demo podés elegir de quién ver los datos">
      <span className="mt-1 block">
        En la app real, cada cliente entra con su enlace personal que le llega por WhatsApp.
      </span>
      <span className="mt-3 flex flex-wrap items-center gap-2">
        <label htmlFor={id} className="font-bold">
          Ver como
        </label>
        <select
          id={id}
          value={s.clienteId ?? ''}
          onChange={(e) => verComo(e.target.value ? Number(e.target.value) : null)}
          className="min-h-10 rounded-sm border-2 border-tinta bg-superficie px-2 text-sm text-texto"
        >
          <option value="">Un visitante sin enlace</option>
          {s.tutores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </span>
    </Notice>
  )
}
