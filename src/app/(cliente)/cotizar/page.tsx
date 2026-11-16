import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { Cotizador } from '@/components/cliente/Cotizador'
import { Notice, PageHeader } from '@/components/ui'
import { loadCatalog } from '@/lib/catalogo'
import { iaDisponible } from '@/lib/ia/gemini'

export const metadata: Metadata = { title: 'Cotizar' }

// Los precios se leen de la base en cada visita: un cambio en el panel se ve al instante
export const dynamic = 'force-dynamic'

export default async function CotizarPage() {
  let catalog
  try {
    catalog = await loadCatalog(await getPayload({ config }))
  } catch {
    catalog = null
  }

  return (
    <>
      <PageHeader eyebrow="Presupuesto al instante" title="cotizá el turno">
        Elegí el tamaño, el manto y los servicios. El precio se actualiza mientras elegís.
      </PageHeader>
      {catalog && catalog.servicios.length > 0 ? (
        <Cotizador catalog={catalog} iaActiva={iaDisponible()} />
      ) : (
        <Notice tone="peligro" title="No pudimos cargar los precios" role="alert">
          Probá de nuevo en un rato o escribinos por WhatsApp.
        </Notice>
      )}
    </>
  )
}
