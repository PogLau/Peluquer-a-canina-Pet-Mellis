import type { ReactNode } from 'react'

import { EmptyState, LinkButton, PageHeader, StatusBadge, Ticket } from '@/components/ui'
import { appointmentStatuses } from '@/lib/estados'
import { formatLongDate, formatMoney } from '@/lib/format'
import type { ResumenPeriodo } from '@/lib/informes'
import type { Reporte, TipoCSV } from '@/lib/panel/informes'
import { whatsappLink } from '@/lib/whatsapp'

function Periodo({ r, id }: { r: ResumenPeriodo; id: string }) {
  return (
    <Ticket as="section" aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="rotulo text-verde">
        {r.periodo.etiqueta}
      </h2>
      <dl className="flex flex-wrap gap-x-6 gap-y-4">
        <div>
          <dt className="text-sm text-texto-suave">Turnos</dt>
          <dd className="cifras font-display text-4xl font-bold">{r.total}</dd>
        </div>
        <div>
          <dt className="text-sm text-texto-suave">Ingresos estimados</dt>
          <dd className="cifras whitespace-nowrap font-display text-2xl font-bold">
            {formatMoney(r.ingresos)}
          </dd>
        </div>
      </dl>
      <ul className="flex flex-wrap gap-2" aria-label="Turnos por estado">
        {appointmentStatuses
          .filter((e) => r.porEstado[e] > 0)
          .map((e) => (
            <li key={e} className="flex items-center gap-1.5">
              <StatusBadge status={e} />
              <span className="cifras text-sm font-bold">{r.porEstado[e]}</span>
            </li>
          ))}
      </ul>
    </Ticket>
  )
}

type Props = {
  r: Reporte
  /** Dirección pública de la app, para el mensaje a los clientes que no vuelven. */
  base: string
  /** Botón de descarga del CSV: enlace al servidor en la app real, archivo armado en el navegador en la demo. */
  exportar: (tipo: TipoCSV, etiqueta: string) => ReactNode
}

/** Informes (solo presentación): los usan la app real y la demo estática. */
export function InformesVista({ r, base, exportar }: Props) {
  const maximo = Math.max(1, ...r.servicios.map((s) => s.cantidad))

  return (
    <>
      <PageHeader eyebrow="Números del salón" title="informes">
        Los ingresos usan el precio final de cada atención y, si todavía no hay, el estimado. Los
        cancelados no suman.
      </PageHeader>

      <div className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Periodo r={r.semana} id="semana" />
          <Periodo r={r.mes} id="mes" />
        </div>
        <div>{exportar('turnos', `Turnos de ${r.mes.periodo.etiqueta} (CSV)`)}</div>

        <Ticket as="section" aria-labelledby="servicios" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="servicios" className="text-xl">
              más pedidos en {r.mes.periodo.etiqueta}
            </h2>
            {r.servicios.length > 0 && exportar('servicios', 'Exportar CSV')}
          </div>
          {r.servicios.length === 0 ? (
            <p className="text-sm text-texto-suave">Todavía no hay turnos este mes.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {r.servicios.map((s) => (
                <li
                  key={s.servicio}
                  className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-sm"
                >
                  <span className="truncate font-bold">{s.servicio}</span>
                  <span
                    className="h-4 rounded-sm border-2 border-tinta bg-superficie-alt"
                    aria-hidden="true"
                  >
                    <span
                      className="block h-full bg-amarillo"
                      style={{ width: `${(s.cantidad / maximo) * 100}%` }}
                    />
                  </span>
                  <span className="cifras font-bold">{s.cantidad}</span>
                </li>
              ))}
            </ol>
          )}
        </Ticket>

        <section aria-labelledby="sin-volver" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="sin-volver" className="text-xl">
              sin volver hace más de 60 días
            </h2>
            {r.sinVolver.length > 0 && exportar('sin-volver', 'Exportar CSV')}
          </div>
          {r.sinVolver.length === 0 ? (
            <EmptyState icon="usuarios" title="nadie para recontactar">
              Todos los clientes vinieron en los últimos 60 días o ya tienen turno.
            </EmptyState>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {r.sinVolver.map((c) => {
                const perros = c.mascotas.join(' y ') || 'tu perro'
                let wa: string | null = null
                try {
                  wa = whatsappLink(
                    c.whatsapp,
                    `Hola, ${c.nombre.split(' ')[0]}. Hace un tiempo que no vemos a ${perros} en Los Mellis. Si querés, reservá cuando te quede cómodo: ${base}/reservar`,
                  )
                } catch {
                  wa = null
                }
                return (
                  <li key={c.id}>
                    <Ticket size="small" className="flex h-full flex-col gap-2">
                      <p className="font-display text-xl">{c.nombre}</p>
                      <p className="text-sm text-texto-suave">
                        {perros} · última visita {formatLongDate(new Date(c.ultimaVisita!))} (
                        {c.diasSinVenir} días)
                      </p>
                      {wa && (
                        <div className="mt-auto">
                          <LinkButton
                            href={wa}
                            external
                            variant="highlight"
                            size="small"
                            icon="whatsapp"
                          >
                            Escribirle
                          </LinkButton>
                        </div>
                      )}
                    </Ticket>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
