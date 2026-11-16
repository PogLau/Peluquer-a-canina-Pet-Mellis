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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./petmellis.db',
    },
  }),
  sharp,
})
