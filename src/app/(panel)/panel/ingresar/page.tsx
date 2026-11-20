import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { FormularioIngreso } from '@/components/panel/FormularioIngreso'
import { Imagotipo, Ticket } from '@/components/ui'
import { getStaffSession } from '@/lib/panel/sesion'

export const metadata: Metadata = { title: 'Ingresar' }

export default async function IngresarPage() {
  if (await getStaffSession()) redirect('/panel')

  return (
    <main
      id="contenido"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-8 px-4 py-10"
    >
      <Imagotipo etiqueta="Panel del salón" />
      <Ticket className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl">ingresá al panel</h1>
          <p className="text-sm text-texto-suave">Agenda, solicitudes y fichas de cada perro.</p>
        </div>
        <FormularioIngreso />
      </Ticket>
    </main>
  )
}
