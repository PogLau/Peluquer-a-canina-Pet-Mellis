# CLAUDE.md — Pet Mellis (web app de peluquería canina)

> Contexto del proyecto para Claude Code. Este archivo va en la raíz del repositorio. Claude Code lo lee al iniciar cada sesión.
> Última actualización: 17/11/2026.

---

## 1. Qué es y para qué

**Pet Mellis** es una web app, sin descarga, para **Los Mellis – Peluquería Canina**, un negocio que ya funciona en **Merlo, Buenos Aires** (ubicación confirmada).

**Objetivo de esta etapa:** tener una **web app real y funcional para una demostración** del MVP. Debe funcionar de punta a punta con datos guardados de verdad y verse profesional. No alcanza con un prototipo de pantallas.

**Problema que resuelve:** los datos de cada perro (qué toleró, qué le costó, cómo estaba el manto) quedan dispersos en papeles, chats de WhatsApp o en la memoria de la peluquera, y se pierden de una visita a otra.

**Idea central:** la **Ficha Evolutiva**. Cada atención se registra y se compara con las anteriores para decidir cómo trabajar la próxima vez. Tagline: *«Cada visita mejora la siguiente.»*

**Equipo:** Laura Pogonza y Viviana Cazas Galindo. Es un proyecto académico de Competencias Emprendedoras 2026 (Tecnicatura en Comercio Electrónico).

---

## 2. Fuente de verdad: el prototipo de Figma Make

- La **base** es el proyecto de Figma Make «WebApp Pet Mellis» (versión 7, rama `main`):
  https://www.figma.com/make/DRHJNcnvsbG4hVzHjXkW4C/WebApp-Pet-Mellis
- Se toma de ahí la **identidad visual** (paleta, tipografías, estilo «ticket»), la **lógica de precios** y la **estructura de pantallas**.
- **No** se copian sus errores. La lista está en la sección 11.
- Para traer el código a local, exportarlo desde Figma Make (menú «…» de la pestaña Archivos, o la sincronización con GitHub si está disponible) y ponerlo en `/reference/figma-make/`. Esa carpeta es **solo de consulta**: no se importa desde la app.
- Documentos relacionados (en claude.ai):
  - Ficha de proyecto del MVP: https://claude.ai/artifact/QCEcJ1nsG4seWuirPYAP5J
  - Auditoría del prototipo: https://claude.ai/artifact/5KcbAzD3cou5GmN4C2we5j

### Stack del prototipo (referencia)
Next.js 16.4 (App Router, Turbopack) · React 19.3 · Tailwind CSS 4 (`@theme inline`) · Payload CMS 4.0 beta · TypeScript estricto · pnpm.

Archivos clave del prototipo:

| Archivo | Qué tiene |
|---|---|
| `src/app/(frontend)/styles.css` | Tokens de color, fuentes, clases `.paper`, `.ticket`, `.btn-cta`, `.seal`, `.tape` |
| `src/lib/pricing.ts` | Servicios, extras, multiplicadores y `buildQuote()` (**reutilizar**) |
| `src/components/Icons.tsx` | Set de íconos SVG (**reutilizar y ampliar**) |
| `src/views/CotizadorIAView.tsx` | Cotizador (la mejor pantalla del prototipo) |
| `src/views/BookingView.tsx` | Reserva en 4 pasos |
| `src/views/PetPassportView.tsx` | Libreta/pasaporte de la mascota |
| `src/views/AdminView.tsx` | Panel de la peluquera (1.095 líneas, rehacer por secciones) |
| `src/mockData.ts` | Datos de ejemplo (base para el seed) |
| `src/app/api/analyze-pet/route.ts` | Análisis de foto con Gemini + fallback simulado (ver sección 11) |

---

## 3. Stack de la app real

