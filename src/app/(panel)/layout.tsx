import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { panelNav } from '@/components/panel/nav'
import { BottomNav, Icon, Imagotipo, SideNav } from '@/components/ui'
import { brandColors } from '@/lib/brand'

import { fontVariables } from '../fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'Panel · Pet Mellis', template: '%s · Panel Pet Mellis' },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: brandColors.negro, width: 'device-width', initialScale: 1 }

/*
  Layout del panel de la peluquera.
  Desde 768 px: menú lateral negro (es el único header). En el celular: barra superior + barra inferior.
  El login con Payload llega en la Fase 3.
*/
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={fontVariables}>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="sr-only z-50 rounded-sm bg-amarillo px-4 py-2 font-extrabold text-negro focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <div className="md:grid md:min-h-dvh md:grid-cols-[248px_1fr]">
          <header className="sticky top-0 z-40 w-full border-b-2 border-tinta bg-negro md:h-dvh md:border-b-0 md:border-r-2">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 md:h-full md:flex-col md:items-stretch md:justify-start md:gap-8 md:py-6">
              <Link href="/panel" aria-label="Pet Mellis, panel" className="rounded-sm focus-visible:outline-amarillo">
                <Imagotipo tone="dark" tagline="panel del salón" />
              </Link>
              <div className="hidden md:block">
                <SideNav items={panelNav} root="/panel" />
              </div>
              {/* En el celular, Informes no entra en la barra inferior: queda acá */}
              <Link
                href="/panel/informes"
                className="inline-flex min-h-10 items-center gap-2 rounded-sm px-2 text-sm font-extrabold text-blanco hover:bg-blanco/10 focus-visible:outline-amarillo md:hidden"
              >
                <Icon name="grafico" size={20} />
                Informes
              </Link>
            </div>
          </header>
          <main id="contenido" className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-10">
            {children}
          </main>
        </div>
        <BottomNav items={panelNav} root="/panel" />
      </body>
    </html>
  )
}
