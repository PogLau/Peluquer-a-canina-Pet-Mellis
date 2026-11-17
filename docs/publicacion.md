# Publicación

| Qué | Dónde | URL | Se publica |
|---|---|---|---|
| **Demo interactiva** (datos ficticios en el navegador) | GitHub Pages | `https://poglau.github.io/Peluquer-a-canina-Pet-Mellis/` | Sola, en cada push a `main` (workflow `.github/workflows/pages.yml`). Ver [`docs/demo.md`](demo.md) |
| **App completa** (cotizador, reservas, `/panel`, `/admin`, base de datos) | Vercel + Postgres (Neon) | la que asigne Vercel | Opcional, para uso real. Pasos abajo |

Para mostrar el proyecto alcanza con la demo: no necesita cuentas, servidor ni base de datos. Lo que sigue es para cuando el salón quiera usar la app de verdad.

---

## 1. App en Vercel

1. Entrá a [vercel.com](https://vercel.com) con tu cuenta de GitHub → **Add New… → Project** → importá `PogLau/Peluquer-a-canina-Pet-Mellis`.
2. Framework: **Next.js** (lo detecta solo). La instalación y el build ya están en `vercel.json` (usa pnpm 12).
3. En **Environment Variables** cargá (los valores listos para pegar están en `.env.vercel`, en tu PC; ese archivo no se sube):

   | Variable | Valor |
   |---|---|
   | `PAYLOAD_SECRET` | una cadena larga y aleatoria (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `WHATSAPP_LOCAL` | el WhatsApp del local, solo dígitos: `5491151770132` |
   | `GEMINI_API_KEY`, `GEMINI_MODEL` | opcionales: activan el análisis real de fotos |

4. **Deploy**. Este primer intento puede fallar porque todavía no hay base de datos: es normal.

## 2. Base de datos (Neon, gratis, desde Vercel)

1. En el proyecto de Vercel → pestaña **Storage → Create Database → Neon (Serverless Postgres)**. Región: São Paulo (`gru1`), la más cercana.
2. **Connect** al proyecto. Vercel crea sola la variable `DATABASE_URL` (la app la usa si no hay `DATABASE_URI`).
3. **Deployments → ⋯ → Redeploy**. Las tablas se crean solas al arrancar (migraciones de `src/migrations`).

También sirve crear la base en [neon.tech](https://neon.tech) y cargar su connection string con pooling como `DATABASE_URI`.

## 3. Datos de demo
Cargá los datos de demo **desde tu PC**, apuntando a la base de Neon (borra los datos del negocio de esa base):

   ```bash
   DATABASE_URI="postgresql://...neon..." SEED_PERMITIR_REMOTO=si DEMO_ADMIN_EMAIL="..." DEMO_ADMIN_PASSWORD="..." pnpm seed
   ```

   En PowerShell, definí cada variable con `$env:NOMBRE = "valor"` antes de `pnpm seed`.

Desde ahí, cada `git push` a `main` vuelve a publicar la app.

## 4. Demo en GitHub Pages

En **Settings → Pages → Source** tiene que estar **GitHub Actions**. Cada push a `main` construye la demo (`pnpm build:demo`) y la publica. Ver [`docs/demo.md`](demo.md).

## Cambios en el código para publicar

- `src/payload.config.ts`: usa **Postgres** si `DATABASE_URI` empieza con `postgres://` o `postgresql://`, y SQLite en cualquier otro caso (demo local).
- `src/migrations/`: migraciones de Postgres (la inicial y `enlace_tutor`, escrita a mano para el enlace personal del cliente). Cuando se cambie una colección, generar otra con `pnpm payload migrate:create <nombre>` (con `DATABASE_URI` de Postgres) y commitearla.
- `pnpm seed` contra una base remota exige `SEED_PERMITIR_REMOTO=si`.

## Pendiente antes de subir fotos en producción

Vercel no guarda archivos subidos: el disco del servidor se borra en cada publicación. Antes de usar la colección `media` (fotos de mascotas) en producción, hay que conectar un almacenamiento externo, por ejemplo `@payloadcms/storage-vercel-blob`. Hoy la app no sube fotos (el análisis de fotos no las guarda), así que no bloquea la demo.
