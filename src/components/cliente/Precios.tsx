import { formatMoney } from '@/lib/format'
import type { Quote } from '@/lib/pricing'

/** Total del presupuesto: un único precio fijo. */
export function TotalPresupuesto({ quote, label = 'Total' }: { quote: Pick<Quote, 'total'>; label?: string }) {
  return (
    <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1" aria-live="polite">
      <span className="rotulo">{label}</span>
      <span className="cifras whitespace-nowrap font-display text-2xl font-bold">{formatMoney(quote.total)}</span>
    </p>
  )
}

/** Nota sobre el precio fijo. */
export function NotaPrecios() {
  return (
    <p className="text-xs text-texto-suave">
      Precio fijo según el tamaño y los servicios elegidos. Si al ver a tu perro hace falta algo más, te
      lo avisamos antes de empezar.
    </p>
  )
}
