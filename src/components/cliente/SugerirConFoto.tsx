'use client'

import { useId, useState, useTransition } from 'react'

import { Icon, Notice, Ticket } from '@/components/ui'
import { cn } from '@/lib/cn'
import { ejemplosMascota } from '@/lib/ia/ejemplos'
import type { ResultadoSugerencia, Sugerencia } from '@/lib/ia/sugerencia'
import { coatLabels, knotsLabels, sizeLabels } from '@/lib/pricing'

type Props = {
  iaActiva: boolean
  sugerencia: Sugerencia | null
  onSugerencia: (s: Sugerencia) => void
  /** Análisis real de la foto (acción del servidor). Sin ella solo están los ejemplos. */
  analizar?: (data: FormData) => Promise<ResultadoSugerencia>
}

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

export function SugerirConFoto({ iaActiva: iaPedida, sugerencia, onSugerencia, analizar }: Props) {
  const iaActiva = iaPedida && !!analizar
  const inputId = useId()
  const [pendiente, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [ejemploActivo, setEjemploActivo] = useState<string | null>(null)

  function usarEjemplo(id: string) {
    const ejemplo = ejemplosMascota.find((e) => e.id === id)
    if (!ejemplo) return
    setError(null)
    setEjemploActivo(id)
    onSugerencia(ejemplo.sugerencia)
  }

  function subirFoto(file: File | undefined) {
    if (!file) return
    setError(null)
    setEjemploActivo(null)
    startTransition(async () => {
      const data = new FormData()
      data.set('foto', await reducir(file))
      if (!analizar) return
      const res = await analizar(data)
      if (res.ok) onSugerencia(res.sugerencia)
      else setError(res.mensaje)
    })
  }

  return (
    <Ticket as="section" aria-labelledby="titulo-foto" highlighted className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Icon name="camara" />
        <h2 id="titulo-foto" className="text-xl">
          sugerir con foto
        </h2>
        <span className="rotulo rounded-pill bg-negro px-2.5 py-1 text-amarillo">Beta</span>
      </div>

      {iaActiva ? (
        <Notice tone="info" title="Sugerencia con IA">
          Analizamos la foto para sugerir el manto, los nudos y el tamaño. La foto no se guarda.
          Revisá los datos: los podés cambiar a mano.
        </Notice>
      ) : (
        <Notice tone="info" title="Modo demo de visión artificial">
          Los ejemplos tienen un resultado precargado: no se analiza ninguna imagen. Sirven para ver
          cómo se completan los datos, que siempre podés cambiar a mano.
        </Notice>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Probá con un ejemplo</p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {ejemplosMascota.map((e) => {
            const activo = ejemploActivo === e.id
            return (
              <li key={e.id}>
                <button
                  type="button"
                  aria-pressed={activo}
                  onClick={() => usarEjemplo(e.id)}
                  className={cn(
                    'flex h-full w-full items-start gap-3 rounded-md border-2 border-tinta p-3 text-left',
                    activo
                      ? 'bg-accion text-sobre-accion'
                      : 'bg-superficie text-texto hover:bg-superficie-alt',
                  )}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border-2 border-tinta bg-amarillo-claro text-negro">
                    <Icon name="pata" size={22} />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-extrabold">{e.nombre}</span>
                    <span className="text-xs">{e.descripcion}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {iaActiva && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={inputId}
            className={cn(
              'inline-flex min-h-12 w-fit cursor-pointer items-center gap-2 rounded-md border-2 border-tinta bg-superficie px-5 text-base font-extrabold text-texto shadow-ticket hover:bg-superficie-alt',
              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-tinta',
              pendiente && 'pointer-events-none opacity-70',
            )}
          >
            <Icon name="camara" size={20} />
            {pendiente ? 'Analizando la foto…' : 'Subir una foto de tu perro'}
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={pendiente}
              onChange={(ev) => {
                subirFoto(ev.target.files?.[0])
                ev.target.value = ''
              }}
            />
          </label>
          <p className="text-sm text-texto-suave">
            JPG, PNG o WEBP. Mejor de cuerpo entero y con buena luz.
          </p>
        </div>
      )}

      <div aria-live="polite" className="flex flex-col gap-2">
        {error && (
          <Notice tone="peligro" title="No pudimos usar la foto">
            {error}
          </Notice>
        )}
        {sugerencia && !error && !pendiente && (
          <Notice
            tone="exito"
            title={`${sugerencia.origen === 'ejemplo' ? 'Ejemplo' : 'Sugerencia'}: ${sugerencia.raza}`}
          >
            <p>
              Completamos: {sizeLabels[sugerencia.tamano].label} · manto{' '}
              {coatLabels[sugerencia.manto].toLowerCase()} ·{' '}
              {sugerencia.nudos === 'sin'
                ? 'sin nudos'
                : `nudos ${knotsLabels[sugerencia.nudos].toLowerCase()}`}
              .
            </p>
            {sugerencia.observaciones && <p className="mt-1">{sugerencia.observaciones}</p>}
          </Notice>
        )}
      </div>
    </Ticket>
  )
}
