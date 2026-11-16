import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Reservar turno' }

export default function Page() {
  return <ComingSoon title="reservá un turno" description="Cuatro pasos: tu perro, los servicios, el horario y la confirmación." phase="Fase 4" icon="calendario" />
}
