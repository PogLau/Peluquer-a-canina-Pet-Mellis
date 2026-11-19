'use client'

import { useState } from 'react'

import { LinkButton, Notice, TextareaField } from '@/components/ui'
import { whatsappLink } from '@/lib/whatsapp'

/**
 * Resumen para el tutor: se puede corregir antes de mandarlo.
 * El botón solo abre WhatsApp con el texto; nada se envía sin que la peluquera lo revise.
 */
export function EnviarResumen({
  telefono,
  mensajeInicial,
}: {
  telefono: string
  mensajeInicial: string
}) {
  const [mensaje, setMensaje] = useState(mensajeInicial)
  let link: string | null = null
  try {
    link = whatsappLink(telefono, mensaje)
  } catch {
    link = null
  }

  return (
    <div className="flex flex-col gap-3">
      <TextareaField
        label="Mensaje para el tutor"
        rows={9}
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        hint="Revisalo y corregilo si hace falta. Se abre WhatsApp con este texto."
      />
      {link ? (
        <LinkButton
          href={link}
          external
          variant="highlight"
          icon="whatsapp"
          aria-disabled={!mensaje.trim()}
        >
          Abrir en WhatsApp
        </LinkButton>
      ) : (
        <Notice tone="aviso" title="El tutor no tiene un WhatsApp válido cargado." />
      )}
    </div>
  )
}
