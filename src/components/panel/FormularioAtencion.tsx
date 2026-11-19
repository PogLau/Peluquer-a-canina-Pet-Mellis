'use client'

import { useState, useTransition } from 'react'

import { scoreAspects } from '@/collections/options'
import {
  Button,
  ChipGroup,
  Notice,
  TagChip,
  TextareaField,
  TextField,
  ToggleChip,
} from '@/components/ui'
import { suggestTutorSummary, type Aspecto, type Puntajes } from '@/lib/ficha'
import { notaDeIngreso } from '@/lib/ia/cuidado'
import type {
  DatosRegistro,
  ErroresRegistro,
  RegistroInput,
  ResultadoRegistro,
} from '@/lib/panel/atenciones'

import { EnviarResumen } from './EnviarResumen'
import { EscaneoIngreso } from './EscaneoIngreso'

const puntajeOpciones = ['1', '2', '3', '4', '5'].map((v) => ({ value: v, label: v }))

function toggle(list: number[], id: number, on: boolean) {
  return on ? [...list, id] : list.filter((x) => x !== id)
}

/** Registrar atención: pensado para completarse en menos de 2 minutos, con toques. */
export function FormularioAtencion({
  datos,
  registrar: registrarAtencion,
}: {
  datos: DatosRegistro
  /** Acción del servidor en la app real; función local en la demo estática. */
  registrar: (input: RegistroInput) => Promise<ResultadoRegistro>
}) {
  const { turno } = datos
  const [servicios, setServicios] = useState<number[]>(datos.serviciosTurno)
  const [precio, setPrecio] = useState(turno.precioEstimado ? String(turno.precioEstimado) : '')
  const [etiquetas, setEtiquetas] = useState<number[]>(datos.etiquetasMascota)
  const [puntajes, setPuntajes] = useState<Puntajes>({})
  const [resumen, setResumen] = useState('')
  const [resumenEditado, setResumenEditado] = useState(false)
  const [recomendacion, setRecomendacion] = useState(datos.recomendacionSugerida)
  // IA Scan & Care: la ficha de ingreso precarga la nota interna (editable)
  const [notaInterna, setNotaInterna] = useState(() =>
    turno.escaneo ? notaDeIngreso(turno.escaneo) : '',
  )
  const [errores, setErrores] = useState<ErroresRegistro>({})
  const [error, setError] = useState<string | null>(null)
  const [enviado, setEnviado] = useState<{ telefono: string; mensaje: string } | null>(null)
  const [pending, startTransition] = useTransition()

  function setPuntaje(aspecto: Aspecto, valor: string) {
    const next = { ...puntajes, [aspecto]: Number(valor) }
    setPuntajes(next)
    // Mientras no lo escriba a mano, el resumen se arma solo con los puntajes
    if (!resumenEditado) setResumen(suggestTutorSummary(turno.mascota.nombre, next))
  }

  if (enviado) {
    return (
      <div className="flex flex-col gap-5">
        <Notice
          tone="exito"
          role="status"
          title={`Atención guardada. ${turno.mascota.nombre} quedó listo para retirar.`}
        >
          La ficha ya tiene esta visita.
        </Notice>
        <EnviarResumen telefono={enviado.telefono} mensajeInicial={enviado.mensaje} />
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-7"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const precioFinal = precio.trim() === '' ? null : Number(precio.replace(/\./g, ''))
        startTransition(async () => {
          const r = await registrarAtencion({
            turnoId: turno.id,
            servicios,
            precioFinal,
            etiquetas,
            puntajes,
            notaInterna,
            resumenTutor: resumen,
            recomendacion,
          })
          if (r.ok) setEnviado({ telefono: r.telefono, mensaje: r.mensaje })
          else {
            setError(r.error)
            setErrores(('errores' in r && r.errores) || {})
          }
        })
      }}
    >
      {turno.escaneo && <EscaneoIngreso escaneo={turno.escaneo} />}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-lg font-bold">Qué se hizo</legend>
        <div className="flex flex-wrap gap-2">
          {datos.servicios.map((s) => (
            <ToggleChip
              key={s.id}
              pressed={servicios.includes(s.id)}
              onPressedChange={(on) => setServicios(toggle(servicios, s.id, on))}
            >
              {s.nombre}
            </ToggleChip>
          ))}
        </div>
        {errores.servicios && <p className="text-sm font-bold text-peligro">{errores.servicios}</p>}
      </fieldset>

      <div className="max-w-xs">
        <TextField
          label="Precio final"
          inputMode="numeric"
          value={precio}
          onChange={(e) => setPrecio(e.target.value.replace(/[^\d.]/g, ''))}
          hint="En pesos. Viene del presupuesto: cambialo si hubo extras."
          error={errores.precioFinal}
          optional
        />
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-lg font-bold">Cómo se portó</legend>
        <p className="text-sm text-texto-suave">
          1 = le costó mucho · 5 = muy bien. Lo que no se hizo, dejalo sin marcar.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {scoreAspects.map(({ name, label }) => (
            <ChipGroup
              key={name}
              legend={label}
              name={`puntaje-${name}`}
              options={puntajeOpciones}
              value={puntajes[name] ? String(puntajes[name]) : null}
              onChange={(v) => setPuntaje(name, v)}
            />
          ))}
        </div>
        {errores.puntajes && <p className="text-sm font-bold text-peligro">{errores.puntajes}</p>}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-lg font-bold">Etiquetas</legend>
        <div className="flex flex-wrap gap-2">
          {datos.etiquetas.map((e) => (
            <TagChip
              key={e.id}
              kind={e.tipo}
              selected={etiquetas.includes(e.id)}
              onToggle={(on) => setEtiquetas(toggle(etiquetas, e.id, on))}
            >
              {e.nombre}
            </TagChip>
          ))}
        </div>
      </fieldset>

      <TextareaField
        label="Resumen para el tutor"
        rows={3}
        optional
        value={resumen}
        onChange={(e) => {
          setResumen(e.target.value)
          setResumenEditado(true)
        }}
        hint="Va en el mensaje de WhatsApp. Se completa con los puntajes; podés reescribirlo."
        error={errores.resumenTutor}
      />
      <TextareaField
        label="Recomendación para la próxima visita"
        rows={3}
        optional
        value={recomendacion}
        onChange={(e) => setRecomendacion(e.target.value)}
        hint="Propuesta a partir de la Ficha Evolutiva."
        error={errores.recomendacion}
      />
      <TextareaField
        label="Nota interna"
        rows={turno.escaneo ? 3 : 2}
        optional
        value={notaInterna}
        onChange={(e) => setNotaInterna(e.target.value)}
        hint="Solo la ve el salón. Nunca le llega al tutor."
        error={errores.notaInterna}
      />

      {error && <Notice tone="peligro" role="alert" title={error} />}
      <div className="flex flex-col gap-2">
        <Button type="submit" icon="check" disabled={pending || servicios.length === 0}>
          {pending ? 'Guardando…' : 'Guardar atención'}
        </Button>
        {servicios.length === 0 && (
          <p className="text-sm text-texto-suave">Elegí al menos un servicio para guardar.</p>
        )}
      </div>
    </form>
  )
}
