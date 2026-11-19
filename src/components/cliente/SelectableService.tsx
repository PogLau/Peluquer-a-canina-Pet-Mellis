import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'

import { serviceIcons } from './ServiceCard'

type Props = {
  id: string
  name: string
  description: string
  duration: string
  selected: boolean
  onToggle: () => void
}

/** Tarjeta de servicio seleccionable del cotizador. No muestra precio: aparece en el resumen al elegir. */
export function SelectableService({ id, name, description, duration, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'flex h-full w-full min-w-0 flex-col gap-3 rounded-md border border-linea p-4 text-left text-texto transition-[background-color,box-shadow,transform] duration-100',
        selected
          ? ' border-verde-oscuro bg-menta-claro shadow-ticket-presionada'
          : 'bg-superficie shadow-ticket hover:bg-superficie-alt',
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="grid size-12 place-items-center rounded-lg border border-linea bg-durazno text-carbon">
          <Icon name={serviceIcons[id] ?? 'pata'} size={24} />
        </span>
        <span
          className={cn(
            'grid size-7 place-items-center rounded-sm border border-linea',
            selected ? 'bg-seleccion text-sobre-seleccion' : 'bg-superficie',
          )}
        >
          {selected && <Icon name="check" size={18} />}
        </span>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-display text-lg font-bold oracion">{name}</span>
        <span className="text-sm text-texto-suave">{description}</span>
      </span>
      <span className="mt-auto flex items-center gap-1.5 border-t border-dashed border-linea pt-2">
        <Icon name="reloj" size={16} />
        <span className="rotulo text-texto-suave">{duration}</span>
      </span>
    </button>
  )
}
