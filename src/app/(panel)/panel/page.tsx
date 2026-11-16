import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Hoy' }

export default function Page() {
  return <ComingSoon title="hoy" description="La agenda del día con las alertas de cada ficha." phase="Fase 3" icon="calendario" />
}