- **Next.js (App Router) + React + TypeScript estricto.** Se mantiene el stack del prototipo para reutilizar componentes.
- **Tailwind CSS 4** con los tokens de la sección 7, definidos en `@theme`.
- **Payload CMS** como base de datos, admin de datos y autenticación de la peluquera. Usar la última versión **estable** al momento de instalar (el prototipo usa una beta). Base de datos: **SQLite** para la demo local y **Postgres** si se despliega.
- **Zod** para validar formularios y endpoints.
- **WhatsApp** mediante enlaces `https://wa.me/<número>?text=<mensaje>`. Sin API paga ni envíos automáticos.
- **Gemini** es opcional y solo del lado del servidor, para «Sugerir con foto (beta)».
- Gestor de paquetes: **pnpm**.

> Antes de agregar una dependencia nueva, preguntar. Preferir lo que ya está en el stack.

---

## 4. Arquitectura: dos paneles separados

| | Panel de cliente | Panel de administrador |
|---|---|---|
| Ruta | `/` (grupo `app/(cliente)`) | `/panel` (grupo `app/(panel)`) |
| Quién | Tutor del perro | Peluquera |
| Acceso | **Sin login.** Entra por el enlace de la web app; para ver lo suyo usa su **enlace personal** (`/mi/<token>`), que el salón le manda por WhatsApp | Usuario y contraseña (auth de Payload). **Es el único login de la app** |
| Ve | Solo **sus** turnos y **sus** perros | Todo el salón |
| Layout | Header propio + barra inferior en el celular | Menú lateral (barra inferior en el celular) |

**Reglas:**
- **No** existe un botón público «Cliente / Peluquera». Cada panel tiene su propio layout y su propio header (uno solo, a ancho completo).
- **Solo la administradora (peluquera) inicia sesión** (decisión del 17/11/2026). Los clientes nunca crean cuenta ni ponen contraseña ni código:
  - Inicio, Cotizador y Reservar son públicos, desde el enlace de la web app.
  - «Mi mascota» y «Mis turnos» se abren con un enlace personal por tutor: un token largo y aleatorio guardado en `tutores` (se puede regenerar desde el panel si se filtra). El panel lo incluye en los mensajes de WhatsApp (confirmación y resumen).
  - Con el enlace se ve solo lo de ese tutor; nunca la nota interna ni datos de otros clientes.
- Los dos paneles leen y escriben **la misma base de datos**:
  - un turno reservado por el cliente aparece en «Solicitudes»;
  - un precio cambiado en el panel se ve en el cotizador.
- El admin de Payload (`/admin`) queda para el equipo técnico. La peluquera usa `/panel`, que se diseña a medida.

Estructura sugerida:

```
src/
├── app/
│   ├── (cliente)/        layout.tsx, page.tsx (Inicio), cotizar/, reservar/, mi-mascota/, mis-turnos/, ingresar/
│   ├── (panel)/panel/    layout.tsx, page.tsx (Hoy), solicitudes/, mascotas/[id]/, registrar/[turnoId]/,
│   │                     clientes/, servicios/, informes/, ingresar/
│   ├── (payload)/        admin de Payload
│   └── api/              analyze-pet/ (opcional), etc.
├── collections/          Tutores, Mascotas, Servicios, Extras, Turnos, Atenciones, Etiquetas, Usuarios
├── globals/              Configuracion
├── components/ui/        Ticket, Button, Field, Chip, StatusBadge, TagChip, Stepper, Modal, Nav, Icons
├── components/cliente/   componentes propios del panel de cliente
├── components/panel/     componentes propios del panel de administrador
├── lib/                  pricing.ts, whatsapp.ts, dates.ts, enlace-cliente.ts
└── seed/                 datos de demo
```

---

## 5. Funcionalidades del MVP

### 5.1 Panel de cliente

