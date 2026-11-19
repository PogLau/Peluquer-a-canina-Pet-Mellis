'use client'

import { Button, Icon, LinkButton } from '@/components/ui'
import type { Catalog } from '@/lib/catalogo'
import { aplicarPlan, reservarHref, type EstadoCotizacion } from '@/lib/cotizacion'
import { formatMoney } from '@/lib/format'
import {
  estadoPelaje,
  hidratacionLabels,
  origenLabels,
  texturaLabels,
  tratamientoInfo,
  type Hidratacion,
} from '@/lib/ia/cuidado'
import { escaneoDeSugerencia, type Sugerencia } from '@/lib/ia/sugerencia'
import { buildQuote, knotsLabels, sizeLabels } from '@/lib/pricing'

type Props = {
  sugerencia: Sugerencia
  catalog: Catalog
  /** Estado actual del cotizador: el plan respeta lo que no cambia (por ejemplo, nada). */
  estado: EstadoCotizacion
  onUsarPlan: () => void
  planAplicado: boolean
}

const nivelHidratacion: Record<Hidratacion, number> = { buena: 3, media: 2, baja: 1 }

function Dato({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b-2 border-dashed border-linea pb-2">
      <dt className="rotulo text-texto-suave">{label}</dt>
      <dd className="font-bold">{children}</dd>
    </div>
  )
}

/** Ficha de ingreso del escaneo: lo que se vio, el tratamiento ideal y su precio estimado. */
export function ResultadoEscaneo({ sugerencia: s, catalog, estado, onUsarPlan, planAplicado }: Props) {
  const plan = aplicarPlan(estado, s, catalog)
  const quote = buildQuote(plan, catalog, catalog.config)
  const info = tratamientoInfo[s.tratamiento]
  const nivel = nivelHidratacion[s.hidratacion]
  const tamanoDudoso = s.confianza.tamano !== 'alta'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl">ficha de ingreso</h3>
        <span className="rotulo rounded-pill border-2 border-tinta bg-superficie px-2.5 py-1">
          {origenLabels[s.origen]}
        </span>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <Dato label="Raza probable">{s.raza}</Dato>
        <Dato label="Tamaño estimado">
          {sizeLabels[s.tamano].label}{' '}
          <span className="font-normal text-texto-suave">({sizeLabels[s.tamano].detail})</span>
          {tamanoDudoso && (
            <span className="block text-sm font-normal text-texto-suave">
              Confirmalo con el peso: una foto no tiene escala.
            </span>
          )}
        </Dato>
        <Dato label="Pelaje">{texturaLabels[s.textura]}</Dato>
        <Dato label="Nudos">
          {s.nudos === 'sin' ? 'Sin nudos' : knotsLabels[s.nudos]}
        </Dato>
        <Dato label="Hidratación">
          <span className="flex items-center gap-2">
            <span className="flex gap-1" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`h-3 w-6 rounded-pill border-2 border-tinta ${n <= nivel ? (nivel === 1 ? 'bg-terracota' : 'bg-amarillo') : 'bg-transparent'}`}
                />
              ))}
            </span>
            {hidratacionLabels[s.hidratacion]}
          </span>
        </Dato>
        <Dato label="Estado del pelaje">{estadoPelaje(s)}</Dato>
      </dl>
      {s.observaciones && <p className="text-sm text-texto-suave">{s.observaciones}</p>}

      <div className="flex flex-col gap-3 rounded-md border-2 border-tinta bg-superficie p-4">
        <p className="rotulo text-verde">Tratamiento ideal</p>
        <p className="flex items-center gap-2 font-display text-xl font-bold lowercase">
          <Icon name={s.tratamiento === 'corte-raza' ? 'tijera' : s.tratamiento === 'spa-desenredado' ? 'cepillo' : 'gota'} />
          {info.nombre}
        </p>
        <p className="text-sm">{info.detalle}</p>
        <ul className="flex flex-col gap-1 border-y-2 border-dashed border-linea py-2 text-sm">
          {quote.lineas.map((l) => (
            <li key={l.id} className="flex justify-between gap-3">
              <span>{l.nombre}</span>
              <span className="cifras font-bold">{formatMoney(l.monto)}</span>
            </li>
          ))}
        </ul>
        <p className="flex items-baseline justify-between gap-3">
          <span className="rotulo">Estimado del plan</span>
          <span className="cifras font-display text-2xl font-bold">{formatMoney(quote.total)}</span>
        </p>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={reservarHref(plan, escaneoDeSugerencia(s))} iconEnd="flecha">
            Reservar con este plan
          </LinkButton>
          <Button variant="secondary" icon="cotizar" onClick={onUsarPlan} disabled={planAplicado}>
            {planAplicado ? 'Plan cargado abajo' : 'Cargar en el cotizador'}
          </Button>
        </div>
        <p className="text-xs text-texto-suave">
          La peluquera recibe esta ficha con tu pedido y la confirma al ver a tu perro. La foto no se
          guarda.
        </p>
      </div>
    </div>
  )
}
