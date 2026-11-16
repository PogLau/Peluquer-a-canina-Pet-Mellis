import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Solicitudes' }

export default function Page() {
  return <ComingSoon title="solicitudes" description="Turnos pedidos desde la web: aceptar, proponer otro horario o rechazar." phase="Fase 3" icon="bandeja" />
}
