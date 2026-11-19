import { LinkButton, Ticket } from '@/components/ui'
import { cn } from '@/lib/cn'
import { reservarHref, type EstadoCotizacion } from '@/lib/cotizacion'
import { formatMoney } from '@/lib/format'
import type { EscaneoTurno } from '@/lib/ia/cuidado'
import { coatLabels, knotsLabels, sizeLabels, type Quote } from '@/lib/pricing'

/** Ticket del presupuesto: una línea por servicio y extra, el recargo por nudos aparte y el total. */
export function ResumenPresupuesto({
  quote,
  estado,
  escaneo = null,
}: {
  quote: Quote
  estado: EstadoCotizacion
  /** Si hubo IA Scan & Care, la ficha de ingreso viaja con la reserva. */
  escaneo?: EscaneoTurno | null
}) {
  const vacio = quote.lineas.length === 0
  return (
    <Ticket as="aside" aria-labelledby="titulo-resumen" className="flex flex-col gap-4 lg:sticky lg:top-24">
      <div>
        <h2 id="titulo-resumen" className="text-xl">
          tu presupuesto
        </h2>
        <p className="rotulo mt-1 text-texto-suave">
          {sizeLabels[estado.tamano].label} · manto {coatLabels[estado.manto].toLowerCase()} ·{' '}
          {estado.nudos === 'sin' ? 'sin nudos' : `nudos ${knotsLabels[estado.nudos].toLowerCase()}`}
        </p>
      </div>

      {vacio ? (
        <p className="text-sm text-texto-suave">Elegí al menos un servicio para ver el precio.</p>
      ) : (
        <ul className="flex flex-col gap-2 border-y-2 border-dashed border-linea py-3" aria-live="polite">
          {quote.lineas.map((l) => (
            <li key={l.id} className="flex items-baseline justify-between gap-3 text-sm">
              <span className={cn(l.tipo === 'recargo' && 'font-bold text-verde')}>{l.nombre}</span>
              <span className="cifras font-bold">{formatMoney(l.monto)}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="flex items-baseline justify-between gap-3" aria-live="polite">
        <span className="rotulo">Total estimado</span>
        <span className="cifras font-display text-2xl font-bold">{formatMoney(quote.total)}</span>
      </p>

      {vacio ? (
        <>
          <LinkButton href="/reservar" fullWidth aria-disabled="true" tabIndex={-1} aria-describedby="falta-servicio">
            Reservar con este presupuesto
          </LinkButton>
          <p id="falta-servicio" className="text-sm text-texto-suave">
            Falta elegir un servicio.
          </p>
        </>
      ) : (
        <LinkButton href={reservarHref(estado, escaneo)} fullWidth iconEnd="flecha">
          Reservar con este presupuesto
        </LinkButton>
      )}
      <p className="text-xs text-texto-suave">
        Es un precio estimado. La peluquera lo confirma al ver a tu perro.
      </p>
    </Ticket>
  )
}
