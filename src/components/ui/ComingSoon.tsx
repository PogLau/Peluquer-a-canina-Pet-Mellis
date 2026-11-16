import { EmptyState } from './Notice'
import { PageHeader } from './PageHeader'
import type { IconName } from './Icons'

/** Pantalla reservada: la ruta y la navegación ya existen; el contenido llega en la fase indicada. */
export function ComingSoon({
  title,
  description,
  phase,
  icon,
}: {
  title: string
  description: string
  phase: string
  icon?: IconName
}) {
  return (
    <>
      <PageHeader title={title}>{description}</PageHeader>
      <EmptyState icon={icon} title="en preparación">
        Esta pantalla se arma en la {phase}.
      </EmptyState>
    </>
  )
}
