# Auditoría WebApp Pet Mellis

**Fecha:** 16 de noviembre de 2026
**Proyecto:** Figma Make «WebApp Pet Mellis» — versión 7, rama `main`
**URL:** https://www.figma.com/make/DRHJNcnvsbG4hVzHjXkW4C/WebApp-Pet-Mellis

**Alcance:** se recorrieron en vista previa las cuatro pestañas del modo Cliente (Cotizador IA, Reservar Turno, Fichas de Mascotas, Mis Turnos) y el modo Peluquera. Se revisaron ~4.900 líneas de código fuente: vistas, componentes, estilos, lógica de precios y la API de análisis de imágenes. No se probó la versión móvil.

---

## Resumen ejecutivo

La identidad visual es fuerte y coherente en el modo Cliente: verde bosque + crema + naranja, estilo «ticket» con bordes de tinta y sombras duras, y una buena pareja tipográfica (Poppins + Nunito). Los problemas principales no son de estilo sino de ejecución:

1. **El último cambio del editor visual rompió el encabezado.** Quedó angosto, debajo de la barra de pestañas, y tapa el contenido al hacer scroll.
2. **Se muestra texto de código en pantalla** en el modo Peluquera: `/* Mode: Groomer Admin View */`.
3. **El modo Peluquera parece otra app.** No usa la paleta ni los componentes del sistema: 97 estilos en línea, 32 colores hex sueltos y 31 emojis como íconos.
4. **El naranja de marca no alcanza el contraste mínimo** cuando se usa como color de texto (2,7 a 3,0:1).
5. **«Smart Vision» no es IA.** Sin clave de Gemini, el resultado se elige de una lista fija según un hash de la imagen, pero la interfaz dice «Visión Artificial Activa».

| Prioridad | Cantidad | Ejemplos |
|---|---|---|
| Crítica | 4 | Encabezado roto, comentario visible, IA simulada, modelo Gemini obsoleto |
| Alta | 6 | Contraste del naranja, modo Peluquera fuera del sistema, formularios sin etiquetas asociadas, datos que no persisten |
| Media | 8 | Textos de 9–10 px, precios por tarjeta vs. resumen, fechas inconsistentes, texto en portugués |
| Baja | 5 | Código muerto, `key={index}`, logs en consola |

---

## 1. Hallazgos críticos

### 1.1 Encabezado roto por el último cambio visual

El commit «Apply visual editor changes: orange text color and header positioning» hizo dos cambios:
- Agregó `w-fit min-h-[25px]` al `<header>` de `src/components/AppHeader.tsx`.
- Movió `<AppHeader>` en `src/views/App.tsx` para que quede después de la barra de pestañas.

**Resultado:**
- El encabezado verde ocupa solo ~640 px de ancho y deja un hueco crema a la derecha.
- Aparece debajo de las pestañas.
- Como header y nav son `sticky top-0`, al hacer scroll el header (z-40) tapa la barra de pestañas (z-30) y los títulos de cada sección (por ejemplo «1. datos del tutor y mascota»).
- `<AppHeader>` está duplicado: línea 195 (Cliente) y línea 298 (Peluquera).

**Solución:** volver a la versión anterior del header (`sticky top-0` a ancho completo, antes del `<nav>`), dejar la nav en `sticky top-16` y renderizar `<AppHeader>` una sola vez, fuera del condicional de modo.

### 1.2 Comentario visible en pantalla

En `src/views/App.tsx`, línea 304, el comentario `/* Mode: Groomer Admin View */` está escrito como texto JSX, sin llaves. Por eso se muestra literalmente arriba del panel de Peluquera.

**Solución:** cambiarlo a `{/* Mode: Groomer Admin View */}`.

### 1.3 «Smart Vision» presentado como IA real

En `src/app/api/analyze-pet/route.ts`, la función `smartVisionFallback()` calcula un hash de los primeros 500 caracteres de la imagen (base64) y con eso elige una raza de una lista fija (Caniche, Golden Retriever, Schnauzer, Mestizo, Bichón…). Cualquier foto, incluso de un gato, devuelve un perro con observaciones inventadas. Sin embargo, la UI muestra «IA: Smart Vision» y «Visión Artificial Activa».

Para un trabajo de emprendimiento esto es un riesgo de credibilidad: el presupuesto «exacto» se basa en datos aleatorios.

**Solución:** etiquetarlo honestamente («modo demo: completá los datos a mano») y no autocompletar, o exigir la clave de Gemini para hacer el análisis.

### 1.4 Modelo de IA obsoleto

- La ruta usa `const MODEL = 'gemini-1.5-flash'`, que Google ya retiró. Las llamadas reales probablemente fallen y caigan siempre en el modo simulado sin avisar.
- La clave se envía dos veces: en la URL y en el encabezado `x-goog-api-key`. Conviene dejar solo el encabezado para que no quede registrada en logs.

