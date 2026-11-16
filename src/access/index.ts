import type { Access, FieldAccess } from 'payload'

/*
  Control de acceso (CLAUDE.md §6).
  - El salón (usuarios con sesión de Payload: peluquera o admin) ve y edita todo.
  - El catálogo (servicios, extras, etiquetas, configuración) es de lectura pública: lo usa el cotizador.
  - Los datos de clientes son solo del salón. El acceso del tutor (filtrado por su sesión) llega en la Fase 4
    desde el servidor, nunca abriendo estas colecciones al público.
*/

type ReqLike = { req: { user?: { collection?: string; rol?: string | null } | null } }

export function isStaff({ req }: ReqLike): boolean {
  return req.user?.collection === 'usuarios'
}

export const staffOnly: Access = (args) => isStaff(args)

export const anyone: Access = () => true

export const adminOnly: Access = ({ req }) => req.user?.collection === 'usuarios' && req.user.rol === 'admin'

/** Para campos internos (por ejemplo, la nota interna de una atención). */
export const staffField: FieldAccess = (args) => isStaff(args)
