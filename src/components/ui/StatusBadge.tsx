import { cn } from '@/lib/cn'
import { statusLabel, type AppointmentStatus } from '@/lib/estados'

export { appointmentStatuses, statusLabel, type AppointmentStatus } from '@/lib/estados'

const classes: Record<AppointmentStatus, string> = {
  solicitado: 'bg-aviso-fondo text-aviso',
  confirmado: 'bg-exito-fondo text-exito',
  en_atencion: 'bg-info-fondo text-info',
  listo: 'bg-exito-fondo text-exito',
  finalizado: 'bg-superficie-alt text-texto-suave',
  cancelado: 'bg-peligro-fondo text-peligro',
}

/** Insignia de estado de turno. El color nunca es la única señal: siempre va el texto. */
export function StatusBadge({ status, className }: { status: AppointmentStatus; className?: string }) {
  return (
    <span className={cn('rotulo inline-flex items-center rounded-pill px-2.5 py-1', classes[status], className)}>
      {statusLabel(status)}
    </span>
  )
}
