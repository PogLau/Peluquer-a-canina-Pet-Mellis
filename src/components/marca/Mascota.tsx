/*
  Los mellis: la mascota de Pet Mellis. Dos perritos mestizos, esponjosos y despeinados, dibujados como
  sticker: contorno a mano alzada en carbón, borde blanco por detrás, pocos trazos adentro.
  Melli lleva pañuelo naranja; su melliza es su espejo (jopo para el otro lado), con una mancha durazno
  en el ojo y pañuelo verde. En todas las escenas aparecen los dos haciendo algo juntos.
  Es un asset de marca: usa los colores fijos de la paleta (variables de globals.css), no los tokens
  semánticos. Archivos para imprenta y redes: public/marca/*.svg. Mínimo: escena 72 px de alto, cabeza 28 px.
*/

import type { ReactNode } from 'react'

export const posesMelli = ['saluda', 'bano', 'secado', 'corte', 'listo', 'foto', 'duerme'] as const
export type PoseMelli = (typeof posesMelli)[number]

/** Qué muestra cada escena (texto alternativo por defecto) y dónde se usa. */
export const posesInfo: Record<PoseMelli, { alt: string; uso: string }> = {
  saluda: { alt: 'Los mellis sentados; Melli saluda con la pata', uso: 'bienvenida, inicio, adaptación' },
  bano: { alt: 'Los mellis en la bañadera, uno con espuma en la cabeza', uso: 'servicio de baño' },
  secado: { alt: 'La melliza seca a Melli, envuelto en una toalla', uso: 'turno en curso, deslanado' },
  corte: { alt: 'La melliza le corta el flequillo a Melli con una tijera', uso: 'servicio de corte' },
  listo: { alt: 'Los mellis recién bañados, con un moño y destellos', uso: 'reserva confirmada, «listo para retirar»' },
  foto: { alt: 'Melli sostiene un teléfono con una foto y su melliza mira', uso: 'consulta por foto' },
  duerme: { alt: 'Los mellis duermen la siesta, apoyados uno en el otro', uso: 'estados vacíos, página no encontrada' },
}

type BaseProps = {
  /** Alto en px. El ancho sale de la proporción del dibujo. */
  size?: number
  className?: string
  /** Texto alternativo. Sin título, el dibujo es decorativo (aria-hidden). */
  title?: string
}

function Svg({
  viewBox,
  ratio,
  size = 40,
  className,
  title,
  children,
}: BaseProps & { viewBox: string; ratio: number; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={Math.round(size * ratio)}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {children}
    </svg>
  )
}

