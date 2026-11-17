/** Estados de un turno: solicitado → confirmado → en_atencion → listo → finalizado; o cancelado. */
export const appointmentStatuses = [
  'solicitado',
  'confirmado',
  'en_atencion',
  'listo',
  'finalizado',
  'cancelado',
] as const

export type AppointmentStatus = (typeof appointmentStatuses)[number]

const labels: Record<AppointmentStatus, string> = {
  solicitado: 'Solicitado',
  confirmado: 'Confirmado',
  en_atencion: 'En atención',
  listo: 'Listo para retirar',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
}

export function statusLabel(status: AppointmentStatus): string {
  return labels[status]
}

/** Paso siguiente del flujo del salón y el texto del botón que lo dispara. */
const siguiente: Partial<Record<AppointmentStatus, { estado: AppointmentStatus; accion: string }>> =
  {
    solicitado: { estado: 'confirmado', accion: 'Confirmar' },
    confirmado: { estado: 'en_atencion', accion: 'Iniciar' },
    en_atencion: { estado: 'listo', accion: 'Listo para retirar' },
    listo: { estado: 'finalizado', accion: 'Finalizar' },
  }

/** Siguiente estado del turno, o null si ya terminó (finalizado o cancelado). */
export function nextStatus(
  status: AppointmentStatus,
): { estado: AppointmentStatus; accion: string } | null {
  return siguiente[status] ?? null
}

/** Un turno se puede cancelar mientras no haya empezado la atención. */
export function canCancel(status: AppointmentStatus): boolean {
  return status === 'solicitado' || status === 'confirmado'
}
