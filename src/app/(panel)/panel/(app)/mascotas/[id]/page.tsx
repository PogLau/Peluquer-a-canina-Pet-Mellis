import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EditarRecomendacion } from '@/components/panel/EditarRecomendacion'
import { guardarRecomendacion } from '../../acciones'
import { EnlaceCliente } from '@/components/panel/EnlaceCliente'
import { FichaDatos, FichaEvolutiva, VisitaFicha } from '@/components/panel/FichaEvolutiva'
import { ReenviarResumen } from '@/components/panel/ReenviarResumen'
import {
  EmptyState,
  Icon,
  LinkButton,
  PageHeader,
  StatusBadge,
  Ticket,
} from '@/components/ui'
import { enlaceDeTutor } from '@/lib/enlace-cliente'
import { formatLongDate, formatTime } from '@/lib/format'
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
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-verde-oscuro"
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
            <p className="rotulo text-verde-oscuro">Cada visita mejora la siguiente</p>
            <h2 id="ficha" className="text-2xl">
              ficha evolutiva
            </h2>
          </div>
          <FichaDatos
            datos={{
              numero: mascota.id,
              nombre: mascota.nombre,
              raza: mascota.raza || null,
              tamano: sizeLabels[mascota.tamano as Size]?.label ?? '',
              manto: coatLabels[mascota.manto as Coat] ?? '',
              pesoKg: mascota.pesoKg ?? null,
              usuario: tutor.nombre,
              cuidados: mascota.cuidadosEspeciales || null,
              etiquetas: mascota.etiquetas.map((e) => ({ nombre: e.nombre, tipo: e.tipo })),
              visitas: atenciones.length,
              ultimaVisita: ultima?.fecha ?? null,
            }}
          />
          <section aria-labelledby="evolucion" className="flex flex-col gap-3">
            <h3 id="evolucion" className="text-xl">
              evolución por aspecto
            </h3>
            <FichaEvolutiva ficha={ficha} />
          </section>
          {ultima && (
            <EditarRecomendacion
              guardar={guardarRecomendacion}
              key={ultima.id}
              atencionId={ultima.id}
              inicial={ultima.recomendacion ?? ''}
              sugerida={perfil.recomendacionSugerida}
            />
          )}
          <section aria-labelledby="registro" className="flex flex-col gap-3">
            <h3 id="registro" className="text-xl">
              registro de visitas
            </h3>
            {atenciones.length === 0 ? (
              <EmptyState icon="libreta" title="sin visitas registradas">
                Cuando registres la primera atención, aparece acá.
              </EmptyState>
            ) : (
              <ol className="flex flex-col gap-4">
                {atenciones.map((a, i) => (
                  <li key={a.id}>
                    <VisitaFicha
                      visita={{ ...a, numero: atenciones.length - i }}
                      acciones={<ReenviarResumen atencionId={a.id} mascota={mascota.nombre} />}
                    />
                  </li>
                ))}
              </ol>
            )}
          </section>
        </Ticket>

        {enlace && (
          <Ticket as="section" aria-labelledby="enlace" className="flex flex-col gap-3">
            <h2 id="enlace" className="text-xl">
              enlace de {tutor.nombre.split(' ')[0]}
            </h2>
            <EnlaceCliente tutorId={tutor.id} tutor={tutor.nombre.split(' ')[0]} inicial={enlace} />
          </Ticket>
        )}

      </div>
    </>
  )
}
