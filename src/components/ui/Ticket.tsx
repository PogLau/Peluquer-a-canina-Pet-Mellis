import type { ComponentPropsWithoutRef, ElementType } from 'react'

import { cn } from '@/lib/cn'

type Props<T extends ElementType> = {
  as?: T
  /** `normal`: relleno de 20 px. `small`: 12 px, para filas y listas. */
  size?: 'normal' | 'small'
  /** Fondo menta fuerte: avisos o fila elegida. */
  highlighted?: boolean
} & Omit<ComponentPropsWithoutRef<T>, 'as'>

/** Tarjeta «ticket»: borde de tinta de 2 px, esquinas de 10 px y sombra dura de 4 px. */
export function Ticket<T extends ElementType = 'div'>({
  as,
  size = 'normal',
  highlighted = false,
  className,
  ...props
}: Props<T>) {
  const Component: ElementType = as ?? 'div'
  return (
    <Component
      className={cn(
        'rounded-md border-2 border-tinta text-texto shadow-ticket',
        highlighted ? 'bg-superficie-alt' : 'bg-superficie',
        size === 'normal' ? 'p-5' : 'p-3',
        className,
      )}
      {...props}
    />
  )
}
