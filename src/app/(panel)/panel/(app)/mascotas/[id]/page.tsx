import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EditarRecomendacion } from '@/components/panel/EditarRecomendacion'
import { guardarRecomendacion } from '../../acciones'
import { EnlaceCliente } from '@/components/panel/EnlaceCliente'
import { FichaEvolutiva } from '@/components/panel/FichaEvolutiva'
import { ReenviarResumen } from '@/components/panel/ReenviarResumen'
import {
  EmptyState,
  Icon,
  LinkButton,
  Notice,
  PageHeader,
  StatusBadge,
  TagChip,
  Ticket,
} from '@/components/ui'
import { enlaceDeTutor } from '@/lib/enlace-cliente'
import { formatLongDate, formatMoney, formatTime } from '@/lib/format'
import { getPetProfile } from '@/lib/panel/mascotas'
import { requireStaff } from '@/lib/panel/sesion'
import { coatLabels, sizeLabels, type Coat, type Size } from '@/lib/pricing'
import { whatsappLink } from '@/lib/whatsapp'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Ficha' }

function waTutor(phone: string): string | null {
  try {
    return whatsappLink(phone)
  } catch {
    return null
  }
}

export default async function MascotaPage({ params }: Props) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()
  const { payload, user } = await requireStaff()
  const perfil = await getPetProfile(payload, user, id)
  if (!perfil) notFound()

  const { mascota, tutor, atenciones, ficha, proximos } = perfil
  const ultima = atenciones[0]
  const enlace = tutor.id ? await enlaceDeTutor(payload, tutor.id) : null
  const linkTutor = waTutor(tutor.whatsapp)
  const datos = [
    mascota.raza,
    sizeLabels[mascota.tamano as Size]?.label,
    `manto ${coatLabels[mascota.manto as Coat]?.toLowerCase()}`,
    mascota.pesoKg ? `${mascota.pesoKg} kg` : null,
  ].filter(Boolean)

  return (
    <>
      <Link
        href="/panel/mascotas"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-verde"
      >
        <Icon name="volver" size={18} /> Mascotas
      </Link>
      <PageHeader
        eyebrow={`Tutor: ${tutor.nombre}`}
        title={mascota.nombre}
        actions={
          linkTutor && (
            <LinkButton href={linkTutor} external variant="highlight" size="small" icon="whatsapp">
              Escribirle a {tutor.nombre.split(' ')[0]}
            </LinkButton>
          )
        }
      >
        {datos.join(' · ')}
      </PageHeader>

      <div className="flex flex-col gap-6">
        {(mascota.cuidadosEspeciales || mascota.etiquetas.length > 0) && (
          <section aria-labelledby="antes" className="flex flex-col gap-3">
            <h2 id="antes" className="text-xl">
              antes de empezar
            </h2>
            {mascota.cuidadosEspeciales && (
              <Notice tone="aviso" title={mascota.cuidadosEspeciales} />
            )}
            {mascota.etiquetas.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {mascota.etiquetas.map((e) => (
                  <li key={e.nombre}>
                    <TagChip kind={e.tipo}>{e.nombre}</TagChip>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {proximos.length > 0 && (
          <section aria-labelledby="proximos" className="flex flex-col gap-3">
            <h2 id="proximos" className="text-xl">
              próximos turnos
            </h2>
            <ul className="flex flex-col gap-3">
              {proximos.map((t) => (
                <li key={t.id}>
                  <Ticket
                    size="small"
                    className="flex flex-wrap items-center justify-between gap-3"
                  >
                    <span className="flex flex-col">
                      <span className="font-bold">
                        {formatLongDate(new Date(t.fechaHora))} ·{' '}
                        {formatTime(new Date(t.fechaHora))}
                      </span>
                      <span className="text-sm text-texto-suave">{t.servicios.join(' + ')}</span>
                    </span>
                    <span className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={t.estado} />
                      {t.estado === 'en_atencion' && (
                        <LinkButton href={`/panel/registrar/${t.id}`} size="small" icon="libreta">
                          Registrar atención
                        </LinkButton>
                      )}
                    </span>
                  </Ticket>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Ticket as="section" aria-labelledby="ficha" className="flex flex-col gap-5">
          <div>
            <p className="rotulo text-verde">Cada visita mejora la siguiente</p>
            <h2 id="ficha" className="text-2xl">
              ficha evolutiva
            </h2>
          </div>
          <FichaEvolutiva ficha={ficha} />
          {ultima && (
            <EditarRecomendacion
              guardar={guardarRecomendacion}
              key={ultima.id}
              atencionId={ultima.id}
              inicial={ultima.recomendacion ?? ''}
              sugerida={perfil.recomendacionSugerida}
            />
          )}
        </Ticket>

        {enlace && (
          <Ticket as="section" aria-labelledby="enlace" className="flex flex-col gap-3">
            <h2 id="enlace" className="text-xl">
              enlace de {tutor.nombre.split(' ')[0]}
            </h2>
            <EnlaceCliente tutorId={tutor.id} tutor={tutor.nombre.split(' ')[0]} inicial={enlace} />
          </Ticket>
        )}

        <section aria-labelledby="historial" className="flex flex-col gap-3">
          <h2 id="historial" className="text-xl">
            historial
          </h2>
          {atenciones.length === 0 ? (
            <EmptyState icon="libreta" title="sin atenciones">
              Cuando registres la primera atención, aparece acá.
            </EmptyState>
          ) : (
            <ol className="flex flex-col gap-4">
              {atenciones.map((a) => (
                <li key={a.id}>
                  <Ticket size="small" className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-bold">{formatLongDate(new Date(a.fecha))}</p>
                      {a.precioFinal !== null && (
                        <p className="cifras text-sm">{formatMoney(a.precioFinal)}</p>
                      )}
                    </div>
                    {a.servicios.length > 0 && <p className="text-sm">{a.servicios.join(' + ')}</p>}
                    {a.etiquetas.length > 0 && (
                      <p className="flex flex-wrap gap-1.5">
                        {a.etiquetas.map((e) => (
                          <TagChip key={e.nombre} kind={e.tipo}>
                            {e.nombre}
                          </TagChip>
                        ))}
                      </p>
                    )}
                    {a.resumenTutor && (
                      <p className="text-sm">
                        <span className="font-bold">Para el tutor: </span>
                        {a.resumenTutor}
                      </p>
                    )}
                    {a.notaInterna && (
                      <p className="text-sm text-texto-suave">
                        <span className="font-bold">Nota interna (solo el salón): </span>
                        {a.notaInterna}
                      </p>
                    )}
                    <div>
                      <ReenviarResumen atencionId={a.id} mascota={mascota.nombre} />
                    </div>
                  </Ticket>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  )
}
