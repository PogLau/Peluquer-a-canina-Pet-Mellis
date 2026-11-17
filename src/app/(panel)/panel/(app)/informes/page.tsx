import type { Metadata } from 'next'

import { InformesVista } from '@/components/panel/InformesVista'
import { buttonClasses, Icon } from '@/components/ui'
import { appBaseUrl } from '@/lib/enlace-cliente'
import { loadReport, type TipoCSV } from '@/lib/panel/informes'
import { requireStaff } from '@/lib/panel/sesion'

export const metadata: Metadata = { title: 'Informes' }

function Exportar({ tipo, children }: { tipo: TipoCSV; children: string }) {
  // Enlace común (no next/link): el navegador descarga el archivo
  return (
    <a
      href={`/panel/informes-csv/${tipo}`}
      download
      className={buttonClasses({ variant: 'secondary', size: 'small' })}
    >
      <Icon name="flecha" size={18} className="rotate-90" />
      {children}
    </a>
  )
}

export default async function InformesPage() {
  const { payload, user } = await requireStaff()
  const [r, base] = await Promise.all([loadReport(payload, user), appBaseUrl()])
  return (
    <InformesVista
      r={r}
      base={base}
      exportar={(tipo, etiqueta) => <Exportar tipo={tipo}>{etiqueta}</Exportar>}
    />
  )
}
