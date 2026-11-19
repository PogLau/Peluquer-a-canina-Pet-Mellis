'use client'

import Link from 'next/link'

import { TurnoCard } from '@/components/panel/TurnoCard'
import { EmptyState, Notice, PageHeader } from '@/components/ui'
import { AvanzarDemo, rutasDemo } from '@/demo/AvanzarDemo'
import { solicitudes, turnosHoy } from '@/demo/selectores'
import { useEstado } from '@/demo/store'
import { statusLabel } from '@/lib/estados'
import { formatLongDate } from '@/lib/format'

export default function HoyDemo() {
  const s = useEstado()
  const now = new Date()
  const turnos = turnosHoy(s, now)
  const pendientesWeb = solicitudes(s).length
  const porAtender = turnos.filter(
    (t) => t.estado === 'confirmado' || t.estado === 'en_atencion',
  ).length
  const resumen = (['en_atencion', 'listo'] as const)
    .map((estado) => ({ estado, cantidad: turnos.filter((t) => t.estado === estado).length }))
    .filter((r) => r.cantidad > 0)
    .map((r) =>
      r.estado === 'listo' && r.cantidad > 1
        ? `${r.cantidad} listos para retirar`
        : `${r.cantidad} ${statusLabel(r.estado).toLowerCase()}`,
    )

  return (
    <>
      <PageHeader eyebrow={formatLongDate(now)} title="hoy">
        {turnos.length === 0
          ? 'No hay turnos confirmados para hoy.'
          : [
              `${turnos.length} ${turnos.length === 1 ? 'turno' : 'turnos'}`,
              `${porAtender} por atender`,
              ...resumen,
            ].join(' · ')}
      </PageHeader>

      {pendientesWeb > 0 && (
        <div className="mb-6">
          <Notice
            tone="info"
            title={`${pendientesWeb} ${pendientesWeb === 1 ? 'solicitud nueva' : 'solicitudes nuevas'} desde la web`}
          >
            <Link href="/panel/solicitudes" className="font-bold underline underline-offset-4">
              Revisarlas
            </Link>
          </Notice>
        </div>
      )}

      {turnos.length === 0 ? (
        <EmptyState icon="calendario" title="día libre">
          Cuando confirmes una solicitud para hoy, va a aparecer acá.
        </EmptyState>
      ) : (
        <ol className="flex flex-col gap-5" aria-label="Turnos de hoy">
          {turnos.map((turno) => (
            <li key={turno.id}>
              <TurnoCard
                turno={turno}
                rutas={rutasDemo}
                renderAccion={(a) => <AvanzarDemo {...a} />}
              />
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
