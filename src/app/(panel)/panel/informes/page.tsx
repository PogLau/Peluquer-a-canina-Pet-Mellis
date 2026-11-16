import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Informes' }

export default function Page() {
  return <ComingSoon title="informes" description="Turnos, ingresos estimados y clientes que no volvieron." phase="Fase 5" icon="grafico" />
}
