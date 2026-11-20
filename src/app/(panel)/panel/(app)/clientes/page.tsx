import type { Metadata } from 'next'
import Link from 'next/link'

import { Button, EmptyState, Icon, LinkButton, PageHeader, Ticket } from '@/components/ui'
import { formatLongDate } from '@/lib/format'
import { listClients } from '@/lib/panel/clientes'
import { requireStaff } from '@/lib/panel/sesion'

export const metadata: Metadata = { title: 'Usuarios' }

function formatPhone(digits: string): string {
  // 5491122334455 → +54 9 11 2233-4455 (solo para leer; se guarda sin formato)
  const m = /^549(\d{2})(\d{4})(\d{4})$/.exec(digits)
  return m ? `+54 9 ${m[1]} ${m[2]}-${m[3]}` : `+${digits}`
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { payload, user } = await requireStaff()
  const q = (await searchParams).q?.trim() ?? ''
  const clientes = await listClients(payload, user, q)

  return (
    <>
      <PageHeader
        eyebrow="Tutores"
        title="usuarios"
        actions={
          <LinkButton href="/panel/clientes/nuevo" size="small" icon="mas">
            Nuevo usuario
          </LinkButton>
        }
      >
        Buscá por nombre, teléfono o zona.
      </PageHeader>

      <form role="search" action="/panel/clientes" className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor="buscar-cliente" className="text-sm font-bold">
            Buscar
          </label>
          <input
            id="buscar-cliente"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Sofía, 1122, Merlo…"
            autoComplete="off"
            className="min-h-12 w-full rounded-sm border border-linea bg-superficie px-3 text-base text-texto placeholder:text-texto-suave"
          />
        </div>
        <Button type="submit" icon="buscar">
          Buscar
        </Button>
      </form>

      {clientes.length === 0 ? (
        <EmptyState icon="usuarios" title={q ? 'sin resultados' : 'todavía no hay usuarios'}>
          {q
            ? `No encontramos «${q}».`
            : 'Se cargan solos cuando alguien reserva, o con «Nuevo usuario».'}
        </EmptyState>
      ) : (
        <>
          <p className="mb-3 text-sm text-texto-suave" role="status">
            {clientes.length} {clientes.length === 1 ? 'usuario' : 'usuarios'}
            {q && ` para «${q}»`}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {clientes.map((c) => (
              <li key={c.id}>
                <Ticket size="small" className="h-full">
                  <Link
                    href={`/panel/clientes/${c.id}`}
                    className="flex h-full flex-col gap-1.5 rounded-sm p-1"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-display text-xl">{c.nombre}</span>
                      <Icon name="flecha" size={20} />
                    </span>
                    <span className="cifras text-sm">{formatPhone(c.whatsapp)}</span>
                    <span className="text-sm text-texto-suave">
                      {c.mascotas.length ? c.mascotas.join(', ') : 'Sin perros cargados'}
                      {c.zona && ` · ${c.zona}`}
                    </span>
                    <span className="text-sm">
                      {c.ultimaVisita
                        ? `Última visita: ${formatLongDate(new Date(c.ultimaVisita))}`
                        : 'Sin visitas todavía'}
                    </span>
                  </Link>
                </Ticket>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
