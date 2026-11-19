import { Manuale } from 'next/font/google'

// Familia única oficial (pet-mellis-contexto-maestro.md §2.4): Manuale 700 para títulos y 400 para texto.
export const manuale = Manuale({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-manuale',
  display: 'swap',
})

export const fontVariables = manuale.variable
