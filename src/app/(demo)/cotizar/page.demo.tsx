'use client'

import { CotizadorBase } from '@/components/cliente/CotizadorBase'
import { PageHeader } from '@/components/ui'
import { catalogOf } from '@/demo/estado'
import { useEstado } from '@/demo/store'

export default function CotizarDemo() {
  const s = useEstado()
  return (
    <>
      <PageHeader eyebrow="Presupuesto al instante" title="cotizá el turno">
        Elegí el tamaño, el manto y los servicios. El precio se actualiza mientras elegís.
      </PageHeader>
      {/* Sin clave de IA: «Sugerir con foto» muestra solo los ejemplos, rotulados como ejemplos */}
      <CotizadorBase catalog={catalogOf(s)} iaActiva={false} />
    </>
  )
}
