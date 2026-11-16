'use client'

import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Icon } from './Icons'

/*
  Campos de formulario. Cada control lleva su <label htmlFor> asociado,
  y la ayuda y el error se enlazan con aria-describedby.
*/

type ShellProps = {
  label: string
  hint?: string
  error?: string
  /** Si no se pasa, se genera uno estable con useId. */
  id?: string
  optional?: boolean
}

const controlClasses =
  'w-full rounded-sm border-2 border-tinta bg-superficie px-3 text-base text-texto placeholder:text-texto-suave disabled:border-linea disabled:bg-superficie-alt disabled:text-texto-suave aria-invalid:border-peligro'

function useFieldIds(id: string | undefined, hint?: string, error?: string) {
  const auto = useId()
  const controlId = id ?? auto
  const hintId = hint ? `${controlId}-ayuda` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return { controlId, hintId, errorId, describedBy }
}

function Shell({
  label,
  hint,
  error,
  optional,
  controlId,
  hintId,
  errorId,
  children,
}: ShellProps & { controlId: string; hintId?: string; errorId?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={controlId} className="text-sm font-bold text-texto">
        {label}
        {optional && <span className="font-normal text-texto-suave"> (opcional)</span>}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="text-sm text-texto-suave">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-sm font-bold text-peligro">
          <Icon name="alerta" size={16} />
          {error}
        </p>
      )}
    </div>
  )
}

type InputProps = ShellProps & Omit<ComponentPropsWithoutRef<'input'>, 'id'>

export function TextField({ label, hint, error, id, optional, className, ...props }: InputProps) {
  const ids = useFieldIds(id, hint, error)
  return (
    <Shell label={label} hint={hint} error={error} optional={optional} {...ids}>
      <input
        id={ids.controlId}
        aria-describedby={ids.describedBy}
        aria-invalid={error ? true : undefined}
        required={!optional}
        className={cn(controlClasses, 'min-h-12', className)}
        {...props}
      />
    </Shell>
  )
}

type SelectProps = ShellProps & Omit<ComponentPropsWithoutRef<'select'>, 'id'>

export function SelectField({ label, hint, error, id, optional, className, children, ...props }: SelectProps) {
  const ids = useFieldIds(id, hint, error)
  return (
    <Shell label={label} hint={hint} error={error} optional={optional} {...ids}>
      <select
        id={ids.controlId}
        aria-describedby={ids.describedBy}
        aria-invalid={error ? true : undefined}
        required={!optional}
        className={cn(controlClasses, 'min-h-12', className)}
        {...props}
      >
        {children}
      </select>
    </Shell>
  )
}

type TextareaProps = ShellProps & Omit<ComponentPropsWithoutRef<'textarea'>, 'id'>

export function TextareaField({ label, hint, error, id, optional, className, ...props }: TextareaProps) {
  const ids = useFieldIds(id, hint, error)
  return (
    <Shell label={label} hint={hint} error={error} optional={optional} {...ids}>
      <textarea
        id={ids.controlId}
        aria-describedby={ids.describedBy}
        aria-invalid={error ? true : undefined}
        required={!optional}
        rows={4}
        className={cn(controlClasses, 'py-2.5', className)}
        {...props}
      />
    </Shell>
  )
}
