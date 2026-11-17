import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/* IA Scan & Care: el escaneo de ingreso viaja con el turno (escrita a mano, como la del enlace). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "turnos" ADD COLUMN "escaneo" jsonb;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "turnos" DROP COLUMN "escaneo";`)
}
