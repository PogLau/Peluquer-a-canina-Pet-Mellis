import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/*
  Enlace personal del cliente: columna nueva en tutores (escrita a mano, mismo formato que la inicial).
  Los tutores existentes reciben su código la primera vez que el panel arma su enlace.
*/
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tutores" ADD COLUMN "enlace_token" varchar;
  CREATE UNIQUE INDEX "tutores_enlace_token_idx" ON "tutores" USING btree ("enlace_token");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "tutores_enlace_token_idx";
  ALTER TABLE "tutores" DROP COLUMN "enlace_token";`)
}
