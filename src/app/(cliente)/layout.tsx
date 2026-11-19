import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { clienteNav } from '@/components/cliente/nav'
import { PieSalon } from '@/components/cliente/PieSalon'
import { BottomNav, Imagotipo, LinkButton, TopNav } from '@/components/ui'
import { brandColors } from '@/lib/brand'

import { fontVariables } from '../fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'Pet Mellis · Peluquería canina en Merlo, Buenos Aires', template: '%s · Pet Mellis' },
  description:
    'Los Mellis, peluquería canina en Merlo, Buenos Aires. Cotizá y reservá el turno de tu perro. Cada visita mejora la siguiente.',
}

export const viewport: Viewport = {
  themeColor: brandColors.blanco,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

/** Layout del panel de cliente: un solo header a ancho completo, con la navegación adentro. */
export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={fontVariables}>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="sr-only z-50 rounded-sm bg-menta px-4 py-2 font-bold text-carbon focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <header className="sticky top-0 z-40 w-full border-b border-linea bg-superficie/95 backdrop-blur">
          <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4">
            <Link
              href="/"
              aria-label="Pet Mellis, inicio"
              className="rounded-sm focus-visible:outline-tinta"
            >
              <Imagotipo />
            </Link>
            <TopNav items={clienteNav} root="/" />
            {/* Reservar ya está en la barra inferior (celular) y en las pestañas (tablet): el botón aparece desde 1024 px */}
            <div className="hidden lg:block">
              <LinkButton href="/reservar" size="small" variant="highlight">
                Reservar turno
              </LinkButton>
            </div>
          </div>
        </header>
        <main id="contenido" className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:pb-16 md:pt-10">
          {children}
        </main>
        <PieSalon />
        <BottomNav items={clienteNav} root="/" />
      </body>
    </html>
  )
}
