import type { ReactNode } from 'react'

import { Melli, type PoseMelli } from '@/components/marca/Mascota'
import { cn } from '@/lib/cn'

import { Icon, type IconName } from './Icons'

type Tone = 'aviso' | 'exito' | 'peligro' | 'info'

const tones: Record<Tone, { classes: string; icon: IconName }> = {
  aviso: { classes: 'bg-aviso-fondo text-aviso', icon: 'alerta' },
  exito: { classes: 'bg-exito-fondo text-exito', icon: 'check' },
  peligro: { classes: 'bg-peligro-fondo text-peligro', icon: 'alerta' },
  info: { classes: 'bg-info-fondo text-info', icon: 'info' },
}

/** Aviso en línea: alertas de la ficha, errores de formulario, confirmaciones. */
export function Notice({
  tone = 'aviso',
  title,
  children,
  role,
}: {
  tone?: Tone
  title?: string
  children?: ReactNode
  role?: 'status' | 'alert'
}) {
  const { classes, icon } = tones[tone]
  return (
    <div role={role} className={cn('flex gap-3 rounded-md border border-current p-3.5', classes)}>
      <Icon name={icon} size={22} className="mt-0.5" />
      <div className="flex flex-col gap-0.5 text-sm">
        {title && <p className="font-bold">{title}</p>}
        {children && <div>{children}</div>}
      </div>
    </div>
  )
}

/** Estado vacío: qué pasa y qué hacer. */
export function EmptyState({
  icon = 'pata',
  mascota,
  title,
  children,
}: {
  icon?: IconName
  /** En pantallas del cliente, una escena de los mellis en lugar del ícono. En el panel, mejor el ícono. */
  mascota?: PoseMelli
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-linea px-6 py-10 text-center">
      {mascota ? (
        <Melli pose={mascota} size={104} />
      ) : (
        <span className="grid size-14 place-items-center rounded-lg border border-linea bg-durazno text-carbon">
          <Icon name={icon} size={28} />
        </span>
      )}
      <p className="font-display text-xl oracion">{title}</p>
      {children && <div className="max-w-sm text-sm text-texto-suave">{children}</div>}
    </div>
  )
}
