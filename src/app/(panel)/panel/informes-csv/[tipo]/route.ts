import { NextResponse } from 'next/server'

import { loadReport, reportCSV, tiposCSV, type TipoCSV } from '@/lib/panel/informes'
import { getStaffSession } from '@/lib/panel/sesion'

/** Descarga de informes en CSV. Solo con sesión del salón. */
export async function GET(_req: Request, { params }: { params: Promise<{ tipo: string }> }) {
  const sesion = await getStaffSession()
  if (!sesion) return new NextResponse('Ingresá al panel para descargar informes.', { status: 401 })
  const { tipo } = await params
  if (!(tiposCSV as readonly string[]).includes(tipo))
    return new NextResponse('Informe desconocido.', { status: 404 })

  const { nombre, contenido } = reportCSV(
    tipo as TipoCSV,
    await loadReport(sesion.payload, sesion.user),
  )
  return new NextResponse(contenido, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${nombre}"`,
      'Cache-Control': 'no-store',
    },
  })
}
