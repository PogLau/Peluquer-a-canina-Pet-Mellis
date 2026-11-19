'use client'

import { useState, useSyncExternalStore, type ReactNode } from 'react'

import { Melli } from '@/components/marca/Mascota'
import { Button, Ticket } from '@/components/ui'

function suscribirHash(avisar: () => void) {
  window.addEventListener('hashchange', avisar)
  return () => window.removeEventListener('hashchange', avisar)
}

/**
 * Consulta por foto plegada: quien ya sabe el tamaño de su perro va directo al formulario.
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
      <Melli pose="foto" size={72} className="shrink-0" />
      <div className="min-w-0 flex-1 basis-56">
        <h2 id="titulo-escaneo-plegado" className="text-xl">
          IA Scan
        </h2>
        <p className="text-sm text-texto-suave">
          ¿No sabés el tamaño o el pelaje? Mandanos una foto y te sugerimos el tamaño, el tipo de pelo y el servicio.
        </p>
      </div>
      <Button
        variant="secondary"
        size="small"
        icon="camara"
        aria-expanded={false}
        onClick={() => setAbiertoPorBoton(true)}
      >
        Escanear con IA Scan
      </Button>
    </Ticket>
  )
}
