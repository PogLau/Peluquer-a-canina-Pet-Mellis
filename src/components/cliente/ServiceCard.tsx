import { Icon, Ticket, type IconName } from '@/components/ui'
import { formatMoney } from '@/lib/format'

export const serviceIcons: Record<string, IconName> = {
  'bano-corte': 'tijera',
  'bano-cepillado': 'bano',
  'corte-estetico': 'tijera',
  unas: 'unas',
  deslanado: 'cepillo',
}

type Props = {
  id: string
  name: string
  description: string
  /** Precio ya calculado, sin recargo por nudos. */
  price: number
  duration: string
  /** «desde» en el Inicio; el precio exacto en el cotizador. */
  priceLabel?: string
  popular?: boolean
}

/** Tarjeta de servicio (manual §12). */
export function ServiceCard({ id, name, description, price, duration, priceLabel = 'desde', popular }: Props) {
  return (
    <Ticket as="article" className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-16 place-items-center rounded-lg border-2 border-tinta bg-superficie-alt text-petroleo">
          <Icon name={serviceIcons[id] ?? 'pata'} size={30} />
        </span>
        {popular && <span className="rotulo rounded-pill bg-petroleo px-2.5 py-1 text-teal">Popular</span>}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl">{name}</h3>
        <p className="text-sm text-texto-suave">{description}</p>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 border-t-2 border-dashed border-linea pt-3">
        <p className="flex flex-col">
          <span className="rotulo text-texto-suave">{priceLabel}</span>
          <span className="cifras font-display text-2xl font-bold">{formatMoney(price)}</span>
        </p>
        <p className="rotulo flex items-center gap-1 text-texto-suave">
          <Icon name="reloj" size={16} />
          {duration}
        </p>
      </div>
    </Ticket>
  )
}