**Solución:** actualizar a un modelo vigente de la familia Gemini Flash y quitar la clave de la URL.

---

## 2. Paleta de colores

Tokens definidos en `src/app/(frontend)/styles.css`:

| Token | Hex | Uso |
|---|---|---|
| `--background` | #f7f0d8 | Fondo papel con trama de puntos (`.paper`) |
| `--card` | #fffdf5 | Tarjetas «ticket» |
| `--foreground` | #12392d | Texto principal |
| `--ink` | #0d2c22 | Bordes y sombras duras |
| `--primary` | #14503b | Verde bosque (header, seleccionados) |
| `--primary-foreground` / `--cream` | #fbf3d2 | Texto sobre verde |
| `--secondary` | #efe5bf | Barra de pestañas, opciones |
| `--sand` | #f0e6c2 | Fondos de opciones |
| `--muted` | #e6dab0 | Fondos suaves |
| `--muted-foreground` | #5b6a58 | Texto secundario |
| `--border` | #cfc397 | Bordes suaves |
| `--accent` / `--orange` / `--ring` | #f26b1d | Naranja de marca (CTA, acentos) |
| `--accent-foreground` | #ffffff | Texto sobre naranja |

**Lo bueno:** la paleta es cálida, tiene personalidad y está bien vinculada a Tailwind con `@theme inline`. El texto principal sobre el fondo tiene un contraste de 11,2:1 (excelente) y el crema sobre verde, de 8,4:1.

### Problemas de contraste

WCAG AA pide 4,5:1 para texto normal y 3:1 para texto grande.

| Combinación | Contraste | Dónde aparece | Estado |
|---|---|---|---|
| Naranja #f26b1d sobre fondo #f7f0d8 | 2,67:1 | Link «¿Querés cotizar con foto primero?», «Iniciar atención» | No cumple |
| Naranja sobre tarjeta #fffdf5 | 2,99:1 | Título y párrafo del Cotizador (cambio reciente a naranja), «Visita #2» | No cumple |
| Blanco sobre naranja | 3,05:1 | Botones «Agendar turno», «Cliente», «Reservar nuevo turno» | Solo texto grande |
| Naranja sobre verde #14503b | 3,08:1 | «Smart Vision» en el header | No cumple |
| Blanco sobre durazno #f6c9a8 | 1,52:1 | Botón «Siguiente paso» deshabilitado | Ilegible |
| «Visión Artificial Activa» (opacity-80 sobre tarjeta) | Muy bajo | Cotizador | Casi invisible |
| `--muted-foreground` sobre fondo | 5,05:1 | Texto secundario | Cumple |
| `--muted-foreground` sobre `--secondary` | 4,56:1 | Texto secundario sobre opciones | Cumple (justo) |

