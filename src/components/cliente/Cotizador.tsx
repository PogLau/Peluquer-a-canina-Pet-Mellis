'use client'

import { sugerirConFoto } from '@/app/(cliente)/cotizar/actions'
import type { Catalog } from '@/lib/catalogo'

import { CotizadorBase } from './CotizadorBase'

/** Cotizador de la app real: con «Sugerir con foto» analizando en el servidor. */
export function Cotizador({ catalog, iaActiva }: { catalog: Catalog; iaActiva: boolean }) {
  return <CotizadorBase catalog={catalog} iaActiva={iaActiva} analizar={sugerirConFoto} />
}
