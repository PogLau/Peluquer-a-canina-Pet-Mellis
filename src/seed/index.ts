/* eslint-disable no-console -- script de terminal */
import config from '@payload-config'
import { getPayload } from 'payload'

import { seed } from './seed'

/*
  El seed BORRA los datos del negocio y carga la demo.
  - SQLite local (DATABASE_URI=file:...): corre directo.
  - Base remota (por ejemplo, la Postgres de Vercel): solo con SEED_PERMITIR_REMOTO=si,
    para que nadie borre una base real por error.
*/
const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || 'file:./petmellis.db'
const esLocal = uri.startsWith('file:')
if (!esLocal && process.env.SEED_PERMITIR_REMOTO !== 'si') {
  console.error(
    'pnpm seed borra los datos. Contra una base remota hay que confirmarlo con SEED_PERMITIR_REMOTO=si.',
  )
  process.exit(1)
}

const payload = await getPayload({ config })
await seed(payload, (msg) => console.log(`  ${msg}`))
console.log('Seed terminado.')
process.exit(0)
