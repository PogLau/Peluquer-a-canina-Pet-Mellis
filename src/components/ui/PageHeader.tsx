import type { ReactNode } from 'react'

import { BotonVolver } from './BotonVolver'

/** Título de pantalla: botón para volver (opcional), rótulo opcional, h1 en minúscula y bajada. */
export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
  volver = false,
}: {
  eyebrow?: string
  /** Texto en minúscula; los nombres propios van en <span className="normal-case">. */
  title: ReactNode
  children?: ReactNode
  actions?: ReactNode
  /** Muestra «Volver» arriba del título (vuelve a la pantalla anterior o al inicio). */
  volver?: boolean
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        {volver && <BotonVolver />}
        {eyebrow && <p className="rotulo text-verde">{eyebrow}</p>}
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        {children && <div className="max-w-2xl text-texto-suave">{children}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  )
}
