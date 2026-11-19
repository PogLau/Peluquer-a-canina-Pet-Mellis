import { olvidarEsteTelefono } from '@/app/(cliente)/acciones'

/** Para teléfonos compartidos: deja de recordar el enlace personal en este teléfono. */
export function OlvidarTelefono({ nombre }: { nombre: string }) {
  return (
    <form
      action={olvidarEsteTelefono}
      className="mt-10 border-t border-linea pt-4 text-sm text-texto-suave"
    >
      Estás viendo los datos de {nombre}.{' '}
      <button type="submit" className="font-bold text-texto underline underline-offset-4">
        No soy {nombre.split(' ')[0]}: olvidar este teléfono
      </button>
    </form>
  )
}
