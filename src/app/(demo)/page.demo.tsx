'use client'

import { InicioVista } from '@/components/cliente/InicioVista'
import { catalogOf, WHATSAPP_SALON } from '@/demo/estado'
import { useEstado } from '@/demo/store'
import { UBICACION_SALON } from '@/lib/brand'
import { whatsappLink } from '@/lib/whatsapp'

const dias: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

export default function InicioDemo() {
  const s = useEstado()
  return (
    <InicioVista
      servicios={catalogOf(s).servicios}
      direccion={UBICACION_SALON}
      horarios={s.horarios.map((h) => ({ ...h, dia: dias[h.dia] ?? h.dia }))}
      whatsapp={whatsappLink(WHATSAPP_SALON, 'Hola, quería consultar por un turno para mi perro.')}
    />
  )
}
