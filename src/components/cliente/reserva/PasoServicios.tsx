'use client'

import { ChipGroup, ToggleChip } from '@/components/ui'
import type { Catalog } from '@/lib/catalogo'
import type { EstadoReserva } from '@/lib/cliente/pasos'
import { alternar } from '@/lib/cotizacion'
import { formatMoney } from '@/lib/format'
import {
  knots,
  knotsLabels,
  servicePrice,
  type Coat,
  type Knots,
  type Quote,
  type Size,
} from '@/lib/pricing'

type Props = {
  estado: EstadoReserva
  set: (patch: Partial<EstadoReserva>) => void
  catalog: Catalog
  tamano: Size
  manto: Coat
  quote: Quote
}

/** Paso 2: servicios y extras (vienen del cotizador si el cliente pasó por ahí). */
export function PasoServicios({ estado, set, catalog, tamano, manto, quote }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-bold">Servicios</legend>
        <div className="flex flex-wrap gap-2">
          {catalog.servicios.map((s) => (
            <ToggleChip
              key={s.id}
              pressed={estado.servicios.includes(s.id)}
              onPressedChange={() => set({ servicios: alternar(estado.servicios, s.id) })}
            >
              {s.nombre} ·{' '}
              <span className="cifras">
                {formatMoney(servicePrice(s, tamano, manto, catalog.config))}
              </span>
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
              {x.nombre} · <span className="cifras">{formatMoney(x.precio)}</span>
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
        hint="El recargo por nudos se suma una sola vez."
      />

      <p className="flex items-baseline justify-between gap-3 rounded-sm border-2 border-tinta bg-superficie-alt px-4 py-3">
        <span className="font-bold">Total estimado</span>
        <span className="cifras font-display text-2xl font-bold">
          {formatMoney(quote.total)}
        </span>
      </p>
    </div>
  )
}
