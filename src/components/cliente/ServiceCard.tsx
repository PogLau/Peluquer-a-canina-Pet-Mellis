import { Melli, type PoseMelli } from '@/components/marca/Mascota'
import { Icon, Ticket, type IconName } from '@/components/ui'

export const serviceIcons: Record<string, IconName> = {
  'bano-higienico': 'bano',
  'bano-corte-higienico': 'tijera',
  'bano-corte': 'tijera',
  deslanado: 'cepillo',
  adaptacion: 'pata',
  unas: 'unas',
}

/** Qué están haciendo los mellis en la tarjeta de cada servicio. */
const servicePoses: Record<string, PoseMelli> = {
  'bano-higienico': 'bano',
  'bano-corte-higienico': 'secado',
  'bano-corte': 'corte',
  deslanado: 'secado',
  adaptacion: 'saluda',
  unas: 'listo',
}

type Props = {
  id: string
  name: string
  description: string
  duration: string
  popular?: boolean
}

/** Tarjeta de servicio de la portada. Sin precio: se ve en el cotizador al elegir tamaño y servicio. */
export function ServiceCard({ id, name, description, duration, popular }: Props) {
  return (
    <Ticket as="article" className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-24 w-36 place-items-center rounded-lg bg-durazno">
          <Melli pose={servicePoses[id] ?? 'saluda'} size={88} />
        </span>
        {popular && <span className="rotulo rounded-pill bg-rosa px-2.5 py-1 text-carbon">Popular</span>}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl">{name}</h3>
        <p className="text-sm text-texto-suave">{description}</p>
      </div>
      <div className="mt-auto flex items-center border-t border-dashed border-linea pt-3">
        <p className="rotulo flex items-center gap-1 text-texto-suave">
          <Icon name="reloj" size={16} />
          {duration}
        </p>
      </div>
    </Ticket>
  )
}
