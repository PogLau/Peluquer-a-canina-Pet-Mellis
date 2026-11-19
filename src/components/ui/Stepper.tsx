import { cn } from '@/lib/cn'

import { Icon } from './Icons'

type Props = {
  steps: readonly string[]
  /** Índice del paso actual, empezando en 0. */
  current: number
}

/** Indicador de pasos (reserva en 4 pasos). */
export function Stepper({ steps, current }: Props) {
  return (
    <nav aria-label="Pasos de la reserva">
      <p className="rotulo mb-2 text-texto-suave">
        Paso {current + 1} de {steps.length}
      </p>
      <ol className="flex gap-1.5">
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <li
              key={step}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-sm border-2 px-2 text-center text-xs font-bold sm:text-sm',
                active && 'border-tinta bg-seleccion text-sobre-seleccion',
                done && 'border-tinta bg-superficie text-texto',
                !active && !done && 'border-linea bg-superficie text-texto-suave',
              )}
            >
              {done && <Icon name="check" size={16} />}
              <span className="sr-only">{done ? 'Completado: ' : active ? 'Actual: ' : 'Pendiente: '}</span>
              <span className={cn(!active && 'hidden sm:inline')}>{step}</span>
              {!active && (
                <span aria-hidden="true" className="sm:hidden">
                  {i + 1}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
