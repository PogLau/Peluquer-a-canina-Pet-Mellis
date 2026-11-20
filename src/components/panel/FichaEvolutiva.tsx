import type { ReactNode } from 'react'

import { TagChip } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { Ficha, Tendencia } from '@/lib/ficha'
import { formatLongDate, formatMoney, formatShortDate } from '@/lib/format'

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
              'h-3 w-2 rounded-[2px] border border-linea',
              n <= valor ? (valor <= 2 ? 'bg-aviso' : 'bg-verde') : 'bg-transparent',
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
            <tr key={fila.aspecto} className="border-t border-linea align-top">
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

/* ---------- La ficha completa, en UNA sola tarjeta ---------- */

type EtiquetaFicha = { nombre: string; tipo: 'alerta' | 'info' }

export type DatosFicha = {
  numero: number
  nombre: string
  raza: string | null
  tamano: string
  manto: string
  pesoKg: number | null
  usuario: string
  cuidados: string | null
  etiquetas: EtiquetaFicha[]
}

/** Una visita tal como la guarda el panel (la más reciente primero). */
export type VisitaEntrada = {
  id: number
  fecha: string
  servicios: string[]
  precioFinal: number | null
  etiquetas: EtiquetaFicha[]
  resumenTutor: string | null
  notaInterna: string | null
  recomendacion: string | null
}

function Etiquetas({ lista }: { lista: EtiquetaFicha[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {lista.map((e) => (
        <li key={e.nombre}>
          <TagChip kind={e.tipo}>{e.nombre}</TagChip>
        </li>
      ))}
    </ul>
  )
}

/** Título de cada parte de la ficha: rótulo verde y una línea que la separa de la anterior. */
function Parte({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 border-t border-linea px-5 py-5">
      <h3 id={id} className="rotulo text-verde-oscuro">
        {titulo}
      </h3>
      {children}
    </section>
  )
}

/**
 * Ficha evolutiva completa en una sola tarjeta:
 * nombre del animal y sus datos, cómo se comportó, los valores marcados (puntajes por aspecto)
 * y el registro de cada visita. `recomendacion` y `acciones` son los controles del panel.
 */
export function FichaTarjeta({
  datos,
  ficha,
  visitas,
  recomendacion,
  acciones,
}: {
  datos: DatosFicha
  ficha: Ficha
  visitas: VisitaEntrada[]
  recomendacion?: ReactNode
  acciones?: (visita: VisitaEntrada) => ReactNode
}) {
  const ultima = visitas[0] ?? null
  const datosLinea = [
    datos.raza,
    datos.tamano,
    datos.manto ? `manto ${datos.manto.toLowerCase()}` : null,
    datos.pesoKg ? `${datos.pesoKg} kg` : null,
  ].filter(Boolean)

  return (
    <article
      aria-labelledby="ficha"
      className="overflow-hidden rounded-md border border-linea bg-superficie shadow-ticket"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 bg-verde-oscuro px-5 py-2.5 text-blanco">
        <p className="rotulo">Ficha evolutiva · Pet Mellis</p>
        <p className="rotulo cifras">Nº {String(datos.numero).padStart(4, '0')}</p>
      </header>

      {/* 1. El animal */}
      <div className="flex flex-col gap-2 px-5 py-5">
        <h2 id="ficha" className="text-3xl">
          {datos.nombre}
        </h2>
        <p className="text-texto-suave">{datosLinea.join(' · ')}</p>
        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <div className="flex gap-1.5">
            <dt className="text-texto-suave">Usuario:</dt>
            <dd className="font-medium">{datos.usuario}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-texto-suave">Visitas:</dt>
            <dd className="font-medium">{visitas.length}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-texto-suave">Última visita:</dt>
            <dd className="font-medium">
              {ultima ? formatShortDate(new Date(ultima.fecha)) : 'todavía no vino'}
            </dd>
          </div>
        </dl>
      </div>

      {/* 2. Cómo se comportó */}
      <Parte id="ficha-comportamiento" titulo="Cómo se comportó">
        {ultima && ultima.etiquetas.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-texto-suave">
              En la última visita ({formatLongDate(new Date(ultima.fecha))}):
            </p>
            <Etiquetas lista={ultima.etiquetas} />
          </div>
        ) : (
          <p className="text-sm text-texto-suave">
            {ultima
              ? 'En la última visita no se marcó nada fuera de lo común.'
              : 'Todavía sin visitas.'}
          </p>
        )}
        {(datos.cuidados || datos.etiquetas.length > 0) && (
          <div className="flex flex-col gap-1.5 rounded-sm bg-durazno px-3 py-2.5">
            <p className="text-sm font-bold">{datos.cuidados || 'Tener en cuenta siempre:'}</p>
            {datos.etiquetas.length > 0 && <Etiquetas lista={datos.etiquetas} />}
          </div>
        )}
      </Parte>

      {/* 3. Valores marcados */}
      <Parte id="ficha-valores" titulo="Valores marcados (de 1 a 5, por visita)">
        <FichaEvolutiva ficha={ficha} />
        {recomendacion}
      </Parte>

      {/* 4. Registro de visitas */}
      <Parte id="ficha-visitas" titulo="Registro de visitas">
        {visitas.length === 0 ? (
          <p className="text-sm text-texto-suave">
            Cuando registres la primera atención, aparece acá.
          </p>
        ) : (
          <ol className="flex flex-col divide-y divide-linea">
            {visitas.map((v, i) => (
              <li key={v.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                <p className="font-bold">
                  <span className="rotulo mr-2 text-verde-oscuro">Visita {visitas.length - i}</span>
                  {formatLongDate(new Date(v.fecha))}
                </p>
                <dl className="grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[160px_minmax(0,1fr)]">
                  <dt className="text-texto-suave">Servicios</dt>
                  <dd>{v.servicios.length ? v.servicios.join(' + ') : 'Sin dato'}</dd>
                  <dt className="text-texto-suave">Precio final</dt>
                  <dd className="cifras">
                    {v.precioFinal !== null ? formatMoney(v.precioFinal) : 'Sin dato'}
                  </dd>
                  {v.etiquetas.length > 0 && (
                    <>
                      <dt className="text-texto-suave">Comportamiento</dt>
                      <dd>
                        <Etiquetas lista={v.etiquetas} />
                      </dd>
                    </>
                  )}
                  {v.resumenTutor && (
                    <>
                      <dt className="text-texto-suave">Para el usuario</dt>
                      <dd>{v.resumenTutor}</dd>
                    </>
                  )}
                  {v.notaInterna && (
                    <>
                      <dt className="text-texto-suave">Nota interna</dt>
                      <dd>{v.notaInterna}</dd>
                    </>
                  )}
                  {v.recomendacion && (
                    <>
                      <dt className="text-texto-suave">Para la próxima</dt>
                      <dd>{v.recomendacion}</dd>
                    </>
                  )}
                </dl>
                {acciones && <div className="pt-1">{acciones(v)}</div>}
              </li>
            ))}
          </ol>
        )}
      </Parte>
    </article>
  )
}
