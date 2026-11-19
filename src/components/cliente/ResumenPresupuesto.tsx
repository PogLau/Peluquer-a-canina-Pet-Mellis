import { LinkButton, Ticket } from '@/components/ui'
import { cn } from '@/lib/cn'
import { reservarHref, type EstadoCotizacion } from '@/lib/cotizacion'
import { formatMoney } from '@/lib/format'
import type { EscaneoTurno } from '@/lib/ia/cuidado'
import { coatLabels, knotsLabels, sizeLabels, type Quote } from '@/lib/pricing'

import { NotaPrecios, TotalPresupuesto } from './Precios'

/**
 * Ticket del presupuesto: una línea por servicio y extra, el desenredado de nudos aparte y el total.
 * No muestra ningún precio hasta que la persona eligió el tamaño y al menos un servicio.
 */
export function ResumenPresupuesto({
  quote,
  estado,
  tamanoElegido,
  escaneo = null,
}: {
  quote: Quote
  estado: EstadoCotizacion
  /** False mientras la persona no tocó un tamaño (ni lo cargó el escaneo). */
  tamanoElegido: boolean
  /** Si hubo Consulta por foto, la ficha de ingreso viaja con la reserva. */
  escaneo?: EscaneoTurno | null
}) {
  const sinServicio = estado.servicioIds.length === 0
  const falta = !tamanoElegido
    ? 'Falta elegir el tamaño de tu perro.'
    : sinServicio
      ? 'Falta elegir un servicio.'
      : null

  return (
    <Ticket as="aside" aria-labelledby="titulo-resumen" className="flex flex-col gap-4 lg:sticky lg:top-24">
      <div>
        <h2 id="titulo-resumen" className="text-xl">
          tu presupuesto
        </h2>
        {tamanoElegido && (
          <p className="rotulo mt-1 text-texto-suave">
            {sizeLabels[estado.tamano].label} · manto {coatLabels[estado.manto].toLowerCase()} ·{' '}
            {estado.nudos === 'sin' ? 'sin nudos' : `nudos ${knotsLabels[estado.nudos].toLowerCase()}`}
          </p>
        )}
      </div>

      {falta ? (
        <p className="text-sm text-texto-suave" aria-live="polite">
          Elegí el tamaño de tu perro y al menos un servicio para ver el precio.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-2 border-y border-dashed border-linea py-3" aria-live="polite">
            {quote.lineas.map((l) => (
              <li key={l.id} className="flex items-baseline justify-between gap-3 text-sm">
                <span className={cn(l.tipo === 'recargo' && 'font-bold text-verde-oscuro')}>{l.nombre}</span>
                <span className="cifras whitespace-nowrap font-bold">{formatMoney(l.monto)}</span>
              </li>
            ))}
          </ul>
          <TotalPresupuesto quote={quote} />
          <NotaPrecios />
        </>
      )}

      {falta ? (
        <>
          <LinkButton
            href="/reservar"
            fullWidth
            aria-disabled="true"
            tabIndex={-1}
            aria-describedby="falta-presupuesto"
          >
            Reservar con este presupuesto
          </LinkButton>
          <p id="falta-presupuesto" className="text-sm text-texto-suave">
            {falta}
          </p>
        </>
      ) : (
        <LinkButton href={reservarHref(estado, escaneo)} fullWidth iconEnd="flecha">
          Reservar con este presupuesto
        </LinkButton>
      )}
    </Ticket>
  )
}
