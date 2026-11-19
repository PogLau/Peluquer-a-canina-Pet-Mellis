'use client'

import { useEffect, useId, useRef, useState } from 'react'

import { Icon, Notice, Ticket } from '@/components/ui'
import type { Catalog } from '@/lib/catalogo'
import { cn } from '@/lib/cn'
import type { EstadoCotizacion } from '@/lib/cotizacion'
import { origenLabels } from '@/lib/ia/cuidado'
import { ejemplosMascota } from '@/lib/ia/ejemplos'
import type { ResultadoSugerencia, Sugerencia } from '@/lib/ia/sugerencia'
import { rutaPublica } from '@/lib/ruta-publica'

import { CargaManual } from './CargaManual'
import { ResultadoEscaneo } from './ResultadoEscaneo'
import { pasosEscaneo, VisorEscaneo } from './VisorEscaneo'

type Props = {
  catalog: Catalog
  estado: EstadoCotizacion
  /** Hay IA real en el servidor (clave y modelo). En la demo estática, siempre false. */
  iaActiva: boolean
  analizar?: (data: FormData) => Promise<ResultadoSugerencia>
  /** Completa tamaño, manto y nudos del cotizador. */
  onSugerencia: (s: Sugerencia) => void
  /** Además carga los servicios y extras del tratamiento sugerido. */
  onUsarPlan: (s: Sugerencia) => void
}

type Foto = { src: string; alt: string; ejemplo: string | null }

/** Reduce la foto en el navegador (≤ 1024 px, JPEG) antes de mandarla: menos datos y más rápido. */
async function reducir(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const escala = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * escala)
    canvas.height = Math.round(bitmap.height * escala)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/jpeg', 0.85))
    return blob ? new File([blob], 'foto.jpg', { type: 'image/jpeg' }) : file
  } catch {
    return file
  }
}

const esperar = (ms: number) => new Promise((ok) => setTimeout(ok, ms))

