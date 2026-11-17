'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'

import { Icon, type IconName } from './Icons'

export type NavItem = {
  href: string
  label: string
  icon: IconName
  /** Se muestra en la barra inferior del celular (máximo 5). */
  mobile?: boolean
}

function isActive(pathname: string, href: string, root: string) {
  return href === root ? pathname === root : pathname === href || pathname.startsWith(`${href}/`)
}

/** Navegación horizontal para el header (desde 768 px). Vive dentro del header. */
export function TopNav({ items, root }: { items: readonly NavItem[]; root: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Principal" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href, root)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-10 items-center rounded-sm px-3 text-sm font-extrabold focus-visible:outline-teal',
                  active ? 'bg-accion text-petroleo' : 'text-marfil hover:bg-marfil/10',
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Barra inferior para el celular (< 768 px). */
export function BottomNav({ items, root }: { items: readonly NavItem[]; root: string }) {
  const pathname = usePathname()
  const visible = items.filter((item) => item.mobile !== false).slice(0, 5)
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-tinta bg-superficie pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}>
        {visible.map((item) => {
          const active = isActive(pathname, item.href, root)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-xs font-extrabold',
                  active ? 'bg-accion text-petroleo' : 'text-texto',
                )}
              >
                <Icon name={item.icon} size={22} />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Menú lateral petróleo del panel de la peluquera (desde 768 px). */
export function SideNav({ items, root }: { items: readonly NavItem[]; root: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Panel">
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href, root)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm font-extrabold focus-visible:outline-teal',
                  active ? 'bg-accion text-petroleo' : 'text-marfil hover:bg-marfil/10',
                )}
              >
                <Icon name={item.icon} size={20} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
