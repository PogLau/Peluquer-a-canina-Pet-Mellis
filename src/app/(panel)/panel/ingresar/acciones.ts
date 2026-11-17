'use server'

import config from '@payload-config'
import { login, logout } from '@payloadcms/next/auth'
import { redirect } from 'next/navigation'

export type EstadoIngreso = { error?: string; email?: string }

/** Ingreso de la peluquera con el usuario de Payload. Deja la cookie de sesión y va a «Hoy». */
export async function ingresar(_prev: EstadoIngreso, formData: FormData): Promise<EstadoIngreso> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { error: 'Completá el email y la contraseña.', email }

  try {
    await login({ collection: 'usuarios', config, email, password })
  } catch (error) {
    const bloqueado = error instanceof Error && /lock/i.test(error.message + error.name)
    return {
      email,
      error: bloqueado
        ? 'La cuenta quedó bloqueada por muchos intentos. Probá de nuevo en unos minutos.'
        : 'El email o la contraseña no coinciden.',
    }
  }
  redirect('/panel')
}

export async function salir() {
  await logout({ config })
  redirect('/panel/ingresar')
}
