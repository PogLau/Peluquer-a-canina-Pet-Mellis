import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_turnos_estado" AS ENUM('solicitado', 'confirmado', 'en_atencion', 'listo', 'finalizado', 'cancelado');
  CREATE TYPE "public"."enum_turnos_nudos" AS ENUM('sin', 'leves', 'moderados', 'severos');
  CREATE TYPE "public"."enum_turnos_origen" AS ENUM('web', 'panel');
  CREATE TYPE "public"."enum_mascotas_tamano" AS ENUM('chico', 'mediano', 'grande');
  CREATE TYPE "public"."enum_mascotas_manto" AS ENUM('corto', 'largo', 'rizado');
  CREATE TYPE "public"."enum_etiquetas_tipo" AS ENUM('alerta', 'info');
  CREATE TYPE "public"."enum_usuarios_rol" AS ENUM('peluquera', 'admin');
  CREATE TYPE "public"."enum_configuracion_horarios_dia" AS ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo');
  CREATE TABLE "turnos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fecha_hora" timestamp(3) with time zone NOT NULL,
  	"estado" "enum_turnos_estado" DEFAULT 'solicitado' NOT NULL,
  	"tutor_id" integer NOT NULL,
  	"mascota_id" integer NOT NULL,
  	"nudos" "enum_turnos_nudos" DEFAULT 'sin' NOT NULL,
  	"precio_estimado" numeric,
  	"origen" "enum_turnos_origen" DEFAULT 'panel' NOT NULL,
  	"notas_cliente" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "turnos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"servicios_id" integer,
  	"extras_id" integer
  );
  
  CREATE TABLE "atenciones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fecha" timestamp(3) with time zone NOT NULL,
  	"mascota_id" integer NOT NULL,
  	"turno_id" integer,
  	"precio_final" numeric,
  	"puntajes_secador" numeric,
  	"puntajes_unas" numeric,
  	"puntajes_bano" numeric,
  	"puntajes_desenredado" numeric,
  	"nota_interna" varchar,
  	"resumen_tutor" varchar,
  	"recomendacion" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "atenciones_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"servicios_id" integer,
  	"etiquetas_id" integer
  );
  
  CREATE TABLE "mascotas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"tutor_id" integer NOT NULL,
  	"foto_id" integer,
  	"raza" varchar,
  	"tamano" "enum_mascotas_tamano" NOT NULL,
  	"manto" "enum_mascotas_manto" NOT NULL,
  	"peso_kg" numeric,
  	"nacimiento" timestamp(3) with time zone,
  	"cuidados_especiales" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mascotas_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"etiquetas_id" integer
  );
  
  CREATE TABLE "tutores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"whatsapp" varchar NOT NULL,
  	"email" varchar,
  	"zona" varchar,
  	"notas" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "servicios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"descripcion" varchar,
  	"duracion" varchar,
  	"precio_chico" numeric NOT NULL,
  	"precio_mediano" numeric NOT NULL,
  	"precio_grande" numeric NOT NULL,
  	"aplica_recargo_manto" boolean DEFAULT true,
  	"popular" boolean DEFAULT false,
  	"activo" boolean DEFAULT true,
  	"orden" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "extras" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"descripcion" varchar,
  	"precio" numeric NOT NULL,
  	"activo" boolean DEFAULT true,
  	"orden" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "etiquetas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"tipo" "enum_etiquetas_tipo" DEFAULT 'info' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "usuarios_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "usuarios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar,
  	"rol" "enum_usuarios_rol" DEFAULT 'peluquera' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"turnos_id" integer,
  	"atenciones_id" integer,
  	"mascotas_id" integer,
  	"tutores_id" integer,
  	"servicios_id" integer,
  	"extras_id" integer,
  	"etiquetas_id" integer,
  	"media_id" integer,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "configuracion_horarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dia" "enum_configuracion_horarios_dia" NOT NULL,
  	"abre" varchar NOT NULL,
  	"cierra" varchar NOT NULL
  );
  
  CREATE TABLE "configuracion" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"direccion" varchar DEFAULT 'Merlo, Buenos Aires',
  	"whatsapp_local" varchar,
  	"duracion_turno_min" numeric DEFAULT 60,
  	"multiplicadores_manto_corto" numeric DEFAULT 1 NOT NULL,
  	"multiplicadores_manto_largo" numeric DEFAULT 1.15 NOT NULL,
  	"multiplicadores_manto_rizado" numeric DEFAULT 1.2 NOT NULL,
  	"recargos_nudos_leves" numeric DEFAULT 1500 NOT NULL,
  	"recargos_nudos_moderados" numeric DEFAULT 3500 NOT NULL,
  	"recargos_nudos_severos" numeric DEFAULT 6000 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "turnos" ADD CONSTRAINT "turnos_tutor_id_tutores_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "turnos" ADD CONSTRAINT "turnos_mascota_id_mascotas_id_fk" FOREIGN KEY ("mascota_id") REFERENCES "public"."mascotas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "turnos_rels" ADD CONSTRAINT "turnos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."turnos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "turnos_rels" ADD CONSTRAINT "turnos_rels_servicios_fk" FOREIGN KEY ("servicios_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "turnos_rels" ADD CONSTRAINT "turnos_rels_extras_fk" FOREIGN KEY ("extras_id") REFERENCES "public"."extras"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "atenciones" ADD CONSTRAINT "atenciones_mascota_id_mascotas_id_fk" FOREIGN KEY ("mascota_id") REFERENCES "public"."mascotas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "atenciones" ADD CONSTRAINT "atenciones_turno_id_turnos_id_fk" FOREIGN KEY ("turno_id") REFERENCES "public"."turnos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "atenciones_rels" ADD CONSTRAINT "atenciones_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."atenciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "atenciones_rels" ADD CONSTRAINT "atenciones_rels_servicios_fk" FOREIGN KEY ("servicios_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "atenciones_rels" ADD CONSTRAINT "atenciones_rels_etiquetas_fk" FOREIGN KEY ("etiquetas_id") REFERENCES "public"."etiquetas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mascotas" ADD CONSTRAINT "mascotas_tutor_id_tutores_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."tutores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mascotas" ADD CONSTRAINT "mascotas_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mascotas_rels" ADD CONSTRAINT "mascotas_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mascotas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mascotas_rels" ADD CONSTRAINT "mascotas_rels_etiquetas_fk" FOREIGN KEY ("etiquetas_id") REFERENCES "public"."etiquetas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "usuarios_sessions" ADD CONSTRAINT "usuarios_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_turnos_fk" FOREIGN KEY ("turnos_id") REFERENCES "public"."turnos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_atenciones_fk" FOREIGN KEY ("atenciones_id") REFERENCES "public"."atenciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mascotas_fk" FOREIGN KEY ("mascotas_id") REFERENCES "public"."mascotas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tutores_fk" FOREIGN KEY ("tutores_id") REFERENCES "public"."tutores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_servicios_fk" FOREIGN KEY ("servicios_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_extras_fk" FOREIGN KEY ("extras_id") REFERENCES "public"."extras"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_etiquetas_fk" FOREIGN KEY ("etiquetas_id") REFERENCES "public"."etiquetas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion_horarios" ADD CONSTRAINT "configuracion_horarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracion"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "turnos_fecha_hora_idx" ON "turnos" USING btree ("fecha_hora");
  CREATE INDEX "turnos_estado_idx" ON "turnos" USING btree ("estado");
  CREATE INDEX "turnos_tutor_idx" ON "turnos" USING btree ("tutor_id");
  CREATE INDEX "turnos_mascota_idx" ON "turnos" USING btree ("mascota_id");
  CREATE INDEX "turnos_updated_at_idx" ON "turnos" USING btree ("updated_at");
  CREATE INDEX "turnos_created_at_idx" ON "turnos" USING btree ("created_at");
  CREATE INDEX "turnos_rels_order_idx" ON "turnos_rels" USING btree ("order");
  CREATE INDEX "turnos_rels_parent_idx" ON "turnos_rels" USING btree ("parent_id");
  CREATE INDEX "turnos_rels_path_idx" ON "turnos_rels" USING btree ("path");
  CREATE INDEX "turnos_rels_servicios_id_idx" ON "turnos_rels" USING btree ("servicios_id");
  CREATE INDEX "turnos_rels_extras_id_idx" ON "turnos_rels" USING btree ("extras_id");
  CREATE INDEX "atenciones_fecha_idx" ON "atenciones" USING btree ("fecha");
  CREATE INDEX "atenciones_mascota_idx" ON "atenciones" USING btree ("mascota_id");
  CREATE INDEX "atenciones_turno_idx" ON "atenciones" USING btree ("turno_id");
  CREATE INDEX "atenciones_updated_at_idx" ON "atenciones" USING btree ("updated_at");
  CREATE INDEX "atenciones_created_at_idx" ON "atenciones" USING btree ("created_at");
  CREATE INDEX "atenciones_rels_order_idx" ON "atenciones_rels" USING btree ("order");
  CREATE INDEX "atenciones_rels_parent_idx" ON "atenciones_rels" USING btree ("parent_id");
  CREATE INDEX "atenciones_rels_path_idx" ON "atenciones_rels" USING btree ("path");
  CREATE INDEX "atenciones_rels_servicios_id_idx" ON "atenciones_rels" USING btree ("servicios_id");
  CREATE INDEX "atenciones_rels_etiquetas_id_idx" ON "atenciones_rels" USING btree ("etiquetas_id");
  CREATE INDEX "mascotas_nombre_idx" ON "mascotas" USING btree ("nombre");
  CREATE INDEX "mascotas_tutor_idx" ON "mascotas" USING btree ("tutor_id");
  CREATE INDEX "mascotas_foto_idx" ON "mascotas" USING btree ("foto_id");
  CREATE INDEX "mascotas_updated_at_idx" ON "mascotas" USING btree ("updated_at");
  CREATE INDEX "mascotas_created_at_idx" ON "mascotas" USING btree ("created_at");
  CREATE INDEX "mascotas_rels_order_idx" ON "mascotas_rels" USING btree ("order");
  CREATE INDEX "mascotas_rels_parent_idx" ON "mascotas_rels" USING btree ("parent_id");
  CREATE INDEX "mascotas_rels_path_idx" ON "mascotas_rels" USING btree ("path");
  CREATE INDEX "mascotas_rels_etiquetas_id_idx" ON "mascotas_rels" USING btree ("etiquetas_id");
  CREATE UNIQUE INDEX "tutores_whatsapp_idx" ON "tutores" USING btree ("whatsapp");
  CREATE INDEX "tutores_updated_at_idx" ON "tutores" USING btree ("updated_at");
  CREATE INDEX "tutores_created_at_idx" ON "tutores" USING btree ("created_at");
  CREATE UNIQUE INDEX "servicios_slug_idx" ON "servicios" USING btree ("slug");
  CREATE INDEX "servicios_updated_at_idx" ON "servicios" USING btree ("updated_at");
  CREATE INDEX "servicios_created_at_idx" ON "servicios" USING btree ("created_at");
  CREATE UNIQUE INDEX "extras_slug_idx" ON "extras" USING btree ("slug");
  CREATE INDEX "extras_updated_at_idx" ON "extras" USING btree ("updated_at");
  CREATE INDEX "extras_created_at_idx" ON "extras" USING btree ("created_at");
  CREATE UNIQUE INDEX "etiquetas_nombre_idx" ON "etiquetas" USING btree ("nombre");
  CREATE INDEX "etiquetas_updated_at_idx" ON "etiquetas" USING btree ("updated_at");
  CREATE INDEX "etiquetas_created_at_idx" ON "etiquetas" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "usuarios_sessions_order_idx" ON "usuarios_sessions" USING btree ("_order");
  CREATE INDEX "usuarios_sessions_parent_id_idx" ON "usuarios_sessions" USING btree ("_parent_id");
  CREATE INDEX "usuarios_updated_at_idx" ON "usuarios" USING btree ("updated_at");
  CREATE INDEX "usuarios_created_at_idx" ON "usuarios" USING btree ("created_at");
  CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_turnos_id_idx" ON "payload_locked_documents_rels" USING btree ("turnos_id");
  CREATE INDEX "payload_locked_documents_rels_atenciones_id_idx" ON "payload_locked_documents_rels" USING btree ("atenciones_id");
  CREATE INDEX "payload_locked_documents_rels_mascotas_id_idx" ON "payload_locked_documents_rels" USING btree ("mascotas_id");
  CREATE INDEX "payload_locked_documents_rels_tutores_id_idx" ON "payload_locked_documents_rels" USING btree ("tutores_id");
  CREATE INDEX "payload_locked_documents_rels_servicios_id_idx" ON "payload_locked_documents_rels" USING btree ("servicios_id");
  CREATE INDEX "payload_locked_documents_rels_extras_id_idx" ON "payload_locked_documents_rels" USING btree ("extras_id");
  CREATE INDEX "payload_locked_documents_rels_etiquetas_id_idx" ON "payload_locked_documents_rels" USING btree ("etiquetas_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_usuarios_id_idx" ON "payload_locked_documents_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_usuarios_id_idx" ON "payload_preferences_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "configuracion_horarios_order_idx" ON "configuracion_horarios" USING btree ("_order");
  CREATE INDEX "configuracion_horarios_parent_id_idx" ON "configuracion_horarios" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "turnos" CASCADE;
  DROP TABLE "turnos_rels" CASCADE;
  DROP TABLE "atenciones" CASCADE;
  DROP TABLE "atenciones_rels" CASCADE;
  DROP TABLE "mascotas" CASCADE;
  DROP TABLE "mascotas_rels" CASCADE;
  DROP TABLE "tutores" CASCADE;
  DROP TABLE "servicios" CASCADE;
  DROP TABLE "extras" CASCADE;
  DROP TABLE "etiquetas" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "usuarios_sessions" CASCADE;
  DROP TABLE "usuarios" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "configuracion_horarios" CASCADE;
  DROP TABLE "configuracion" CASCADE;
  DROP TYPE "public"."enum_turnos_estado";
  DROP TYPE "public"."enum_turnos_nudos";
  DROP TYPE "public"."enum_turnos_origen";
  DROP TYPE "public"."enum_mascotas_tamano";
  DROP TYPE "public"."enum_mascotas_manto";
  DROP TYPE "public"."enum_etiquetas_tipo";
  DROP TYPE "public"."enum_usuarios_rol";
  DROP TYPE "public"."enum_configuracion_horarios_dia";`)
}
