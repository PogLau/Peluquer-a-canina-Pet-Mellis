'use client'

import { ErrorPantalla } from '@/components/ui'

export default function ErrorDeSeccion({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorPantalla error={error} reset={reset} volver="/" />
}
