import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { DemoShell } from '@/demo/DemoShell'
import { brandColors } from '@/lib/brand'

import { fontVariables } from '../fonts'
import '@/styles/globals.css'

/*
  Demo estática de Pet Mellis (GitHub Pages). Solo se compila con DEMO_ESTATICO=1 (pnpm build:demo):
  en el build normal, los archivos *.demo.tsx no son páginas. Ver docs/demo.md.
*/

export const metadata: Metadata = {
  title: 'Pet Mellis · Demo de la web app',
  description:
    'Demo interactiva de Pet Mellis, la web app de Los Mellis – Peluquería Canina (Merlo): cotizador, reservas, panel de la peluquera y Ficha Evolutiva. Datos ficticios.',
  robots: { index: false },
}

export const viewport: Viewport = {
  themeColor: brandColors.blanco,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={fontVariables}>
      <body className="min-h-dvh">
        <DemoShell>{children}</DemoShell>
      </body>
    </html>
  )
}