| Pantalla | Qué hace | Criterio de aceptación |
|---|---|---|
| **Inicio** | Foto del local, los 3 servicios más pedidos con precio «desde», horarios, dirección (Merlo) y CTA «Reservar turno» | En el celular, el CTA se ve sin hacer scroll |
| **Cotizador** | Elegir tamaño, manto y nudos, más servicios y extras. Precio por línea y total en vivo. Opcional: «Sugerir con foto (beta)» | El precio de cada tarjeta coincide con su línea del resumen; el recargo por nudos aparece **una sola vez** y en una línea aparte |
| **Reservar turno** | Asistente de 4 pasos: 1) tutor y mascota (o elegir una existente), 2) servicios (precargados desde el cotizador), 3) día y horario libres, 4) confirmación | Cada paso valida y dice qué falta. Al confirmar se crea un turno «Solicitado» y se ofrece «Avisar por WhatsApp» |
| **Mi mascota** | Libreta de cada perro: datos, cuidados especiales, historial y recomendación para la próxima visita | No muestra las notas internas, solo el resumen compartido |
| **Mis turnos** | Turnos próximos y pasados con su estado. Cancelar si faltan más de 24 h | **Sin** acciones del salón y **sin** turnos de otros clientes |

### 5.2 Panel de administrador

| Sección | Qué hace | Criterio de aceptación |
|---|---|---|
| **Hoy** | Agenda del día con alertas de la ficha (por ejemplo, «miedo al secador»). Acciones: Confirmar → Iniciar → Listo para retirar → Finalizar | Cambiar de estado lleva un toque |
| **Solicitudes** | Turnos pedidos desde la web. Aceptar, proponer otro horario o rechazar | Al aceptar se abre WhatsApp con el mensaje armado |
| **Mascotas** | Buscador por perro o tutor. Perfil completo con la Ficha Evolutiva | Encontrar un perro lleva menos de 10 s |
| **Registrar atención** | Servicios hechos, precio final, etiquetas rápidas, puntaje por aspecto (secador, uñas, baño, desenredado), nota interna, resumen para el tutor y recomendación | Se completa en menos de 2 min; las etiquetas se eligen con un toque |
| **Ficha Evolutiva** | Compara las últimas 3 visitas por aspecto y propone la decisión para la próxima | La recomendación se puede editar |
| **Enviar resumen** | Arma el mensaje (qué se hizo, cómo se portó, próxima fecha sugerida) y abre `wa.me` | Nunca se envía nada sin revisión |
| **Clientes** | Tutores con sus perros, teléfono y última visita | Alta y edición en una sola pantalla |
| **Servicios y precios** | Tabla editable (precios por tamaño, recargos, extras) | Los cambios se ven al instante en el cotizador |
| **Informes** | Turnos de la semana y del mes, ingresos estimados, servicios más pedidos, clientes sin volver hace más de 60 días | Se pueden exportar a CSV |

**Etiquetas rápidas iniciales:**
- tranquilo, nervioso, miedo al secador;
- no tolera las uñas, muerde al cepillar;
- nudos en orejas, piel sensible, alérgico;
- cachorro, perro mayor.

**Estados de un turno:** `solicitado` → `confirmado` → `en_atencion` → `listo` → `finalizado`; o `cancelado`.

### 5.3 Fuera del MVP (fase 2)
- La IA como función principal.
- Pagos y señas.
- Recordatorios automáticos con WhatsApp Business API.
- Varias peluqueras o sucursales.
- App nativa.

---

## 6. Modelo de datos (colecciones de Payload)

| Colección | Campos principales | Relaciones |
|---|---|---|
| `tutores` | nombre, whatsapp (único), email?, zona, notas | → mascotas, turnos |
| `mascotas` | nombre, foto (upload), raza, tamaño (`chico`/`mediano`/`grande`), manto (`corto`/`largo`/`rizado`), nacimiento, cuidadosEspeciales, etiquetas[] | tutor; → atenciones |
| `servicios` | nombre, descripción, duración, precioChico, precioMediano, precioGrande, aplicaRecargoManto, ícono, popular | — |
| `extras` | nombre, descripción, precio | — |
| `turnos` | fechaHora, estado, servicios[], extras[], precioEstimado, origen (`web`/`panel`), notasCliente | tutor, mascota |
| `atenciones` | fecha, serviciosRealizados[], precioFinal, puntajes {secador, uñas, baño, desenredado} (1–5), etiquetas[], notaInterna, resumenTutor, recomendacion | turno, mascota |
| `etiquetas` | nombre, tipo (`alerta`/`info`) | — |
| `usuarios` | email, contraseña, rol (`peluquera`/`admin`) | auth de Payload |
| *global* `configuracion` | dirección, whatsappLocal, horarios por día, duraciónTurnoMin, multiplicadoresManto, recargosNudos | — |

