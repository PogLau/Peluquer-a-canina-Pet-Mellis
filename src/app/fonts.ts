import { Outfit } from 'next/font/google'

/*
  Familia única: Outfit, la equivalente libre (Google Fonts, licencia OFL) de Stolzl, la tipografía de la
  referencia de diseño. Las dos son geométricas, con «a» de un solo piso y mayúsculas anchas.
  400 para texto, 500 para rótulos y botones, 700 para títulos.
  Si el salón licencia Stolzl (Adobe Fonts o TipoType), se cambia acá por next/font/local con la misma variable.
*/
export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

export const fontVariables = outfit.variable
