import type { ReactNode } from 'react'

/** Título de pantalla: rótulo opcional, h1 en minúscula y bajada. */
export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        {eyebrow && <p className="rotulo text-enlace">{eyebrow}</p>}
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        {children && <div className="max-w-2xl text-texto-suave">{children}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  )
}
