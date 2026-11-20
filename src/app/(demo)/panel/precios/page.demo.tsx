'use client'

import { useState } from 'react'

import { TablaPrecios } from '@/components/panel/TablaPrecios'
import { PageHeader } from '@/components/ui'
import { guardarPrecios } from '@/demo/acciones'
import { preciosEditables } from '@/demo/selectores'
import { useEstado } from '@/demo/store'

export default function PreciosDemo() {
  const s = useEstado()
  const [inicial] = useState(() => preciosEditables(s))
  return (
    <>
      <PageHeader eyebrow="Catálogo" title="servicios y precios">
        Los cambios se ven al instante en el cotizador de los usuarios. Los turnos ya pedidos
        mantienen su precio.
      </PageHeader>
      <TablaPrecios inicial={inicial} guardar={guardarPrecios} />
    </>
  )
}
