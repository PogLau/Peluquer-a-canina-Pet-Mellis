import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { fontVariables } from '../fonts'
import '@/styles/globals.css'

export const metadata: Metadata = { title: 'Componentes · Pet Mellis', robots: { index: false } }

/** Catálogo de componentes. Solo en desarrollo. */
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <html lang="es-AR" className={fontVariables}>
      <body className="min-h-dvh">
        <main className="mx-auto w-full max-w-5xl px-4 py-10">{children}</main>
      </body>
    </html>
  )
}
