import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Atenciones } from './collections/Atenciones'
import { Etiquetas } from './collections/Etiquetas'
import { Extras } from './collections/Extras'
import { Mascotas } from './collections/Mascotas'
import { Media } from './collections/Media'
import { Servicios } from './collections/Servicios'
import { Turnos } from './collections/Turnos'
import { Tutores } from './collections/Tutores'
import { Usuarios } from './collections/Usuarios'
import { Configuracion } from './globals/Configuracion'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * SQLite para la demo local (DATABASE_URI=file:...) y Postgres para Vercel (DATABASE_URI=postgres://...).
 * En Postgres el esquema se crea con migraciones (src/migrations), que corren en cada build de Vercel.
 */
function databaseAdapter() {
  const uri = process.env.DATABASE_URI || 'file:./petmellis.db'
  if (/^postgres(ql)?:\/\//.test(uri)) {
    return postgresAdapter({
      pool: { connectionString: uri },
      migrationDir: path.resolve(dirname, 'migrations'),
      // En producción aplica las migraciones pendientes al arrancar (no hace falta correrlas a mano)
      prodMigrations: migrations,
    })
  }
  return sqliteAdapter({ client: { url: uri } })
}

export default buildConfig({
  admin: {
    user: Usuarios.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Pet Mellis',
    },
  },
  collections: [Turnos, Atenciones, Mascotas, Tutores, Servicios, Extras, Etiquetas, Media, Usuarios],
  globals: [Configuracion],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: databaseAdapter(),
  sharp,
})
