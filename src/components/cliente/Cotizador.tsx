'use client'

import { useMemo, useState } from 'react'

import { ChipGroup, Ticket, ToggleChip } from '@/components/ui'
import type { Catalog } from '@/lib/catalogo'
import { aplicarSugerencia, alternar, estadoInicial, type EstadoCotizacion } from '@/lib/cotizacion'
import { formatMoney } from '@/lib/format'
import type { Sugerencia } from '@/lib/ia/sugerencia'
import {
  buildQuote,
  coatLabels,
  coats,
  knots,
  knotsLabels,
  servicePrice,
  sizeLabels,
  sizes,
} from '@/lib/pricing'

import { ResumenPresupuesto } from './ResumenPresupuesto'
import { SelectableService } from './SelectableService'
import { SugerirConFoto } from './SugerirConFoto'

type Props = { catalog: Catalog; iaActiva: boolean }

export function Cotizador({ catalog, iaActiva }: Props) {
  const popular = catalog.servicios.find((s) => s.popular)?.id
  const [estado, setEstado] = useState<EstadoCotizacion>(() => estadoInicial(popular))
  const [sugerencia, setSugerencia] = useState<Sugerencia | null>(null)

  const quote = useMemo(() => buildQuote(estado, catalog, catalog.config), [estado, catalog])
  const set = (patch: Partial<EstadoCotizacion>) => setEstado((e) => ({ ...e, ...patch }))

  function onSugerencia(s: Sugerencia) {
    setSugerencia(s)
    setEstado((e) => aplicarSugerencia(e, s))
  }

  // Marca «sugerido» mientras el valor elegido coincida con la sugerencia
  const sugerido = (campo: 'tamano' | 'manto' | 'nudos') =>
    sugerencia && sugerencia[campo] === estado[campo]
      ? `Sugerido por ${sugerencia.origen === 'ejemplo' ? 'el ejemplo' : 'la foto'}. Podés cambiarlo.`
      : undefined

  const hintTamano =
    sugerencia && sugerencia.tamano === estado.tamano && sugerencia.confianza.tamano !== 'alta'
      ? 'Confirmalo: una foto no permite medir al perro. Guiate por el peso.'
      : sugerido('tamano')

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="flex flex-col gap-8">
        <SugerirConFoto iaActiva={iaActiva} sugerencia={sugerencia} onSugerencia={onSugerencia} />

        <Ticket as="section" aria-labelledby="titulo-perro" className="flex flex-col gap-6">
          <h2 id="titulo-perro" className="text-xl">
            tu perro
          </h2>
          <ChipGroup
            legend="Tamaño"
            name="tamano"
            value={estado.tamano}
            onChange={(tamano) => set({ tamano })}
            hint={hintTamano}
            options={sizes.map((s) => ({ value: s, label: sizeLabels[s].label, detail: sizeLabels[s].detail }))}
          />
          <ChipGroup
            legend="Manto"
            name="manto"
            value={estado.manto}
            onChange={(manto) => set({ manto })}
            hint={sugerido('manto')}
            options={coats.map((c) => ({ value: c, label: coatLabels[c] }))}
          />
          <ChipGroup
            legend="Nudos"
            name="nudos"
            value={estado.nudos}
            onChange={(nudos) => set({ nudos })}
            hint={
              sugerido('nudos') ??
              (estado.nudos !== 'sin' ? 'El recargo por nudos se suma una sola vez en el resumen.' : undefined)
            }
            options={knots.map((k) => ({ value: k, label: knotsLabels[k] }))}
          />
        </Ticket>

        <section aria-labelledby="titulo-servicios" className="flex flex-col gap-4">
          <h2 id="titulo-servicios" className="text-xl">
            servicios
          </h2>
          <p className="text-sm text-texto-suave">
            Precio para un perro {sizeLabels[estado.tamano].label.toLowerCase()} de manto{' '}
            {coatLabels[estado.manto].toLowerCase()}. No incluye el recargo por nudos.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {catalog.servicios.map((s) => (
              <li key={s.id}>
                <SelectableService
                  id={s.id}
                  name={s.nombre}
                  description={s.descripcion}
                  duration={s.duracion}
                  price={servicePrice(s, estado.tamano, estado.manto, catalog.config)}
                  selected={estado.servicioIds.includes(s.id)}
                  onToggle={() => set({ servicioIds: alternar(estado.servicioIds, s.id) })}
                />
              </li>
            ))}
          </ul>
        </section>

        {catalog.extras.length > 0 && (
          <section aria-labelledby="titulo-extras" className="flex flex-col gap-3">
            <h2 id="titulo-extras" className="text-xl">
              extras
            </h2>
            <div className="flex flex-wrap gap-2">
              {catalog.extras.map((e) => (
                <ToggleChip
                  key={e.id}
                  pressed={estado.extraIds.includes(e.id)}
                  onPressedChange={() => set({ extraIds: alternar(estado.extraIds, e.id) })}
                >
                  {e.nombre} · {formatMoney(e.precio)}
                </ToggleChip>
              ))}
            </div>
          </section>
        )}
      </div>

      <ResumenPresupuesto quote={quote} estado={estado} />
    </div>
  )
}
