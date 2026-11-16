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
