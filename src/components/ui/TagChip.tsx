import { cn } from '@/lib/cn'

import { Icon } from './Icons'

type Props = {
  children: string
  /** Etiquetas de cuidado (miedo al secador, no tolera las uñas...): se ven en aviso. */
  kind?: 'info' | 'alerta'
  /** Si se pasa onToggle, la etiqueta es un botón seleccionable (registrar atención). */
  selected?: boolean
  onToggle?: (selected: boolean) => void
}

/** Etiqueta rápida de la Ficha Evolutiva. */
export function TagChip({ children, kind = 'info', selected = false, onToggle }: Props) {
  const classes = cn(
    'inline-flex min-h-9 items-center gap-1.5 rounded-pill border px-3 text-sm font-bold',
    selected
      ? 'border-linea bg-seleccion text-sobre-seleccion'
      : kind === 'alerta'
        ? 'border-aviso bg-aviso-fondo text-aviso'
        : 'border-linea bg-superficie text-texto',
  )
  const content = (
    <>
      {kind === 'alerta' && <Icon name="alerta" size={16} />}
      {children}
    </>
  )

  if (onToggle) {
    return (
      <button type="button" aria-pressed={selected} onClick={() => onToggle(!selected)} className={classes}>
        {content}
      </button>
    )
  }
  return <span className={classes}>{content}</span>
}
