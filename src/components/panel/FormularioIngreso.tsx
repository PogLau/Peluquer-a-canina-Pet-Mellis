'use client'

import { useActionState } from 'react'

import { ingresar, type EstadoIngreso } from '@/app/(panel)/panel/ingresar/acciones'
import { Button, Notice, TextField } from '@/components/ui'

export function FormularioIngreso() {
  const [estado, action, pending] = useActionState<EstadoIngreso, FormData>(ingresar, {})

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {estado.error && <Notice tone="peligro" role="alert" title={estado.error} />}
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        defaultValue={estado.email}
        autoFocus
      />
      <TextField
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      <Button type="submit" fullWidth disabled={pending} icon="usuario">
        {pending ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>
  )
}