**Control de acceso:**
- `atenciones.notaInterna` nunca se expone al cliente.
- Las consultas del panel de cliente siempre filtran por el `tutor` de la sesión.

---

## 7. Sistema de diseño

> **Paleta oficial vigente (19/11/2026).** Reemplaza a las anteriores (amarillo y negro; azul, menta y coral; grafito y terracota). Los tokens viven en `src/styles/globals.css` y se usan como utilidades de Tailwind (`bg-accion`, `text-texto-suave`, `border-tinta`, `shadow-ticket`...). La paleta por defecto de Tailwind está desactivada.

Estilo: fondo blanco cálido con trama de puntos, tarjetas «ticket» (borde petróleo de 2 px y sombra dura de 4 px), títulos en minúscula. Todo color sale de un token, todo texto cumple el contraste WCAG AA y los dos paneles usan **los mismos componentes**.

### 7.1 Tokens de color

| Token (utilidad) | Hex | Uso |
|---|---|---|
| `crema` (blanco cálido) | #fffdf7 | Fondo general (`fondo`) y texto sobre verde |
| `verde` (verde profundo) | #245b45 | Logo, header, **títulos principales** (`titulo`), **CTA principal** (`accion`, texto crema), estados activos |
| `petroleo` (azul petróleo) | #173b46 | Texto principal, subtítulos, etiquetas, bordes y sombra (`texto`, `tinta`) |
| `amarillo` (amarillo cálido) | #f4d35e | Selección (chips, pasos, pestaña activa), badges, CTA secundario (`Button variant="highlight"`), siempre con texto petróleo |
| `naranja` (naranja amable) | #f28c45 | Promociones, alertas suaves e íconos destacados, con texto petróleo |

Derivados de las escalas 50–950 de la marca (verificados AA en `tests/contraste.test.ts`): `verde-claro` #dbf0e8, `verde-hover` #2c6d53, `amarillo-claro` #fcf2cf, `amarillo-hover` #f2cb40, `naranja-claro` #fae4d1, `naranja-texto` #8b480e, `petroleo-claro` #ecf6f9 (`superficie-alt`), `texto-suave` #256174, `linea` #d8ecf3. Estados: `exito`, `aviso`, `peligro`, `info` con su `*-fondo`. Tema oscuro en `[data-theme="oscuro"]`.

**Reglas de color:**
- CTA principal: verde con texto blanco cálido. Botones amarillos o naranjas: texto petróleo.
- Nunca amarillo ni naranja como texto chico sobre fondos claros (para eso está `naranja-texto`).
- Sobre el header o bloques verdes, el botón principal pasa a `variant="highlight"` (amarillo).
- Botón deshabilitado: fondo `superficie-alt`, texto `texto-suave`, sin sombra, y un mensaje con lo que falta.
- Los estados se acompañan con palabras o íconos, no solo color.
- Nada de hex sueltos ni de clases `emerald-*`, `amber-*`, `gray-*`: lo verifica `tests/design-rules.test.ts`.

### 7.2 Tipografía

Familia única oficial: **Manuale** (Google Fonts), serif humanista. No se usan Sora, Nunito, Space Mono, Fredoka, Poppins ni Inter.

