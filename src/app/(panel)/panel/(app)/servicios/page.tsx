import type { Metadata } from 'next'

import { TablaPrecios } from '@/components/panel/TablaPrecios'
import { guardarPrecios } from '../acciones-gestion'
import { PageHeader } from '@/components/ui'
import { getPricing } from '@/lib/panel/precios'
import { requireStaff } from '@/lib/panel/sesion'

export const metadata: Metadata = { title: 'Servicios y precios' }

export default async function ServiciosPage() {
  const { payload, user } = await requireStaff()
  const precios = await getPricing(payload, user)

  return (
    <>
      <PageHeader eyebrow="Catálogo" title="servicios y precios">
        Los cambios se ven al instante en el cotizador de los usuarios. Los turnos ya pedidos
        mantienen su precio.
      </PageHeader>
      <TablaPrecios inicial={precios} guardar={guardarPrecios} />
    </>
  )
}