const escenas: Record<PoseMelli, ReactNode> = {
  saluda: (
    <>
      <ellipse cx="165" cy="207" rx="95" ry={4.5} fill="var(--carbon)" opacity={0.07} />
      <g transform="translate(208 142) scale(-1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(-8 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--verde)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(-8 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <path d="M-17 -30C-16.3 -30.7 -14.3 -34 -13 -34C-11.7 -34 -9.7 -30.7 -9 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -30C9.7 -30.7 11.7 -34 13 -34C14.3 -34 16.3 -30.7 17 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <g transform="translate(118 142) scale(1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(4 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(4 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="-13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="-12.1" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <ellipse cx="13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="13.9" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M1 -12.5C1.8 -13.2 5.1 -13.2 6 -12.5C6.9 -11.8 6.6 -9 6.2 -8C5.8 -7 4.4 -6.5 3.6 -6.5C2.8 -6.5 1.6 -7 1.2 -8C0.8 -9 0.2 -11.8 1 -12.5Z" fill="var(--rosa)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
        <path d="M-14 24C-16 22.5 -22.3 18.7 -26 15C-29.7 11.3 -33.5 5.8 -36 2C-38.5 -1.8 -40.2 -6.3 -41 -8" fill="none" stroke="var(--carbon)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-14 24C-16 22.5 -22.3 18.7 -26 15C-29.7 11.3 -33.5 5.8 -36 2C-38.5 -1.8 -40.2 -6.3 -41 -8" fill="none" stroke="var(--blanco)" strokeWidth={10.200000000000001} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-41 -6C-38.8 -6.8 -35.8 -9.5 -35 -12C-34.2 -14.5 -34.7 -18.7 -36 -21C-37.3 -23.3 -40.5 -25.7 -43 -26C-45.5 -26.3 -49.3 -24.8 -51 -23C-52.7 -21.2 -53.5 -17.7 -53 -15C-52.5 -12.3 -50 -8.5 -48 -7C-46 -5.5 -43.2 -5.2 -41 -6Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="-44" cy={-13} rx={3.4} ry={2.8} fill="var(--rosa)" />
        <circle cx="-39" cy={-19} r={1.4} fill="var(--rosa)" />
        <circle cx="-44" cy={-21} r={1.4} fill="var(--rosa)" />
        <circle cx="-49" cy={-19} r={1.4} fill="var(--rosa)" />
      </g>
      <path d="M58 112C57 111.3 53 108.7 52 108" fill="none" stroke="var(--naranja)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 102C61.3 101 58.7 97 58 96" fill="none" stroke="var(--naranja)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M71 99C71.2 97.8 71.8 93.2 72 92" fill="none" stroke="var(--naranja)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  bano: (
    <>
      <g transform="translate(112 140) scale(1 1)">
        <g className="sticker">
          <g transform="rotate(-6 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(-6 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-17 -31.5C-16.3 -31 -14.3 -28.5 -13 -28.5C-11.7 -28.5 -9.7 -31 -9 -31.5" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -31.5C9.7 -31 11.7 -28.5 13 -28.5C14.3 -28.5 16.3 -31 17 -31.5" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16.1 0 -14.4 0 -14" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4 -13C-3.3 -13.2 -1.3 -14 0 -14C1.3 -14 3.3 -13.2 4 -13" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <circle cx="-26" cy="-64" r="8" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} />
          <circle cx="-12" cy="-70" r="11" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} />
          <circle cx="6" cy="-72" r="12" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} />
          <circle cx="22" cy="-66" r="9" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} />
          <circle cx="32" cy="-60" r="6" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} />
          <circle cx="-4" cy="-84" r="7" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} />
          <circle cx="14" cy="-86" r="5" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} />
          <path d="M-14 -74C-13.3 -74.7 -11.5 -77.2 -10 -78C-8.5 -78.8 -5.8 -78.8 -5 -79" fill="none" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 -76C3.7 -76.7 5.5 -79.3 7 -80C8.5 -80.7 11.2 -80 12 -80" fill="none" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="36" cy="-82" r="3.5" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.3} />
          <path d="M34.1 -82C34.2 -82.3 34.5 -83.2 34.8 -83.6C35.1 -83.9 35.8 -84 36 -84.1" fill="none" stroke="var(--carbon)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="-36" cy="-80" r="2.8" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.3} />
          <path d="M-37.5 -80C-37.4 -80.2 -37.2 -81 -37 -81.3C-36.7 -81.5 -36.2 -81.6 -36 -81.7" fill="none" stroke="var(--carbon)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <g transform="translate(210 140) scale(-1 1)">
        <g className="sticker">
          <g transform="rotate(8 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <g transform="rotate(8 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <path d="M-17 -30C-16.3 -30.7 -14.3 -34 -13 -34C-11.7 -34 -9.7 -30.7 -9 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -30C9.7 -30.7 11.7 -34 13 -34C14.3 -34 16.3 -30.7 17 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <path d="M34 150H286L276 196Q273 205 262 205H58Q47 205 44 196Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 144C52 142.2 116.7 141 160 141C203.3 141 268 142.2 290 144C312 145.8 313.7 150.3 292 152C270.3 153.7 204 154 160 154C116 154 49.7 153.7 28 152C6.3 150.3 8 145.8 30 144Z" fill="var(--menta)" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 205C59 206.5 55 212.5 54 214" fill="none" stroke="var(--carbon)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M260 205C261 206.5 265 212.5 266 214" fill="none" stroke="var(--carbon)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 172C76.7 171.7 103.3 170.3 110 170" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <path d="M200 182C208.3 181.7 241.7 180.3 250 180" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <path d="M60 146C57.5 144.7 63.2 140.6 66 139.7C68.8 138.8 73.5 141.2 76.5 140.6C79.5 140 80.8 136.4 84 136.1C87.2 135.8 92.5 138.7 96 138.8C99.5 138.9 101.8 136.2 105 136.6C108.2 136.9 113 139.5 115.5 141.1C118 142.6 122.2 144.8 120 146C117.8 147.2 108.5 147.9 102 148.2C95.5 148.6 88 148.2 81 147.8C74 147.4 62.5 147.3 60 146Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M198 145C195.2 143.5 201.7 139 204.8 138C207.9 137 213.3 139.7 216.7 139C220.1 138.3 221.5 134.3 225.2 134C228.9 133.7 234.8 136.9 238.8 137C242.8 137.1 245.3 134.1 249 134.5C252.7 134.9 258.1 137.8 260.9 139.5C263.7 141.2 268.6 143.7 266 145C263.4 146.3 253 147.2 245.6 147.5C238.2 147.8 229.7 147.4 221.8 147C213.9 146.6 200.8 146.5 198 145Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="270" cy="112" r="7" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.3} />
      <path d="M266.1 112C266.4 111.5 266.9 109.5 267.6 108.8C268.2 108.1 269.6 108 270 107.8" fill="none" stroke="var(--carbon)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="286" cy="92" r="4" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.3} />
      <path d="M283.8 92C283.9 91.7 284.2 90.6 284.6 90.2C285 89.8 285.8 89.7 286 89.6" fill="none" stroke="var(--carbon)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="40" cy="118" r="5" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.3} />
      <path d="M37.2 118C37.4 117.6 37.8 116.2 38.2 115.8C38.7 115.2 39.7 115.1 40 115" fill="none" stroke="var(--carbon)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="160" cy="104" r="4.5" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.3} />
      <path d="M157.5 104C157.7 103.7 158 102.4 158.4 102C158.8 101.5 159.7 101.4 160 101.3" fill="none" stroke="var(--carbon)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="170" cy="86" r="3" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.3} />
      <path d="M168.3 86C168.4 85.8 168.7 85 168.9 84.7C169.2 84.4 169.8 84.3 170 84.2" fill="none" stroke="var(--carbon)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  secado: (
    <>
      <ellipse cx="165" cy="207" rx="105" ry={4.5} fill="var(--carbon)" opacity={0.07} />
      <g transform="translate(100 142) scale(1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g >
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <g >
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-17 -30C-16.3 -30.7 -14.3 -34 -13 -34C-11.7 -34 -9.7 -30.7 -9 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -30C9.7 -30.7 11.7 -34 13 -34C14.3 -34 16.3 -30.7 17 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16.2 0 -14.8 0 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={0} cy={-11} rx={2} ry={2.5} fill="var(--carbon)" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <path d="M-50 -36C-48.5 -46.8 -46.6 -59.1 -40 -66C-33.4 -72.9 -16.5 -80.5 -6 -82C4.5 -83.5 21.3 -80.5 30 -76C38.7 -71.5 48.4 -60.4 52 -52C55.6 -43.6 55.2 -28.1 54 -20C52.8 -11.9 47.6 -3.1 44 2C40.4 7.1 31.2 17 30 14C28.8 11 36.9 -8.4 36 -18C35.1 -27.6 30.3 -43.4 24 -50C17.7 -56.6 2.7 -62.3 -6 -62C-14.7 -61.7 -28.6 -55.2 -34 -48C-39.4 -40.8 -42.6 -23.6 -42 -14C-41.4 -4.4 -28.8 13 -30 16C-31.2 19 -47 13.8 -50 6C-53 -1.8 -51.5 -25.2 -50 -36Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-30 -62C-25.7 -63.7 -13 -71.3 -4 -72C5 -72.7 19.3 -67 24 -66" fill="none" stroke="var(--blanco)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
          <path d="M-48 4C-48.3 5 -49.7 9 -50 10" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-42 9C-42.2 10 -42.8 14 -43 15" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-36 12C-36 13 -36 17 -36 18" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <g transform="translate(226 142) scale(-1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(-6 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--verde)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(-6 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <ellipse cx="-13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="-12.1" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <ellipse cx="13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="13.9" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M1 -12.5C1.8 -13.2 5.1 -13.2 6 -12.5C6.9 -11.8 6.6 -9 6.2 -8C5.8 -7 4.4 -6.5 3.6 -6.5C2.8 -6.5 1.6 -7 1.2 -8C0.8 -9 0.2 -11.8 1 -12.5Z" fill="var(--rosa)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
        <path d="M14 24C16 22.5 22.3 18.7 26 15C29.7 11.3 33.5 5.8 36 2C38.5 -1.8 40.2 -6.3 41 -8" fill="none" stroke="var(--carbon)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 24C16 22.5 22.3 18.7 26 15C29.7 11.3 33.5 5.8 36 2C38.5 -1.8 40.2 -6.3 41 -8" fill="none" stroke="var(--blanco)" strokeWidth={10.200000000000001} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M41 -6C38.8 -6.8 35.8 -9.5 35 -12C34.2 -14.5 34.7 -18.7 36 -21C37.3 -23.3 40.5 -25.7 43 -26C45.5 -26.3 49.3 -24.8 51 -23C52.7 -21.2 53.5 -17.7 53 -15C52.5 -12.3 50 -8.5 48 -7C46 -5.5 43.2 -5.2 41 -6Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="44" cy={-13} rx={3.4} ry={2.8} fill="var(--rosa)" />
        <circle cx="39" cy={-19} r={1.4} fill="var(--rosa)" />
        <circle cx="44" cy={-21} r={1.4} fill="var(--rosa)" />
        <circle cx="49" cy={-19} r={1.4} fill="var(--rosa)" />
      </g>
      <g transform="translate(207 96) scale(-1 1)">
        <path d="M0 0C2.5 -1.3 27 -7.5 30 -8C33 -8.5 35.5 -7.5 36 -6C36.5 -4.5 36.5 8.5 36 10C35.5 11.5 33 12.2 30 12C27 11.8 2.5 9 0 8C-2.5 7 -2.5 1.3 0 0Z" fill="var(--menta)" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 9C17.1 10.7 15.8 28 16 30C16.2 32 19.2 32.9 20 33C20.8 33.1 25.4 32.9 26 31C26.6 29.1 27.7 11.8 27 10C26.3 8.2 18.9 7.3 18 9Z" fill="var(--menta)" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={2} cy={4} r={3.2} fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.4} />
      </g>
      <path d="M164 88C163 87.3 160 84.3 158 84C156 83.7 153 85.7 152 86" fill="none" stroke="var(--verde-oscuro)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M164 98C162.3 98 155.7 98 154 98" fill="none" stroke="var(--verde-oscuro)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M164 108C163 108.5 160 111 158 111C156 111 153 108.5 152 108" fill="none" stroke="var(--verde-oscuro)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  corte: (
    <>
      <ellipse cx="165" cy="207" rx="105" ry={4.5} fill="var(--carbon)" opacity={0.07} />
      <g transform="translate(104 142) scale(1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(6 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(6 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="-13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="-12.1" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M9 -30C9.7 -30.7 11.7 -34 13 -34C14.3 -34 16.3 -30.7 17 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16.1 0 -14.4 0 -14" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4 -13C-3.3 -13.2 -1.3 -14 0 -14C1.3 -14 3.3 -13.2 4 -13" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <g transform="translate(222 142) scale(-1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(-4 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--verde)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(-4 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <ellipse cx="-11.7" cy="-31" rx={2.7} ry={3.3} fill="var(--carbon)" />
          <circle cx="-10.8" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <ellipse cx="14.3" cy="-31" rx={2.7} ry={3.3} fill="var(--carbon)" />
          <circle cx="15.2" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M1 -12.5C1.8 -13.2 5.1 -13.2 6 -12.5C6.9 -11.8 6.6 -9 6.2 -8C5.8 -7 4.4 -6.5 3.6 -6.5C2.8 -6.5 1.6 -7 1.2 -8C0.8 -9 0.2 -11.8 1 -12.5Z" fill="var(--rosa)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
        <path d="M14 24C16 22.5 22.3 18.7 26 15C29.7 11.3 33.5 5.8 36 2C38.5 -1.8 40.2 -6.3 41 -8" fill="none" stroke="var(--carbon)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 24C16 22.5 22.3 18.7 26 15C29.7 11.3 33.5 5.8 36 2C38.5 -1.8 40.2 -6.3 41 -8" fill="none" stroke="var(--blanco)" strokeWidth={10.200000000000001} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M41 -6C38.8 -6.8 35.8 -9.5 35 -12C34.2 -14.5 34.7 -18.7 36 -21C37.3 -23.3 40.5 -25.7 43 -26C45.5 -26.3 49.3 -24.8 51 -23C52.7 -21.2 53.5 -17.7 53 -15C52.5 -12.3 50 -8.5 48 -7C46 -5.5 43.2 -5.2 41 -6Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="44" cy={-13} rx={3.4} ry={2.8} fill="var(--rosa)" />
        <circle cx="39" cy={-19} r={1.4} fill="var(--rosa)" />
        <circle cx="44" cy={-21} r={1.4} fill="var(--rosa)" />
        <circle cx="49" cy={-19} r={1.4} fill="var(--rosa)" />
      </g>
      <g transform="translate(178 112) rotate(-14) scale(1.35)">
        <path d="M0 0C-1.2 -0.9 -9.7 -7.2 -12 -9C-14.3 -10.8 -27.8 -22.1 -28 -22C-28.2 -21.9 -16.5 -10 -14 -8C-11.5 -6 0.8 1.3 2 2C3.2 2.7 1.2 0.9 0 0Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 0C-1.2 -0.4 -11.4 -1.5 -14 -2C-16.6 -2.5 -31 -6.3 -31 -6C-31 -5.7 -16.7 1.2 -14 2C-11.3 2.8 -0.2 3.2 1 3C2.2 2.8 1.2 0.4 0 0Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 1C1 1.5 5 3.5 6 4" fill="none" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 1C0.7 2.3 3.3 7.7 4 9" fill="none" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={9} cy={4} r={4.6} fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.6} />
        <circle cx={5} cy={12} r={4.6} fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.6} />
        <circle cx={0} cy={1} r={1.4} fill="var(--carbon)" />
      </g>
      <path d="M128 96C128.5 97 130.5 101 131 102" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M138 104C137.5 105 135.5 109 135 110" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M124 110C124.7 110.8 127.3 114.2 128 115" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  listo: (
    <>
      <ellipse cx="165" cy="207" rx="105" ry={4.5} fill="var(--carbon)" opacity={0.07} />
      <g transform="translate(116 142) scale(1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(8 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(8 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-17 -30C-16.3 -30.7 -14.3 -34 -13 -34C-11.7 -34 -9.7 -30.7 -9 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -30C9.7 -30.7 11.7 -34 13 -34C14.3 -34 16.3 -30.7 17 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <g transform="translate(-26 -60) rotate(-15)">
            <path d="M0 0C0.1 -0.8 -11.1 -7.3 -12 -7C-12.9 -6.7 -13.8 4.5 -13 5C-12.2 5.5 -0.1 0.8 0 0Z" fill="var(--rosa)" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0 0C-0.1 -0.8 11.1 -7.3 12 -7C12.9 -6.7 13.8 4.5 13 5C12.2 5.5 0.1 0.8 0 0Z" fill="var(--rosa)" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={0} cy={0} r={2.6} fill="var(--rosa)" stroke="var(--carbon)" strokeWidth={1.5} />
          </g>
        </g>
      </g>
      <g transform="translate(204 142) scale(-1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(8 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--verde)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(8 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <path d="M-17 -30C-16.3 -30.7 -14.3 -34 -13 -34C-11.7 -34 -9.7 -30.7 -9 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -30C9.7 -30.7 11.7 -34 13 -34C14.3 -34 16.3 -30.7 17 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M1 -12.5C1.8 -13.2 5.1 -13.2 6 -12.5C6.9 -11.8 6.6 -9 6.2 -8C5.8 -7 4.4 -6.5 3.6 -6.5C2.8 -6.5 1.6 -7 1.2 -8C0.8 -9 0.2 -11.8 1 -12.5Z" fill="var(--rosa)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <path d="M42 49Q44.2 55.8 51 58Q44.2 60.2 42 67Q39.8 60.2 33 58Q39.8 55.8 42 49Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M282 63Q283.7 68.3 289 70Q283.7 71.7 282 77Q280.3 71.7 275 70Q280.3 68.3 282 63Z" fill="var(--verde)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M272 127Q273.2 130.8 277 132Q273.2 133.2 272 137Q270.8 133.2 267 132Q270.8 130.8 272 127Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M48 123Q49.2 126.8 53 128Q49.2 129.2 48 133Q46.8 129.2 43 128Q46.8 126.8 48 123Z" fill="var(--verde)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M160 24Q161.4 28.6 166 30Q161.4 31.4 160 36Q158.6 31.4 154 30Q158.6 28.6 160 24Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  foto: (
    <>
      <ellipse cx="165" cy="207" rx="105" ry={4.5} fill="var(--carbon)" opacity={0.07} />
      <g transform="translate(214 140) scale(-1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(12 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--verde)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(12 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <ellipse cx="-13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="-12.1" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <ellipse cx="13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="13.9" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16.2 0 -14.8 0 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={0} cy={-11} rx={2} ry={2.5} fill="var(--carbon)" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <g transform="translate(124 142) scale(1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(6 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(6 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="-11.7" cy="-31" rx={2.7} ry={3.3} fill="var(--carbon)" />
          <circle cx="-10.8" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <ellipse cx="14.3" cy="-31" rx={2.7} ry={3.3} fill="var(--carbon)" />
          <circle cx="15.2" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16.1 0 -14.4 0 -14" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4 -13C-3.3 -13.2 -1.3 -14 0 -14C1.3 -14 3.3 -13.2 4 -13" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <g transform="translate(128 176) rotate(-4)">
        <path d="M-16 -26Q-16 -30 -12 -30H12Q16 -30 16 -26V26Q16 30 12 30H-12Q-16 30 -16 26Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 -22H11V18H-11Z" fill="var(--menta)" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={0} cy={2} rx={5} ry={4} fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.2} />
        <circle cx={-5} cy={-5} r={2} fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.1} />
        <circle cx={0} cy={-8} r={2} fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.1} />
        <circle cx={5} cy={-5} r={2} fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.1} />
        <path d="M-4 24C-2.7 24 2.7 24 4 24" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-22 6C-22 4 -16.3 0 -14 0C-11.7 0 -8 4 -8 6C-8 8 -11.7 12 -14 12C-16.3 12 -22 8 -22 6Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 6C22 4 16.3 0 14 0C11.7 0 8 4 8 6C8 8 11.7 12 14 12C16.3 12 22 8 22 6Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M70 54Q71.4 58.6 76 60Q71.4 61.4 70 66Q68.6 61.4 64 60Q68.6 58.6 70 54Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  duerme: (
    <>
      <ellipse cx="165" cy="207" rx="105" ry={4.5} fill="var(--carbon)" opacity={0.07} />
      <g transform="translate(210 144) scale(-1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(14 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--verde)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(14 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <path d="M-17 -31.5C-16.3 -31 -14.3 -28.5 -13 -28.5C-11.7 -28.5 -9.7 -31 -9 -31.5" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -31.5C9.7 -31 11.7 -28.5 13 -28.5C14.3 -28.5 16.3 -31 17 -31.5" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16.1 0 -14.4 0 -14" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4 -13C-3.3 -13.2 -1.3 -14 0 -14C1.3 -14 3.3 -13.2 4 -13" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <g transform="translate(114 144) scale(1 1)">
        <g className="sticker">
          <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <g transform="rotate(14 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <path d="M26 44C27 41 31.7 39.3 34 36C36.3 32.7 38.5 27.8 40 24C41.5 20.2 41.5 15.7 43 13C44.5 10.3 48 7.3 49 8C50 8.7 48 15.7 49 17C50 18.3 54.8 14.3 55 16C55.2 17.7 51.8 23 50 27C48.2 31 46.5 36.2 44 40C41.5 43.8 37.7 47.7 35 50C32.3 52.3 29.5 55 28 54C26.5 53 25 47 26 44Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 30C42.7 28.3 45.3 21.7 46 20" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-20 -2C-16.7 -2.7 -12.7 1.3 -8 2C-3.3 2.7 3.2 2.7 8 2C12.8 1.3 17.8 -3 21 -2C24.2 -1 25.2 5.7 27 8C28.8 10.3 31.7 10 32 12C32.3 14 28.8 16.8 29 20C29.2 23.2 31.8 27 33 31C34.2 35 36.2 40 36 44C35.8 48 34 52.3 32 55C30 57.7 27 59.2 24 60C21 60.8 18 59.8 14 60C10 60.2 4.7 61 0 61C-4.7 61 -10 60 -14 60C-18 60 -21 61.8 -24 61C-27 60.2 -30 58 -32 55C-34 52 -36 47 -36 43C-36 39 -32.2 34.3 -32 31C-31.8 27.7 -35.5 25.5 -35 23C-34.5 20.5 -30.2 18.8 -29 16C-27.8 13.2 -29.5 9 -28 6C-26.5 3 -23.3 -1.3 -20 -2Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-13 34C-13.2 36 -14.2 42.7 -14 46C-13.8 49.3 -12.3 52.7 -12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 34C13.2 36 14.2 42.7 14 46C13.8 49.3 12.3 52.7 12 54" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-4 22C-3.7 23.3 -2.3 28.7 -2 30" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 24C4.7 25.2 3.3 29.8 3 31" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-30 40C-29 41.3 -25 46.7 -24 48" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 60C-19 58.5 -18.2 55.3 -17 54C-15.8 52.7 -13 52 -11 52C-9 52 -6.2 52.7 -5 54C-3.8 55.3 -3 58.5 -4 60C-5 61.5 -8.7 63 -11 63C-13.3 63 -17 61.5 -18 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-11 55C-11 55.7 -11 58.3 -11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 60C3 58.5 3.8 55.3 5 54C6.2 52.7 9 52 11 52C13 52 15.8 52.7 17 54C18.2 55.3 19 58.5 18 60C17 61.5 13.3 63 11 63C8.7 63 5 61.5 4 60Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 55C11 55.7 11 58.3 11 59" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-17 3C-16.2 2.3 -3.4 9 0 9C3.4 9 16.2 2.3 17 3C17.8 3.7 9.7 14.3 8 16C6.3 17.7 1.6 20 0 20C-1.6 20 -6.3 17.7 -8 16C-9.7 14.3 -17.8 3.7 -17 3Z" fill="var(--naranja)" stroke="var(--carbon)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-2 12C-1.3 12 1.3 12 2 12" fill="none" stroke="var(--carbon)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <g transform="rotate(14 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-17 -31.5C-16.3 -31 -14.3 -28.5 -13 -28.5C-11.7 -28.5 -9.7 -31 -9 -31.5" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -31.5C9.7 -31 11.7 -28.5 13 -28.5C14.3 -28.5 16.3 -31 17 -31.5" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16.1 0 -14.4 0 -14" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4 -13C-3.3 -13.2 -1.3 -14 0 -14C1.3 -14 3.3 -13.2 4 -13" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <path d="M250 36C251.3 36 258 34.5 258 36C258 37.5 250 43.5 250 45C250 46.5 256.7 45 258 45" fill="none" stroke="var(--carbon)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M263 24C263.8 24 268 23 268 24C268 25 263 29 263 30C263 31 267.2 30 268 30" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M56 48C57.3 48 64 46.5 64 48C64 49.5 56 55.5 56 57C56 58.5 62.7 57 64 57" fill="none" stroke="var(--carbon)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M69 36C69.8 36 74 35 74 36C74 37 69 41 69 42C69 43 73.2 42 74 42" fill="none" stroke="var(--carbon)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
}

