import type { NavItem } from '@/components/ui'

// `mobile: false`: no entra en la barra inferior del celular (máximo 5); se llega desde el header.
export const panelNav: readonly NavItem[] = [
  { href: '/panel', label: 'Hoy', icon: 'calendario' },
  { href: '/panel/solicitudes', label: 'Solicitudes', icon: 'bandeja' },
  { href: '/panel/mascotas', label: 'Mascotas', icon: 'pata' },
  { href: '/panel/clientes', label: 'Clientes', icon: 'usuarios' },
  { href: '/panel/servicios', label: 'Precios', icon: 'ajustes' },
  { href: '/panel/informes', label: 'Informes', icon: 'grafico', mobile: false },
]
