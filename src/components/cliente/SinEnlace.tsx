import { EmptyState, LinkButton, Notice } from '@/components/ui'
import { getDatosLocal } from '@/lib/datos-publicos'

/** Mi mascota y Mis turnos sin enlace personal: qué pasa y cómo conseguirlo (no hay login). */
export async function SinEnlace({ invalido = false }: { invalido?: boolean }) {
  const local = await getDatosLocal()
  return (
    <div className="flex flex-col gap-5">
      {invalido && (
        <Notice tone="aviso" role="alert" title="Ese enlace ya no funciona.">
          Puede que el salón haya generado uno nuevo. Pedíselo por WhatsApp.
        </Notice>
      )}
      <EmptyState icon="libreta" title="abrí tu enlace personal">
        Para ver los turnos y la libreta de tu perro, usá el enlace que te mandamos por WhatsApp. No
        hace falta usuario ni contraseña.
      </EmptyState>
      <div className="flex flex-wrap justify-center gap-3">
        {local.whatsapp && (
          <LinkButton href={local.whatsapp} external variant="dark" icon="whatsapp">
            Pedir mi enlace por WhatsApp
          </LinkButton>
        )}
        <LinkButton href="/reservar" variant="secondary" icon="calendario">
          Reservar un turno
        </LinkButton>
      </div>
    </div>
  )
}
