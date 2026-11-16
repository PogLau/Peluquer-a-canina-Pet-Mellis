import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Usuarios } from './collections/Usuarios'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Fase 0: solo usuarios (auth de la peluquera) y media.
// Las colecciones del negocio (tutores, mascotas, servicios, turnos...) llegan en la Fase 1.
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
  collections: [Usuarios, Media],
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
