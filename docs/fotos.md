# Fotos de la web app

Las fotos de `public/fotos/` son de bancos de imágenes y están reducidas a WebP de hasta 1.200 px
(entre 17 y 116 KB cada una). Son material de demostración: antes de usar la app con clientes reales,
reemplazarlas por fotos propias del salón (ver CLAUDE.md §14).

| Archivo | Dónde se usa | Fuente |
|---|---|---|
| `yorkshire-mesa.webp` | Inicio (foto principal) | Freepik («haircuting process small dog sits table…») |
| `corte-mesa.webp` | Inicio, «en el salón» | Freepik («haircuting process small dog sits table…») |
| `yorkshire-tijera.webp` | Inicio, «en el salón» | Freepik («woman shears dog… yorkshire terrier») |
| `yorkshire-bata.webp` | Inicio, «en el salón» | Freepik («lovely pet portrait isolated») |
| `yorkshire-toalla.webp` | Inicio, «en el salón» | Freepik («close up hands holding yorkshire…») |
| `yorkshire-largo.webp` | IA Scan & Care, ejemplo «Yorkshire» | Freepik («lovely pet portrait isolated») |
| `shih-tzu.webp` | IA Scan & Care, ejemplo «Shih Tzu» | Freepik («front view cute dog sitting») |
| `terrier-clinica.webp` | IA Scan & Care, ejemplo «Terrier» | Freepik («cute dog vet clinic») |
| `maltes-panuelo.webp` | IA Scan & Care, ejemplo «Maltés» | Pexels, foto de Jay Brand |
| `caniche-mix.webp` | IA Scan & Care, ejemplo «Caniche» | Pexels, foto de Jess Arras |
| `shih-tzu-mono.webp` | IA Scan & Care, ejemplo «Shih Tzu con moño» | Pexels, foto de Ricardo Pérez Saravia |

Las licencias de Freepik piden atribución en el uso gratuito: si la demo se muestra en público,
dejar esta página enlazada o agregar el crédito al pie.

## IA Scan & Care

Las fichas de las fotos de ejemplo están **preparadas a mano** (`src/lib/ia/ejemplos.ts`) y la
interfaz lo dice («Ejemplo de demo»). No se analiza ninguna imagen salvo que el servidor tenga
`GEMINI_API_KEY` y `GEMINI_MODEL`. Sin IA, una foto propia no se analiza: el tutor marca lo que ve.
