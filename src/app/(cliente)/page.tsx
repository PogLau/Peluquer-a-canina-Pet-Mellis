import { ServiceCard } from '@/components/cliente/ServiceCard'
import { Icon, Isotipo, LinkButton, Ticket } from '@/components/ui'
import { servicios } from '@/lib/catalogo-demo'
import { startingPrice } from '@/lib/pricing'
import { whatsappLink } from '@/lib/whatsapp'

// Fase 0: el catálogo sale de catalogo-demo. En la Fase 2 se lee de Payload.
function localWhatsapp(): string | null {
  const phone = process.env.WHATSAPP_LOCAL ?? ''
  if (/x/i.test(phone)) return null
  try {
    return whatsappLink(phone, 'Hola, quería consultar por un turno para mi perro.')
  } catch {
    return null
  }
}

export default function InicioPage() {
  const destacados = [...servicios].sort((a, b) => Number(b.popular ?? false) - Number(a.popular ?? false)).slice(0, 3)
  const whatsapp = localWhatsapp()

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="titulo-inicio" className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-5">
          <p className="rotulo text-amarillo-texto">Peluquería canina · Merlo</p>
          <h1 id="titulo-inicio" className="text-3xl md:text-4xl">
            cada visita mejora la siguiente
          </h1>
          <p className="text-lg text-texto-suave">
            Anotamos cómo le fue a tu perro en cada turno, así la próxima vez empezamos sabiendo qué le gusta y qué le
            cuesta.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/reservar" iconEnd="flecha">
              Reservar turno
            </LinkButton>
            <LinkButton href="/cotizar" variant="secondary" icon="cotizar">
              Cotizar
            </LinkButton>
          </div>
        </div>
        <Ticket highlighted className="flex flex-col items-center gap-4 py-8 text-center">
          <Isotipo height={120} title="Los mellis" />
          <p className="max-w-xs text-sm">
            Toby le teme al secador, Max no se deja cortar las uñas. Cada historia queda en su{' '}
            <strong>Ficha Evolutiva</strong>.
          </p>
        </Ticket>
      </section>

      <section aria-labelledby="titulo-servicios" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="titulo-servicios" className="text-2xl">
            los más pedidos
          </h2>
          <LinkButton href="/cotizar" variant="ghost" size="small" iconEnd="flecha">
            Ver todos y cotizar
          </LinkButton>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((s) => (
            <li key={s.id}>
              <ServiceCard
                id={s.id}
                name={s.nombre}
                description={s.descripcion}
                price={startingPrice(s)}
                duration={s.duracion}
                popular={s.popular}
              />
            </li>
          ))}
        </ul>
        <p className="text-sm text-texto-suave">
          El precio final depende del tamaño, el tipo de manto y los nudos. Calculalo en el cotizador.
        </p>
      </section>

      <section aria-labelledby="titulo-donde" className="grid gap-6 md:grid-cols-2">
        <h2 id="titulo-donde" className="sr-only">
          dónde estamos
        </h2>
        <Ticket className="flex items-start gap-4">
          <Icon name="ubicacion" size={28} />
          <div>
            <p className="font-display text-xl lowercase">dónde estamos</p>
            <p className="text-texto-suave">Merlo, Buenos Aires</p>
          </div>
        </Ticket>
        <Ticket className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Icon name="reloj" size={28} />
            <div>
              <p className="font-display text-xl lowercase">horarios</p>
              <p className="text-texto-suave">Consultá los días y horarios disponibles al reservar.</p>
            </div>
          </div>
          {whatsapp && (
            <LinkButton href={whatsapp} external variant="dark" size="small" icon="whatsapp">
              Escribinos
            </LinkButton>
          )}
        </Ticket>
      </section>
    </div>
  )
}
