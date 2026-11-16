import type { NavItem } from '@/components/ui'

export const clienteNav: readonly NavItem[] = [
  { href: '/', label: 'Inicio', icon: 'inicio' },
  { href: '/cotizar', label: 'Cotizar', icon: 'cotizar' },
  { href: '/reservar', label: 'Reservar', icon: 'calendario' },
  { href: '/mi-mascota', label: 'Mi mascota', icon: 'libreta' },
  { href: '/mis-turnos', label: 'Mis turnos', icon: 'reloj' },
]