/** Los mellis haciendo algo juntos (escena apaisada, 320 × 220). */
export function Melli({ pose = 'saluda', size = 120, className, title }: BaseProps & { pose?: PoseMelli }) {
  return (
    <Svg viewBox="0 0 320 220" ratio={320 / 220} size={size} className={className} title={title}>
      {escenas[pose]}
    </Svg>
  )
}

const cabezas = {
  melli: (
    <>
      <g transform="translate(100 142) scale(1 1)">
        <g className="sticker">
          <g >
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <g >
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="-13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="-12.1" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <ellipse cx="13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="13.9" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
    </>
  ),
  melliza: (
    <>
      <g transform="translate(100 142) scale(-1 1)">
        <g className="sticker">
          <g >
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <g >
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <ellipse cx="-13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="-12.1" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <ellipse cx="13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="13.9" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
    </>
  ),
}

/** La cabeza de uno de los dos: avatar y sellos chicos. */
export function MelliCabeza({
  size = 40,
  className,
  title,
  cual = 'melli',
}: BaseProps & { cual?: keyof typeof cabezas }) {
  return (
    <Svg viewBox="34 58 132 104" ratio={132 / 104} size={size} className={className} title={title}>
      {cabezas[cual]}
    </Svg>
  )
}

/** Isotipo: las dos cabezas juntas, inclinadas una hacia la otra. */
export function Mellis({ size = 40, className, title }: BaseProps) {
  return (
    <Svg viewBox="6 8 208 100" ratio={208 / 100} size={size} className={className} title={title}>
      <g transform="translate(152 86) scale(-1 1)">
        <g className="sticker">
          <g transform="rotate(-12 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <g transform="rotate(-12 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -38C7.5 -40.2 11.3 -42 14 -42C16.7 -42 20.3 -40.2 22 -38C23.7 -35.8 24.5 -31.7 24 -29C23.5 -26.3 21.3 -23 19 -22C16.7 -21 12.3 -21.8 10 -23C7.7 -24.2 5.7 -26.5 5 -29C4.3 -31.5 4.5 -35.8 6 -38Z" fill="var(--naranja)" stroke="none" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <path d="M-17 -30C-16.3 -30.7 -14.3 -34 -13 -34C-11.7 -34 -9.7 -30.7 -9 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -30C9.7 -30.7 11.7 -34 13 -34C14.3 -34 16.3 -30.7 17 -30" fill="none" stroke="var(--carbon)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
      <g transform="translate(68 88) scale(1 1)">
        <g className="sticker">
          <g transform="rotate(10 0 -10)">
            <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--blanco)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <g transform="rotate(10 0 -10)">
          <path d="M0 -66C2.2 -67.5 3.5 -72 5 -72C6.5 -72 7.3 -66.3 9 -66C10.7 -65.7 13.5 -70.5 15 -70C16.5 -69.5 16.2 -64.7 18 -63C19.8 -61.3 23.5 -61.5 26 -60C28.5 -58.5 31 -56.3 33 -54C35 -51.7 35.8 -48.3 38 -46C40.2 -43.7 43.8 -42.8 46 -40C48.2 -37.2 49.8 -33 51 -29C52.2 -25 53 -20 53 -16C53 -12 52 -8.2 51 -5C50 -1.8 48.2 2.2 47 3C45.8 3.8 45.2 -0.3 44 0C42.8 0.3 41.5 5 40 5C38.5 5 36.2 2.3 35 0C33.8 -2.3 33.5 -8.5 33 -9C32.5 -9.5 33 -5 32 -3C31 -1 29 1.3 27 3C25 4.7 22.3 6.2 20 7C17.7 7.8 15.2 7.3 13 8C10.8 8.7 9.2 10.8 7 11C4.8 11.2 2.3 9 0 9C-2.3 9 -4.8 11.2 -7 11C-9.2 10.8 -10.8 8.7 -13 8C-15.2 7.3 -17.7 7.8 -20 7C-22.3 6.2 -25 4.8 -27 3C-29 1.2 -30.8 -2 -32 -4C-33.2 -6 -33 -9.5 -34 -9C-35 -8.5 -36.5 -3.2 -38 -1C-39.5 1.2 -41.7 3.7 -43 4C-44.3 4.3 -44.7 1.2 -46 1C-47.3 0.8 -49.5 4.3 -51 3C-52.5 1.7 -54.3 -3.5 -55 -7C-55.7 -10.5 -55.2 -14.5 -55 -18C-54.8 -21.5 -55 -24.8 -54 -28C-53 -31.2 -51.2 -34.3 -49 -37C-46.8 -39.7 -43.3 -41.3 -41 -44C-38.7 -46.7 -37.3 -50.3 -35 -53C-32.7 -55.7 -29.7 -58.5 -27 -60C-24.3 -61.5 -21.2 -60.7 -19 -62C-16.8 -63.3 -15.8 -67.8 -14 -68C-12.2 -68.2 -10.3 -63.3 -8 -63C-5.7 -62.7 -2.2 -64.5 0 -66Z" fill="var(--blanco)" stroke="var(--carbon)" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 -42C35.7 -39.7 34.2 -32.3 34 -28C33.8 -23.7 34.8 -18 35 -16" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-38 -42C-37.5 -39.7 -35.5 -32.5 -35 -28C-34.5 -23.5 -35 -17.2 -35 -15" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-28 -2C-27.3 -2.7 -24.7 -5.3 -24 -6" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 -4C27.7 -4.7 30.3 -7.3 31 -8" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="-13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="-12.1" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <ellipse cx="13" cy="-31" rx={3} ry={3.6} fill="var(--carbon)" />
          <circle cx="13.9" cy="-32.2" r={0.9} fill="var(--blanco)" />
          <path d="M-3 -60C-3.7 -58.7 -6.5 -54.5 -7 -52C-7.5 -49.5 -6.2 -46.2 -6 -45" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 -61C6.5 -59.8 7.8 -55.8 9 -54C10.2 -52.2 12.3 -50.7 13 -50" fill="none" stroke="var(--carbon)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 -57C16 -56 20 -52 21 -51" fill="none" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.6 -21C-4.1 -21.8 -1.5 -22.5 0 -22.5C1.5 -22.5 4.1 -21.8 4.6 -21C5.1 -20.2 3.8 -18.2 3 -17.5C2.2 -16.8 1 -16.5 0 -16.5C-1 -16.5 -2.2 -16.8 -3 -17.5C-3.8 -18.2 -5.1 -20.2 -4.6 -21Z" fill="var(--carbon)" stroke="var(--carbon)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-1.8 -20.6C-1.4 -20.7 0.4 -21.1 0.8 -21.2" fill="none" stroke="var(--blanco)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          <path d="M1 -12.5C1.8 -13.2 5.1 -13.2 6 -12.5C6.9 -11.8 6.6 -9 6.2 -8C5.8 -7 4.4 -6.5 3.6 -6.5C2.8 -6.5 1.6 -7 1.2 -8C0.8 -9 0.2 -11.8 1 -12.5Z" fill="var(--rosa)" stroke="var(--carbon)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 -16.5C0 -16 0 -14 0 -13.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 -14C-5.5 -13.6 -4 -11.6 -3 -11.5C-2 -11.4 -1 -13.5 0 -13.5C1 -13.5 1.9 -11.3 3 -11.5C4.1 -11.7 5.9 -14 6.5 -14.5" fill="none" stroke="var(--carbon)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={-23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
          <ellipse cx={23} cy={-21} rx={4.5} ry={2.6} fill="var(--rosa)" opacity={0.7} />
        </g>
      </g>
    </Svg>
  )
}
