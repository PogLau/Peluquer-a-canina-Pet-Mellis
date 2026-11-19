'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { AsistenteReserva } from '@/components/cliente/reserva/AsistenteReserva'
import { Cargando, PageHeader } from '@/components/ui'
import { reservarTurno } from '@/demo/acciones'
import { catalogOf, WHATSAPP_SALON } from '@/demo/estado'
import { agendaOf } from '@/demo/operaciones'
import { mascotasDelCliente } from '@/demo/selectores'
import { useEstado } from '@/demo/store'
import { freeSlots } from '@/lib/agenda'
import { estadoDesdeParams } from '@/lib/cotizacion'
import { escaneoDesdeParams } from '@/lib/ia/cuidado'
import { whatsappLink } from '@/lib/whatsapp'

function Reserva() {
  const s = useEstado()
  const params = useSearchParams()
  const tutor = s.tutores.find((t) => t.id === s.clienteId)
  return (
    <AsistenteReserva
      catalog={catalogOf(s)}
      dias={freeSlots(agendaOf(s))}
      tutor={tutor?.nombre ?? null}
      mascotas={mascotasDelCliente(s)}
      preset={estadoDesdeParams(new URLSearchParams(params.toString()))}
      escaneo={escaneoDesdeParams(new URLSearchParams(params.toString()))}
      whatsappLocal={whatsappLink(WHATSAPP_SALON, 'Hola, quería consultar por un turno.')}
      reservar={reservarTurno}
    />
  )
}

export default function ReservarDemo() {
  return (
    <>
      <PageHeader volver eyebrow="Reserva" title="reservá un turno">
        Cuatro pasos: tu perro, los servicios, el horario y la confirmación. No hace falta crear una
        cuenta.
      </PageHeader>
      <Suspense fallback={<Cargando tarjetas={1} />}>
        <Reserva />
      </Suspense>
    </>
  )
}
