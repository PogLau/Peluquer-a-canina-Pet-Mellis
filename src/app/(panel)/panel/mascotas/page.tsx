import type { Metadata } from 'next'

import { ComingSoon } from '@/components/ui'

export const metadata: Metadata = { title: 'Mascotas' }

export default function Page() {
  return <ComingSoon title="mascotas" description="Buscá por perro o tutor y abrí su Ficha Evolutiva." phase="Fase 3" icon="pata" />
}
