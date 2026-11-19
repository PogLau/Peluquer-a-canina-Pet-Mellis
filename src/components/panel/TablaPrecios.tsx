'use client'

import { useState, useTransition } from 'react'

import { Button, LinkButton, Notice, Ticket } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { ErroresCampos } from '@/lib/panel/clientes'
import { camposDesde, camposHasta, type PreciosEditables } from '@/lib/panel/precios'
import { sizeLabels, sizes } from '@/lib/pricing'

const celda = 'px-2 py-2 align-top'
const th = 'rotulo px-2 py-2 text-left'

/** Campo numérico chico dentro de una tabla, con su error debajo. */
function Num({
  label,
  value,
  onChange,
  error,
  sufijo,
  prefijo,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  sufijo?: string
  /** Texto antes del campo (por ejemplo «a» para el «hasta»). */
  prefijo?: string
}) {
  return (
    <div className="flex min-w-24 flex-col gap-1">
      <span className="flex items-center gap-1">
        {prefijo && (
          <span aria-hidden="true" className="text-sm text-texto-suave">
            {prefijo}
          </span>
        )}
        {!sufijo && (
          <span aria-hidden="true" className="text-sm text-texto-suave">
            $
          </span>
        )}
        <input
          aria-label={label}
          aria-invalid={error ? true : undefined}
          inputMode={sufijo ? 'decimal' : 'numeric'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'cifras min-h-10 w-full rounded-sm border-2 border-tinta bg-superficie px-2 text-right text-sm',
            error && 'border-peligro',
          )}
        />
        {sufijo && (
          <span aria-hidden="true" className="text-sm text-texto-suave">
            {sufijo}
          </span>
        )}
      </span>
      {error && <span className="text-xs font-bold text-peligro">{error}</span>}
    </div>
  )
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="size-5 accent-[var(--tinta)]"
    />
  )
}

