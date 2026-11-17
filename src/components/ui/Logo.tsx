/*
  Logo de Pet Mellis (manual §2 y §13.1). Es un asset de marca: sus colores son fijos
  y no se recolorean, por eso este es el único componente con hex propios.
  Tamaño mínimo: isotipo 24 px de alto; imagotipo horizontal 120 px de ancho.
*/

const TEAL = '#14B8A6'
const MARFIL = '#FFFDF9'
const PETROLEO = '#0F2942'
const MEJILLA = '#2DD4BF'

type IsotipoProps = { height?: number; className?: string; title?: string }

export function Isotipo({ height = 40, className, title }: IsotipoProps) {
  const width = Math.round((height * 230) / 150)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 230 150"
      width={width}
      height={height}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {/* Mellis de atrás: marfil con moño teal */}
      <path
        d="M125.63 53.18A9.42 9.42 0 0 1 136.16 65.18A9.42 9.42 0 0 1 133.35 80.9A9.42 9.42 0 0 1 119.31 88.5A9.42 9.42 0 0 1 104.61 82.26A9.42 9.42 0 0 1 100.33 66.88A9.42 9.42 0 0 1 109.68 53.94A9.42 9.42 0 0 1 125.63 53.18Z"
        fill={MARFIL}
        stroke={PETROLEO}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M204.75 53.18A9.42 9.42 0 0 1 215.28 65.18A9.42 9.42 0 0 1 212.47 80.9A9.42 9.42 0 0 1 198.43 88.5A9.42 9.42 0 0 1 183.73 82.26A9.42 9.42 0 0 1 179.45 66.88A9.42 9.42 0 0 1 188.8 53.94A9.42 9.42 0 0 1 204.75 53.18Z"
        fill={MARFIL}
        stroke={PETROLEO}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M165.99 14.7A14.05 14.05 0 0 1 187.57 24.76A14.05 14.05 0 0 1 201.23 44.27A14.05 14.05 0 0 1 203.3 67.99A14.05 14.05 0 0 1 193.24 89.57A14.05 14.05 0 0 1 173.73 103.23A14.05 14.05 0 0 1 150.01 105.3A14.05 14.05 0 0 1 128.43 95.24A14.05 14.05 0 0 1 114.77 75.73A14.05 14.05 0 0 1 112.7 52.01A14.05 14.05 0 0 1 122.76 30.43A14.05 14.05 0 0 1 142.27 16.77A14.05 14.05 0 0 1 165.99 14.7Z"
        fill={MARFIL}
        stroke={PETROLEO}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M136.38 60.92Q142.36 67.5 148.34 60.92"
        fill="none"
        stroke={PETROLEO}
        strokeWidth="4.25"
        strokeLinecap="round"
      />
      <path
        d="M167.66 60.92Q173.64 67.5 179.62 60.92"
        fill="none"
        stroke={PETROLEO}
        strokeWidth="4.25"
        strokeLinecap="round"
      />
      <circle cx="132.7" cy="72.42" r="4.6" fill={MEJILLA} />
      <circle cx="183.3" cy="72.42" r="4.6" fill={MEJILLA} />
      <ellipse cx="158" cy="70.12" rx="5.98" ry="4.14" fill={PETROLEO} />
      <path
        d="M158 74.26v3.22M151.56 76.56Q154.78 81.62 158 77.48Q161.22 81.62 164.44 76.56"
        fill="none"
        stroke={PETROLEO}
        strokeWidth="4.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="rotate(-18 177.32 24.12)">
        <path
          d="M177.32 24.12L161.68 14.74Q159.33 24.12 161.68 33.5Z"
          fill={TEAL}
          stroke={PETROLEO}
          strokeWidth="4.25"
          strokeLinejoin="round"
        />
        <path
          d="M177.32 24.12L192.96 14.74Q195.31 24.12 192.96 33.5Z"
          fill={TEAL}
          stroke={PETROLEO}
          strokeWidth="4.25"
          strokeLinejoin="round"
        />
        <circle cx="177.32" cy="24.12" r="3.75" fill={TEAL} stroke={PETROLEO} strokeWidth="4.25" />
      </g>
      {/* Mellis de adelante: teal */}
      <path
        d="M39.5 77.51A10.24 10.24 0 0 1 53.04 88.37A10.24 10.24 0 0 1 53 105.72A10.24 10.24 0 0 1 39.4 116.51A10.24 10.24 0 0 1 22.49 112.61A10.24 10.24 0 0 1 15 96.95A10.24 10.24 0 0 1 22.57 81.33A10.24 10.24 0 0 1 39.5 77.51Z"
        fill={TEAL}
        stroke={PETROLEO}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M125.5 77.51A10.24 10.24 0 0 1 139.04 88.37A10.24 10.24 0 0 1 139 105.72A10.24 10.24 0 0 1 125.4 116.51A10.24 10.24 0 0 1 108.49 112.61A10.24 10.24 0 0 1 101 96.95A10.24 10.24 0 0 1 108.57 81.33A10.24 10.24 0 0 1 125.5 77.51Z"
        fill={TEAL}
        stroke={PETROLEO}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M78 36A15.27 15.27 0 0 1 103 42.7A15.27 15.27 0 0 1 121.3 61A15.27 15.27 0 0 1 128 86A15.27 15.27 0 0 1 121.3 111A15.27 15.27 0 0 1 103 129.3A15.27 15.27 0 0 1 78 136A15.27 15.27 0 0 1 53 129.3A15.27 15.27 0 0 1 34.7 111A15.27 15.27 0 0 1 28 86A15.27 15.27 0 0 1 34.7 61A15.27 15.27 0 0 1 53 42.7A15.27 15.27 0 0 1 78 36Z"
        fill={TEAL}
        stroke={PETROLEO}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M54.5 87Q61 94.15 67.5 87"
        fill="none"
        stroke={PETROLEO}
        strokeWidth="4.25"
        strokeLinecap="round"
      />
      <path
        d="M88.5 87Q95 94.15 101.5 87"
        fill="none"
        stroke={PETROLEO}
        strokeWidth="4.25"
        strokeLinecap="round"
      />
      <ellipse cx="78" cy="97" rx="6.5" ry="4.5" fill={PETROLEO} />
      <path
        d="M78 101.5v3.5M71 104Q74.5 109.5 78 105Q81.5 109.5 85 104"
        fill="none"
        stroke={PETROLEO}
        strokeWidth="4.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ImagotipoProps = {
  /** `light`: sobre marfil o menta. `dark`: sobre petróleo (texto marfil, descriptor teal). */
  tone?: 'light' | 'dark'
  tagline?: string
  className?: string
}

/** Imagotipo horizontal: isotipo + «pet mellis» + descriptor. */
export function Imagotipo({
  tone = 'light',
  tagline = 'peluquería canina · Merlo',
  className,
}: ImagotipoProps) {
  const oscuro = tone === 'dark'
  return (
    <span className={['inline-flex items-center gap-2.5', className].filter(Boolean).join(' ')}>
      {/* Sobre petróleo, el isotipo va con una placa marfil para no perder su línea */}
      <span className={oscuro ? 'rounded-md bg-marfil px-1 py-0.5' : undefined}>
        <Isotipo height={30} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-xl font-semibold lowercase tracking-tight ${oscuro ? 'text-marfil' : 'text-texto'}`}
        >
          pet mellis
        </span>
        <span className={`rotulo mt-1 ${oscuro ? 'text-teal' : 'text-texto-suave'}`}>
          {tagline}
        </span>
      </span>
    </span>
  )
}
