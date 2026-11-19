'use client'

import { ChipGroup, ToggleChip } from '@/components/ui'
import type { Catalog } from '@/lib/catalogo'
import type { EstadoReserva } from '@/lib/cliente/pasos'
import { alternar } from '@/lib/cotizacion'
import { formatMoney } from '@/lib/format'
import { knots, knotsLabels, type Knots, type Quote } from '@/lib/pricing'

import { NotaPrecios, TotalPresupuesto } from '../Precios'

type Props = {
  estado: EstadoReserva
  set: (patch: Partial<EstadoReserva>) => void
  catalog: Catalog
  quote: Quote
}

/** Paso 2: servicios y extras (vienen del cotizador si el cliente pasó por ahí). */
export function PasoServicios({ estado, set, catalog, quote }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-bold">Servicios</legend>
        {estado.servicios.length === 0 && (
          <p className="mb-1 text-sm text-texto-suave">
            Todavía no elegiste ningún servicio. Tocá el que quieras.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {catalog.servicios.map((s) => (
            <ToggleChip
              key={s.id}
              pressed={estado.servicios.includes(s.id)}
              onPressedChange={() => set({ servicios: alternar(estado.servicios, s.id) })}
            >
              {s.nombre}
            </ToggleChip>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-bold">Extras (opcional)</legend>
        <div className="flex flex-wrap gap-2">
          {catalog.extras.map((x) => (
            <ToggleChip
              key={x.id}
              pressed={estado.extras.includes(x.id)}
              onPressedChange={() => set({ extras: alternar(estado.extras, x.id) })}
            >
              {x.nombre}
            </ToggleChip>
          ))}
        </div>
      </fieldset>

      <ChipGroup
        legend="¿Cómo están los nudos?"
        name="nudos"
        options={knots.map((k) => ({ value: k, label: knotsLabels[k] }))}
        value={estado.nudos}
        onChange={(v) => set({ nudos: v as Knots })}
        hint="El desenredado de nudos se suma una sola vez."
      />

      {/* El precio aparece recién con al menos un servicio elegido (el tamaño ya se eligió en el paso 1) */}
      {estado.servicios.length > 0 && (
        <div className="flex flex-col gap-2 rounded-sm border border-linea bg-superficie-alt px-4 py-3">
          <ul className="flex flex-col gap-1.5 text-sm" aria-live="polite">
            {quote.lineas.map((l) => (
              <li key={`${l.tipo}-${l.id}`} className="flex items-baseline justify-between gap-3">
                <span>{l.nombre}</span>
                <span className="cifras whitespace-nowrap font-bold">{formatMoney(l.monto)}</span>
              </li>
            ))}
          </ul>
          <TotalPresupuesto quote={quote} />
          <NotaPrecios />
        </div>
      )}
    </div>
  )
}