/** IA Scan & Care: elegir o subir una foto, escanearla y armar la ficha de ingreso con su plan. */
export function IaScanCare({ catalog, estado, iaActiva: iaPedida, analizar, onSugerencia, onUsarPlan }: Props) {
  const iaActiva = iaPedida && !!analizar
  const inputId = useId()
  const [foto, setFoto] = useState<Foto | null>(null)
  const [paso, setPaso] = useState<number | null>(null)
  const [resultado, setResultado] = useState<Sugerencia | null>(null)
  const [manual, setManual] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [planAplicado, setPlanAplicado] = useState(false)
  // Cada escaneo tiene su número: si el usuario elige otra foto a mitad de camino, el viejo se descarta
  const corrida = useRef(0)
  const urlPropia = useRef<string | null>(null)

  useEffect(
    () => () => {
      if (urlPropia.current) URL.revokeObjectURL(urlPropia.current)
    },
    [],
  )

  function nuevaFoto(f: Foto) {
    if (urlPropia.current && urlPropia.current !== f.src) {
      URL.revokeObjectURL(urlPropia.current)
      urlPropia.current = null
    }
    setFoto(f)
    setResultado(null)
    setError(null)
    setManual(false)
    setPlanAplicado(false)
  }

  async function escanear(obtener: () => Promise<ResultadoSugerencia>) {
    const id = ++corrida.current
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pausa = reducido ? 250 : 650
    const analisis = obtener()
    for (let i = 0; i < pasosEscaneo.length; i++) {
      if (corrida.current !== id) return
      setPaso(i)
      await esperar(pausa)
    }
    const r = await analisis
    if (corrida.current !== id) return
    setPaso(pasosEscaneo.length)
    if (r.ok) {
      setResultado(r.sugerencia)
      onSugerencia(r.sugerencia)
    } else {
      setPaso(null)
      setError(r.mensaje)
    }
  }

  function elegirEjemplo(id: string) {
    const e = ejemplosMascota.find((x) => x.id === id)
    if (!e) return
    nuevaFoto({ src: rutaPublica(e.foto), alt: e.alt, ejemplo: e.id })
    void escanear(async () => ({ ok: true, sugerencia: e.sugerencia }))
  }

  function subirFoto(file: File | undefined) {
    if (!file) return
    corrida.current++
    const src = URL.createObjectURL(file)
    nuevaFoto({ src, alt: 'Foto de tu perro', ejemplo: null })
    urlPropia.current = src
    if (!iaActiva || !analizar) {
      // Sin IA no hay análisis: el tutor completa lo que ve (nada de resultados inventados)
      setPaso(null)
      setManual(true)
      return
    }
    void escanear(async () => {
      const data = new FormData()
      data.set('foto', await reducir(file))
      return analizar(data)
    })
  }

  function listoManual(s: Sugerencia) {
    setManual(false)
    setResultado(s)
    onSugerencia(s)
  }

  function usarPlan() {
    if (!resultado) return
    onUsarPlan(resultado)
    setPlanAplicado(true)
  }

  const escaneando = paso !== null && paso < pasosEscaneo.length

  return (
    <Ticket as="section" id="escaneo" aria-labelledby="titulo-escaneo" highlighted className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid size-10 place-items-center rounded-lg border-2 border-tinta bg-amarillo text-petroleo">
          <Icon name="escaner" />
        </span>
        <h2 id="titulo-escaneo" className="text-2xl">
          ia scan &amp; care
        </h2>
        <span className="rotulo rounded-pill bg-verde px-2.5 py-1 text-crema">Beta</span>
      </div>
      <p className="max-w-2xl">
        Elegí una foto y armamos la ficha de ingreso: raza, tamaño, tipo de pelaje, hidratación y
        nudos, con el tratamiento ideal y su precio.
      </p>
      <Notice tone="info" title={iaActiva ? 'Las fotos de ejemplo están preparadas' : 'Modo demo: no se analizan imágenes'}>
        {iaActiva
          ? 'Cada ejemplo tiene su ficha cargada a mano. Si subís una foto propia, la analiza la IA (beta): revisá los datos, los podés cambiar.'
          : 'Cada foto de ejemplo tiene su ficha cargada a mano para mostrar el recorrido. Si subís una foto tuya, marcás vos lo que ves y armamos el mismo plan.'}
      </Notice>

      <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start">
        {foto ? (
          <VisorEscaneo
            src={foto.src}
            alt={foto.alt}
            paso={manual ? null : paso}
            rotulo={resultado ? origenLabels[resultado.origen] : manual ? 'Sin análisis' : undefined}
          />
        ) : (
          <div className="escaneo-grilla grid aspect-square place-items-center rounded-md border-2 border-dashed border-tinta bg-superficie p-6 text-center">
            <span className="flex flex-col items-center gap-2 text-texto-suave">
              <Icon name="camara" size={40} />
              Elegí una foto de abajo o subí la de tu perro.
            </span>
          </div>
        )}

        <div aria-live="polite" className="flex min-w-0 flex-col gap-4">
          {error && (
            <Notice tone="peligro" title="No pudimos usar la foto">
              {error}
            </Notice>
          )}
          {escaneando && <p className="font-bold">Analizando… {pasosEscaneo[paso]}.</p>}
          {manual && (
            <>
              <Notice tone="aviso" title="Esta foto no se analiza">
                En esta versión no hay IA conectada. Marcá lo que ves en la foto y te mostramos el plan.
              </Notice>
              <CargaManual onListo={listoManual} />
            </>
          )}
          {resultado && !escaneando && (
            <ResultadoEscaneo
              sugerencia={resultado}
              catalog={catalog}
              estado={estado}
              onUsarPlan={usarPlan}
              planAplicado={planAplicado}
            />
          )}
          {!foto && !error && (
            <ul className="flex flex-col gap-2 text-sm">
              {['Elegí una foto', 'Mirá cómo la escaneamos', 'Reservá con el plan sugerido'].map((t, i) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="cifras grid size-7 place-items-center rounded-pill border-2 border-tinta bg-superficie font-bold">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Fotos de ejemplo</p>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ejemplosMascota.map((e) => {
            const activa = foto?.ejemplo === e.id
            return (
              <li key={e.id}>
                <button
                  type="button"
                  aria-pressed={activa}
                  disabled={escaneando}
                  onClick={() => elegirEjemplo(e.id)}
                  className={cn(
                    'flex w-full flex-col overflow-hidden rounded-md border-2 border-tinta text-left disabled:opacity-60',
                    activa ? 'bg-seleccion text-sobre-seleccion shadow-ticket-presionada' : 'bg-superficie shadow-ticket hover:bg-superficie-alt',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rutaPublica(e.foto)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                  <span className="flex flex-col px-2 py-1.5">
                    <span className="text-sm font-bold">{e.nombre}</span>
                    <span className="text-xs">{e.descripcion}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={cn(
            'inline-flex min-h-12 w-fit cursor-pointer items-center gap-2 rounded-md border-2 border-tinta bg-superficie px-5 text-base font-bold text-texto shadow-ticket hover:bg-superficie-alt',
            'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-tinta',
            escaneando && 'pointer-events-none opacity-60',
          )}
        >
          <Icon name="camara" size={20} />
          Subir una foto de tu perro
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={escaneando}
            onChange={(ev) => {
              subirFoto(ev.target.files?.[0])
              ev.target.value = ''
            }}
          />
        </label>
        <p className="text-sm text-texto-suave">
          JPG, PNG o WEBP, de cuerpo entero y con buena luz. La foto no se guarda.
        </p>
      </div>
    </Ticket>
  )
}
