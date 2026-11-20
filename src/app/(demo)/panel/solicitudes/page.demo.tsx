'use client'

import { useState } from 'react'

import { SolicitudCard } from '@/components/panel/SolicitudCard'
import { EmptyState, PageHeader } from '@/components/ui'
import { accionesSolicitud, enlaceDemo } from '@/demo/acciones'
import { solicitudes } from '@/demo/selectores'
import { useEstado } from '@/demo/store'

export default function SolicitudesDemo() {
  const s = useEstado()
  // Como en la app real: la tarjeta respondida sigue a la vista (con su botón de WhatsApp) hasta salir de la pantalla
  const [lista] = useState(() => solicitudes(s))

  return (
    <>
      <PageHeader eyebrow="Pedidos desde la web" title="solicitudes">
        Al aceptar se abre WhatsApp con la confirmación lista: revisala antes de mandarla.
      </PageHeader>
      {lista.length === 0 ? (
        <EmptyState icon="bandeja" title="nada pendiente">
          Reservá un turno como usuario («Ver como usuario», arriba) y aparece acá.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-5">
          {lista.map((turno) => (
            <li key={turno.id}>
              <SolicitudCard
                turno={turno}
                enlace={enlaceDemo(turno.tutor.id)}
                acciones={accionesSolicitud}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
