'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import { Cargando } from '@/components/ui'
import { verComo } from '@/demo/acciones'

/** Enlace personal de la demo (/mi?c=<cliente>). En la app real es /mi/<código secreto>. */
function AbrirEnlace() {
  const params = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    const id = Number(params.get('c'))
    if (Number.isInteger(id) && id > 0) verComo(id)
    router.replace('/mis-turnos')
  }, [params, router])
  return <Cargando tarjetas={1} />
}

export default function MiDemo() {
  return (
    <Suspense fallback={<Cargando tarjetas={1} />}>
      <AbrirEnlace />
    </Suspense>
  )
}