| Rol | Peso | Tamaño (escala 1.333 sobre 16 px) |
|---|---|---|
| Títulos (`font-display`, h1–h3) | 700 Bold | `text-4xl` 50,6 px (H2) · `text-3xl` 37,9 px (H3) · `text-2xl` 28,4 px (H4) · `text-xl` 21,3 px (H5), en minúscula; los dos más grandes se achican con `clamp()` en el celular |
| Cuerpo y botones (`font-sans`) | 400 Regular / 700 Bold | 16 px el cuerpo, interlineado 1,5; botones 16 px (mínimo 14) |
| Rótulos y datos (`.rotulo`) | 700 Bold | 12 px (small) |

- Cargar la fuente con `next/font` (`src/app/fonts.ts`), no con `@import`.
- **Mínimo de 12 px** para cualquier texto y de **14 px** para acciones. Prohibido `text-[9px]` y `text-[10px]`.
- Íconos de interfaz: SVG de 24 × 24 con trazo de 1,75 px en `currentColor` (`components/ui/Icons.tsx`). **Sin emojis.**
- **Logo:** el manual define un isotipo nuevo (una «M» con dos perros), pero todavía no hay archivo. Hasta tenerlo, se usan los mellis de siempre recoloreados con la paleta oficial (`components/ui/Logo.tsx`, `app/icon.svg`).

### 7.3 Componentes compartidos (`components/ui/`)
- `Ticket` (normal y chico)
- `Button` (`primary`, `secondary`, `ghost`)
- `Field` (con `<label htmlFor>`, ayuda y error)
- `Chip` (selector de opción)
- `StatusBadge` (uno por estado de turno)
- `TagChip`
- `Stepper`
- `Modal`
- `Nav` (superior y barra inferior)
- `Icons` (SVG, trazo de 1,75 px)

**Accesibilidad:**
- Todos los componentes llevan **foco visible**: `outline 2px var(--ring)`, `offset 2px`.
- Nada de `<div onClick>`: usar `<button>` o `<a>`.

### 7.4 Contenido
- Español rioplatense, con voseo: «reservá», «tu perro», «elegí».
- Con el cliente, el tono es cálido; en el panel, breve y operativo.
- **Sin emojis** en la interfaz.
- Fechas con `Intl.DateTimeFormat('es-AR')`, por ejemplo «lunes 16 de noviembre». La fecha del día siempre se calcula, nunca se escribe fija.
- Moneda: ARS con `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })`.
- Fotos propias o libres, guardadas en el proyecto o en Media. No usar hotlinks a Unsplash.

---

## 8. Reglas de precios (tarifario 2027, `src/lib/pricing.ts` y `src/lib/catalogo-demo.ts`)

Los precios son **orientativos**: cada servicio tiene un rango «desde–hasta» por tamaño y el valor final se confirma al revisar el manto en el local. El cotizador, la reserva y el escaneo muestran el total como rango («desde $X / hasta $Y») y una nota aclaratoria. El precio que se guarda en el turno (`precioEstimado`) es el «desde» y lo calcula el servidor.

**Tamaños:** chico hasta 10 kg · mediano 10–25 kg · grande 25–40 kg · gigante más de 40 kg (`sizeFromWeight`).

| Servicio | Chico | Mediano | Grande | Gigante |
|---|---|---|---|---|
| Baño higiénico simple (incluye uñas y oídos) | 18.000–25.000 | 25.000–35.000 | 38.000–50.000 | 50.000–68.000 |
| Baño y corte higiénico (zona sanitaria, plantares, lagrimales) | 22.000–30.000 | 30.000–42.000 | 45.000–58.000 | 60.000–78.000 |
| Baño y corte completo (máquina y/o tijera según raza), popular | 32.000–48.000 | 45.000–62.000 | 62.000–80.000 | 82.000–105.000 |
| Deslanado profundo (doble capa) | 28.000–38.000 | 40.000–55.000 | 58.000–75.000 | 78.000–98.000 |
| Sesión de adaptación (cachorros hasta 5 meses) | 15.000–20.000 | 18.000–24.000 | 22.000–28.000 | 25.000–32.000 |
| Corte de uñas y limpieza de oídos (sin baño) | 6.000–10.000 | 6.000–10.000 | 6.000–10.000 | 6.000–10.000 |

