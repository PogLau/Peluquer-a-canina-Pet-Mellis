'use client'

import { useState, useSyncExternalStore, type ReactNode } from 'react'

import { Button, Icon, Ticket } from '@/components/ui'

function suscribirHash(avisar: () => void) {
  window.addEventListener('hashchange', avisar)
  return () => window.removeEventListener('hashchange', avisar)
}

/**
 * IA Scan & Care plegado: quien ya sabe el tamaño de su perro va directo al formulario.
 * Se abre con el botón o al llegar con /cotizar#escaneo (desde el inicio o la reserva).
 * Una vez abierto queda abierto, para no perder la foto ni el escaneo.
 */
export function EscaneoPlegado({ children }: { children: ReactNode }) {
  const [abiertoPorBoton, setAbiertoPorBoton] = useState(false)
  const pedidoPorEnlace = useSyncExternalStore(
    suscribirHash,
    () => window.location.hash === '#escaneo',
    () => false,
  )
  if (abiertoPorBoton || pedidoPorEnlace) return <>{children}</>

  return (
    <Ticket
      as="section"
      id="escaneo"
      aria-labelledby="titulo-escaneo-plegado"
      highlighted
      className="flex scroll-mt-24 flex-wrap items-center gap-x-4 gap-y-3"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg border-2 border-tinta bg-amarillo text-petroleo">
        <Icon name="escaner" />
      </span>
      <div className="min-w-0 flex-1 basis-56">
        <h2 id="titulo-escaneo-plegado" className="text-xl">
          ¿no sabés el tamaño o el pelaje?
        </h2>
        <p className="text-sm text-texto-suave">
          Con una foto, IA Scan &amp; Care (beta) te sugiere los datos y el tratamiento.
        </p>
      </div>
      <Button
        variant="secondary"
        size="small"
        icon="camara"
        aria-expanded={false}
        onClick={() => setAbiertoPorBoton(true)}
      >
        Escanear una foto
      </Button>
    </Ticket>
  )
}
