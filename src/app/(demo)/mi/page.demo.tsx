'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import { Cargando } from '@/components/ui'
import { abrirEnlace } from '@/demo/acciones'

/** Enlace personal de la demo (/mi?t=<código secreto>), como /mi/<código> en la app real. */
function AbrirEnlace() {
  const params = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    const ok = abrirEnlace(params.get('t') ?? '')
    router.replace(ok ? '/mis-turnos' : '/mis-turnos?enlace=invalido')
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
