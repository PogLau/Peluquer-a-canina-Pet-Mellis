import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatMoney } from '@/lib/format'

import { serviceIcons } from './ServiceCard'

type Props = {
  id: string
  name: string
  description: string
  duration: string
  /** Precio para el tamaño y manto elegidos, sin recargo por nudos (coincide con su línea del resumen). */
  price: number
  /** Precio «hasta» (rango orientativo). */
  priceHasta?: number
  selected: boolean
  onToggle: () => void
}

/** Tarjeta de servicio seleccionable del cotizador. */
export function SelectableService({ id, name, description, duration, price, priceHasta, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'flex h-full w-full min-w-0 flex-col gap-3 rounded-md border-2 border-tinta p-4 text-left text-texto transition-[background-color,box-shadow,transform] duration-100',
        selected
          ? 'translate-x-[3px] translate-y-[3px] bg-amarillo-claro shadow-ticket-presionada'
          : 'bg-superficie shadow-ticket hover:bg-superficie-alt',
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="grid size-12 place-items-center rounded-lg border-2 border-tinta bg-amarillo-claro text-petroleo">
          <Icon name={serviceIcons[id] ?? 'pata'} size={24} />
        </span>
        <span
          className={cn(
            'grid size-7 place-items-center rounded-sm border-2 border-tinta',
            selected ? 'bg-seleccion text-sobre-seleccion' : 'bg-superficie',
          )}
        >
          {selected && <Icon name="check" size={18} />}
        </span>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-display text-lg font-bold lowercase">{name}</span>
        <span className="text-sm text-texto-suave">{description}</span>
      </span>
      <span className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-1 border-t-2 border-dashed border-linea pt-2">
        <span className="flex flex-col">
          <span className="cifras font-display text-xl font-bold">
            {priceHasta !== undefined && priceHasta > price && <span className="text-sm font-normal">desde </span>}
            {formatMoney(price)}
          </span>
          {priceHasta !== undefined && priceHasta > price && (
            <span className="cifras text-xs text-texto-suave">hasta {formatMoney(priceHasta)}</span>
          )}
        </span>
        <span className="rotulo text-texto-suave">{duration}</span>
      </span>
    </button>
  )
}
