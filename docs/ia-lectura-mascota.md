# IA como lectora de la mascota: propuesta

> Estado: **implementado** (cotizador en `/cotizar`).
> - **Modo demo (sin clave):** tres ejemplos (Toby, Luna, Coco) con resultados **precargados** en `src/lib/ia/ejemplos.ts`. La interfaz dice «Modo demo de visión artificial: no se analiza ninguna imagen». El botón para subir una foto propia no aparece.
> - **Con `GEMINI_API_KEY` y `GEMINI_MODEL` en el `.env`:** se suma «Subir una foto de tu perro», que se analiza de verdad en el servidor (`src/lib/ia/gemini.ts`, server action en `app/(cliente)/cotizar/actions.ts`). Probado con respuestas simuladas en los tests; **falta probarlo con una clave real**.
> - Se eligió Gemini porque ya era el proveedor de `CLAUDE.md` y se llama con `fetch`, sin dependencias nuevas. La sección 4 queda como referencia por si se cambia.
>
> Por qué los ejemplos no «analizan» la foto que sube el usuario: simular un análisis sobre una foto real repetiría el error n.º 3 del prototipo («Smart Vision» elegía una raza al azar y decía «Visión Artificial Activa»).

## 1. Qué hace

En el cotizador, el tutor sube una foto de su perro y toca **«Sugerir con foto (beta)»**. La IA **sugiere**:

| Dato | Desde la foto | Confiabilidad |
|---|---|---|
| Raza probable | Sí | Media (mestizos y cachorros confunden) |
| Tipo de manto (corto / largo / rizado) | Sí | **Alta**: es lo que mejor se ve |
| Nudos (sin / leves / moderados / severos) | Sí, si el pelo se ve de cerca | Media |
| Tamaño (chico / mediano / grande) | **No de forma confiable** | Baja: una foto no tiene escala |

El **precio no lo calcula la IA**. La IA solo precarga los selectores del cotizador. El precio lo sigue calculando `pricing.ts` con los valores de la base de datos. Así:

- el precio que ve el cliente es siempre el mismo que vería eligiendo a mano;
- un cambio de precios en el panel se respeta;
- un error de la IA no puede inventar un precio.

### El tamaño

El tamaño define la mitad del precio y la foto no lo resuelve (un caniche de cerca y un golden de lejos ocupan lo mismo). Propuesta:

1. La IA propone un tamaño **a partir de la raza** («Caniche Toy: suele ser chico») y lo marca como *a confirmar*.
2. El cotizador pide el **peso aproximado** (campo opcional) y, si se completa, manda el peso: `sizeFromWeight()` ya existe en `pricing.ts`.
3. Si la confianza es baja, no se precarga nada y se le pide al tutor que elija.

## 2. Flujo

```
Cliente (navegador)                 Servidor (Next.js)                    Proveedor de IA
──────────────────                  ──────────────────                    ───────────────
elige foto ──► reduce a ≤1024 px ─► POST /api/sugerir-mascota
               (en el navegador)    · valida tipo (jpg/png/webp) y ≤ 4 MB
                                    · límite: 5 pedidos por hora por IP
                                    · clave solo en el .env del servidor ─► análisis de imagen con
                                                                           salida JSON con esquema
                                    · valida el JSON recibido ◄────────────
                                    · NO guarda la foto
               ◄── { raza, manto, nudos, tamanoSugerido, confianza, observaciones }
precarga selectores (editables)
muestra «Sugerencia beta · revisá los datos»
```

Respuesta del endpoint (contrato fijo, independiente del proveedor):

```json
{
  "esPerro": true,
  "raza": "Caniche Toy",
  "manto": "rizado",
  "nudos": "moderados",
  "tamanoSugerido": "chico",
  "confianza": { "manto": "alta", "nudos": "media", "tamano": "baja" },
  "observaciones": "Se ven nudos detrás de las orejas."
}
```

Si la foto no es de un perro (`esPerro: false`), o la IA rechaza el pedido, o falla, el cotizador muestra «No pudimos leer la foto, elegí los datos a mano» y sigue funcionando igual.

## 3. Reglas (de `CLAUDE.md` §11, errores del prototipo)

- **Sin clave en el `.env` el botón no aparece.** Nada de datos simulados presentados como IA.
- La clave **solo** en el servidor (variables de entorno). Nunca en el navegador, en `localStorage` ni en la URL.
- Rotulado **«beta»** y con todos los datos editables antes de reservar.
- Sin `console.log` de la imagen ni de la respuesta en producción.
- **Privacidad:** la foto se manda al proveedor y no se guarda en Pet Mellis. Texto junto al botón: «La foto se usa solo para sugerir los datos y no se guarda».

## 4. Proveedor (a decidir)

Los dos sirven: tienen visión y respuesta JSON con esquema. El código del endpoint es el mismo salvo la llamada al proveedor.

| | **Claude (Anthropic)** | **Gemini (Google)** |
|---|---|---|
| Modelo | `claude-opus-5-5` (por defecto) o `claude-haiku-5-5` (más barato) | Modelo Flash vigente, por `GEMINI_MODEL` |
| Visión | Sí (imagen en base64) | Sí |
| JSON con esquema | Sí: `output_config.format` con JSON Schema | Sí: `responseSchema` |
| SDK | `@anthropic-ai/sdk` (dependencia nueva) | `@google/genai` (dependencia nueva) o `fetch` |
| Variables | `ANTHROPIC_API_KEY` | `GEMINI_API_KEY`, `GEMINI_MODEL` (ya en `.env.example`) |
| Costo por foto (estimado) | Opus 5.5: ~US$ 0,01 · Haiku 5.5: ~US$ 0,0003 | Ver precios vigentes de Google; tiene capa gratuita |
| Rechazos | Respuesta con `stop_reason: "refusal"`; se activa el *fallback* del servidor | Bloqueos de seguridad propios |

Estimación con una foto de ~1024 px (~1.400 tokens), ~500 tokens de instrucciones y ~300 de respuesta. Opus 5.5: US$ 4 por millón de tokens de entrada y US$ 20 de salida. Haiku 5.5: US$ 0,10 y 0,50.

**Para la demo:** cualquiera de los dos cuesta centavos. `CLAUDE.md` hoy nombra a Gemini; si se elige Claude, hay que actualizar §3 y §13.

## 5. Plan de implementación (cuando se apruebe)

1. `src/lib/ia/sugerencia.ts`: tipo de respuesta + validación del JSON (sin dependencia nueva, o con Zod si se aprueba).
2. `src/lib/ia/proveedor.ts`: una función `analizarFoto(imagen)` con la llamada al proveedor elegido.
3. `src/app/api/sugerir-mascota/route.ts`: validación de archivo, límite por IP, sin guardar la foto.
4. Botón en el cotizador (Fase 4), visible solo si `IA_HABILITADA` (hay clave en el servidor).
5. Tests: el endpoint sin clave responde 404; un JSON inválido no precarga nada; con una respuesta simulada **en el test** los selectores se precargan y el precio sale de `pricing.ts`.
6. Probar con 10 fotos reales (Toby, Max, Luna…) y anotar aciertos de manto y nudos antes de mostrarlo en la demo.
