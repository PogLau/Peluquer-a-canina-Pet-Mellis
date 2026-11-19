'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { EnviarResumen } from '@/components/panel/EnviarResumen'
import { FormularioAtencion } from '@/components/panel/FormularioAtencion'
import {
  Cargando,
  EmptyState,
  Icon,
  LinkButton,
  Notice,
  PageHeader,
  TagChip,
  Ticket,
} from '@/components/ui'
import { enlaceDemo, registrarAtencion } from '@/demo/acciones'
import { rutasDemo } from '@/demo/AvanzarDemo'
import { datosRegistro } from '@/demo/selectores'
import { useEstado } from '@/demo/store'
import { formatTime } from '@/lib/format'
import { summaryMessage } from '@/lib/mensajes'

function Registro() {
  const s = useEstado()
  const turnoId = Number(useSearchParams().get('turno'))
  // Se toman los datos al entrar: así, al guardar, el formulario muestra su paso «Enviar resumen»
  const [datos] = useState(() => datosRegistro(s, turnoId))
  if (!datos) {
    return (
      <EmptyState icon="libreta" title="no encontramos ese turno">
        <Link href="/panel" className="font-bold underline">
          Volver a Hoy
        </Link>
      </EmptyState>
    )
  }
  const { turno } = datos
  const existente = datos.atencionExistente
    ? s.atenciones.find((a) => a.id === datos.atencionExistente)
    : null

  return (
    <>
      <Link
        href="/panel"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-verde"
      >
        <Icon name="volver" size={18} /> Hoy
      </Link>
      <PageHeader
        eyebrow={`${formatTime(new Date(turno.fechaHora))} · ${turno.tutor.nombre}`}
        title={
          <>
            atención de <span className="normal-case">{turno.mascota.nombre}</span>
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

      {existente ? (
        <Ticket className="flex flex-col gap-5">
          <Notice
            tone="exito"
            role="status"
            title={`Atención registrada. ${turno.mascota.nombre} quedó listo para retirar.`}
          />
          <EnviarResumen
            telefono={turno.tutor.whatsapp}
            mensajeInicial={summaryMessage({
              tutor: turno.tutor.nombre,
              mascota: turno.mascota.nombre,
              fecha: new Date(existente.fecha),
              servicios: existente.servicios.map(
                (id) => s.servicios.find((x) => x.id === id)?.nombre ?? id,
              ),
              resumenTutor: existente.resumenTutor,
              recomendacion: existente.recomendacion,
              enlace: enlaceDemo(turno.tutor.id),
            })}
          />
          <div>
            <LinkButton
              href={rutasDemo.mascota(turno.mascota.id)}
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
        <Ticket className="flex flex-col gap-5">
          <FormularioAtencion datos={datos} registrar={registrarAtencion} />
          <LinkButton
            href={rutasDemo.mascota(turno.mascota.id)}
            size="small"
            variant="ghost"
            iconEnd="flecha"
          >
            Ver la ficha de {turno.mascota.nombre}
          </LinkButton>
        </Ticket>
      )}
    </>
  )
}

export default function RegistrarDemo() {
  return (
    <Suspense fallback={<Cargando />}>
      <Registro />
    </Suspense>
  )
}
