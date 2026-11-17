'use client'

import { InformesVista } from '@/components/panel/InformesVista'
import { Button } from '@/components/ui'
import { reporte } from '@/demo/selectores'
import { useEstado } from '@/demo/store'
import { reportCSV, type Reporte, type TipoCSV } from '@/lib/panel/informes'

/** En la demo el CSV se arma en el navegador (en la app real lo descarga el servidor). */
function descargar(tipo: TipoCSV, r: Reporte) {
  const { nombre, contenido } = reportCSV(tipo, r)
  const url = URL.createObjectURL(new Blob([contenido], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  a.click()
  URL.revokeObjectURL(url)
}

export default function InformesDemo() {
  const s = useEstado()
  const r = reporte(s)
  const base = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}`
  return (
    <InformesVista
      r={r}
      base={base}
      exportar={(tipo, etiqueta) => (
        <Button variant="secondary" size="small" icon="flecha" onClick={() => descargar(tipo, r)}>
          {etiqueta}
        </Button>
      )}
    />
  )
}
