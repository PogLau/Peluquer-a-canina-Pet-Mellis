import { InicioVista } from '@/components/cliente/InicioVista'
import { getCatalogo, getDatosLocal } from '@/lib/datos-publicos'

// Precios, dirección y horarios salen de la base: un cambio en el panel se ve en la próxima visita
export const dynamic = 'force-dynamic'

export default async function InicioPage() {
  const [catalogo, local] = await Promise.all([getCatalogo(), getDatosLocal()])
  return (
    <InicioVista
      servicios={catalogo?.servicios ?? []}
      direccion={local.direccion}
      horarios={local.horarios}
      whatsapp={local.whatsapp}
    />
  )
}
