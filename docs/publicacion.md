# Publicación: app en Vercel + portada en GitHub Pages

| Qué | Dónde | URL | Se publica |
|---|---|---|---|
| **App completa** (cotizador, reservas, `/panel`, `/admin`) | Vercel + Postgres (Neon) | la que asigne Vercel, por ejemplo `https://pet-mellis.vercel.app` | Sola, en cada push a `main` |
| **Portada** (carpeta `portada/`) | GitHub Pages | `https://poglau.github.io/Peluquer-a-canina-Pet-Mellis/` | Sola, en cada push a `main` que toque `portada/` (workflow `.github/workflows/pages.yml`) |

## Por qué no todo en GitHub Pages

GitHub Pages solo sirve archivos estáticos. La app necesita un servidor para Payload, la base de datos, el login de la peluquera, las server actions (sugerir con foto) y los precios en vivo. Con `output: 'export'` el build falla, porque Next no puede exportar rutas de API ni server actions. Por eso:

- **No** hace falta `output: 'export'`, `basePath` ni `assetPrefix` en `next.config.ts`: la app no se publica en Pages.
- La portada usa **rutas relativas** (`favicon.svg`, `./`), así funciona bajo `/Peluquer-a-canina-Pet-Mellis/` sin configurar nada.

---

## 1. Base de datos (Neon, gratis)

1. Entrá a [neon.tech](https://neon.tech) y creá un proyecto (región: São Paulo, la más cercana).
2. Copiá la **connection string con pooling** (empieza con `postgresql://` y tiene `-pooler` en el host).

## 2. App en Vercel

1. Entrá a [vercel.com](https://vercel.com) con tu cuenta de GitHub → **Add New… → Project** → importá `PogLau/Peluquer-a-canina-Pet-Mellis`.
2. Framework: **Next.js** (lo detecta solo). La instalación y el build ya están en `vercel.json` (usa pnpm 12).
3. En **Environment Variables** cargá:

   | Variable | Valor |
   |---|---|
   | `DATABASE_URI` | la connection string de Neon |
   | `PAYLOAD_SECRET` | una cadena larga y aleatoria (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `WHATSAPP_LOCAL` | el WhatsApp del local, solo dígitos (`549...`) |
   | `GEMINI_API_KEY`, `GEMINI_MODEL` | opcionales: activan el análisis real de fotos |

4. **Deploy**. Las tablas se crean solas la primera vez que arranca (migraciones de `src/migrations`).
5. Cargá los datos de demo **desde tu PC**, apuntando a la base de Neon (borra los datos del negocio de esa base):

   ```bash
   DATABASE_URI="postgresql://...neon..." SEED_PERMITIR_REMOTO=si DEMO_ADMIN_EMAIL="..." DEMO_ADMIN_PASSWORD="..." pnpm seed
   ```

   En PowerShell, definí cada variable con `$env:NOMBRE = "valor"` antes de `pnpm seed`.

6. Desde ahí, cada `git push` a `main` vuelve a publicar la app.

## 3. Portada en GitHub Pages

En el repositorio, en GitHub:

1. **Settings → Pages → Build and deployment → Source:** elegí **GitHub Actions** (no «Deploy from a branch»).
2. **Settings → Secrets and variables → Actions → pestaña Variables → New repository variable:**
   - Name: `APP_URL`
   - Value: la URL de Vercel, sin barra final (por ejemplo `https://pet-mellis.vercel.app`).
3. **Actions → «Portada en GitHub Pages» → Run workflow** para la primera publicación. Las siguientes salen solas con cada push que toque `portada/`.
4. Al terminar, la URL aparece en el resumen del workflow y en **Settings → Pages**.

Si `APP_URL` no está cargada, la portada se publica igual, pero oculta los botones de la app y muestra «La reserva online está por abrir».

## Cambios en el código para publicar

- `src/payload.config.ts`: usa **Postgres** si `DATABASE_URI` empieza con `postgres://` o `postgresql://`, y SQLite en cualquier otro caso (demo local).
- `src/migrations/`: migraciones de Postgres (la inicial y `enlace_tutor`, escrita a mano para el enlace personal del cliente). Cuando se cambie una colección, generar otra con `pnpm payload migrate:create <nombre>` (con `DATABASE_URI` de Postgres) y commitearla.
- `pnpm seed` contra una base remota exige `SEED_PERMITIR_REMOTO=si`.

## Pendiente antes de subir fotos en producción

Vercel no guarda archivos subidos: el disco del servidor se borra en cada publicación. Antes de usar la colección `media` (fotos de mascotas) en producción, hay que conectar un almacenamiento externo, por ejemplo `@payloadcms/storage-vercel-blob`. Hoy la app no sube fotos (el análisis de fotos no las guarda), así que no bloquea la demo.
