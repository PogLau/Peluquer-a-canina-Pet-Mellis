import { ServiceCard } from '@/components/cliente/ServiceCard'
import { Icon, LinkButton, Ticket } from '@/components/ui'
import { franjaHoraria } from '@/lib/format'
import { ejemplosMascota } from '@/lib/ia/ejemplos'
import type { Service } from '@/lib/pricing'
import { rutaPublica } from '@/lib/ruta-publica'

const fotosSalon = [
  { src: '/fotos/salon-bano.webp', alt: 'Yorkshire bañándose con la ducha de mano, sostenido con guantes' },
  { src: '/fotos/salon-corte-tijera.webp', alt: 'Yorkshire sentado en la mesa de trabajo durante el corte con tijera' },
  { src: '/fotos/salon-secado.webp', alt: 'Secado de un Yorkshire con secador de mano' },
  { src: '/fotos/salon-patas.webp', alt: 'Corte del pelo de las patas con tijera sobre la mesa' },
  { src: '/fotos/salon-peine.webp', alt: 'Yorkshire mirando hacia arriba entre el peine y la tijera' },
] as const

type Props = {
  servicios: Service[]
  direccion: string
  horarios: Array<{ dia: string; abre: string; cierra: string }>
  /** Enlace wa.me del local, o null si no está configurado. */
  whatsapp: string | null
}

/** Inicio del cliente (solo presentación): lo usan la app real y la demo estática. */
export function InicioVista({ servicios, direccion, horarios, whatsapp }: Props) {
  const destacados = [...servicios]
    .sort((a, b) => Number(b.popular ?? false) - Number(a.popular ?? false))
    .slice(0, 3)
  const local = { direccion, horarios }

  return (
    <div className="flex flex-col gap-12">
      <section
        aria-labelledby="titulo-inicio"
        className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]"
      >
        <div className="flex flex-col gap-5">
          <h1 id="titulo-inicio" className="text-3xl md:text-4xl">
            cada visita mejora <span className="text-verde">la siguiente</span>
          </h1>
          <p className="text-lg text-texto-suave">
            Anotamos cómo le fue a tu perro en cada turno. Así, la próxima vez ya sabemos qué le
            gusta, qué le cuesta y cómo dejarlo tranquilo.
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
        <figure className="relative">
          {/* Foto local de public/fotos (créditos en docs/fotos.md) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rutaPublica('/fotos/yorkshire-mesa.webp')}
            alt="Persona del salón con guantes preparando a un Yorkshire terrier sobre la mesa de trabajo"
            className="aspect-[4/3] w-full rounded-md border border-linea object-cover shadow-ticket"
          />
          <figcaption className="relative -mt-10 ml-4 mr-4 rounded-md border border-linea bg-durazno p-4 text-sm shadow-ticket sm:ml-8 sm:mr-auto sm:max-w-xs">
            Toby le teme al secador, Max no se deja cortar las uñas. Cada historia queda en su{' '}
            <strong>Ficha Evolutiva</strong>.
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="titulo-escaneo"
        className="grid items-center gap-6 rounded-md border border-linea bg-verde-oscuro p-5 text-blanco shadow-ticket md:grid-cols-[1fr_1.1fr] md:p-8"
      >
        <div className="flex flex-col gap-4">
          <p className="rotulo text-blanco">Antes de reservar</p>
          <h2 id="titulo-escaneo" className="text-3xl">
            IA Scan
          </h2>
          <p>
            ¿No sabés qué servicio le toca? Mandanos una foto de tu perro y te decimos qué le conviene y cuánto sale, más o menos.
            Lo confirmamos cuando lo vemos en el salón.
          </p>
          <div>
            <LinkButton href="/cotizar#escaneo" variant="highlight" iconEnd="flecha">
              Escanear con IA Scan
            </LinkButton>
          </div>
        </div>
        <ul className="grid grid-cols-3 gap-3" aria-label="Fotos de ejemplo">
          {ejemplosMascota.slice(0, 3).map((e) => (
            <li key={e.id} className="flex flex-col gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rutaPublica(e.foto)}
                alt={e.alt}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-md border border-blanco object-cover"
              />
              <span className="text-xs font-bold">{e.nombre}</span>
            </li>
          ))}
        </ul>
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
        {destacados.length === 0 && (
          <p className="text-texto-suave">
            Ahora no podemos mostrar los servicios. Escribinos y te contamos.
          </p>
        )}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((s) => (
            <li key={s.id}>
              <ServiceCard
                id={s.id}
                name={s.nombre}
                description={s.descripcion}
                duration={s.duracion}
                popular={s.popular}
              />
            </li>
          ))}
        </ul>
        <p className="text-sm text-texto-suave">
          El precio depende del tamaño de tu perro y de lo que le hagamos. En el cotizador lo ves al
          instante.
        </p>
      </section>

      <section aria-labelledby="titulo-salon" className="flex flex-col gap-5">
        <h2 id="titulo-salon" className="text-2xl">
          en el salón
        </h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {fotosSalon.map((f) => (
            <li key={f.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rutaPublica(f.src)}
                alt={f.alt}
                loading="lazy"
                className="aspect-square w-full rounded-md border border-linea object-cover shadow-ticket"
              />
            </li>
          ))}
        </ul>
        <p className="text-xs text-texto-suave">Fotos de demostración: Freepik y Pexels.</p>
      </section>

      <section aria-labelledby="titulo-donde" className="grid gap-6 md:grid-cols-2">
        <h2 id="titulo-donde" className="sr-only">
          dónde estamos
        </h2>
        <Ticket className="flex items-start gap-4">
          <Icon name="ubicacion" size={28} />
          <div>
            <p className="font-display text-xl oracion">dónde estamos</p>
            <p className="text-texto-suave">{local.direccion}</p>
          </div>
        </Ticket>
        <Ticket className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Icon name="reloj" size={28} />
            <div>
              <p className="font-display text-xl oracion">horarios</p>
              {local.horarios.length > 0 ? (
                <ul className="text-texto-suave">
                  {local.horarios.map((h) => (
                    <li key={h.dia}>
                      {h.dia}: {franjaHoraria(h.abre, h.cierra)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-texto-suave">
                  Consultá los días y horarios disponibles al reservar.
                </p>
              )}
            </div>
          </div>
          {whatsapp && (
            <LinkButton href={whatsapp} external variant="highlight" size="small" icon="whatsapp">
              Escribinos
            </LinkButton>
          )}
        </Ticket>
      </section>
    </div>
  )
}
