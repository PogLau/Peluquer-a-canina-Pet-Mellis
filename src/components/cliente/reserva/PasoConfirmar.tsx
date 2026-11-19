'use client'

import { TextareaField } from '@/components/ui'
import type { EstadoReserva } from '@/lib/cliente/pasos'
import { formatLongDate, formatMoney, formatTime } from '@/lib/format'
import type { Quote } from '@/lib/pricing'

import { NotaPrecios, TotalPresupuesto } from '../Precios'

type Props = {
  estado: EstadoReserva
  set: (patch: Partial<EstadoReserva>) => void
  tutor: string
  mascota: string
  quote: Quote
  error?: string
}

/** Paso 4: el resumen antes de pedir el turno. */
export function PasoConfirmar({ estado, set, tutor, mascota, quote, error }: Props) {
  const fecha = estado.fechaHora ? new Date(estado.fechaHora) : null
  return (
    <div className="flex flex-col gap-5">
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="font-bold">Tutor</dt>
        <dd>{tutor}</dd>
        <dt className="font-bold">Perro</dt>
        <dd>{mascota}</dd>
        <dt className="font-bold">Cuándo</dt>
        <dd>{fecha ? `${formatLongDate(fecha)} a las ${formatTime(fecha)}` : '—'}</dd>
      </dl>

      <ul className="flex flex-col divide-y-2 divide-linea rounded-sm border-2 border-tinta bg-superficie">
        {quote.lineas.map((l) => (
          <li key={`${l.tipo}-${l.id}`} className="flex justify-between gap-3 px-4 py-2.5 text-sm">
            <span className={l.tipo === 'recargo' ? 'font-bold text-verde' : undefined}>
              {l.nombre}
            </span>
            <span className="cifras whitespace-nowrap">{formatMoney(l.monto)}</span>
          </li>
        ))}
        <li className="flex flex-col gap-2 bg-superficie-alt px-4 py-3">
          <TotalPresupuesto quote={quote} />
          <NotaPrecios />
        </li>
      </ul>

      <TextareaField
        label="¿Algo que tengamos que saber?"
        optional
        rows={3}
        value={estado.notas}
        onChange={(e) => set({ notas: e.target.value })}
        hint="Por ejemplo: le tiene miedo al secador, o preferís a la mañana."
        error={error}
      />
      <p className="text-sm text-texto-suave">
        El turno queda pedido y te lo confirmamos por WhatsApp. El precio final puede cambiar si hay
        nudos o servicios extra.
      </p>
    </div>
  )
}
