import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { AsistenteReserva } from '@/components/cliente/reserva/AsistenteReserva'
import { reservarTurno } from '../acciones'
import { Notice, PageHeader } from '@/components/ui'
import { availableDays, petsOfTutor } from '@/lib/cliente/reserva'
import { estadoDesdeParams } from '@/lib/cotizacion'
import { getCatalogo, getDatosLocal } from '@/lib/datos-publicos'
import { getClienteSession } from '@/lib/enlace-cliente'

export const metadata: Metadata = { title: 'Reservar turno' }

// Horarios libres y precios vigentes en cada visita
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function ReservarPage({ searchParams }: Props) {
  const raw = await searchParams
  const params = new URLSearchParams(
    Object.entries(raw).flatMap(([k, v]) => (typeof v === 'string' ? [[k, v]] : [])),
  )
  const [catalog, sesion, local] = await Promise.all([
    getCatalogo(),
    getClienteSession(),
    getDatosLocal(),
  ])

  let dias = null
  let mascotas: Awaited<ReturnType<typeof petsOfTutor>> = []
  try {
    const payload = sesion?.payload ?? (await getPayload({ config }))
    ;[dias, mascotas] = await Promise.all([
      availableDays(payload),
      sesion ? petsOfTutor(payload, sesion.tutor.id) : Promise.resolve([]),
    ])
  } catch {
    dias = null
  }

  return (
    <>
      <PageHeader eyebrow="Reserva" title="reservá un turno">
        Cuatro pasos: tu perro, los servicios, el horario y la confirmación. No hace falta crear una
        cuenta.
      </PageHeader>
      {catalog && catalog.servicios.length > 0 && dias ? (
        <AsistenteReserva
          reservar={reservarTurno}
          catalog={catalog}
          dias={dias}
          tutor={sesion?.tutor.nombre ?? null}
          mascotas={mascotas}
          preset={estadoDesdeParams(params)}
          whatsappLocal={local.whatsapp}
        />
      ) : (
        <Notice tone="peligro" role="alert" title="No pudimos cargar la reserva">
          Probá de nuevo en un rato o escribinos por WhatsApp.
        </Notice>
      )}
    </>
  )
}