**Adicionales:** baño medicado o dermatológico +$8.000 a $15.000 · baño antipulgas / garrapatas +$7.000 a $14.000 · plus por manejo especial o conducta +15 % a 25 % sobre los servicios · traslado a domicilio $6.000 a $15.000.

**Desenredado de nudos** (selector de nudos): leves $12.000 · moderados $18.000 · severos $25.000. Se suma **una sola vez**, en una línea aparte, y solo si hay un servicio con recargo por manto.

**Manto:** el tarifario ya contempla el manto dentro de cada rango, así que el multiplicador quedó en 1 (se puede volver a usar desde el panel).

```
total_desde = Σ servicios[desde] + Σ extras fijos[desde] + % manejo[desde] sobre servicios + desenredado
total_hasta = Σ servicios[hasta] + Σ extras fijos[hasta] + % manejo[hasta] sobre servicios + desenredado
```

**Caso de prueba:** Toby (chico, nudos moderados) + baño y corte completo + antipulgas = **$57.000 a $80.000**.

## 9. Datos de demo (seed)

Basados en `mockData.ts` del prototipo. Comando: `pnpm seed`.

| Mascota | Raza | Tamaño / manto | Alertas para la demo |
|---|---|---|---|
| Toby | Caniche Toy | chico / rizado | nudos en orejas; 3 visitas con evolución del secador (mucho miedo → tolera mejor) |
| Luna | Golden Retriever | grande / largo | tranquila |
| Coco | Shih Tzu | chico / largo | piel sensible |
| Max | Schnauzer Miniatura | chico / rizado | nervioso, no tolera las uñas («usar técnica gradual») |
| Bella | Bichón Maltés | chico / rizado | perro mayor |

Además:
- Tutores de ejemplo, con teléfonos ficticios.
- 4 turnos para «hoy» (10:00, 12:00, 14:30 y 16:00) en distintos estados.
- 2 solicitudes pendientes.
- Un usuario `peluquera` cuyas credenciales salen de `.env` (`DEMO_ADMIN_EMAIL` y `DEMO_ADMIN_PASSWORD`). **Nunca** escribirlas en el código.

---

## 10. Guion de la demostración (debe funcionar de punta a punta)

1. **Cliente (celular):** entra al Inicio → cotiza a Toby (chico, rizado, nudos moderados, Baño y Corte + oídos = $15.200) → «Reservar con este presupuesto» → elige el horario → confirma → «Avisar por WhatsApp».
2. **Peluquera (computadora o tablet):** ingresa a `/panel` → ve la solicitud nueva → la acepta (se abre `wa.me` con el mensaje armado).
3. En «Hoy» abre a Max → ve la alerta «no tolera las uñas» antes de empezar → Iniciar.
4. Registra la atención de Toby con etiquetas y puntajes en menos de 2 minutos → la Ficha Evolutiva muestra la mejora con el secador → envía el resumen por WhatsApp.
5. Cambia el precio de Baño y Corte en «Servicios y precios» → el cotizador del cliente lo muestra al instante.
6. **Cliente:** en «Mis turnos» ve su turno «Listo para retirar» y en «Mi mascota», el resumen nuevo.

---

## 11. Errores del prototipo que NO hay que repetir

