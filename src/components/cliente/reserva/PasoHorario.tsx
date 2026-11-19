'use client'

import { ChipGroup, EmptyState } from '@/components/ui'
import type { DiaLibre } from '@/lib/agenda'
import type { EstadoReserva } from '@/lib/cliente/pasos'

type Props = {
  estado: EstadoReserva
  set: (patch: Partial<EstadoReserva>) => void
  dias: DiaLibre[]
  whatsappLocal: string | null
}

/** Paso 3: solo se muestran días y horarios libres (el servidor lo vuelve a chequear al confirmar). */
export function PasoHorario({ estado, set, dias, whatsappLocal }: Props) {
  if (dias.length === 0) {
    return (
      <EmptyState icon="calendario" title="no quedan horarios libres">
        En las próximas dos semanas está todo ocupado.
        {whatsappLocal && (
          <>
            {' '}
            <a
              href={whatsappLocal}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline underline-offset-4"
            >
              Escribinos por WhatsApp
            </a>{' '}
            y te buscamos un lugar.
          </>
        )}
      </EmptyState>
    )
  }

  const dia = dias.find((d) => d.fecha === estado.fecha) ?? null

  return (
    <div className="flex flex-col gap-6">
      <ChipGroup
        legend="Día"
        name="dia"
        scroll
        options={dias.map((d) => ({
          value: d.fecha,
          label: d.etiqueta,
          detail: `${d.horas.length} horarios`,
        }))}
        value={estado.fecha}
        onChange={(fecha) => set({ fecha, fechaHora: null })}
      />
      {dia ? (
        <ChipGroup
          legend={`Horario del ${dia.etiqueta}`}
          name="hora"
          options={dia.horas.map((h) => ({ value: h.iso, label: h.hora }))}
          value={estado.fechaHora}
          onChange={(fechaHora) => set({ fechaHora })}
        />
      ) : (
        <p className="text-sm text-texto-suave">Elegí un día para ver los horarios.</p>
      )}
    </div>
  )
}
