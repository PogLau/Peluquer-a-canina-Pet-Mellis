import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Mis turnos' }

export default function Page() {
  return <ComingSoon title="mis turnos" description="Tus turnos próximos y pasados, con su estado." phase="Fase 4" icon="reloj" />
}
