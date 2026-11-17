'use client'

import { useState } from 'react'

import { Button, ChipGroup, TextField } from '@/components/ui'
import {
  hidratacionLabels,
  hidrataciones,
  mantoDeTextura,
  texturaLabels,
  texturas,
  tratamientoSugerido,
  type Hidratacion,
  type Textura,
} from '@/lib/ia/cuidado'
import type { Sugerencia } from '@/lib/ia/sugerencia'
import { knots, knotsLabels, sizeLabels, sizes, type Knots, type Size } from '@/lib/pricing'

/**
 * Sin IA (la demo estática o un servidor sin clave) no se analiza la foto: el tutor la mira y
 * marca lo que ve. Con eso se arma el mismo plan, con origen «manual».
 */
export function CargaManual({ onListo }: { onListo: (s: Sugerencia) => void }) {
  const [raza, setRaza] = useState('')
  const [tamano, setTamano] = useState<Size>('chico')
  const [textura, setTextura] = useState<Textura>('largo')
  const [hidratacion, setHidratacion] = useState<Hidratacion>('media')
  const [nudos, setNudos] = useState<Knots>('sin')

  function listo() {
    onListo({
      raza: raza.trim().slice(0, 60) || 'Sin especificar',
      tamano,
      manto: mantoDeTextura(textura),
      nudos,
      observaciones: '',
      textura,
      hidratacion,
      tratamiento: tratamientoSugerido({ nudos, hidratacion, textura }),
      confianza: { tamano: 'media', manto: 'media', nudos: 'media' },
      origen: 'manual',
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <TextField
        label="Raza"
        optional
        value={raza}
        maxLength={60}
        placeholder="Por ejemplo: Caniche, mestizo…"
        onChange={(e) => setRaza(e.target.value)}
      />
      <ChipGroup
        legend="Tamaño"
        name="manual-tamano"
        value={tamano}
        onChange={setTamano}
        options={sizes.map((s) => ({ value: s, label: sizeLabels[s].label, detail: sizeLabels[s].detail }))}
      />
      <ChipGroup
        legend="Pelaje"
        name="manual-textura"
        value={textura}
        onChange={setTextura}
        options={texturas.map((t) => ({ value: t, label: texturaLabels[t] }))}
      />
      <ChipGroup
        legend="¿Cómo ves el pelo?"
        name="manual-hidratacion"
        value={hidratacion}
        onChange={setHidratacion}
        hint="Buena: brilla y está suave. Baja: se ve seco u opaco."
        options={hidrataciones.map((h) => ({ value: h, label: hidratacionLabels[h] }))}
      />
      <ChipGroup
        legend="Nudos"
        name="manual-nudos"
        value={nudos}
        onChange={setNudos}
        options={knots.map((k) => ({ value: k, label: knotsLabels[k] }))}
      />
      <div>
        <Button icon="check" onClick={listo}>
          Armar el plan
        </Button>
      </div>
    </div>
  )
}
