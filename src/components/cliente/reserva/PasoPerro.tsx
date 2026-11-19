'use client'

import { ChipGroup, Icon, LinkButton, TextField } from '@/components/ui'
import type { EstadoReserva } from '@/lib/cliente/pasos'
import type { MascotaDelTutor } from '@/lib/cliente/reserva'
import { coatLabels, coats, sizeLabels, sizes, type Coat, type Size } from '@/lib/pricing'

type Props = {
  estado: EstadoReserva
  set: (patch: Partial<EstadoReserva>) => void
  tutor: string | null
  mascotas: MascotaDelTutor[]
}

const NUEVA = 'nueva'

/** Paso 1: quién sos y qué perro viene. Con enlace personal se elige uno de los suyos. */
export function PasoPerro({ estado, set, tutor, mascotas }: Props) {
  // Aviso si el «otro perro» se llama igual que uno ya guardado (la reserva actualiza a ese perro)
  const repetido = mascotas.find(
    (m) => m.nombre.trim().toLowerCase() === estado.nueva.nombre.trim().toLowerCase(),
  )
  const setNueva = (patch: Partial<EstadoReserva['nueva']>) =>
    set({ nueva: { ...estado.nueva, ...patch } })

  return (
    <div className="flex flex-col gap-6">
      {tutor ? (
        <p className="text-base">
          Hola, <strong>{tutor.split(' ')[0]}</strong>. Elegí qué perro viene.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Tu nombre"
            autoComplete="name"
            value={estado.tutorNombre}
            onChange={(e) => set({ tutorNombre: e.target.value })}
          />
          <TextField
            label="Tu WhatsApp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="11 2233 4455"
            value={estado.whatsapp}
            onChange={(e) => set({ whatsapp: e.target.value })}
            hint="Te confirmamos el turno por acá."
          />
        </div>
      )}

      {mascotas.length > 0 && (
        <ChipGroup
          legend="Tu perro"
          name="mascota"
          options={[
            ...mascotas.map((m) => ({
              value: String(m.id),
              label: m.nombre,
              detail: m.raza ?? sizeLabels[m.tamano].label,
            })),
            { value: NUEVA, label: 'Otro perro', icon: 'mas' as const },
          ]}
          value={estado.mascotaId === null ? NUEVA : String(estado.mascotaId)}
          onChange={(v) => set({ mascotaId: v === NUEVA ? null : Number(v) })}
        />
      )}

      {estado.mascotaId === null && (
        <div className="flex flex-col gap-5">
          {/* Perro nuevo: opción de volver a escanearlo con IA para conocer tamaño y pelaje */}
          <div className="flex flex-col gap-3 rounded-md border-2 border-dashed border-linea bg-superficie-alt p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm">
              <Icon name="escaner" size={20} className="mt-0.5 text-verde" />
              <span>
                <strong>¿No sabés su tamaño o tipo de pelaje?</strong> Escanealo con IA y después reservá con
                los datos cargados.
              </span>
            </p>
            <LinkButton href="/cotizar#escaneo" variant="secondary" size="small" icon="escaner" className="shrink-0">
              Escanear con IA
            </LinkButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Nombre de tu perro"
              value={estado.nueva.nombre}
              onChange={(e) => setNueva({ nombre: e.target.value })}
              hint={
                repetido
                  ? `Ya tenés un perro llamado ${repetido.nombre}. Si es el mismo, elegilo arriba; si seguís, actualizamos su tamaño y su manto con lo que marques acá.`
                  : undefined
              }
            />
            <TextField
              label="Raza"
              optional
              placeholder="Caniche, mestizo…"
              value={estado.nueva.raza}
              onChange={(e) => setNueva({ raza: e.target.value })}
            />
          </div>
          <ChipGroup
            legend="Tamaño"
            name="tamano"
            options={sizes.map((s) => ({
              value: s,
              label: sizeLabels[s].label,
              detail: sizeLabels[s].detail,
            }))}
            value={estado.nueva.tamano}
            onChange={(v) => setNueva({ tamano: v as Size })}
          />
          <ChipGroup
            legend="Manto"
            name="manto"
            options={coats.map((c) => ({ value: c, label: coatLabels[c] }))}
            value={estado.nueva.manto}
            onChange={(v) => setNueva({ manto: v as Coat })}
          />
        </div>
      )}
    </div>
  )
}