/** Tabla editable de precios. Al guardar, el cotizador del cliente usa los valores nuevos. */
export function TablaPrecios({
  inicial,
  guardar: guardarPrecios,
  cotizadorHref = '/cotizar',
}: {
  inicial: PreciosEditables
  guardar: (
    p: PreciosEditables,
  ) => Promise<{ ok: true } | { ok: false; error: string; errores?: ErroresCampos }>
  cotizadorHref?: string
}) {
  const [p, setP] = useState(inicial)
  const [guardado, setGuardado] = useState(inicial)
  const [errores, setErrores] = useState<ErroresCampos>({})
  const [aviso, setAviso] = useState<{ tono: 'exito' | 'peligro'; texto: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const cambios = JSON.stringify(p) !== JSON.stringify(guardado)

  function update(fn: (draft: PreciosEditables) => void) {
    setP((prev) => {
      const next = structuredClone(prev)
      fn(next)
      return next
    })
    setAviso(null)
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        startTransition(async () => {
          const r = await guardarPrecios(p)
          if (r.ok) {
            setErrores({})
            setGuardado(p)
            setAviso({
              tono: 'exito',
              texto: 'Precios guardados. El cotizador ya muestra los valores nuevos.',
            })
          } else {
            setErrores(r.errores ?? {})
            setAviso({ tono: 'peligro', texto: r.error })
          }
        })
      }}
    >
      <Ticket as="section" aria-labelledby="t-servicios" className="flex flex-col gap-3">
        <h2 id="t-servicios" className="text-xl">
          servicios
        </h2>
        {errores.servicios && <p className="text-sm font-bold text-peligro">{errores.servicios}</p>}
        <div className="overflow-x-auto">
          <p className="text-sm text-texto-suave">
            Precios orientativos por tamaño: «desde» y «hasta». Si dejás «hasta» vacío, se muestra un solo
            precio.
          </p>
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="bg-superficie-alt">
                <th className={th}>Servicio</th>
                {sizes.map((size) => (
                  <th key={size} className={th}>
                    {sizeLabels[size].label}
                    <span className="block font-normal text-texto-suave">{sizeLabels[size].detail}</span>
                  </th>
                ))}
                <th className={th}>Recargo manto</th>
                <th className={th}>Popular</th>
                <th className={th}>Activo</th>
              </tr>
            </thead>
            <tbody>
              {p.servicios.map((s, i) => (
                <tr key={s.id} className={cn('border-t-2 border-linea', !s.activo && 'opacity-60')}>
                  <th scope="row" className={cn(celda, 'text-left font-bold')}>
                    {s.nombre}
                  </th>
                  {camposDesde.map((desde, j) => {
                    const hasta = camposHasta[j]
                    const tamano = sizeLabels[sizes[j]].label.toLowerCase()
                    return (
                      <td key={desde} className={celda}>
                        <div className="flex flex-col gap-1.5">
                          <Num
                            label={`${s.nombre}, ${tamano}, desde`}
                            value={s[desde]}
                            onChange={(v) => update((d) => void (d.servicios[i][desde] = v))}
                            error={errores[`servicios.${i}.${desde}`]}
                          />
                          <Num
                            label={`${s.nombre}, ${tamano}, hasta`}
                            prefijo="a"
                            value={s[hasta]}
                            onChange={(v) => update((d) => void (d.servicios[i][hasta] = v))}
                            error={errores[`servicios.${i}.${hasta}`]}
                          />
                        </div>
                      </td>
                    )
                  })}
                  <td className={celda}>
                    <Check
                      label={`${s.nombre}: aplica recargo por manto y nudos`}
                      checked={s.aplicaRecargoManto}
                      onChange={(v) => update((d) => void (d.servicios[i].aplicaRecargoManto = v))}
                    />
                  </td>
                  <td className={celda}>
                    <Check
                      label={`${s.nombre}: popular`}
                      checked={s.popular}
                      onChange={(v) => update((d) => void (d.servicios[i].popular = v))}
                    />
                  </td>
                  <td className={celda}>
                    <Check
                      label={`${s.nombre}: activo`}
                      checked={s.activo}
                      onChange={(v) => update((d) => void (d.servicios[i].activo = v))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Ticket>

      <div className="grid gap-6 lg:grid-cols-2">
        <Ticket as="section" aria-labelledby="t-extras" className="flex flex-col gap-3">
          <h2 id="t-extras" className="text-xl">
            extras
          </h2>
          <ul className="flex flex-col divide-y-2 divide-linea">
            {p.extras.map((x, i) => (
              <li
                key={x.id}
                className={cn(
                  'flex flex-wrap items-start justify-between gap-x-3 gap-y-1 py-2',
                  !x.activo && 'opacity-60',
                )}
              >
                <span className="pt-2 font-bold">{x.nombre}</span>
                <span className="flex items-start gap-2">
                  <Num
                    label={`${x.nombre}, desde`}
                    sufijo={x.tipo === 'porcentaje' ? '%' : undefined}
                    value={x.precio}
                    onChange={(v) => update((d) => void (d.extras[i].precio = v))}
                    error={errores[`extras.${i}.precio`]}
                  />
                  <Num
                    label={`${x.nombre}, hasta`}
                    prefijo="a"
                    sufijo={x.tipo === 'porcentaje' ? '%' : undefined}
                    value={x.precioHasta}
                    onChange={(v) => update((d) => void (d.extras[i].precioHasta = v))}
                    error={errores[`extras.${i}.precioHasta`]}
                  />
                  <span className="pt-2.5">
                    <Check
                      label={`${x.nombre}: activo`}
                      checked={x.activo}
                      onChange={(v) => update((d) => void (d.extras[i].activo = v))}
                    />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Ticket>

        <Ticket as="section" aria-labelledby="t-recargos" className="flex flex-col gap-4">
          <h2 id="t-recargos" className="text-xl">
            recargos
          </h2>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-bold">
              Multiplicador por manto (servicios con recargo)
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {(['corto', 'largo', 'rizado'] as const).map((k) => (
                <label key={k} className="flex flex-col gap-1 text-sm">
                  <span className="capitalize">{k}</span>
                  <Num
                    label={`Multiplicador manto ${k}`}
                    sufijo="×"
                    value={p.multiplicadores[k]}
                    onChange={(v) => update((d) => void (d.multiplicadores[k] = v))}
                    error={errores[`multiplicadores.${k}`]}
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-bold">
              Desenredado de nudos, según dificultad (se suma una sola vez)
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {(['leves', 'moderados', 'severos'] as const).map((k) => (
                <label key={k} className="flex flex-col gap-1 text-sm">
                  <span className="capitalize">{k}</span>
                  <Num
                    label={`Recargo nudos ${k}`}
                    value={p.recargos[k]}
                    onChange={(v) => update((d) => void (d.recargos[k] = v))}
                    error={errores[`recargos.${k}`]}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </Ticket>
      </div>

      {aviso && (
        <Notice
          tone={aviso.tono}
          role={aviso.tono === 'peligro' ? 'alert' : 'status'}
          title={aviso.texto}
        />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" icon="check" disabled={pending || !cambios}>
          {pending ? 'Guardando…' : 'Guardar precios'}
        </Button>
        <LinkButton href={cotizadorHref} external variant="ghost" iconEnd="flecha">
          Ver el cotizador
        </LinkButton>
        {!cambios && !aviso && (
          <p className="text-sm text-texto-suave">Cambiá un valor para poder guardar.</p>
        )}
      </div>
    </form>
  )
}