| # | Error en Figma Make | Qué hacer |
|---|---|---|
| 1 | Header con `w-fit` puesto después de la nav; dos elementos `sticky top-0` superpuestos | Un header por layout, a ancho completo; la navegación vive dentro del header |
| 2 | `/* Mode: Groomer Admin View */` escrito como texto JSX | Comentarios en JSX siempre como `{/* … */}` |
| 3 | «Smart Vision» elegía una raza al azar según un hash de la imagen y la UI decía «Visión Artificial Activa» | Sin datos simulados presentados como IA. La foto es una **sugerencia beta**, rotulada y editable. Sin clave: el botón no aparece |
| 4 | Modelo `gemini-1.5-flash` retirado; la clave iba en la URL y en el header | Modelo Gemini Flash vigente por `.env` (`GEMINI_MODEL`); la clave solo en el header `x-goog-api-key` y solo en el servidor |
| 5 | Clave de API guardada en `localStorage` desde un modal | Sin campo de clave en el cliente. Solo variables de entorno |
| 6 | El cliente veía la agenda del salón y los botones de la peluquera | Filtrar siempre por tutor; las acciones solo en `/panel` |
| 7 | Panel admin con 97 `style={{}}`, 32 hex sueltos y emojis | Solo tokens, componentes de `ui/` e íconos SVG |
| 8 | 52 textos de 9–10 px | Mínimo 12 px |
| 9 | Labels sin `htmlFor`; `<div onClick>` | `Field` con label asociado; botones reales |
| 10 | El precio de la tarjeta incluía el recargo por nudos y no coincidía con el resumen | La tarjeta muestra el precio sin recargo; el recargo va en una línea aparte |
| 11 | Datos solo en `useState`: se perdían al recargar | Todo en Payload |
| 12 | Fechas fijas («26 de Noviembre») o en formato ISO | `Intl.DateTimeFormat('es-AR')` |
| 13 | Texto en portugués («Carteirinha digital de saúde canina») | «Libreta de mi mascota» |
| 14 | `ClientView.tsx` sin uso; `AdminView.tsx` de 1.095 líneas | Archivos de menos de 300 líneas, un componente por sección |
| 15 | `key={index}` y `console.log` en la API | Keys estables (`id`) y sin logs en producción |
| 16 | La sede figuraba como «San Miguel» | La sede es **Merlo** |

---

## 12. Plan de trabajo para Claude Code

Trabajar **por fases**, de a una, con un commit al final de cada una. Antes de cada fase, mostrar el plan y esperar la confirmación.

- [x] **Fase 0. Base:** proyecto Next.js + TS + Tailwind 4 + Payload (SQLite), tokens de la sección 7, fuentes con `next/font`, `components/ui/` y una página `/dev/ui` con todos los componentes para revisarlos.
- [x] **Fase 1. Datos:** colecciones y global de la sección 6, control de acceso y `pnpm seed`.
- [x] **Fase 2. Precios:** `lib/pricing.ts` leyendo de la base de datos, con tests unitarios (incluido el caso de $15.200).
- [x] **Fase 3. Panel de administrador:** login, Hoy, Solicitudes, Mascotas + Ficha Evolutiva, Registrar atención, Enviar resumen. Las rutas protegidas viven en `app/(panel)/panel/(app)/` y la lógica en `lib/panel/` (probada en `tests/panel-*.test.ts`). El usuario de demo sale de `DEMO_ADMIN_*` en `.env`.
- [x] **Fase 4. Panel de cliente:** Inicio, Cotizador, Reservar (4 pasos), enlace personal del tutor (sin login), Mi mascota, Mis turnos. Enlace: `lib/enlace-cliente.ts` y `app/(cliente)/mi/[token]`; reserva y horarios libres: `lib/cliente/` y `lib/agenda.ts` (probados en `tests/cliente-*.test.ts`). El botón «Avisar por WhatsApp» aparece cuando hay un WhatsApp real del local (configuración o `WHATSAPP_LOCAL`).
- [x] **Fase 5. Resto del panel:** Clientes (alta y edición con sus perros y el enlace personal), Servicios y precios (editables, se ven al instante en el cotizador) e Informes con CSV (`/panel/informes-csv/<tipo>`, punto y coma y BOM para Excel). Lógica en `lib/panel/clientes.ts`, `precios.ts`, `informes.ts` y `lib/informes.ts`, probada en `tests/gestion-*.test.ts`.
- [x] **Fase 6. Pulido para la demo:** responsive (360 px, 768 px, 1280 px), accesibilidad (contraste, foco, labels), estados vacíos y de error, y recorrer el guion de la sección 10 completo. Hecho el 17/11/2026: pantallas de carga, error y no encontrado; sin desborde a 360/768/1280 px; revisión de etiquetas, nombres, ids y contraste AA; `pnpm build` limpio; guion de la §10 recorrido entero sobre el build de producción.
- [x] **Fase 7 (opcional, adelantada):** «Sugerir con foto (beta)» con Gemini del lado del servidor y ejemplos de demo rotulados. Ver `docs/ia-lectura-mascota.md`. Falta probar con una clave real.
- [x] **Fase 8. Paleta oficial e IA Scan & Care** (17/11/2026): paleta azul calma, menta y coral (§7). En el cotizador, «IA Scan & Care» escanea una foto de ejemplo (fichas preparadas a mano y rotuladas) o una propia (con Gemini; sin IA, el tutor marca lo que ve) y arma la ficha de ingreso: raza, tamaño, pelaje (`corto`/`largo`/`rizado`/`mixto`), hidratación, nudos y tratamiento ideal (regla fija en `lib/ia/cuidado.ts`), con su precio. El escaneo viaja con la reserva (`turnos.escaneo`, migración `20261117_150000_escaneo_turno`) y la peluquera lo ve en Solicitudes, Hoy y Registrar atención (precarga la nota interna). Componentes en `components/cliente/escaneo/` y `components/panel/EscaneoIngreso.tsx`; tests en `tests/escaneo.test.ts`. Fotos en `public/fotos/` (créditos en `docs/fotos.md`).

