import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Servicios y precios' }

export default function Page() {
  return <ComingSoon title="servicios y precios" description="Precios por tamaño, recargos y extras. Los cambios se ven al instante en el cotizador." phase="Fase 5" icon="ajustes" />
}
