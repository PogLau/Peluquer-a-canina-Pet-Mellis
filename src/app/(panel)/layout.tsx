import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { brandColors } from '@/lib/brand'

import { fontVariables } from '../fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'Panel · Pet Mellis', template: '%s · Panel Pet Mellis' },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: brandColors.negro,
  width: 'device-width',
  initialScale: 1,
}

/*
  Documento del panel de la peluquera. El menú y el control de sesión viven en panel/(app)/layout.tsx;
  /panel/ingresar queda afuera para poder entrar sin sesión.
*/
export default function PanelRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={fontVariables}>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
