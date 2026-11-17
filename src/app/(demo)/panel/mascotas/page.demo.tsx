'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

import { Cargando, EmptyState, Icon, PageHeader, TagChip, Ticket } from '@/components/ui'
import { rutasDemo } from '@/demo/AvanzarDemo'
import { FichaDemo } from '@/demo/FichaDemo'
import { useEstado } from '@/demo/store'
import { coatLabels, sizeLabels } from '@/lib/pricing'

function Buscador() {
  const s = useEstado()
  const [q, setQ] = useState('')
  const texto = q.trim().toLowerCase()
  const mascotas = s.mascotas
    .map((m) => ({ m, tutor: s.tutores.find((t) => t.id === m.tutorId)?.nombre ?? '' }))
    .filter(
      ({ m, tutor }) =>
        !texto || [m.nombre, m.raza, tutor].some((x) => x.toLowerCase().includes(texto)),
    )
    .sort((a, b) => a.m.nombre.localeCompare(b.m.nombre, 'es'))

  return (
    <>
      <PageHeader eyebrow="Fichas" title="mascotas">
        Buscá por el nombre del perro, la raza o el tutor.
      </PageHeader>
      <div role="search" className="mb-6 flex flex-col gap-1.5">
        <label htmlFor="buscar-mascota" className="text-sm font-bold">
          Buscar
        </label>
        <input
          id="buscar-mascota"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Toby, caniche, Sofía…"
          autoComplete="off"
          className="min-h-12 w-full rounded-sm border-2 border-tinta bg-superficie px-3 text-base text-texto placeholder:text-texto-suave"
        />
      </div>
      {mascotas.length === 0 ? (
        <EmptyState icon="pata" title="sin resultados">
          No encontramos «{q}». Probá con otra parte del nombre.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2" aria-live="polite">
          {mascotas.map(({ m, tutor }) => {
            const alertas = m.etiquetaIds
              .map((id) => s.etiquetas.find((e) => e.id === id))
              .filter((e) => e?.tipo === 'alerta')
            return (
              <li key={m.id}>
                <Ticket size="small" className="h-full">
                  <Link
                    href={rutasDemo.mascota(m.id)}
                    className="flex h-full flex-col gap-2 rounded-sm p-1"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-display text-xl lowercase">{m.nombre}</span>
                      <Icon name="flecha" size={20} />
                    </span>
                    <span className="text-sm text-texto-suave">
                      {[m.raza, sizeLabels[m.tamano].label, coatLabels[m.manto]]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    <span className="text-sm">Tutor: {tutor}</span>
                    {alertas.length > 0 && (
                      <span className="flex flex-wrap gap-1.5">
                        {alertas.map((e) => (
                          <TagChip key={e!.id} kind="alerta">
                            {e!.nombre}
                          </TagChip>
                        ))}
                      </span>
                    )}
                  </Link>
                </Ticket>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

function Contenido() {
  const id = Number(useSearchParams().get('id'))
  return Number.isInteger(id) && id > 0 ? <FichaDemo id={id} /> : <Buscador />
}

export default function MascotasDemo() {
  return (
    <Suspense fallback={<Cargando />}>
      <Contenido />
    </Suspense>
  )
}
