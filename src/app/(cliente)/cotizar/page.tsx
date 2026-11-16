import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Cotizar' }

export default function Page() {
  return <ComingSoon title="cotizá el turno" description="Elegí tamaño, manto y servicios, y mirá el precio al instante." phase="Fase 4" icon="cotizar" />
}
