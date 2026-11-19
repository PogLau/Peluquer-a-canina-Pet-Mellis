import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Icon, type IconName } from './Icons'

/**
 * - `primary`: verde oscuro con texto blanco (CTA principal). Una sola por pantalla.
 * - `secondary`: blanco con contorno fino carbón, como el botón «Consultation» de la referencia.
 * - `highlight`: naranja con texto carbón. CTA secundarios, WhatsApp y acciones sobre bandas verdes.
 * - `ghost`: sin borde, para acciones terciarias.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'highlight' | 'ghost'

type Base = {
  variant?: ButtonVariant
  size?: 'normal' | 'small'
  icon?: IconName
  iconEnd?: IconName
  fullWidth?: boolean
  children: ReactNode
}

// Línea fina y sombra apenas visible; al presionar, la sombra se aplana
const ticket = 'border shadow-ticket-presionada hover:shadow-ticket active:shadow-none'

const variants: Record<ButtonVariant, string> = {
  primary: cn(ticket, 'border-transparent bg-accion text-sobre-accion hover:bg-verde-hover'),
  secondary: cn(ticket, 'border-tinta bg-superficie text-texto hover:bg-superficie-alt'),
  highlight: cn(ticket, 'border-transparent bg-naranja text-carbon hover:bg-naranja-hover'),
  ghost: 'border border-transparent bg-transparent text-texto underline-offset-4 hover:underline',
}

export function buttonClasses({
  variant = 'primary',
  size = 'normal',
  fullWidth = false,
}: Pick<Base, 'variant' | 'size' | 'fullWidth'>) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-sm font-sans font-medium transition-[box-shadow,background-color] duration-150',
    // Acciones: mínimo 14 px
    size === 'normal' ? 'min-h-12 px-5 text-base' : 'min-h-10 px-4 text-sm',
    variants[variant],
    // Deshabilitado: sin sombra y apagado. Siempre acompañarlo con un mensaje de qué falta.
    'disabled:pointer-events-none disabled:border-linea disabled:bg-superficie-alt disabled:text-texto-suave disabled:shadow-none',
    'aria-disabled:pointer-events-none aria-disabled:border-linea aria-disabled:bg-superficie-alt aria-disabled:text-texto-suave aria-disabled:shadow-none',
    fullWidth && 'w-full',
  )
}

function Content({ icon, iconEnd, size, children }: Pick<Base, 'icon' | 'iconEnd' | 'size' | 'children'>) {
  const px = size === 'small' ? 18 : 20
  return (
    <>
      {icon && <Icon name={icon} size={px} />}
      <span>{children}</span>
      {iconEnd && <Icon name={iconEnd} size={px} />}
    </>
  )
}

type ButtonProps = Base & Omit<ComponentPropsWithoutRef<'button'>, 'children'>

export function Button({
  variant,
  size,
  icon,
  iconEnd,
  fullWidth,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(buttonClasses({ variant, size, fullWidth }), className)} {...props}>
      <Content icon={icon} iconEnd={iconEnd} size={size}>
        {children}
      </Content>
    </button>
  )
}

type LinkButtonProps = Base &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'children'> & {
    /** Abre en otra pestaña (por ejemplo, un enlace wa.me). */
    external?: boolean
  }

/** Enlace con aspecto de botón. */
export function LinkButton({
  variant,
  size,
  icon,
  iconEnd,
  fullWidth,
  external = false,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      <Content icon={icon} iconEnd={iconEnd} size={size}>
        {children}
      </Content>
    </Link>
  )
}