### Definición de «terminado» para cada pantalla
- Usa solo tokens y componentes de `ui/`.
- Se ve bien a 360 px y a 1280 px.
- Cumple el contraste AA y tiene foco visible.
- Tiene los estados de carga, vacío y error.
- `pnpm lint`, `pnpm typecheck` y `pnpm test` pasan.

---

## 13. Comandos

```bash
pnpm install
pnpm dev          # servidor de desarrollo
pnpm seed         # carga los datos de demo
pnpm lint
pnpm typecheck    # tsc --noEmit
pnpm test         # tests unitarios (precios, permisos)
pnpm build
pnpm dev:demo     # demo estática en http://localhost:3002
pnpm build:demo   # demo estática en .next-demo/ (la publica GitHub Pages)
```

**Demo para mostrar el proyecto** (decisión del 17/11/2026, ver `docs/demo.md`): se publica en GitHub Pages un sitio estático que funciona entero en el navegador, con datos ficticios en `localStorage`, barra «Ver como cliente / peluquera» y «Reiniciar demo». No usa servidor, base de datos ni login. Vive en `src/app/(demo)/*.demo.tsx` y `src/demo/`, y reutiliza los componentes y la lógica de la app real (los componentes reciben sus acciones por props). Cualquier cambio en una pantalla compartida tiene que seguir funcionando en las dos versiones. WhatsApp del salón: `5491151770132`.

Variables de entorno (`.env.example`):

```
DATABASE_URI=file:./petmellis.db
PAYLOAD_SECRET=
DEMO_ADMIN_EMAIL=
DEMO_ADMIN_PASSWORD=
WHATSAPP_LOCAL=549XXXXXXXXXX
GEMINI_API_KEY=          # opcional
GEMINI_MODEL=            # opcional, modelo Flash vigente
```

---

## 14. Preguntas abiertas

- Dirección exacta del local en Merlo y horarios de atención.
- Precios definitivos y duración de cada servicio (los de la sección 8 vienen del prototipo).
- ¿Atiende una sola peluquera o hay más personas en el salón?
- Fotos reales del local y permiso de los clientes para usar las fotos de sus perros.
- ¿Dónde se va a mostrar la demo: en local o publicada (Vercel u otro)?
