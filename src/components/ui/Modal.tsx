'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'

import { Icon } from './Icons'

type Props = {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  /** Botones de acción al pie. */
  footer?: ReactNode
}

/** Modal sobre <dialog> nativo: atrapa el foco, cierra con Escape y devuelve el foco al salir. */
export function Modal({ open, onClose, title, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-auto w-[calc(100%-32px)] max-w-lg rounded-md border-2 border-tinta bg-superficie p-0 text-texto shadow-ticket backdrop:bg-petroleo/50"
    >
      <div className="flex items-start justify-between gap-4 border-b-2 border-tinta px-5 py-4">
        <h2 id={titleId} className="text-xl">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="-m-1 rounded-sm p-1 text-texto hover:bg-superficie-alt"
          aria-label="Cerrar"
        >
          <Icon name="cerrar" />
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
      {footer && <div className="flex flex-wrap justify-end gap-3 border-t-2 border-linea px-5 py-4">{footer}</div>}
    </dialog>
  )
}
