'use client'

import { useMemo, useRef, useState, useTransition } from 'react'

import { Melli } from '@/components/marca/Mascota'
import { Button, LinkButton, Notice, Stepper, Ticket, BotonVolver } from '@/components/ui'
import type { DiaLibre } from '@/lib/agenda'
import type { Catalog } from '@/lib/catalogo'
import {
  initialBooking,
  missingInStep,
  pasosReserva,
  type EstadoReserva,
} from '@/lib/cliente/pasos'
import type { ErroresReserva, MascotaDelTutor, ReservaInput } from '@/lib/cliente/reserva'
import type { EstadoCotizacion } from '@/lib/cotizacion'
import { formatLongDate, formatMoney, formatTime } from '@/lib/format'
import { origenLabels, resumenEscaneo, type EscaneoTurno } from '@/lib/ia/cuidado'
import { buildQuote } from '@/lib/pricing'

import { PasoConfirmar } from './PasoConfirmar'
import { PasoHorario } from './PasoHorario'
import { PasoPerro } from './PasoPerro'
import { PasoServicios } from './PasoServicios'

type Props = {
  catalog: Catalog
  dias: DiaLibre[]
  tutor: string | null
  mascotas: MascotaDelTutor[]
  preset: Partial<EstadoCotizacion>
  whatsappLocal: string | null
  /** Acción del servidor en la app real; función local en la demo estática. */
  reservar: (
    input: ReservaInput,
    resumen: { mascota: string; servicios: string[] },
  ) => Promise<RespuestaReserva>
  misTurnosHref?: string
  /** Ficha de la consulta por foto que viene del cotizador: se guarda con el turno para la peluquera. */
  escaneo?: EscaneoTurno | null
}

export type RespuestaReserva =
  | { ok: true; precioEstimado: number; avisarLink: string | null; conEnlace: boolean }
  | { ok: false; error: string; errores?: ErroresReserva }

type Listo = {
  precio: number
  avisarLink: string | null
  conEnlace: boolean
  cuando: string
  mascota: string
}

const pasoDeError = {
  tutor: 0,
  whatsapp: 0,
  mascota: 0,
  servicios: 1,
  fechaHora: 2,
  notas: 3,
} as const