**Recomendaciones:**
- Crear un naranja oscuro para texto: `--orange-text: #c2410c`. Tiene 5,1:1 sobre la tarjeta, y el blanco sobre él da 5,2:1.
- Reservar #f26b1d para fondos, íconos y texto grande.
- Volver el párrafo del Cotizador a `--foreground`, porque un párrafo entero en naranja cansa la lectura.
- En botones naranjas, usar texto tinta (#0d2c22) en vez de blanco: 4,9:1.

### Colores fuera del sistema

Además de los tokens, hay colores sueltos estilo Tailwind (rojos, ámbar, esmeralda, azul) repetidos en varias vistas:

| Archivo | Colores hex únicos |
|---|---|
| `AdminView.tsx` | 32 (45 usos) |
| `PetPassportView.tsx` | 16 |
| `ClientView.tsx` | 12 |
| `AppointmentsView.tsx` | 9 |

También se usan clases `emerald-*`, `amber-*` y `gray-*`. Son los colores de estados (programado, en progreso, listo, alertas) y deberían ser tokens: `--success`, `--warning`, `--danger` e `--info`, cada uno con su color de fondo y de texto.

---

## 3. Tipografía

| Rol | Fuente | Pesos cargados | Uso |
|---|---|---|---|
| Display | Poppins | 600, 700, 800, 900 | Títulos en minúscula, logo (`.font-display`, letter-spacing -0.025em) |
| Texto | Nunito | 400, 600, 700, 800, 900 | Cuerpo, botones |
| Etiquetas | `font-mono` (monoespaciada del sistema) | — | Rótulos tipo «(01) COTIZADOR INTELIGENTE», precios secundarios |

**Lo bueno:** la combinación redonda de Poppins + Nunito encaja con una marca de mascotas, y los títulos en minúscula y extrabold le dan una voz propia.

**Problemas:**
- **Fuente mono sin definir.** `font-mono` usa la fuente del sistema (Consolas, Menlo, etc.), así que se ve distinta en cada computadora. Conviene definir una (por ejemplo Space Mono o JetBrains Mono) en `--font-mono`.
- **Textos demasiado chicos.** Hay 52 usos de `text-[9px]` o `text-[10px]` (17 en el Cotizador, 12 en Fichas, 9 en Turnos), incluidas acciones clicables como «Iniciar atención →» y «Completar ✓». El mínimo razonable es 12 px, y 14 px para acciones.
- **Pesos de más.** Se cargan 9 pesos entre ambas familias, incluido el 900 en las dos. Con 400/700/800 de Nunito y 700/800 de Poppins alcanza, y la carga es más rápida.
- **Modo Peluquera.** Usa otro ritmo tipográfico (títulos con mayúscula inicial, otros tamaños) y no sigue la jerarquía del resto.
- **Sin escala definida.** Los tamaños se eligen caso por caso. Conviene fijar 5 o 6 pasos: 12 / 14 / 16 / 20 / 28 / 44 px.

---

## 4. Apariencia y UX por pantalla

### Cotizador IA
Es la pantalla más lograda: la foto, la lista de servicios y el presupuesto tipo ticket se entienden bien. Problemas:
- La tarjeta de cada servicio muestra un precio que ya incluye el recargo por enredos (Baño y Corte $13.700), pero el resumen lo desglosa ($10.200 + recargo $3.500). Si se eligen dos servicios con corte, la suma de las tarjetas no coincide con el total, porque el recargo se cobra una sola vez. **Solución:** mostrar en la tarjeta el precio sin recargo.
- El título y la bajada en naranja tienen bajo contraste (ver sección 2).

### Reservar Turno
Tiene un buen stepper de 4 pasos (Datos → Servicios → Horario → Confirmar). Problemas:
- El botón deshabilitado es ilegible y no explica qué falta completar.
- Las etiquetas de los campos no están asociadas a los inputs: no hay ningún `htmlFor` en el proyecto. Un lector de pantalla no las lee, y al hacer clic en la etiqueta no se enfoca el campo.

### Fichas de Mascotas
La estética de «pasaporte» (sello, cinta) es muy simpática. Problemas:
- Hay texto en portugués: «Carteirinha digital de saúde canina». Conviene reemplazarlo por «Libreta sanitaria digital».
- Las fechas de visitas están en formato ISO (2024-09-18). Conviene usar `toLocaleDateString('es-AR')` para mostrar «18 sep 2024».

### Mis Turnos (cliente)
- El cliente ve la agenda de todo el salón, con los nombres de otras mascotas y los botones de la peluquera («Iniciar atención», «Completar ✓»). Es una fuga de rol: esas acciones deben estar solo en el modo Peluquera.
- La fecha «26 de Noviembre» está fija en el código, mientras que el panel de Peluquera muestra la fecha real (lunes 16 de noviembre).

### Modo Peluquera
Es funcionalmente completo (Hoy, Mascotas, Registrar servicio, Informes), pero visualmente se aparta del sistema:
- Bordes finos en vez del estilo «ticket».
- Emojis como íconos (🐾 ✏️ 📋) en lugar de los SVG de `Icons.tsx`.
- Otra paleta para los estados.
- El header de la app queda encima del panel, y su propio encabezado «Pets Mellis · Admin» lo duplica.

### Responsive
Existe una barra inferior para móvil (`md:hidden`), lo cual es bueno. Con el header en `w-fit` y dos barras sticky superpuestas, en pantallas chicas el espacio útil se reduce mucho. Hay que revisarlo después de corregir el punto 1.1.

---

## 5. Código y arquitectura

**Stack:** Next.js 16.4.2 (Turbopack) + React 19.3 + Tailwind CSS 4 + Payload CMS 4.0 beta + TypeScript en modo estricto. La compilación y `tsc --noEmit` pasan sin errores.

### Estructura relevante

```
src/
├── app/
│   ├── (frontend)/  layout.tsx, page.tsx, styles.css, not-found.tsx
│   ├── (payload)/   admin de Payload
│   └── api/analyze-pet/route.ts   (203 líneas)
├── collections/     Admins.ts, Folders.ts, Media.ts, Tags.ts
├── components/      AppHeader.tsx (83), Icons.tsx (112), SettingsModal.tsx (249)
├── lib/             pricing.ts (122), make-custom-code.tsx, make-site-settings.ts, payload.ts
├── views/
│   ├── App.tsx               (322)
│   ├── AdminView.tsx         (1.095)
│   ├── AppointmentsView.tsx  (203)
│   ├── BookingView.tsx       (549)
│   ├── ClientView.tsx        (656)  ← no se usa
│   ├── CotizadorIAView.tsx   (615)
│   └── PetPassportView.tsx   (304)
├── mockData.ts  (286)
└── types.ts     (53)
```

### Hallazgos

- **Código muerto.** `src/views/ClientView.tsx` (656 líneas) no se importa en ningún lado: es una versión anterior del portal de cliente. Borrarlo evita confusiones, sobre todo para la IA de Figma Make, que puede editar el archivo equivocado.
- **Archivos muy grandes.** `AdminView.tsx` tiene 1.095 líneas y 97 bloques `style={{…}}`. Conviene partirlo en subcomponentes (AgendaHoy, ListaMascotas, FormRegistro, Informes) y pasar los estilos a clases de Tailwind con los tokens.
- **Pestañas repetidas.** En `App.tsx`, los 4 botones de la nav repiten la misma lógica de clases. Un arreglo `tabs` con `.map()` ahorra unas 60 líneas y evita inconsistencias.
- **Sin persistencia.** Turnos, mascotas y reservas viven en `useState` con datos de `mockData.ts`, así que al recargar la página se pierde todo. Payload CMS está instalado, pero sus colecciones son solo las de la plantilla (Admins, Folders, Media, Tags). Para un MVP creíble, conviene crear colecciones `Mascotas`, `Turnos` y `Servicios` en Payload o, como mínimo, guardar en `localStorage`.
- **Precios.** `src/lib/pricing.ts` es la única fuente de precios (bien hecho), pero `SettingsModal` permite «editar precios» sin guardarlos en ningún lado.
- **Clave de API en el navegador.** La clave de Gemini se guarda en `localStorage` (`pets_mellis_gemini_key`) y viaja en cada pedido. En una app pública, la clave debería vivir solo en las variables de entorno del servidor (`APP_GEMINI_API_KEY`). Además, el `GET` de `/api/analyze-pet` informa públicamente si hay una clave configurada y su formato.
- **Accesibilidad.**
  - Solo hay 3 `aria-label` en todo el proyecto.
  - Hay `<div onClick>` que no se pueden usar con teclado: logo del header, fondo del modal y 2 en AdminView.
  - Faltan estados de foco visibles en los botones tipo ticket.
  - No hay ningún `htmlFor` en los formularios.
- **Menores.**
  - `key={i}` en dos listas (Cotizador y Admin).
  - Dos `console.log`/`console.error` en la ruta de la API.
  - Imágenes de ejemplo cargadas desde Unsplash (dependencia externa). Convendría subirlas a `public/` o a Media.

### Lógica de precios (referencia)

`buildQuote(size, coat, tangles, servicios, extras)` en `pricing.ts`:
- El precio base depende del tamaño. Ejemplo, Baño y Corte: chico $8.500, mediano $11.500, grande $15.000.
- Si el servicio tiene `coat: true`, se aplica el multiplicador de manto (pelo rizado: +20%) y se redondea a centenas.
- Los extras tienen precio fijo (limpieza de oídos: $1.500, etc.).
- El recargo por enredos (leves: $1.500, moderados: $3.500, severos: $6.000) se suma **una sola vez** si hay al menos un servicio de peluquería.

---

## 6. Plan de acción sugerido

### Paso 1: arreglos rápidos (menos de 1 hora)
1. Revertir el cambio del header. Prompt sugerido para Figma Make: «restaurá el header a ancho completo, sticky arriba de la barra de pestañas, y renderizalo una sola vez».
2. Envolver en llaves el comentario de la línea 304 de `App.tsx`.
3. Cambiar «Carteirinha digital de saúde canina» por «Libreta sanitaria digital».
4. Volver el párrafo del Cotizador al color de texto normal.

### Paso 2: sistema visual (medio día)
5. Agregar `--orange-text`, los tokens de estado (`--success`, `--warning`, `--danger`, `--info`) y `--font-mono`.
6. Subir todos los `text-[9px]` y `text-[10px]` a 12 px como mínimo.
7. Rehacer el botón deshabilitado (fondo `--muted`, texto `--muted-foreground`) y agregar un mensaje que diga qué falta completar.
8. Pasar el modo Peluquera a las clases `ticket` y `btn-cta`, a los tokens y a los íconos SVG de `Icons.tsx`.

### Paso 3: producto (1 a 2 días)
9. Etiquetar Smart Vision como demo y actualizar el modelo de Gemini.
10. Quitar las acciones de peluquera de «Mis Turnos» del cliente y mostrarle solo sus propios turnos.
11. Hacer que mascotas y turnos persistan (Payload o `localStorage`).
12. Borrar `ClientView.tsx` y dividir `AdminView.tsx`.

> **Nota:** el equipo de Figma Make no tiene créditos de IA hasta el 30 de noviembre, así que los pasos 1 y 2 conviene hacerlos a mano en la pestaña **Archivos**.

---

**Documento editable de la auditoría:** https://claude.ai/artifact/5KcbAzD3cou5GmN4C2we5j
