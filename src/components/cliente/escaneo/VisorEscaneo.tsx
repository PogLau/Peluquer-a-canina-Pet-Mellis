'use client'

import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'

export const pasosEscaneo = [
  'Buscando al perro en la foto',
  'Estimando raza y tamaño',
  'Leyendo el tipo de pelaje',
  'Revisando hidratación y nudos',
] as const

type Props = {
  src: string
  alt: string
  /** Paso en curso (0 a 4). null: no se está escaneando. */
  paso: number | null
  /** Rótulo sobre la foto cuando terminó: «Ejemplo de demo», «IA beta»… */
  rotulo?: string
}

/** Foto con el marco de escaneo: esquinas, grilla, línea que barre y la lista de pasos. */
export function VisorEscaneo({ src, alt, paso, rotulo }: Props) {
  const escaneando = paso !== null && paso < pasosEscaneo.length
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-md border-2 border-tinta bg-verde shadow-ticket">
        {/* Foto local (public/fotos) o elegida por el usuario (blob:): no pasa por next/image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="aspect-square w-full object-cover" />
        {escaneando && (
          <div aria-hidden="true" className="escaneo-grilla absolute inset-0">
            <span className="escaneo-linea" />
          </div>
        )}
        {/* Esquinas del visor */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-3">
          <span className="absolute left-0 top-0 size-7 rounded-tl-md border-l-4 border-t-4 border-amarillo" />
          <span className="absolute right-0 top-0 size-7 rounded-tr-md border-r-4 border-t-4 border-amarillo" />
          <span className="absolute bottom-0 left-0 size-7 rounded-bl-md border-b-4 border-l-4 border-amarillo" />
          <span className="absolute bottom-0 right-0 size-7 rounded-br-md border-b-4 border-r-4 border-amarillo" />
        </span>
        {(escaneando || rotulo) && (
          <span className="rotulo absolute left-3 top-3 ml-9 mt-1 rounded-pill bg-verde px-2.5 py-1 text-marfil">
            {escaneando ? 'Escaneando…' : rotulo}
          </span>
        )}
      </div>

      {paso !== null && (
        <ol className="flex flex-col gap-1.5" aria-label="Pasos del escaneo">
          {pasosEscaneo.map((texto, i) => {
            const hecho = i < paso
            const actual = i === paso
            return (
              <li
                key={texto}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  hecho ? 'text-texto' : actual ? 'font-bold text-texto' : 'text-texto-suave',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-pill border-2',
                    hecho ? 'border-tinta bg-amarillo text-grafito' : 'border-linea',
                    actual && 'border-tinta',
                  )}
                >
                  {hecho && <Icon name="check" size={14} />}
                </span>
                {texto}
                <span className="sr-only">{hecho ? ': listo' : actual ? ': en curso' : ''}</span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
