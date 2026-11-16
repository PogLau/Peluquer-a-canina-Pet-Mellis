import { Nunito, Sora, Space_Mono } from 'next/font/google'

// Display: Oddval no está en Google Fonts. Sora es el reemplazo indicado por el manual.
// Si se agrega el archivo de Oddval SemiBold, cargarlo con next/font/local
// (variable: '--font-oddval') y sumarlo a `fontVariables`.
export const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-sora',
  display: 'swap',
})

export const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const fontVariables = `${sora.variable} ${nunito.variable} ${spaceMono.variable}`
