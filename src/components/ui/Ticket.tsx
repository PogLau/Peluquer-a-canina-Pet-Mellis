import type { ComponentPropsWithoutRef, ElementType } from 'react'

import { cn } from '@/lib/cn'

type Props<T extends ElementType> = {
  as?: T
  /** `normal`: relleno de 20 px. `small`: 12 px, para filas y listas. */
  size?: 'normal' | 'small'
  /** Fondo alternativo: avisos o fila elegida. */
  highlighted?: boolean
} & Omit<ComponentPropsWithoutRef<T>, 'as'>

/** Tarjeta: borde fino gris de 1 px, esquinas de 8 px y sombra suave. */
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
        'rounded-md border border-linea text-texto shadow-ticket',
        highlighted ? 'bg-durazno' : 'bg-superficie',
        size === 'normal' ? 'p-5' : 'p-3',
        className,
      )}
      {...props}
    />
  )
}
