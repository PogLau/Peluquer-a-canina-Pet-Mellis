# Fotos de la web app

Las fotos de `public/fotos/` son de bancos de imágenes y están reducidas a WebP de hasta 1.200 px
(entre 17 y 116 KB cada una). Son material de demostración: antes de usar la app con clientes reales,
reemplazarlas por fotos propias del salón (ver CLAUDE.md §14).

| Archivo | Dónde se usa | Fuente |
|---|---|---|
| `yorkshire-mesa.webp` | Inicio (foto principal) | Freepik («haircuting process small dog sits table…») |
| `salon-bano.webp` | Inicio, «en el salón» | Entregada para la web el 20/11/2026 (confirmar licencia antes de publicar) |
| `salon-corte-tijera.webp` | Inicio, «en el salón» | Entregada para la web el 20/11/2026 (confirmar licencia antes de publicar) |
| `salon-secado.webp` | Inicio, «en el salón» | Entregada para la web el 20/11/2026 (confirmar licencia antes de publicar) |
| `salon-patas.webp` | Inicio, «en el salón» | Entregada para la web el 20/11/2026 (confirmar licencia antes de publicar) |
| `salon-peine.webp` | Inicio, «en el salón» | Entregada para la web el 20/11/2026 (confirmar licencia antes de publicar) |
| `escaneo-pastor-brie.webp` | IA Scan, ejemplo «Pastor de Brie» | Entregada para la web el 20/11/2026 (confirmar licencia antes de publicar) |
| `escaneo-spaniel.webp` | IA Scan, ejemplo «Spaniel» | Entregada para la web el 20/11/2026 (confirmar licencia antes de publicar) |
| `escaneo-shih-tzu.webp` | IA Scan, ejemplo «Shih Tzu» | Entregada para la web el 20/11/2026 (confirmar licencia antes de publicar) |

Las licencias de Freepik piden atribución en el uso gratuito: si la demo se muestra en público,
dejar esta página enlazada o agregar el crédito al pie.

## Consulta por foto

Las fichas de las fotos de ejemplo están **preparadas a mano** (`src/lib/ia/ejemplos.ts`) y la
interfaz lo dice («Ejemplo de demo»). No se analiza ninguna imagen salvo que el servidor tenga
`GEMINI_API_KEY` y `GEMINI_MODEL`. Sin IA, una foto propia no se analiza: el tutor marca lo que ve.