/** Reserva en 4 pasos. Cada paso dice qué falta; el servidor valida todo de nuevo al confirmar. */
export function AsistenteReserva({
  catalog,
  dias,
  tutor,
  mascotas,
  preset,
  whatsappLocal,
  reservar: reservarTurno,
  misTurnosHref = '/mis-turnos',
  escaneo = null,
}: Props) {
  const [estado, setEstado] = useState<EstadoReserva>(() => {
    // Sin servicio por defecto: solo trae los que se eligieron en el cotizador
    const inicial = initialBooking(preset, mascotas)
    // La raza que vio el escaneo precarga la del perro nuevo (se puede cambiar)
    if (escaneo && !inicial.nueva.raza && escaneo.raza !== 'Sin especificar') {
      return { ...inicial, nueva: { ...inicial.nueva, raza: escaneo.raza } }
    }
    return inicial
  })
  const [paso, setPaso] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [errorNotas, setErrorNotas] = useState<string | undefined>()
  const [listo, setListo] = useState<Listo | null>(null)
  const [pending, startTransition] = useTransition()
  const titulo = useRef<HTMLHeadingElement>(null)

  const set = (patch: Partial<EstadoReserva>) => {
    setEstado((e) => ({ ...e, ...patch }))
    setError(null)
  }
  const elegida = mascotas.find((m) => m.id === estado.mascotaId)
  // El precio se calcula desde el paso 2, cuando el tamaño ya es obligatorio: el respaldo no se ve
  const tamano = elegida?.tamano ?? estado.nueva.tamano ?? 'chico'
  const manto = elegida?.manto ?? estado.nueva.manto
  const nombreMascota = elegida?.nombre ?? (estado.nueva.nombre.trim() || 'tu perro')
  const quote = useMemo(
    () =>
      buildQuote(
        {
          tamano,
          manto,
          nudos: estado.nudos,
          servicioIds: estado.servicios,
          extraIds: estado.extras,
        },
        catalog,
        catalog.config,
      ),
    [tamano, manto, estado.nudos, estado.servicios, estado.extras, catalog],
  )
  const falta = missingInStep(paso, estado, !!tutor)

  function ir(n: number) {
    setPaso(n)
    setError(null)
    requestAnimationFrame(() => titulo.current?.focus())
  }

  function confirmar() {
    startTransition(async () => {
      const r = await reservarTurno(
        {
          tutorNombre: estado.tutorNombre,
          whatsapp: estado.whatsapp,
          mascotaId: estado.mascotaId,
          mascota:
            estado.mascotaId === null
              ? { ...estado.nueva, tamano: estado.nueva.tamano ?? '' }
              : null,
          servicios: estado.servicios,
          extras: estado.extras,
          nudos: estado.nudos,
          fechaHora: estado.fechaHora ?? '',
          notas: estado.notas,
          escaneo,
        },
        {
          mascota: nombreMascota,
          servicios: quote.lineas.filter((l) => l.tipo === 'servicio').map((l) => l.nombre),
        },
      )
      if (r.ok) {
        const f = new Date(estado.fechaHora!)
        setListo({
          precio: r.precioEstimado,
          avisarLink: r.avisarLink,
          conEnlace: r.conEnlace,
          cuando: `${formatLongDate(f)} a las ${formatTime(f)}`,
          mascota: nombreMascota,
        })
        return
      }
      setError(r.error)
      const campo = r.errores
        ? (Object.keys(r.errores)[0] as keyof typeof pasoDeError | undefined)
        : undefined
      if (campo === 'notas') setErrorNotas(r.errores?.notas)
      if (campo && pasoDeError[campo] !== paso) setPaso(pasoDeError[campo])
      if (campo === 'fechaHora') set({ fecha: null, fechaHora: null })
    })
  }

  if (listo) {
    return (
      <Ticket className="flex flex-col gap-5">
        <Melli pose="listo" size={112} title="Los mellis, recién bañados" />
        <Notice
          tone="exito"
          role="status"
          title={`Listo: pediste el turno de ${listo.mascota} para el ${listo.cuando}.`}
        >
          Precio: <span className="cifras font-bold">{formatMoney(listo.precio)}</span>. Te
          lo confirmamos por WhatsApp.
        </Notice>
        <div className="flex flex-wrap gap-3">
          {listo.avisarLink && (
            <LinkButton href={listo.avisarLink} external variant="highlight" icon="whatsapp">
              Avisar por WhatsApp
            </LinkButton>
          )}
          {listo.conEnlace && (
            <LinkButton href={misTurnosHref} variant="secondary" icon="reloj">
              Ver mis turnos
            </LinkButton>
          )}
        </div>
      </Ticket>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Stepper steps={pasosReserva} current={paso} />
      {escaneo && (
        <Notice tone="info" title="Reservás con los datos de IA Scan">
          {resumenEscaneo(escaneo)}. ({origenLabels[escaneo.origen]}.) La peluquera la ve con tu pedido.
        </Notice>
      )}
      <Ticket className="flex flex-col gap-6">
        <h2 ref={titulo} tabIndex={-1} className="text-2xl outline-none">
          {paso === 0 && !tutor ? 'tus datos y tu perro' : pasosReserva[paso].toLowerCase()}
        </h2>
        {paso === 0 && <PasoPerro estado={estado} set={set} tutor={tutor} mascotas={mascotas} />}
        {paso === 1 && (
          <PasoServicios
            estado={estado}
            set={set}
            catalog={catalog}
            quote={quote}
          />
        )}
        {paso === 2 && (
          <PasoHorario estado={estado} set={set} dias={dias} whatsappLocal={whatsappLocal} />
        )}
        {paso === 3 && (
          <PasoConfirmar
            estado={estado}
            set={set}
            tutor={tutor ?? estado.tutorNombre}
            mascota={nombreMascota}
            quote={quote}
            error={errorNotas}
          />
        )}

        {error && <Notice tone="peligro" role="alert" title={error} />}

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap justify-between gap-3">
            {paso > 0 ? (
              <Button variant="ghost" icon="volver" onClick={() => ir(paso - 1)}>
                Volver
              </Button>
            ) : (
              // En el primer paso, «Volver» lleva a la pantalla anterior (o al inicio)
              <BotonVolver />
            )}
            {paso < 3 ? (
              <Button
                iconEnd="flecha"
                disabled={!!falta}
                aria-describedby={falta ? 'falta-paso' : undefined}
                onClick={() => ir(paso + 1)}
              >
                Siguiente
              </Button>
            ) : (
              <Button icon="check" disabled={pending} onClick={confirmar}>
                {pending ? 'Pidiendo…' : 'Pedir turno'}
              </Button>
            )}
          </div>
          {falta && (
            <p id="falta-paso" className="text-right text-sm text-texto-suave" role="status">
              {falta}
            </p>
          )}
        </div>
      </Ticket>
    </div>
  )
}
