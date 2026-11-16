import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Mi mascota' }

export default function Page() {
  return <ComingSoon title="libreta de mi mascota" description="Los datos de tu perro, sus cuidados y cómo le fue en cada visita." phase="Fase 4" icon="libreta" />
}
