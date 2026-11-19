import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_extras_tipo" AS ENUM('fijo', 'porcentaje');
  ALTER TYPE "public"."enum_mascotas_tamano" ADD VALUE 'gigante';
  ALTER TABLE "configuracion" ALTER COLUMN "multiplicadores_manto_largo" SET DEFAULT 1;
  ALTER TABLE "configuracion" ALTER COLUMN "multiplicadores_manto_rizado" SET DEFAULT 1;
  ALTER TABLE "configuracion" ALTER COLUMN "recargos_nudos_leves" SET DEFAULT 12000;
  ALTER TABLE "configuracion" ALTER COLUMN "recargos_nudos_moderados" SET DEFAULT 18000;
  ALTER TABLE "configuracion" ALTER COLUMN "recargos_nudos_severos" SET DEFAULT 25000;
  ALTER TABLE "servicios" ADD COLUMN "precio_gigante" numeric;
  ALTER TABLE "servicios" ADD COLUMN "precio_chico_hasta" numeric;
  ALTER TABLE "servicios" ADD COLUMN "precio_mediano_hasta" numeric;
  ALTER TABLE "servicios" ADD COLUMN "precio_grande_hasta" numeric;
  ALTER TABLE "servicios" ADD COLUMN "precio_gigante_hasta" numeric;
  ALTER TABLE "extras" ADD COLUMN "tipo" "enum_extras_tipo" DEFAULT 'fijo' NOT NULL;
  ALTER TABLE "extras" ADD COLUMN "precio_hasta" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "mascotas" ALTER COLUMN "tamano" SET DATA TYPE text;
  DROP TYPE "public"."enum_mascotas_tamano";
  CREATE TYPE "public"."enum_mascotas_tamano" AS ENUM('chico', 'mediano', 'grande');
  ALTER TABLE "mascotas" ALTER COLUMN "tamano" SET DATA TYPE "public"."enum_mascotas_tamano" USING "tamano"::"public"."enum_mascotas_tamano";
  ALTER TABLE "configuracion" ALTER COLUMN "multiplicadores_manto_largo" SET DEFAULT 1.15;
  ALTER TABLE "configuracion" ALTER COLUMN "multiplicadores_manto_rizado" SET DEFAULT 1.2;
  ALTER TABLE "configuracion" ALTER COLUMN "recargos_nudos_leves" SET DEFAULT 1500;
  ALTER TABLE "configuracion" ALTER COLUMN "recargos_nudos_moderados" SET DEFAULT 3500;
  ALTER TABLE "configuracion" ALTER COLUMN "recargos_nudos_severos" SET DEFAULT 6000;
  ALTER TABLE "servicios" DROP COLUMN "precio_gigante";
  ALTER TABLE "servicios" DROP COLUMN "precio_chico_hasta";
  ALTER TABLE "servicios" DROP COLUMN "precio_mediano_hasta";
  ALTER TABLE "servicios" DROP COLUMN "precio_grande_hasta";
  ALTER TABLE "servicios" DROP COLUMN "precio_gigante_hasta";
  ALTER TABLE "extras" DROP COLUMN "tipo";
  ALTER TABLE "extras" DROP COLUMN "precio_hasta";
  DROP TYPE "public"."enum_extras_tipo";`)
}
