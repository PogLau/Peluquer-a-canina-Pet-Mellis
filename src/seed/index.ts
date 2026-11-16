/* eslint-disable no-console -- script de terminal */
import config from '@payload-config'
import { getPayload } from 'payload'

import { seed } from './seed'

// Solo contra una base SQLite local: nunca borrar datos de una base desplegada
const uri = process.env.DATABASE_URI ?? 'file:./petmellis.db'
if (!uri.startsWith('file:')) {
  console.error(`pnpm seed solo corre contra SQLite local (DATABASE_URI=file:...). Recibido: ${uri.split(':')[0]}:...`)
  process.exit(1)
}

const payload = await getPayload({ config })
await seed(payload, (msg) => console.log(`  ${msg}`))
console.log('Seed terminado.')
process.exit(0)
