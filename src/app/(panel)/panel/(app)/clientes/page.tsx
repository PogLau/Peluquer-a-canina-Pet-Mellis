import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Clientes' }

export default function Page() {
  return <ComingSoon title="clientes" description="Tutores con sus perros, teléfono y última visita." phase="Fase 5" icon="usuarios" />
}
