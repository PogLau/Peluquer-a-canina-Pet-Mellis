'use client'

import { useRouter } from 'next/navigation'

import { Button } from './Button'

/**
 * Vuelve a la pantalla anterior de la app. Si la persona llegó directo (un enlace de WhatsApp,
 * un favorito) y no hay una pantalla anterior de la app, va al `destino` (el inicio por defecto).
 */
export function BotonVolver({ destino = '/', texto = 'Volver' }: { destino?: string; texto?: string }) {
  const router = useRouter()

  function volver() {
    let vieneDeLaApp = false
    try {
      vieneDeLaApp = !!document.referrer && new URL(document.referrer).origin === window.location.origin
    } catch {
      vieneDeLaApp = false
    }
    if (vieneDeLaApp && window.history.length > 1) router.back()
    else router.push(destino)
  }

  return (
    <Button variant="ghost" size="small" icon="volver" onClick={volver} className="-ml-2 w-fit px-2">
      {texto}
    </Button>
  )
}
