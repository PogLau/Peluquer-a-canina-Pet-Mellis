# Pet Mellis

Web app de **Los Mellis – Peluquería Canina** (Merlo, Buenos Aires), con **Ficha Evolutiva**: *cada visita mejora la siguiente.*

- Contexto completo del proyecto: [`CLAUDE.md`](CLAUDE.md)
- Manual de marca y tokens: [`branding-pet-mellis.md`](branding-pet-mellis.md)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 · Payload CMS 3 (SQLite) · Vitest · pnpm.

## Puesta en marcha

Requiere Node.js 22, 24 o 26 y pnpm.

```bash
pnpm install
cp .env.example .env   # completar PAYLOAD_SECRET y el resto
pnpm dev
```

| Ruta | Qué es |
|---|---|
| `/` | Panel de cliente (Inicio, Cotizar, Reservar, Mi mascota, Mis turnos) |
| `/panel` | Panel de la peluquera (Hoy, Solicitudes, Mascotas, Clientes, Precios, Informes) |
| `/admin` | Admin de Payload, para el equipo técnico |
| `/dev/ui` | Catálogo de componentes (solo en desarrollo) |

## Comandos

```bash
pnpm dev          # servidor de desarrollo
pnpm lint
pnpm typecheck    # tsc --noEmit
pnpm test         # precios, WhatsApp y reglas de diseño
pnpm build
```

## Estructura

```
src/
├── app/
│   ├── (cliente)/        layout propio + páginas del tutor
│   ├── (panel)/panel/    layout propio + páginas de la peluquera
│   ├── (payload)/        admin y API de Payload (generado)
│   └── (dev)/dev/ui/     catálogo de componentes
├── collections/          colecciones de Payload
├── components/ui/        Ticket, Button, Field, Chip, StatusBadge, TagChip, Stepper, Modal, Nav, Icons, Logo
├── components/cliente/   componentes del panel de cliente
├── components/panel/     componentes del panel de la peluquera
├── lib/                  pricing.ts, format.ts, whatsapp.ts
└── styles/globals.css    tokens de marca
```

## Publicación

**Demo interactiva:** https://poglau.github.io/Peluquer-a-canina-Pet-Mellis/ — funciona entera en el navegador, con datos ficticios, y se publica sola en cada push a `main` ([`docs/demo.md`](docs/demo.md)). Para producción, la app completa va en Vercel con Postgres ([`docs/publicacion.md`](docs/publicacion.md)).
