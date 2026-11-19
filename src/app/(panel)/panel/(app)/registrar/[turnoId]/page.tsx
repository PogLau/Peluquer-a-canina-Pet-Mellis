import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EnviarResumen } from '@/components/panel/EnviarResumen'
import { FormularioAtencion } from '@/components/panel/FormularioAtencion'
import { registrarAtencion } from '../../acciones'
import { Icon, LinkButton, Notice, PageHeader, TagChip, Ticket } from '@/components/ui'
import { formatTime } from '@/lib/format'
import { enlaceDeTutor } from '@/lib/enlace-cliente'
import { getRegisterData, summaryForVisit } from '@/lib/panel/atenciones'
import { requireStaff } from '@/lib/panel/sesion'

export const metadata: Metadata = { title: 'Registrar atención' }

export default async function RegistrarPage({ params }: { params: Promise<{ turnoId: string }> }) {
  const turnoId = Number((await params).turnoId)
  if (!Number.isInteger(turnoId)) notFound()
  const { payload, user } = await requireStaff()
  const datos = await getRegisterData(payload, user, turnoId)
  if (!datos) notFound()
  const { turno } = datos
  const resumen = datos.atencionExistente
    ? await summaryForVisit(payload, user, datos.atencionExistente, (id) =>
        enlaceDeTutor(payload, id),
      )
    : null

  return (
    <>
      <Link
        href="/panel"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-verde-oscuro"
      >
        <Icon name="volver" size={18} /> Hoy
      </Link>
      <PageHeader
        eyebrow={`${formatTime(new Date(turno.fechaHora))} · ${turno.tutor.nombre}`}
        title={
          <>
            atención de {turno.mascota.nombre}
          </>
        }
      >
        {turno.servicios.join(' + ')}
      </PageHeader>

      {turno.mascota.alertas.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-2" aria-label="Alertas de la ficha">
          {turno.mascota.alertas.map((a) => (
            <li key={a}>
              <TagChip kind="alerta">{a}</TagChip>
            </li>
          ))}
        </ul>
      )}

      {resumen ? (
        // Ya registrada (recién guardada o abierta de nuevo): queda el paso de enviar el resumen
        <Ticket className="flex flex-col gap-5">
          <Notice
            tone="exito"
            role="status"
            title={`Atención registrada. ${turno.mascota.nombre} quedó listo para retirar.`}
          >
            La Ficha Evolutiva ya tiene esta visita.
          </Notice>
          <EnviarResumen telefono={resumen.telefono} mensajeInicial={resumen.mensaje} />
          <div>
            <LinkButton
              href={`/panel/mascotas/${turno.mascota.id}`}
              size="small"
              variant="secondary"
              icon="libreta"
            >
              Ver la ficha de {turno.mascota.nombre}
            </LinkButton>
          </div>
        </Ticket>
      ) : turno.estado === 'solicitado' || turno.estado === 'cancelado' ? (
        <Notice tone="aviso" title="Este turno todavía no está confirmado." />
      ) : (
        <Ticket>
          <FormularioAtencion datos={datos} registrar={registrarAtencion} />
        </Ticket>
      )}
    </>
  )
}
