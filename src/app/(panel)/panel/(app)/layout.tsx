import Link from 'next/link'
import type { ReactNode } from 'react'

import { panelNav } from '@/components/panel/nav'
import { BottomNav, Icon, Imagotipo, SideNav } from '@/components/ui'
import { requireStaff } from '@/lib/panel/sesion'

import { salir } from '../ingresar/acciones'

/*
  Panel de la peluquera (requiere sesión del salón).
  Desde 768 px: menú lateral petróleo (es el único header). En el celular: barra superior + barra inferior.
*/
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const { user } = await requireStaff()
  const nombre = user.nombre || user.email

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-sm bg-accion px-4 py-2 font-extrabold text-petroleo focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <div className="md:grid md:min-h-dvh md:grid-cols-[248px_1fr]">
        <header className="sticky top-0 z-40 w-full border-b-2 border-tinta bg-petroleo md:h-dvh md:border-b-0 md:border-r-2">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 md:h-full md:flex-col md:items-stretch md:justify-start md:gap-8 md:py-6">
            <Link
              href="/panel"
              aria-label="Pet Mellis, panel"
              className="rounded-sm focus-visible:outline-teal"
            >
              <Imagotipo tone="dark" tagline="panel del salón" />
            </Link>
            <div className="hidden md:block">
              <SideNav items={panelNav} root="/panel" />
            </div>
            <div className="flex items-center gap-1 md:mt-auto md:flex-col md:items-stretch md:gap-3">
              {/* En el celular, Informes no entra en la barra inferior: queda acá */}
              <Link
                href="/panel/informes"
                className="inline-flex min-h-10 items-center gap-2 rounded-sm px-2 text-sm font-extrabold text-marfil hover:bg-marfil/10 focus-visible:outline-teal md:hidden"
              >
                <Icon name="grafico" size={20} />
                <span className="sr-only sm:not-sr-only">Informes</span>
              </Link>
              <p
                className="hidden truncate px-3 text-sm text-marfil/80 md:block"
                title={user.email}
              >
                {nombre}
              </p>
              <form action={salir}>
                <button
                  type="submit"
                  className="inline-flex min-h-10 w-full items-center gap-2 rounded-sm px-2 text-sm font-extrabold text-marfil hover:bg-marfil/10 focus-visible:outline-teal md:px-3"
                >
                  <Icon name="salir" size={20} />
                  <span className="sr-only sm:not-sr-only">Salir</span>
                </button>
              </form>
            </div>
          </div>
        </header>
        <main
          id="contenido"
          className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-10"
        >
          {children}
        </main>
      </div>
      <BottomNav items={panelNav} root="/panel" />
    </>
  )
}
