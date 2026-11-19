import { formatShortDate } from '@/lib/format'
import type { Ficha, Tendencia } from '@/lib/ficha'
import { cn } from '@/lib/cn'

const tendencias: Record<Tendencia, string> = {
  mejora: 'mejora',
  empeora: 'empeora',
  igual: 'igual',
}

/** Puntaje de 1 a 5 como cinco marcas, con el número para lectores de pantalla y para leer rápido. */
function Puntaje({ valor }: { valor: number | null }) {
  if (valor === null) return <span className="text-sm text-texto-suave">—</span>
  return (
    <span className="inline-flex items-center gap-2" aria-label={`${valor} de 5`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              'h-3 w-2 rounded-[2px] border border-tinta',
              n <= valor ? (valor <= 2 ? 'bg-aviso' : 'bg-amarillo') : 'bg-transparent',
            )}
          />
        ))}
      </span>
      <span className="cifras text-sm font-bold" aria-hidden="true">
        {valor}
      </span>
    </span>
  )
}

/** Tabla de la Ficha Evolutiva: últimas visitas por aspecto y la decisión para la próxima. */
export function FichaEvolutiva({ ficha }: { ficha: Ficha }) {
  if (ficha.fechas.length === 0) {
    return (
      <p className="text-sm text-texto-suave">
        Todavía no hay atenciones con puntajes. Se arma sola desde la primera visita.
      </p>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">
          Puntajes de 1 (le costó mucho) a 5 (muy bien) en las últimas visitas
        </caption>
        <thead>
          <tr className="bg-superficie-alt">
            <th scope="col" className="rotulo px-3 py-2">
              Aspecto
            </th>
            {ficha.fechas.map((f, i) => (
              <th key={f} scope="col" className="rotulo px-3 py-2">
                {i === ficha.fechas.length - 1 ? 'Última' : `Visita ${i + 1}`}
                <span className="block font-normal normal-case tracking-normal">
                  {formatShortDate(new Date(f))}
                </span>
              </th>
            ))}
            <th scope="col" className="rotulo px-3 py-2">
              Próxima vez
            </th>
          </tr>
        </thead>
        <tbody>
          {ficha.filas.map((fila) => (
            <tr key={fila.aspecto} className="border-t-2 border-linea align-top">
              <th scope="row" className="px-3 py-3 font-bold">
                {fila.label}
                {fila.tendencia && (
                  <span
                    className={cn(
                      'rotulo mt-1 block',
                      fila.tendencia === 'mejora'
                        ? 'text-exito'
                        : fila.tendencia === 'empeora'
                          ? 'text-peligro'
                          : 'text-texto-suave',
                    )}
                  >
                    {tendencias[fila.tendencia]}
                  </span>
                )}
              </th>
              {fila.valores.map((v, i) => (
                <td key={ficha.fechas[i]} className="px-3 py-3">
                  <Puntaje valor={v} />
                </td>
              ))}
              <td
                className={cn('px-3 py-3', fila.atencion ? 'font-bold text-aviso' : 'text-texto')}
              >
                {fila.decision}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
