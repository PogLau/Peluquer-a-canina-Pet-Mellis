import { scoreAspects } from '@/collections/options'

/*
  Ficha Evolutiva: compara las últimas visitas por aspecto (secador, uñas, baño, desenredado)
  y propone cómo encarar la próxima. La peluquera siempre puede editar la recomendación.
*/

export type Aspecto = (typeof scoreAspects)[number]['name']
export type Puntajes = Partial<Record<Aspecto, number | null>>
export type Tendencia = 'mejora' | 'empeora' | 'igual'

export type VisitaFicha = { fecha: string; puntajes?: Puntajes | null }

export type FilaFicha = {
  aspecto: Aspecto
  label: string
  /** Un valor por visita (de la más vieja a la más nueva); null si no se registró. */
  valores: Array<number | null>
  tendencia: Tendencia | null
  decision: string
  /** true si conviene mirarlo antes de empezar. */
  atencion: boolean
}

export type Ficha = { fechas: string[]; filas: FilaFicha[] }

const MAX_VISITAS = 3

function decidir(valores: number[]): {
  decision: string
  tendencia: Tendencia | null
  atencion: boolean
} {
  if (valores.length === 0)
    return { decision: 'Sin registros todavía', tendencia: null, atencion: false }
  const ultimo = valores[valores.length - 1]
  const previo = valores.length > 1 ? valores[valores.length - 2] : null
  const primero = valores[0]
  const tendencia: Tendencia | null =
    valores.length < 2 ? null : ultimo > primero ? 'mejora' : ultimo < primero ? 'empeora' : 'igual'

  if (ultimo <= 2) {
    return previo !== null && ultimo > previo
      ? { decision: 'Mejora, pero todavía le cuesta: seguir de a poco', tendencia, atencion: true }
      : { decision: 'Le cuesta: empezar por acá y con calma', tendencia, atencion: true }
  }
  if (ultimo === 3) {
    return tendencia === 'mejora'
      ? { decision: 'Viene mejorando: mantener la adaptación gradual', tendencia, atencion: true }
      : { decision: 'Regular: tenerlo en cuenta al empezar', tendencia, atencion: true }
  }
  if (previo !== null && previo <= 2) {
    return { decision: 'Mejoró mucho: repetir lo de la última vez', tendencia, atencion: false }
  }
  return { decision: 'Sin problemas', tendencia, atencion: false }
}

/** Arma la ficha con las últimas 3 visitas que tengan algún puntaje. */
export function buildFicha(visitas: VisitaFicha[]): Ficha {
  const conPuntajes = visitas
    .filter((v) => v.puntajes && Object.values(v.puntajes).some((p) => typeof p === 'number'))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-MAX_VISITAS)

  const filas = scoreAspects.map(({ name, label }) => {
    const valores = conPuntajes.map((v) => v.puntajes?.[name] ?? null)
    const registrados = valores.filter((v): v is number => typeof v === 'number')
    return { aspecto: name, label, valores, ...decidir(registrados) }
  })
  return { fechas: conPuntajes.map((v) => v.fecha), filas }
}

/** Recomendación de partida para la próxima visita, a partir de la ficha. */
export function suggestRecommendation(ficha: Ficha): string {
  if (ficha.fechas.length === 0) return ''
  const pendientes = ficha.filas.filter((f) => f.atencion)
  if (pendientes.length === 0)
    return 'Todo anduvo bien en la última visita: repetir el mismo trabajo.'
  return pendientes
    .map((f) => `${f.label}: ${f.decision.charAt(0).toLowerCase()}${f.decision.slice(1)}.`)
    .join(' ')
}

/** Frase de «cómo se portó» para el tutor, a partir de los puntajes de la atención. */
export function suggestTutorSummary(nombre: string, puntajes: Puntajes): string {
  const bien = scoreAspects
    .filter((a) => (puntajes[a.name] ?? 0) >= 4)
    .map((a) => a.label.toLowerCase())
  const costo = scoreAspects
    .filter((a) => typeof puntajes[a.name] === 'number' && (puntajes[a.name] as number) <= 2)
    .map((a) => a.label.toLowerCase())
  const lista = (items: string[]) =>
    items.length > 1 ? `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}` : items[0]
  const partes: string[] = []
  if (bien.length) partes.push(`${nombre} se portó muy bien con ${lista(bien)}.`)
  if (costo.length) partes.push(`Le costó ${lista(costo)}; la próxima vamos de a poco.`)
  return partes.join(' ')
}
