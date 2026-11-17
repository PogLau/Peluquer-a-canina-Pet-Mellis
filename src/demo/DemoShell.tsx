'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import { clienteNav } from '@/components/cliente/nav'
import {
  BottomNav,
  Button,
  Cargando,
  Imagotipo,
  LinkButton,
  Modal,
  SideNav,
  TopNav,
  type NavItem,
} from '@/components/ui'
import { cn } from '@/lib/cn'

import { reiniciarDemo, useDemo } from './store'

/*
  Marco de la demo estática: una barra fina arriba (qué es esto, cliente o peluquera, reiniciar)
  y los mismos layouts que la app real. En la app real no hay botón «Cliente / Peluquera»:
  la peluquera entra con usuario y contraseña. En la demo se salta ese paso.
*/

export const panelNavDemo: readonly NavItem[] = [
  { href: '/panel', label: 'Hoy', icon: 'calendario' },
  { href: '/panel/solicitudes', label: 'Solicitudes', icon: 'bandeja' },
  { href: '/panel/mascotas', label: 'Mascotas', icon: 'pata' },
  { href: '/panel/precios', label: 'Precios', icon: 'ajustes' },
  { href: '/panel/informes', label: 'Informes', icon: 'grafico' },
]

function BarraDemo({ panel }: { panel: boolean }) {
  const [confirmar, setConfirmar] = useState(false)
  const pestana = (activa: boolean) =>
    cn(
      'inline-flex min-h-9 items-center rounded-sm px-3 text-sm font-extrabold',
      activa ? 'bg-negro text-amarillo' : 'text-negro underline-offset-4 hover:underline',
    )
  return (
    <div className="border-b-2 border-tinta bg-amarillo">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 text-negro">
        <p className="text-sm">
          <span className="rotulo mr-2">Demo</span>
          Datos ficticios, guardados solo en este navegador.
        </p>
        <nav aria-label="Modo de la demo" className="flex flex-wrap items-center gap-1">
          <Link href="/" aria-current={!panel ? 'page' : undefined} className={pestana(!panel)}>
            Ver como cliente
          </Link>
          <Link href="/panel" aria-current={panel ? 'page' : undefined} className={pestana(panel)}>
            Ver como peluquera
          </Link>
          <button type="button" onClick={() => setConfirmar(true)} className={pestana(false)}>
            Reiniciar demo
          </button>
        </nav>
      </div>
      <Modal
        open={confirmar}
        onClose={() => setConfirmar(false)}
        title="¿reiniciar la demo?"
        footer={
          <>
            <Button variant="ghost" size="small" onClick={() => setConfirmar(false)}>
              Volver
            </Button>
            <Button
              size="small"
              onClick={() => {
                reiniciarDemo()
                setConfirmar(false)
              }}
            >
              Reiniciar
            </Button>
          </>
        }
      >
        <p className="text-sm">
          Se borran los turnos, atenciones y cambios que hiciste, y vuelven los datos de ejemplo de
          hoy. Solo afecta a este navegador.
        </p>
      </Modal>
    </div>
  )
}

function MarcoCliente({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b-2 border-tinta bg-negro">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            href="/"
            aria-label="Pet Mellis, inicio"
            className="rounded-sm focus-visible:outline-amarillo"
          >
            <Imagotipo tone="dark" />
          </Link>
          <TopNav items={clienteNav} root="/" />
          <div className="hidden lg:block">
            <LinkButton href="/reservar" size="small">
              Reservar turno
            </LinkButton>
          </div>
        </div>
      </header>
      <main id="contenido" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pb-16 md:pt-10">
        {children}
      </main>
      <BottomNav items={clienteNav} root="/" />
    </>
  )
}

function MarcoPanel({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="md:grid md:min-h-dvh md:grid-cols-[248px_1fr]">
        <header className="sticky top-0 z-40 w-full border-b-2 border-tinta bg-negro md:h-dvh md:border-b-0 md:border-r-2">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 md:h-full md:flex-col md:items-stretch md:justify-start md:gap-8 md:py-6">
            <Link
              href="/panel"
              aria-label="Pet Mellis, panel"
              className="rounded-sm focus-visible:outline-amarillo"
            >
              <Imagotipo tone="dark" tagline="panel del salón" />
            </Link>
            <div className="hidden md:block">
              <SideNav items={panelNavDemo} root="/panel" />
            </div>
            <p className="hidden px-3 text-sm text-blanco md:mt-auto md:block">
              En la app real, la peluquera entra con usuario y contraseña.
            </p>
          </div>
        </header>
        <main
          id="contenido"
          className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-10"
        >
          {children}
        </main>
      </div>
      <BottomNav items={panelNavDemo} root="/panel" />
    </>
  )
}

export function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const panel = pathname === '/panel' || pathname.startsWith('/panel/')
  const estado = useDemo()
  // Los datos viven en el navegador: hasta tenerlos se muestra el esqueleto
  const contenido = estado ? children : <Cargando />
  const Marco = panel ? MarcoPanel : MarcoCliente

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-sm bg-amarillo px-4 py-2 font-extrabold text-negro focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <BarraDemo panel={panel} />
      <Marco>{contenido}</Marco>
    </>
  )
}
