'use client'

import { EmptyState, LinkButton, Notice, PageHeader, TagChip, Ticket } from '@/components/ui'
import { libretaCliente } from '@/demo/selectores'
import { useEstado } from '@/demo/store'
import { OlvidarTelefonoDemo, SinEnlaceDemo } from '@/demo/AccesoDemo'
import { formatLongDate } from '@/lib/format'
import { coatLabels, sizeLabels, type Coat, type Size } from '@/lib/pricing'

export default function MiMascotaDemo() {
  const s = useEstado()
  const tutor = s.tutores.find((t) => t.id === s.clienteId)
  const mascotas = libretaCliente(s)

  return (
    <>
      <PageHeader volver
        eyebrow={tutor ? `Hola, ${tutor.nombre.split(' ')[0]}` : 'Sin enlace personal'}
        title="libreta de mi mascota"
      >
        Cómo le fue en cada visita y qué conviene para la próxima.
      </PageHeader>
      {!tutor && (
        <div className="mb-6">
          <SinEnlaceDemo />
        </div>
      )}

      {!tutor || mascotas.length === 0 ? (
        <EmptyState
          icon="pata"
          title={tutor ? 'todavía no hay perros cargados' : 'abrí tu enlace personal'}
        >
          {tutor
            ? 'Se cargan cuando reservás tu primer turno.'
            : 'Con tu enlace personal ves la libreta de tus perros, y solo la de ellos.'}
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-8">
          {mascotas.map((m) => (
            <Ticket
              as="section"
              key={m.id}
              aria-labelledby={`nombre-${m.id}`}
              className="flex flex-col gap-5"
            >
              <div>
                <h2 id={`nombre-${m.id}`} className="text-2xl">
                  <span className="normal-case">{m.nombre}</span>
                </h2>
                <p className="text-sm text-texto-suave">
                  {[
                    m.raza,
                    sizeLabels[m.tamano as Size]?.label,
                    `manto ${coatLabels[m.manto as Coat]?.toLowerCase()}`,
                    m.pesoKg ? `${m.pesoKg} kg` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              {m.proximaRecomendacion && (
                <Notice tone="info" title="Para la próxima visita">
                  {m.proximaRecomendacion}
                </Notice>
              )}
              {(m.cuidadosEspeciales || m.etiquetas.length > 0) && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg">cuidados</h3>
                  {m.cuidadosEspeciales && <p className="text-sm">{m.cuidadosEspeciales}</p>}
                  {m.etiquetas.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {m.etiquetas.map((e) => (
                        <li key={e}>
                          <TagChip>{e}</TagChip>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-3">
                <h3 className="text-lg">visitas</h3>
                {m.visitas.length === 0 ? (
                  <p className="text-sm text-texto-suave">Todavía no tiene visitas registradas.</p>
                ) : (
                  <ol className="flex flex-col divide-y-2 divide-linea">
                    {m.visitas.map((v) => (
                      <li key={v.id} className="flex flex-col gap-1 py-3 first:pt-0">
                        <p className="font-bold">{formatLongDate(new Date(v.fecha))}</p>
                        {v.servicios.length > 0 && (
                          <p className="text-sm text-texto-suave">{v.servicios.join(' + ')}</p>
                        )}
                        {v.resumenTutor && <p className="text-sm">{v.resumenTutor}</p>}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div>
                <LinkButton href="/reservar" size="small" variant="secondary" icon="calendario">
                  Reservar para {m.nombre}
                </LinkButton>
              </div>
            </Ticket>
          ))}
        </div>
      )}
      {tutor && <OlvidarTelefonoDemo nombre={tutor.nombre} />}
    </>
  )
}
