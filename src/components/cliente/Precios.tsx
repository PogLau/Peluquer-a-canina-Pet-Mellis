import { formatMoney } from '@/lib/format'
import type { Quote } from '@/lib/pricing'

/** Total del presupuesto como rango: «desde $X» grande y «hasta $Y» debajo. */
export function TotalRango({ quote, label = 'Total estimado' }: { quote: Pick<Quote, 'total' | 'totalHasta'>; label?: string }) {
  const hayRango = quote.totalHasta > quote.total
  return (
    <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1" aria-live="polite">
      <span className="rotulo">{label}</span>
      <span className="flex flex-col items-end">
        <span className="cifras font-display text-2xl font-bold">
          {hayRango && <span className="text-sm font-normal">desde </span>}
          {formatMoney(quote.total)}
        </span>
        {hayRango && (
          <span className="cifras text-sm text-texto-suave">hasta {formatMoney(quote.totalHasta)}</span>
        )}
      </span>
    </p>
  )
}

/** Nota de precios orientativos del tarifario. */
export function NotaPrecios() {
  return (
    <p className="text-xs text-texto-suave">
      Precios orientativos («desde»): el valor final se confirma al revisar el manto de tu perro en el local.
    </p>
  )
}
