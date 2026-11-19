import { Icon } from '@/components/ui'
import { UBICACION_SALON } from '@/lib/brand'

/** Pie del panel de cliente: quiénes somos y dónde estamos. */
export function PieSalon() {
  return (
    <footer className="border-t-2 border-tinta bg-verde text-crema">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-28 pt-8 sm:flex-row sm:items-start sm:justify-between md:pb-10">
        <div>
          <p className="titulo font-display text-xl font-bold">Los Mellis</p>
          <p className="text-sm">Peluquería canina con turno</p>
        </div>
        <p className="flex items-center gap-2 text-sm">
          <Icon name="ubicacion" size={20} className="text-amarillo" />
          <span>
            <span className="sr-only">Ubicación: </span>
            {UBICACION_SALON}
          </span>
        </p>
      </div>
    </footer>
  )
}
