import { appointmentStatuses, statusLabel } from '../lib/estados'
import { coatLabels, coats, knots, knotsLabels, sizeLabels, sizes } from '../lib/pricing'

/* Opciones compartidas por colecciones, pricing.ts y la interfaz: una sola fuente. */

export const sizeOptions = sizes.map((value) => ({
  value,
  label: `${sizeLabels[value].label} (${sizeLabels[value].detail})`,
}))

export const coatOptions = coats.map((value) => ({ value, label: coatLabels[value] }))

export const knotsOptions = knots.map((value) => ({ value, label: knotsLabels[value] }))

export const statusOptions = appointmentStatuses.map((value) => ({ value, label: statusLabel(value) }))

export const scoreAspects = [
  { name: 'secador', label: 'Secador' },
  { name: 'unas', label: 'Uñas' },
  { name: 'bano', label: 'Baño' },
  { name: 'desenredado', label: 'Desenredado' },
] as const
