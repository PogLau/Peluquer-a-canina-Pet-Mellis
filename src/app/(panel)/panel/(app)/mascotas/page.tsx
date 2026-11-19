import type { Metadata } from 'next'
import Link from 'next/link'

import { Button, EmptyState, Icon, PageHeader, TagChip, Ticket } from '@/components/ui'
import { coatLabels, sizeLabels, type Coat, type Size } from '@/lib/pricing'
import { searchPets } from '@/lib/panel/mascotas'
import { requireStaff } from '@/lib/panel/sesion'

export const metadata: Metadata = { title: 'Mascotas' }

export default async function MascotasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { payload, user } = await requireStaff()
  const q = (await searchParams).q?.trim() ?? ''
  const mascotas = await searchPets(payload, user, q)

  return (
    <>
      <PageHeader eyebrow="Fichas" title="mascotas">
        Buscá por el nombre del perro, la raza o el tutor.
      </PageHeader>

      <form role="search" action="/panel/mascotas" className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor="buscar-mascota" className="text-sm font-bold">
            Buscar
          </label>
          <input
            id="buscar-mascota"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Toby, caniche, Laura…"
            autoComplete="off"
            className="min-h-12 w-full rounded-sm border-2 border-tinta bg-superficie px-3 text-base text-texto placeholder:text-texto-suave"
          />
        </div>
        <Button type="submit" icon="buscar">
          Buscar
        </Button>
      </form>

      {mascotas.length === 0 ? (
        <EmptyState icon="pata" title={q ? 'sin resultados' : 'todavía no hay mascotas'}>
          {q
            ? `No encontramos «${q}». Probá con otra parte del nombre.`
            : 'Las mascotas se cargan al reservar un turno.'}
        </EmptyState>
      ) : (
        <>
          <p className="mb-3 text-sm text-texto-suave" role="status">
            {mascotas.length} {mascotas.length === 1 ? 'mascota' : 'mascotas'}
            {q && ` para «${q}»`}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {mascotas.map((m) => (
              <li key={m.id}>
                <Ticket size="small" className="h-full">
                  <Link
                    href={`/panel/mascotas/${m.id}`}
                    className="flex h-full flex-col gap-2 rounded-sm p-1 focus-visible:outline-offset-4"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-display text-xl">{m.nombre}</span>
                      <Icon name="flecha" size={20} />
                    </span>
                    <span className="text-sm text-texto-suave">
                      {[m.raza, sizeLabels[m.tamano as Size]?.label, coatLabels[m.manto as Coat]]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    <span className="text-sm">Tutor: {m.tutor}</span>
                    {m.alertas.length > 0 && (
                      <span className="flex flex-wrap gap-1.5">
                        {m.alertas.map((a) => (
                          <TagChip key={a} kind="alerta">
                            {a}
                          </TagChip>
                        ))}
                      </span>
                    )}
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
