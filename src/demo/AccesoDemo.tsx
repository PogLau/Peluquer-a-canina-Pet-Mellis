'use client'

import { useSyncExternalStore } from 'react'

import { Notice } from '@/components/ui'

import { olvidarEsteTelefono } from './acciones'

/*
  Privacidad en la demo: igual que en la app real, cada cliente ve solo sus perros y sus turnos.
  No hay forma de elegir a otro cliente: se entra con el enlace personal (que tiene un código secreto)
  o reservando por primera vez.
*/

/** Aviso para quien entra sin enlace: cómo ver sus datos sin exponer los de los demás. */
export function SinEnlaceDemo() {
  // En el HTML estático no hay dirección: el aviso de enlace inválido aparece ya en el navegador
  const invalido = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get('enlace') === 'invalido',
    () => false,
  )
  if (invalido) {
    return (
      <Notice tone="peligro" title="Ese enlace ya no funciona" role="alert">
        <span className="mt-1 block">
          Puede que la peluquería haya generado uno nuevo. Pedile tu enlace actual por WhatsApp.
        </span>
      </Notice>
    )
  }
  return (
    <Notice tone="info" title="Tus datos son solo tuyos">
      <span className="mt-1 block">
        Cada cliente entra con su enlace personal, que le llega por WhatsApp, y ve solo sus perros
        y sus turnos. Para probarlo en la demo, reservá un turno o abrí el enlace de un cliente desde
        su ficha en el panel de la peluquera.
      </span>
    </Notice>
  )
}

/** Para teléfonos compartidos: este navegador deja de recordar al cliente. */
export function OlvidarTelefonoDemo({ nombre }: { nombre: string }) {
  return (
    <p className="mt-10 border-t-2 border-linea pt-4 text-sm text-texto-suave">
      Estás viendo los datos de {nombre}.{' '}
      <button
        type="button"
        onClick={olvidarEsteTelefono}
        className="font-bold text-texto underline underline-offset-4"
      >
        No soy {nombre.split(' ')[0]}: olvidar este teléfono
      </button>
    </p>
  )
}
