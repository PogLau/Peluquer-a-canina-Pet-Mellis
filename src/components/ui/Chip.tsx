'use client'

import { useId, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Icon, type IconName } from './Icons'

/*
  ChipGroup: selector de una opción (tamaño, manto, nudos) hecho con radios reales,
  así se navega con flechas y los lectores de pantalla anuncian el grupo.
*/

export type ChipOption<V extends string> = {
  value: V
  label: string
  /** Texto chico debajo, por ejemplo «hasta 10 kg». */
  detail?: string
  icon?: IconName
}

type Props<V extends string> = {
  legend: string
  name: string
  options: ReadonlyArray<ChipOption<V>>
  value: V | null
  onChange: (value: V) => void
  hint?: string
  /** Una sola fila que se desliza de costado (por ejemplo, los días de la reserva en el celular). */
  scroll?: boolean
}

export function ChipGroup<V extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
  scroll = false,
}: Props<V>) {
  const hintId = useId()
  return (
    <fieldset className="flex min-w-0 flex-col gap-2" aria-describedby={hint ? hintId : undefined}>
      <legend className="mb-2 text-sm font-bold text-texto">{legend}</legend>
      <div
        className={cn(
          'flex gap-2',
          scroll
            ? '-mx-1 snap-x overflow-x-auto px-1 pb-3 pt-1 [&>label]:shrink-0 [&>label]:snap-start'
            : 'flex-wrap',
        )}
      >
        {options.map((option) => {
          const checked = option.value === value
          return (
            <label
              key={option.value}
              className={cn(
                'relative flex min-h-12 cursor-pointer items-center gap-2 rounded-sm border-2 border-tinta px-3.5 py-2 text-sm font-extrabold transition-colors',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-tinta',
                checked
                  ? 'bg-accion text-sobre-accion shadow-ticket-presionada'
                  : 'bg-superficie text-texto hover:bg-superficie-alt',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.icon && <Icon name={option.icon} size={20} />}
              <span className="flex flex-col leading-tight">
                <span>{option.label}</span>
                {option.detail && <span className="text-xs font-normal">{option.detail}</span>}
              </span>
            </label>
          )
        })}
      </div>
      {hint && (
        <p id={hintId} className="text-sm text-texto-suave">
          {hint}
        </p>
      )}
    </fieldset>
  )
}

type ToggleChipProps = {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  children: ReactNode
  icon?: IconName
}

/** Chip que se prende y se apaga (selección múltiple: servicios, extras). */
export function ToggleChip({ pressed, onPressedChange, children, icon }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 rounded-sm border-2 border-tinta px-3.5 text-sm font-extrabold transition-colors',
        pressed
          ? 'bg-accion text-sobre-accion'
          : 'bg-superficie text-texto hover:bg-superficie-alt',
      )}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}
