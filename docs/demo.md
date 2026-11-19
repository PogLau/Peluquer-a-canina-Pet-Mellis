# Demo interactiva (GitHub Pages)

**Dirección:** https://poglau.github.io/Peluquer-a-canina-Pet-Mellis/

Es la forma de mostrar el trabajo sin montar infraestructura: un sitio estático que funciona entero en el navegador. Sirve para presentar el proyecto y para que cualquiera lo pruebe.

## Qué es y qué no es

| | Demo (GitHub Pages) | App real (Next.js + Payload) |
|---|---|---|
| Datos | Ficticios, guardados en el navegador de cada visitante (`localStorage`). Nada se envía a ningún lado | Base de datos (SQLite local, Postgres en producción) |
| Peluquera | Barra «Ver como peluquera», sin contraseña | Usuario y contraseña (`/panel/ingresar`) |
| Cliente | Su enlace de demo con código secreto `/mi/?t=<código>` (desde su ficha en el panel), o reservando por primera vez. Cada cliente ve solo sus perros y turnos | Enlace personal secreto `/mi/<token>` |
| Reiniciar | Botón «Reiniciar demo» (solo afecta a ese navegador) | `pnpm seed` |
| Sugerir con foto | Solo los ejemplos, rotulados como ejemplos | Análisis real con Gemini si hay clave |
| WhatsApp | Los botones abren `wa.me` con el mensaje armado; nada se manda solo | Igual |

## Qué se puede hacer

Todo el guion de la demo (`CLAUDE.md` §10):

1. **Cliente:** cotizar (Toby: $15.200), reservar en 4 pasos con horarios libres de verdad, avisar por WhatsApp, ver «Mis turnos» y «Mi mascota».
1. **IA Scan & Care (en Cotizar):** elegir una foto de ejemplo, ver el escaneo y la ficha de ingreso (raza, pelaje, hidratación, nudos, tratamiento y precio) y «Reservar con este plan». La ficha llega a Solicitudes y a Registrar atención. Las fichas de ejemplo están preparadas a mano y rotuladas; una foto propia no se analiza en la demo (el tutor marca lo que ve).
2. **Peluquera:** ver la solicitud nueva y aceptarla, iniciar a Max con un toque, registrar la atención de Toby, ver la mejora en la Ficha Evolutiva, enviar el resumen, cambiar precios (se ven al instante en el cotizador) e Informes con descarga en CSV.

## Cómo está hecha

- Las pantallas usan **los mismos componentes y la misma lógica** que la app real (precios, Ficha Evolutiva, horarios libres, mensajes, informes, validaciones). Los componentes reciben sus acciones por props: la app real les pasa acciones del servidor y la demo, funciones sobre los datos del navegador.
- `src/app/(demo)/`: las páginas de la demo (`*.demo.tsx`). En el build normal no son páginas.
- `src/demo/`: estado inicial (los datos de `src/seed/datos.ts`, con fechas relativas a hoy), operaciones, selectores y el marco con la barra de demo.
- `next.config.ts`: con `DEMO_ESTATICO=1` se exporta solo la demo como HTML estático en `.next-demo/`.

## Comandos

```bash
pnpm dev:demo     # demo en http://localhost:3002
pnpm build:demo   # sitio estático en .next-demo/
```

La publicación es automática: el workflow `.github/workflows/pages.yml` corre typecheck y tests, construye la demo con la ruta del repositorio y la publica en cada push a `main`.
