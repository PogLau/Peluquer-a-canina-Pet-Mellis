'use client'

import { useMemo, useState } from 'react'

import { ChipGroup, Ticket, ToggleChip } from '@/components/ui'
import type { Catalog } from '@/lib/catalogo'
import {
  aplicarPlan,
  aplicarSugerencia,
  alternar,
  estadoInicial,
  type EstadoCotizacion,
} from '@/lib/cotizacion'
import { escaneoDeSugerencia, type ResultadoSugerencia, type Sugerencia } from '@/lib/ia/sugerencia'
import {
  buildQuote,
  coatLabels,
  coats,
  knots,
  knotsLabels,
  sizeLabels,
  sizes,
} from '@/lib/pricing'

import { IaScanCare } from './escaneo/IaScanCare'
import { ResumenPresupuesto } from './ResumenPresupuesto'
import { SelectableService } from './SelectableService'

type Props = {
  catalog: Catalog
  iaActiva: boolean
  analizar?: (data: FormData) => Promise<ResultadoSugerencia>
}

/** Cotizador sin dependencias del servidor: lo usan la app real y la demo estática. */
export function CotizadorBase({ catalog, iaActiva, analizar }: Props) {
  // Empieza sin servicios elegidos y sin tamaño marcado: ningún precio aparece antes de elegir
  const [estado, setEstado] = useState<EstadoCotizacion>(() => estadoInicial())
  const [tamanoElegido, setTamanoElegido] = useState(false)
  const [sugerencia, setSugerencia] = useState<Sugerencia | null>(null)

  const quote = useMemo(() => buildQuote(estado, catalog, catalog.config), [estado, catalog])
  const set = (patch: Partial<EstadoCotizacion>) => setEstado((e) => ({ ...e, ...patch }))

  function onSugerencia(s: Sugerencia) {
    setSugerencia(s)
    setTamanoElegido(true)
    setEstado((e) => aplicarSugerencia(e, s))
  }

  function onUsarPlan(s: Sugerencia) {
    setSugerencia(s)
    setTamanoElegido(true)
    setEstado((e) => aplicarPlan(e, s, catalog))
  }

  // Marca «sugerido» mientras el valor elegido coincida con la sugerencia
  const sugerido = (campo: 'tamano' | 'manto' | 'nudos') =>
    sugerencia && sugerencia[campo] === estado[campo]
      ? 'Sugerido por el escaneo. Podés cambiarlo.'
      : undefined

  const hintTamano =
    sugerencia && sugerencia.tamano === estado.tamano && sugerencia.confianza.tamano !== 'alta'
      ? 'Confirmalo: una foto no permite medir al perro. Guiate por el peso.'
      : sugerido('tamano')

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="flex min-w-0 flex-col gap-8">
        <IaScanCare
          catalog={catalog}
          estado={estado}
          iaActiva={iaActiva}
          analizar={analizar}
          onSugerencia={onSugerencia}
          onUsarPlan={onUsarPlan}
        />

        <Ticket as="section" aria-labelledby="titulo-perro" className="flex flex-col gap-6">
          <h2 id="titulo-perro" className="text-xl">
            tu perro
          </h2>
          <ChipGroup
            legend="Tamaño"
            name="tamano"
            value={tamanoElegido ? estado.tamano : null}
            onChange={(tamano) => {
              setTamanoElegido(true)
              set({ tamano })
            }}
            hint={hintTamano}
            options={sizes.map((s) => ({
              value: s,
              label: sizeLabels[s].label,
              detail: sizeLabels[s].detail,
            }))}
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
              (estado.nudos !== 'sin'
                ? 'El desenredado de nudos se suma una sola vez en el resumen.'
                : undefined)
            }
            options={knots.map((k) => ({ value: k, label: knotsLabels[k] }))}
          />
        </Ticket>

        <section aria-labelledby="titulo-servicios" className="flex flex-col gap-4">
          <h2 id="titulo-servicios" className="text-xl">
            servicios
          </h2>
          <p className="text-sm text-texto-suave">
            Elegí los servicios: el precio aparece en el resumen cuando ya marcaste el tamaño de tu perro.
          </p>
          {estado.servicioIds.length === 0 && (
            <p role="status" className="text-sm font-bold text-aviso">
              Todavía no elegiste ningún servicio. Tocá el que quieras para sumarlo al presupuesto.
            </p>
          )}
          <ul className="grid gap-4 sm:grid-cols-2">
            {catalog.servicios.map((s) => (
              <li key={s.id} className="min-w-0">
                <SelectableService
                  id={s.id}
                  name={s.nombre}
                  description={s.descripcion}
                  duration={s.duracion}
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
                  {e.nombre}
                </ToggleChip>
              ))}
            </div>
          </section>
        )}
      </div>

      <ResumenPresupuesto
        quote={quote}
        estado={estado}
        tamanoElegido={tamanoElegido}
        escaneo={sugerencia ? escaneoDeSugerencia(sugerencia) : null}
      />
    </div>
  )
}
