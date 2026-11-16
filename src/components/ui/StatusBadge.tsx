import { cn } from '@/lib/cn'

export const appointmentStatuses = [
  'solicitado',
  'confirmado',
  'en_atencion',
  'listo',
  'finalizado',
  'cancelado',
] as const

export type AppointmentStatus = (typeof appointmentStatuses)[number]

const config: Record<AppointmentStatus, { label: string; classes: string }> = {
  solicitado: { label: 'Solicitado', classes: 'bg-aviso-fondo text-aviso' },
  confirmado: { label: 'Confirmado', classes: 'bg-exito-fondo text-exito' },
  en_atencion: { label: 'En atención', classes: 'bg-info-fondo text-info' },
  listo: { label: 'Listo para retirar', classes: 'bg-exito-fondo text-exito' },
  finalizado: { label: 'Finalizado', classes: 'bg-superficie-alt text-texto-suave' },
  cancelado: { label: 'Cancelado', classes: 'bg-peligro-fondo text-peligro' },
}

export function statusLabel(status: AppointmentStatus) {
  return config[status].label
}

/** Insignia de estado de turno. El color nunca es la única señal: siempre va el texto. */
export function StatusBadge({ status, className }: { status: AppointmentStatus; className?: string }) {
  const { label, classes } = config[status]
  return (
    <span className={cn('rotulo inline-flex items-center rounded-pill px-2.5 py-1', classes, className)}>
      {label}
    </span>
  )
}
