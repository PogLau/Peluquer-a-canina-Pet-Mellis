import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EnlaceCliente } from '@/components/panel/EnlaceCliente'
import { FormularioCliente } from '@/components/panel/FormularioCliente'
import { FormularioMascota } from '@/components/panel/FormularioMascota'
import { Icon, LinkButton, Notice, PageHeader, Ticket } from '@/components/ui'
import { enlaceDeTutor } from '@/lib/enlace-cliente'
import { formatLongDate } from '@/lib/format'
import { getClient } from '@/lib/panel/clientes'
import { requireStaff } from '@/lib/panel/sesion'
import { whatsappLink } from '@/lib/whatsapp'

export const metadata: Metadata = { title: 'Cliente' }

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ nuevo?: string }> }

function Volver() {
  return (
    <Link
      href="/panel/clientes"
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-menta-texto"
    >
      <Icon name="volver" size={18} /> Clientes
    </Link>
  )
}

export default async function ClientePage({ params, searchParams }: Props) {
  const { id: raw } = await params
  const { payload, user } = await requireStaff()

  if (raw === 'nuevo') {
    return (
      <>
        <Volver />
        <PageHeader title="nuevo cliente">
          Después de crearlo vas a poder cargar sus perros.
        </PageHeader>
        <Ticket>
          <FormularioCliente
            inicial={{ id: null, nombre: '', whatsapp: '', zona: '', notas: '' }}
          />
        </Ticket>
      </>
    )
  }

  const id = Number(raw)
  if (!Number.isInteger(id)) notFound()
  const datos = await getClient(payload, user, id)
  if (!datos) notFound()
  const { cliente, mascotas } = datos
  const [enlace, recienCreado] = await Promise.all([
    enlaceDeTutor(payload, id),
    searchParams.then((s) => s.nuevo === '1'),
  ])
  let wa: string | null = null
  try {
    wa = whatsappLink(cliente.whatsapp)
  } catch {
    wa = null
  }

  return (
    <>
      <Volver />
      <PageHeader
        eyebrow="Cliente"
        title={cliente.nombre.toLowerCase()}
        actions={
          wa && (
            <LinkButton href={wa} external variant="dark" size="small" icon="whatsapp">
              Escribirle
            </LinkButton>
          )
        }
      />
      <div className="flex flex-col gap-6">
        {recienCreado && (
          <Notice tone="exito" role="status" title="Cliente creado. Ahora cargá sus perros." />
        )}
        <Ticket as="section" aria-labelledby="datos" className="flex flex-col gap-4">
          <h2 id="datos" className="text-xl">
            datos
          </h2>
          <FormularioCliente inicial={cliente} />
        </Ticket>

        <section aria-labelledby="perros" className="flex flex-col gap-3">
          <h2 id="perros" className="text-xl">
            perros
          </h2>
          {mascotas.map((m) => (
            <FormularioMascota
              key={m.id}
              tutorId={id}
              inicial={m}
              ultimaVisita={m.ultimaVisita ? formatLongDate(new Date(m.ultimaVisita)) : null}
            />
          ))}
          <p className="mt-2 text-sm font-bold">Agregar un perro</p>
          <FormularioMascota tutorId={id} />
        </section>

        <Ticket as="section" aria-labelledby="enlace" className="flex flex-col gap-3">
          <h2 id="enlace" className="text-xl">
            enlace personal
          </h2>
          <EnlaceCliente tutorId={id} tutor={cliente.nombre.split(' ')[0]} inicial={enlace} />
        </Ticket>
      </div>
    </>
  )
}
