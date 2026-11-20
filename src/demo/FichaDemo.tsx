'use client'

import Link from 'next/link'
import { useState } from 'react'

import { EditarRecomendacion } from '@/components/panel/EditarRecomendacion'
import { EnviarResumen } from '@/components/panel/EnviarResumen'
import { FichaDatos, FichaEvolutiva, VisitaFicha } from '@/components/panel/FichaEvolutiva'
import {
  Button,
  EmptyState,
  Icon,
  LinkButton,
  Modal,
  PageHeader,
  StatusBadge,
  Ticket,
} from '@/components/ui'
import { formatLongDate, formatTime } from '@/lib/format'
import { summaryMessage } from '@/lib/mensajes'
import type { AtencionPanel } from '@/lib/panel/mascotas'
import { coatLabels, sizeLabels } from '@/lib/pricing'
import { whatsappLink } from '@/lib/whatsapp'

import { enlaceDemo, guardarRecomendacion } from './acciones'
import { rutasDemo } from './AvanzarDemo'
import { fichaDe } from './selectores'
import { useEstado } from './store'

function Reenviar({
  a,
  mascota,
  tutor,
}: {
  a: AtencionPanel
  mascota: string
  tutor: { id: number; nombre: string; whatsapp: string }
}) {
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <Button size="small" variant="secondary" icon="whatsapp" onClick={() => setAbierto(true)}>
        Enviar resumen
      </Button>
      <Modal
        open={abierto}
        onClose={() => setAbierto(false)}
        title={
          <>
            resumen de {mascota}
          </>
        }
      >
        {abierto && (
          <EnviarResumen
            telefono={tutor.whatsapp}
            mensajeInicial={summaryMessage({
              tutor: tutor.nombre,
              mascota,
              fecha: new Date(a.fecha),
              servicios: a.servicios,
              resumenTutor: a.resumenTutor,
              recomendacion: a.recomendacion,
              enlace: enlaceDemo(tutor.id),
            })}
          />
        )}
      </Modal>
    </>
  )
}

/** Perfil de la mascota con la Ficha Evolutiva (versión demo de /panel/mascotas/[id]). */
export function FichaDemo({ id }: { id: number }) {
  const s = useEstado()
  const perfil = fichaDe(s, id)
  if (!perfil) {
    return (
      <EmptyState icon="pata" title="no encontramos ese perro">
        <Link href="/panel/mascotas" className="font-bold underline">
          Volver a Mascotas
        </Link>
      </EmptyState>
    )
  }
  const { mascota, tutor, etiquetas, atenciones, ficha, proximos } = perfil
  const ultima = atenciones[0]
  let linkTutor: string | null = null
  try {
    linkTutor = whatsappLink(tutor.whatsapp)
  } catch {
    linkTutor = null
  }

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
        {[
          mascota.raza,
          sizeLabels[mascota.tamano].label,
          `manto ${coatLabels[mascota.manto].toLowerCase()}`,
          mascota.pesoKg ? `${mascota.pesoKg} kg` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
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
                        <LinkButton href={rutasDemo.registrar(t.id)} size="small" icon="libreta">
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
              tamano: sizeLabels[mascota.tamano]?.label ?? '',
              manto: coatLabels[mascota.manto] ?? '',
              pesoKg: mascota.pesoKg ?? null,
              usuario: tutor.nombre,
              cuidados: mascota.cuidadosEspeciales || null,
              etiquetas: etiquetas.map((e) => ({ nombre: e.nombre, tipo: e.tipo })),
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
              key={ultima.id}
              atencionId={ultima.id}
              inicial={ultima.recomendacion ?? ''}
              sugerida={perfil.recomendacionSugerida}
              guardar={guardarRecomendacion}
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
                      acciones={<Reenviar a={a} mascota={mascota.nombre} tutor={tutor} />}
                    />
                  </li>
                ))}
              </ol>
            )}
          </section>
        </Ticket>

      </div>
    </>
  )
}
