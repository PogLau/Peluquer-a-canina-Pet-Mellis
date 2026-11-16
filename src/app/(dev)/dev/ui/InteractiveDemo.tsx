'use client'

import { useState } from 'react'

import { Button, ChipGroup, Modal, SelectField, TextareaField, TextField, ToggleChip } from '@/components/ui'
import { coatLabels, coats, sizeLabels, sizes, type Coat, type Size } from '@/lib/pricing'

export function InteractiveDemo() {
  const [size, setSize] = useState<Size | null>('chico')
  const [coat, setCoat] = useState<Coat | null>(null)
  const [oidos, setOidos] = useState(true)
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <TextField label="Nombre de tu perro" placeholder="Toby" />
        <TextField label="WhatsApp" type="tel" hint="Con código de área, sin 0 ni 15." error="Falta el número" />
        <SelectField label="Raza" optional defaultValue="">
          <option value="">Elegí una</option>
          <option>Caniche Toy</option>
          <option>Golden Retriever</option>
        </SelectField>
        <TextareaField label="Cuidados especiales" optional />
      </div>
      <div className="flex flex-col gap-6">
        <ChipGroup
          legend="Tamaño"
          name="demo-tamano"
          value={size}
          onChange={setSize}
          options={sizes.map((s) => ({ value: s, label: sizeLabels[s].label, detail: sizeLabels[s].detail }))}
        />
        <ChipGroup
          legend="Manto"
          name="demo-manto"
          value={coat}
          onChange={setCoat}
          hint="Elegí uno para ver el precio."
          options={coats.map((c) => ({ value: c, label: coatLabels[c] }))}
        />
        <div className="flex flex-wrap gap-2">
          <ToggleChip pressed={oidos} onPressedChange={setOidos}>
            Limpieza de oídos
          </ToggleChip>
        </div>
        <div>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Abrir modal
          </Button>
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="cancelar turno"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Volver
            </Button>
            <Button onClick={() => setOpen(false)}>Sí, cancelar</Button>
          </>
        }
      >
        <p>¿Seguro que querés cancelar el turno del lunes?</p>
      </Modal>
    </div>
  )
}
