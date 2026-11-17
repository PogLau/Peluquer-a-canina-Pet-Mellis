'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { Button, buttonClasses } from './Button'
import { EmptyState } from './Notice'

/** Esqueleto de carga: misma forma que una pantalla (título y tarjetas), sin saltos al aparecer el contenido. */
export function Cargando({ tarjetas = 3 }: { tarjetas?: number }) {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <p role="status" className="sr-only">
        Cargando…
      </p>
      <div className="flex flex-col gap-3" aria-hidden="true">
        <div className="h-4 w-32 animate-pulse rounded-sm bg-superficie-alt" />
        <div className="h-10 w-64 max-w-full animate-pulse rounded-sm bg-superficie-alt" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
        {Array.from({ length: tarjetas }, (_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-md border-2 border-linea bg-superficie"
          />
        ))}
      </div>
    </div>
  )
}

/** Error inesperado: qué pasó, qué hacer y un botón para reintentar. */
export function ErrorPantalla({
  error,
  reset,
  volver,
}: {
  error: Error & { digest?: string }
  reset: () => void
  volver: string
}) {
  useEffect(() => {
    // Se registra en la consola del navegador para poder diagnosticarlo; al usuario no se le muestran detalles técnicos
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <EmptyState icon="alerta" title="algo no salió bien">
        No pudimos cargar esta pantalla. Puede ser la conexión: probá de nuevo en un momento.
        {error.digest && <span className="cifras mt-2 block text-xs">Código: {error.digest}</span>}
      </EmptyState>
      <div className="flex flex-wrap justify-center gap-3">
        <Button icon="volver" onClick={reset}>
          Probar de nuevo
        </Button>
        <Link href={volver} className={buttonClasses({ variant: 'secondary' })}>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

/** Página que no existe (o un perro, cliente o turno que ya no está). */
export function NoEncontrado({ volver, texto }: { volver: string; texto: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <EmptyState icon="pata" title="no encontramos esa página">
        {texto}
      </EmptyState>
      <Link href={volver} className={buttonClasses({ variant: 'primary' })}>
        Volver al inicio
      </Link>
    </div>
  )
}
