import { ServiceCard } from '@/components/cliente/ServiceCard'
import { Icon, LinkButton, Ticket } from '@/components/ui'
import { ejemplosMascota } from '@/lib/ia/ejemplos'
import { startingPrice, type Service } from '@/lib/pricing'
import { rutaPublica } from '@/lib/ruta-publica'

const fotosSalon = [
  { src: '/fotos/yorkshire-tijera.webp', alt: 'Corte de un Yorkshire con peine y tijera' },
  { src: '/fotos/yorkshire-bata.webp', alt: 'Yorkshire envuelto en una toalla después del baño' },
  { src: '/fotos/corte-mesa.webp', alt: 'Corte de pelo en las patas sobre la mesa de trabajo' },
  { src: '/fotos/yorkshire-toalla.webp', alt: 'Yorkshire recién bañado, secándose en una toalla' },
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
          <p className="rotulo text-verde">Peluquería canina · Merlo</p>
          <h1 id="titulo-inicio" className="text-3xl md:text-4xl">
            cada visita mejora la siguiente
          </h1>
          <p className="text-lg text-texto-suave">
            Anotamos cómo le fue a tu perro en cada turno, así la próxima vez empezamos sabiendo qué
            le gusta y qué le cuesta.
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
            alt="Peluquera con guantes preparando a un Yorkshire terrier sobre la mesa de trabajo"
            className="aspect-[4/3] w-full rounded-md border-2 border-tinta object-cover shadow-ticket"
          />
          <figcaption className="relative -mt-10 ml-4 mr-4 rounded-md border-2 border-tinta bg-amarillo-claro p-4 text-sm shadow-ticket sm:ml-8 sm:mr-auto sm:max-w-xs">
            Toby le teme al secador, Max no se deja cortar las uñas. Cada historia queda en su{' '}
            <strong>Ficha Evolutiva</strong>.
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="titulo-escaneo"
        className="grid items-center gap-6 rounded-md border-2 border-tinta bg-verde p-5 text-crema shadow-ticket md:grid-cols-[1fr_1.1fr] md:p-8"
      >
        <div className="flex flex-col gap-4">
          <p className="rotulo flex items-center gap-2 text-amarillo">
            <Icon name="escaner" size={18} /> Nuevo · beta
          </p>
          <h2 id="titulo-escaneo" className="text-3xl">
            ia scan &amp; care
          </h2>
          <p>
            Elegí una foto y armamos la ficha de ingreso de tu perro: raza, tamaño, tipo de pelaje,
            hidratación y nudos. Te sugerimos el tratamiento ideal con su precio, y lo reservás en un
            paso.
          </p>
          <div>
            <LinkButton href="/cotizar#escaneo" variant="highlight" iconEnd="flecha">
              Probar el escaneo
            </LinkButton>
          </div>
        </div>
        <ul className="grid grid-cols-3 gap-3" aria-label="Fotos de ejemplo del escaneo">
          {ejemplosMascota.slice(0, 3).map((e) => (
            <li key={e.id} className="flex flex-col gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rutaPublica(e.foto)}
                alt={e.alt}
                loading="lazy"
                className="aspect-[3/4] w-full rounded-md border-2 border-amarillo object-cover"
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
            Los precios no están disponibles en este momento. Escribinos para consultar.
          </p>
        )}
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
          El precio final depende del tamaño, el tipo de manto y los nudos. Calculalo en el
          cotizador.
        </p>
      </section>

      <section aria-labelledby="titulo-salon" className="flex flex-col gap-5">
        <h2 id="titulo-salon" className="text-2xl">
          en el salón
        </h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {fotosSalon.map((f) => (
            <li key={f.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rutaPublica(f.src)}
                alt={f.alt}
                loading="lazy"
                className="aspect-square w-full rounded-md border-2 border-tinta object-cover shadow-ticket"
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
            <p className="font-display text-xl lowercase">dónde estamos</p>
            <p className="text-texto-suave">{local.direccion}</p>
          </div>
        </Ticket>
        <Ticket className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Icon name="reloj" size={28} />
            <div>
              <p className="font-display text-xl lowercase">horarios</p>
              {local.horarios.length > 0 ? (
                <ul className="text-texto-suave">
                  {local.horarios.map((h) => (
                    <li key={h.dia}>
                      {h.dia}: {h.abre} a {h.cierra} h
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
