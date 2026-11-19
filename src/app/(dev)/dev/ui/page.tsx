import { ServiceCard } from '@/components/cliente/ServiceCard'
import {
  Button,
  EmptyState,
  Icon,
  iconNames,
  Imagotipo,
  Isotipo,
  Notice,
  PageHeader,
  StatusBadge,
  appointmentStatuses,
  Stepper,
  TagChip,
  Ticket,
} from '@/components/ui'

import { InteractiveDemo } from './InteractiveDemo'

const colorTokens = [
  ['blanco', 'bg-blanco'],
  ['carbón', 'bg-carbon'],
  ['verde salvia', 'bg-verde'],
  ['verde oscuro (botones)', 'bg-verde-oscuro'],
  ['menta', 'bg-menta'],
  ['naranja', 'bg-naranja'],
  ['rosa', 'bg-rosa'],
  ['gris', 'bg-gris'],
  ['durazno', 'bg-durazno'],
  ['linea', 'bg-linea'],
] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-linea pt-6">
      <h2 className="text-xl">{title}</h2>
      {children}
    </section>
  )
}

export default function DevUiPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader eyebrow="Fase 0 · sistema de diseño" title="componentes de pet mellis">
        Todos los componentes de <code>components/ui</code>, con los tokens del manual de marca.
      </PageHeader>

      <Section title="logo">
        <div className="flex flex-wrap items-center gap-6">
          <Isotipo height={64} title="Pet Mellis" />
          <Imagotipo />
          <span className="rounded-md bg-verde-oscuro p-4">
            <Imagotipo tone="dark" />
          </span>
        </div>
      </Section>

      <Section title="color">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colorTokens.map(([name, bg]) => (
            <li key={name} className="flex flex-col gap-1.5">
              <span className={`h-14 rounded-md border border-linea ${bg}`} />
              <span className="rotulo">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="tipografía">
        <p className="font-display text-4xl font-bold oracion">pet mellis · H2 50,5 px</p>
        <p className="font-display text-3xl font-bold oracion">título · H3 37,9 px</p>
        <p className="font-display text-2xl font-bold oracion">sección · H4 28,4 px</p>
        <p className="font-display text-xl font-bold oracion">tarjeta · H5 21,3 px</p>
        <p>Cuerpo 16 px: Manuale Regular 400, interlineado 1,5.</p>
        <p className="text-sm text-texto-suave">Secundario 14 px: ayudas y notas.</p>
        <p className="rotulo">Etiqueta · Manuale Bold 12 px</p>
      </Section>

      <Section title="botones">
        <div className="flex flex-wrap gap-4">
          <Button>Reservar turno</Button>
          <Button variant="secondary">Cotizar</Button>
          <Button variant="highlight" icon="whatsapp">
            Avisar por WhatsApp
          </Button>
          <Button variant="ghost">Cancelar</Button>
          <Button disabled>Confirmar</Button>
          <Button size="small" icon="mas">
            Agregar
          </Button>
        </div>
      </Section>

      <Section title="tickets y tarjetas">
        <div className="grid gap-6 md:grid-cols-3">
          <Ticket>
            <h3 className="text-xl">ticket normal</h3>
            <p className="text-sm text-texto-suave">Borde de 2 px y sombra dura de 4 px.</p>
          </Ticket>
          <Ticket size="small" highlighted>
            <p className="font-bold">Ticket chico resaltado</p>
            <p className="text-sm">Para filas elegidas y avisos.</p>
          </Ticket>
          <ServiceCard
            id="bano-corte"
            name="Baño y Corte"
            description="Baño completo, secado y corte a elección."
            duration="2 a 3 h"
            popular
          />
        </div>
      </Section>

      <Section title="estados de turno">
        <div className="flex flex-wrap gap-2">
          {appointmentStatuses.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
      </Section>

      <Section title="etiquetas de la ficha">
        <div className="flex flex-wrap gap-2">
          <TagChip>tranquilo</TagChip>
          <TagChip kind="alerta">miedo al secador</TagChip>
          <TagChip kind="alerta">no tolera las uñas</TagChip>
          <TagChip selected>nudos en orejas</TagChip>
        </div>
      </Section>

      <Section title="avisos y estados vacíos">
        <div className="grid gap-4 md:grid-cols-2">
          <Notice tone="aviso" title="Max · no tolera las uñas">
            Empezar por acá, con técnica gradual.
          </Notice>
          <Notice tone="exito" title="Turno solicitado">
            Te avisamos por WhatsApp cuando se confirme.
          </Notice>
          <Notice tone="peligro" title="Falta el teléfono">
            Lo necesitamos para confirmarte el turno.
          </Notice>
          <Notice tone="info" title="En atención">
            Toby está en el baño.
          </Notice>
        </div>
        <EmptyState title="sin turnos para hoy">Cuando entren solicitudes, aparecen acá.</EmptyState>
      </Section>

      <Section title="pasos">
        <Stepper steps={['Tu perro', 'Servicios', 'Horario', 'Confirmar']} current={1} />
      </Section>

      <Section title="formularios, chips y modal">
        <InteractiveDemo />
      </Section>

      <Section title="íconos de interfaz">
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {iconNames.map((name) => (
            <li key={name} className="flex flex-col items-center gap-2 rounded-md border border-linea p-3">
              <Icon name={name} />
              <span className="rotulo text-texto-suave">{name}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
