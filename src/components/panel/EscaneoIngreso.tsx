import { Icon } from '@/components/ui'
import {
  estadoPelaje,
  hidratacionLabels,
  origenLabels,
  texturaLabels,
  tratamientoInfo,
  type EscaneoTurno,
} from '@/lib/ia/cuidado'

/**
 * Ficha de la consulta por foto en el panel (Solicitudes, Hoy, Registrar).
 * Siempre rotulada como sugerencia: la peluquera la confirma al ver al perro.
 */
export function EscaneoIngreso({ escaneo: e, compacto = false }: { escaneo: EscaneoTurno; compacto?: boolean }) {
  const plan = tratamientoInfo[e.tratamiento].nombre
  return (
    <section
      aria-label="Ficha de IA Scan"
      className="flex flex-col gap-1.5 rounded-md border border-linea bg-durazno p-3 text-sm text-carbon"
    >
      <p className="flex flex-wrap items-center gap-2">
        <Icon name="escaner" size={18} />
        <span className="rotulo">Consulta por foto</span>
        <span className="rotulo rounded-pill border border-linea bg-superficie px-2 py-0.5 text-texto">
          {origenLabels[e.origen]}
        </span>
      </p>
      {compacto ? (
        <p>
          <strong>{plan}</strong> · {e.raza} · {texturaLabels[e.textura].toLowerCase()} ·{' '}
          {estadoPelaje(e).replace(/\.$/, '').toLowerCase()}
        </p>
      ) : (
        <dl className="grid gap-x-4 gap-y-0.5 sm:grid-cols-[auto_1fr]">
          <dt className="font-bold">Plan sugerido</dt>
          <dd>{plan}</dd>
          <dt className="font-bold">Raza probable</dt>
          <dd>{e.raza}</dd>
          <dt className="font-bold">Pelaje</dt>
          <dd>
            {texturaLabels[e.textura]} · hidratación {hidratacionLabels[e.hidratacion].toLowerCase()}
          </dd>
          <dt className="font-bold">Estado</dt>
          <dd>{estadoPelaje(e)}</dd>
        </dl>
      )}
    </section>
  )
}
