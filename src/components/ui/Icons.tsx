import type { ReactNode, SVGProps } from 'react'

/*
  Íconos de interfaz de Pet Mellis (manual §5 y §13.4):
  24 × 24, trazo de 1,75 px, puntas redondeadas, en currentColor.
  Nunca reemplazarlos por emojis.
*/

const trazos = {
  pata: (
    <g fill="currentColor" stroke="none">
      <ellipse cx="7" cy="9" rx="1.8" ry="2.4" />
      <ellipse cx="17" cy="9" rx="1.8" ry="2.4" />
      <ellipse cx="10" cy="5" rx="1.7" ry="2.2" />
      <ellipse cx="14" cy="5" rx="1.7" ry="2.2" />
      <path d="M12 11.5c-3 0-5.5 3.6-5.5 5.6 0 1.6 1.3 2.4 2.7 2.4 1.2 0 1.8-.6 2.8-.6s1.6.6 2.8.6c1.4 0 2.7-.8 2.7-2.4 0-2-2.5-5.6-5.5-5.6Z" />
    </g>
  ),
  tijera: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
    </>
  ),
  bano: (
    <>
      <path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Z" />
      <path d="M6 12V5.5A2.5 2.5 0 0 1 10.5 4" />
      <path d="M7 20l-1 2M17 20l1 2" />
    </>
  ),
  cepillo: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <path d="M6 10v8M9 10v10M12 10v8M15 10v10M18 10v8" />
    </>
  ),
  unas: (
    <>
      <path d="M7 4c-2 3-2 7 0 10l3 3" />
      <path d="M17 4c2 3 2 7 0 10l-3 3" />
      <circle cx="12" cy="19" r="2" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  ubicacion: (
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6L4 20Z" />
      <path d="M9.5 9.5c0 2.5 2.5 5 5 5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2Z" />
    </>
  ),
  inicio: <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z" />,
  cotizar: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </>
  ),
  calendario: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  libreta: (
    <>
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
      <path d="M5 17a3 3 0 0 1 3-3h11" />
    </>
  ),
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  volver: <path d="M19 12H5M11 6l-6 6 6 6" />,
  alerta: (
    <>
      <path d="M12 4 21 19H3L12 4Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  usuarios: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c1.2-3.5 3.7-5.5 6.5-5.5s5.3 2 6.5 5.5" />
      <path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M17.5 14.8c1.8.7 3.2 2.4 4 5.2" />
    </>
  ),
  grafico: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="m7 15 4-4 3 3 5-6" />
    </>
  ),
  bandeja: (
    <>
      <path d="M4 13 6.5 5h11L20 13v6H4v-6Z" />
      <path d="M4 13h4.5l1 2h5l1-2H20" />
    </>
  ),
  etiqueta: (
    <>
      <path d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="7.5" cy="8.5" r="1.5" />
    </>
  ),
  ajustes: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  buscar: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  mas: <path d="M12 5v14M5 12h14" />,
  cerrar: <path d="M6 6l12 12M18 6 6 18" />,
  salir: (
    <>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </>
  ),
  escaner: (
    <>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <path d="M4 12h16" />
    </>
  ),
  gota: <path d="M12 3.5c3 3.7 6 7.2 6 10.5a6 6 0 0 1-12 0c0-3.3 3-6.8 6-10.5Z" />,
  camara: (
    <>
      <path d="M4 8h3l1.5-2.5h7L17 8h3v11H4V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof trazos
export const iconNames = Object.keys(trazos) as IconName[]

type Props = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  name: IconName
  /** Tamaño en px (24 por defecto). */
  size?: number
  /** Si el ícono transmite información por sí solo, describilo acá. Si no, queda oculto a lectores. */
  label?: string
}

export function Icon({ name, size = 24, label, className, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['shrink-0', className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...props}
    >
      {trazos[name]}
    </svg>
  )
}
