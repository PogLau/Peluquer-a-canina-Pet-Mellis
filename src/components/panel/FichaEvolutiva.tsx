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

/* ---------- Ficha de registro: encabezado con los datos del perro y entradas de cada visita ---------- */

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
  visitas: number
  ultimaVisita: string | null
}

/** Un campo rotulado de la ficha: rótulo chico arriba y el dato debajo, como en una ficha impresa. */
function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-linea px-4 py-3">
      <dt className="rotulo text-texto-suave">{rotulo}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  )
}

/** Encabezado de la ficha: número, datos del perro y cuidados, todo en campos rotulados. */
export function FichaDatos({ datos }: { datos: DatosFicha }) {
  return (
    <div className="overflow-hidden rounded-md border border-tinta">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-verde-oscuro px-4 py-2 text-blanco">
        <p className="rotulo">Ficha evolutiva · Pet Mellis</p>
        <p className="rotulo cifras">Nº {String(datos.numero).padStart(4, '0')}</p>
      </div>
      <dl className="grid sm:grid-cols-2 lg:grid-cols-4">
        <Campo rotulo="Nombre">{datos.nombre}</Campo>
        <Campo rotulo="Raza">{datos.raza || 'Sin dato'}</Campo>
        <Campo rotulo="Tamaño">{datos.tamano}</Campo>
        <Campo rotulo="Manto">{datos.manto}</Campo>
        <Campo rotulo="Peso">{datos.pesoKg ? `${datos.pesoKg} kg` : 'Sin dato'}</Campo>
        <Campo rotulo="Usuario">{datos.usuario}</Campo>
        <Campo rotulo="Visitas registradas">{datos.visitas}</Campo>
        <Campo rotulo="Última visita">
          {datos.ultimaVisita ? formatShortDate(new Date(datos.ultimaVisita)) : 'Todavía no vino'}
        </Campo>
      </dl>
      <div className="flex flex-col gap-2 bg-durazno px-4 py-3">
        <p className="rotulo text-texto-suave">Cuidados y comportamiento</p>
        <p className={cn('text-sm', datos.cuidados ? 'font-bold' : 'text-texto-suave')}>
          {datos.cuidados || 'Sin cuidados especiales anotados.'}
        </p>
        {datos.etiquetas.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {datos.etiquetas.map((e) => (
              <li key={e.nombre}>
                <TagChip kind={e.tipo}>{e.nombre}</TagChip>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export type VisitaRegistro = {
  numero: number
  fecha: string
  servicios: string[]
  precioFinal: number | null
  etiquetas: EtiquetaFicha[]
  resumenTutor: string | null
  notaInterna: string | null
  recomendacion: string | null
}

/** Entrada del registro de visitas: fecha y número arriba, y cada dato en su renglón rotulado. */
export function VisitaFicha({ visita, acciones }: { visita: VisitaRegistro; acciones?: ReactNode }) {
  const filas: Array<[string, ReactNode]> = [
    ['Servicios', visita.servicios.length ? visita.servicios.join(' + ') : 'Sin dato'],
    ['Precio final', visita.precioFinal !== null ? formatMoney(visita.precioFinal) : 'Sin dato'],
  ]
  if (visita.etiquetas.length)
    filas.push([
      'Comportamiento',
      <span key="e" className="flex flex-wrap gap-1.5">
        {visita.etiquetas.map((e) => (
          <TagChip key={e.nombre} kind={e.tipo}>
            {e.nombre}
          </TagChip>
        ))}
      </span>,
    ])
  if (visita.resumenTutor) filas.push(['Para el usuario', visita.resumenTutor])
  if (visita.notaInterna) filas.push(['Nota interna (solo el salón)', visita.notaInterna])
  if (visita.recomendacion) filas.push(['Para la próxima', visita.recomendacion])

  return (
    <article className="overflow-hidden rounded-md border border-linea bg-superficie">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-linea bg-superficie-alt px-4 py-2">
        <p className="font-bold">
          <span className="rotulo mr-2 text-verde-oscuro">Visita {visita.numero}</span>
          {formatLongDate(new Date(visita.fecha))}
        </p>
      </header>
      <dl className="divide-y divide-linea">
        {filas.map(([rotulo, valor]) => (
          <div key={rotulo} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
            <dt className="rotulo pt-0.5 text-texto-suave">{rotulo}</dt>
            <dd className="text-sm">{valor}</dd>
          </div>
        ))}
      </dl>
      {acciones && <div className="border-t border-linea px-4 py-3">{acciones}</div>}
    </article>
  )
}
