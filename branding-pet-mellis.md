# Pet Mellis — manual de marca y contexto de diseño

**Pet Mellis** es la marca de *Los Mellis – Peluquería Canina* (Merlo, Buenos Aires) y de su web app con **Ficha Evolutiva**: una libreta digital que recuerda cómo le fue a cada perro en sus visitas anteriores.

> **Tagline:** *Cada visita mejora la siguiente.*
> **Descriptor:** peluquería canina · Merlo

> Documento de contexto (16/11/2026; paleta actualizada el 17/11/2026, ver §3). Reemplaza la sección 7 «Sistema de diseño» de `CLAUDE.md`.

Este manual define el nombre, el logo, los colores, la tipografía, los íconos, el patrón y la voz. Todo lo que se diseñe (web app, redes, vidriera, papelería) sale de acá.

---

## 1. Concepto

**Referencia visual.** Se toma como base el proyecto *Puppy Grooming* de Noé Chaumont (Behance, 2023): una cabeza de perro redonda y peluda como signo, íconos de servicio donde esa misma cabeza lleva el accesorio de cada servicio, un patrón de cabezas al 10 % y la tipografía **Oddval**.

**Lo propio de Pet Mellis.**
- **Los mellis.** El nombre viene de *mellizos*: el signo son **dos** cabezas peludas juntas, una menta adelante y una blanca con moño coral atrás. Hablan del equipo (dos personas que atienden) y del vínculo perro–tutor.
- **Recién peinados y tranquilos.** El contorno festoneado es el manto después del baño y el cepillado. Los ojos cerrados y la sonrisa transmiten calma: un perro que la pasó bien.
- **Azul calma, menta y coral.** Confianza y calma (azul), frescura y cuidado (menta y celeste), energía para actuar (coral, solo en la acción principal). Es una paleta de alto contraste que se lee bien en el celular.
- **El ticket.** Las tarjetas con borde negro y sombra dura vienen de la libreta y del presupuesto impreso: la marca registra, anota y recuerda.

**Propósito:** que ningún perro empiece de cero en su próxima visita.
**Propuesta de valor:** atención personalizada que mejora con cada turno, porque todo lo que pasó queda anotado y se usa.
**Personalidad:** cálida, prolija, alegre sin ser infantil, cercana (voseo).

## 2. Logo

| Pieza | Qué es | Cuándo |
|---|---|---|
| Isotipo | Los dos mellis | Avatar, favicon, sellos, íconos de app |
| Logotipo | «pet mellis» en Oddval SemiBold, minúscula | Cuando el isotipo ya está cerca |
| Imagotipo horizontal | Isotipo + logotipo + descriptor | Header de la web app, firmas, vidriera (principal) |
| Imagotipo vertical | Isotipo arriba, logotipo abajo | Posteos cuadrados, bolsas, stickers |
| Avatar | Un mellis blanco sobre círculo amarillo | Instagram, Facebook, WhatsApp Business |

- **Área de seguridad:** ¼ del alto del isotipo libre alrededor.
- **Tamaño mínimo:** isotipo 24 px (10 mm impreso); imagotipo horizontal 120 px de ancho.
- **Fondos:** crema o blanco (versión principal), amarillo (mellis blanco y amarillo claro, moño negro), negro (versión principal con texto blanco y descriptor amarillo).
- **No:** recolorear a los mellis, separarlos, rotarlos, agregar sombras o degradados, ponerlos sobre una foto sin placa.

Archivos en el grupo de assets **Logos**. La vista **Logo** muestra todas las versiones.

## 3. Color

> **Paleta oficial desde el 17/11/2026.** Reemplaza al amarillo y negro de la primera versión. Donde el resto de este manual (§1, §2, §5, §6, §10, §11 y §12) nombre `amarillo-*` o `negro`, leer la equivalencia de la última columna. Los valores vigentes están en `src/styles/globals.css`.

| Token | Hex | Rol | Reemplaza a |
|---|---|---|---|
| `azul-calma` (`azul`) | #0F2942 | Primario: header, títulos, texto, bordes y sombra de los tickets | `negro` |
| `verde-menta` (`menta`) | #14B8A6 | Secundario: íconos, éxito, chips elegidos, el mellis de adelante | `amarillo-mellis` (fuera de los CTA) |
| `menta-texto` | #0F766E | Menta oscuro para texto chico sobre claro (5,4:1) | `amarillo-texto` |
| `celeste` | #E2F8F5 | Tarjetas destacadas, avisos suaves, filas elegidas | `amarillo-claro` |
| `crema-suave` (`crema`) | #FFFDF9 | Fondo de página | `crema` |
| `naranja-coral` (`coral`) | #F97316 | Acento: CTA clave («Reservar turno», «Reservar con este plan»), moño del logo | `amarillo-mellis` en botones |
| `coral-hover` | #FB923C | Hover del CTA | `amarillo-profundo` |
| `pizarra` | #64748B | Texto secundario de marca (papelería, redes) | — |
| `blanco` | #FFFFFF | Tarjetas, el mellis de atrás, texto sobre azul | — |

**Proporción sugerida:** 55 % crema/blanco, 25 % azul, 12 % menta y celeste, 8 % coral. El coral se reserva para la acción principal: si hay dos botones coral en la misma vista, uno sobra.

**Contraste (WCAG AA):**
- Azul sobre crema: 14,6:1. Blanco sobre azul: 14,8:1. ✔
- **Texto azul sobre coral: 5,3:1.** ✔ Texto blanco sobre coral: 2,8:1. ✘ **Prohibido.**
- Azul sobre menta: 6,0:1. Menta sobre azul: 6,0:1. ✔
- Menta #14B8A6 como texto sobre blanco o crema: 2,5:1. ✘ **Prohibido.** Para eso está `menta-texto` (5,4:1).
- Pizarra #64748B sobre crema: 4,7:1 ✔, pero sobre celeste da 4,3:1 ✘. Por eso en la web app el texto secundario (`texto-suave`) es un pizarra un punto más oscuro, #536175 (5,7:1 sobre celeste).

Los colores de estado (`exito`, `aviso`, `peligro`, `info`) son solo para la web app y siempre van con texto.

La web app tiene **tema claro** (fondo crema, tarjetas blancas, tinta azul) y **tema oscuro** (fondo azul noche #0B1E31, tinta menta). Los tokens semánticos (`fondo`, `superficie`, `texto`, `tinta`, `accion`, `seleccion`…) cambian solos entre temas.

<details>
<summary>Paleta anterior (amarillo y negro, hasta el 17/11/2026)</summary>

| Token | Hex |
|---|---|
| `amarillo-mellis` | #FFD000 |
| `negro` | #111111 |
| `crema` | #FFFBEA |
| `amarillo-claro` | #FFF3B0 |
| `amarillo-profundo` | #F2B705 |
| `amarillo-texto` | #7A5C00 |

</details>

## 4. Tipografía

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Display | **Oddval** | SemiBold (600) | Logotipo, títulos, precios. Títulos en minúscula. |
| Texto | **Nunito** | 400, 700, 800 | Párrafos, botones, formularios |
| Datos | **Space Mono** | 400, 700 | Rótulos en mayúscula, estados, datos del ticket |

**Oddval** es de Type Forward (Stan Partalev y Mirela Belova): geométrica, ancha, de x-height alta y con *ink traps*. El peso **SemiBold** se descarga gratis desde la página de la fundidora y DaFont; la familia completa se compra por estilo. Para el logo, piezas impresas y redes alcanza con el SemiBold.

**En la web** Oddval no está en Google Fonts: los títulos usan la pila `Oddval, Sora, …`. Si se sube el archivo de Oddval SemiBold al proyecto se usa ese; si no, **Sora** (Google Fonts, gratis) es el reemplazo más parecido.

**Escala:** 56 (logotipo) · 40 · 28 · 20 · 18 · 16 · 14 · 12 px. Nada por debajo de 12 px; acciones mínimo 14 px.

## 5. Iconografía

- **Íconos de servicio:** un mellis amarillo con el accesorio de cada servicio (tijera, burbujas, peine, alicate, cepillo, gota, diente, escudo, moño, planilla). Línea negra, accesorio blanco. Para el cotizador, la vidriera y las historias destacadas. Mínimo 40 px.
- **Íconos de interfaz:** línea de 1,75 px, 24 × 24, puntas redondeadas, en `currentColor`. Navegación, horarios, ubicación, WhatsApp, alertas.
- **Sin emojis** en la interfaz ni en las piezas de marca.

## 6. Patrón

Mellis y patitas alternados en un módulo de 120 px. Amarillo con línea negra para bolsas y stickers; crema con línea al 12 % para fondos de la web y papelería; negro con línea amarilla al 35 % para historias. Nunca detrás de texto chico.

## 7. Voz y tono

- **Voz:** cálida, clara y prolija. Español rioplatense con voseo: «reservá», «elegí», «tu perro».
- **Con el tutor:** cercana y tranquilizadora. «Toby tolera cada vez mejor el secador. La próxima seguimos de a poco.»
- **En el panel de la peluquera:** breve y operativa. «Max · no tolera las uñas · empezar por acá.»
- **Evitar:** diminutivos en exceso, signos de exclamación seguidos, promesas que la app no cumple («IA que adivina la raza»).

## 8. Aplicaciones

Header y barra inferior de la web app, tarjetas de servicio, insignias de estado y etiquetas de la ficha, ticket de presupuesto, tarjeta personal, posteo de Instagram, avatar, favicon, vinilo de vidriera (imagotipo vertical + íconos de servicio en fila) y bolsa o sticker con el patrón amarillo. Ver las vistas **Aplicaciones**, **Navegación**, **Tarjeta de servicio** y **Etiqueta**.

## 9. Storytelling

Todo empezó en una peluquería de Merlo donde cada perro tiene su historia: Toby le teme al secador, Max no se deja cortar las uñas, Coco tiene la piel sensible. Esas historias vivían en papelitos, en chats de WhatsApp y en la memoria de quien atiende, y en la visita siguiente había que volver a empezar. Así nacieron *los mellis*: dos cabezas peludas, recién peinadas y tranquilas, que representan a las dos personas detrás del proyecto y la idea de que el cuidado se hace de a dos, la peluquera y el tutor. El amarillo es la alegría con la que se va cada perro; el blanco, la prolijidad del trabajo; el negro, la confianza de que nada se pierde. Pet Mellis no reemplaza el trato de siempre: lo recuerda. Cada atención queda anotada en la Ficha Evolutiva, se compara con las anteriores y define cómo empezar la próxima vez. Por eso la promesa es simple: **cada visita mejora la siguiente**.

## 10. Para la web app (reemplazo de tokens)

La sección 7 de `CLAUDE.md` usa la paleta del prototipo (verde y naranja). Con esta marca se reemplaza así:

| Token del prototipo | Pasa a |
|---|---|
| `--background` #f7f0d8 | `fondo` (#FFFBEA) |
| `--card` #fffdf5 | `superficie` (#FFFFFF) |
| `--foreground`, `--ink` | `texto`, `tinta` (#111111) |
| `--primary` #14503b (header, seleccionados) | `negro` (#111111) |
| `--cream` (texto sobre verde) | `blanco` |
| `--orange` (CTA) | `accion` = `amarillo-mellis` con texto `sobre-accion` |
| `--orange-text` | `amarillo-texto` (#7A5C00) |
| `--secondary`, `--sand`, `--muted` | `superficie-alt` (#FFF3B0) |
| `--border` | `linea` (#E6DFC4) |
| `--ring` | `tinta` |
| Poppins (display) | Oddval → Sora |

Nunito, Space Mono, el estilo ticket (borde 2 px, sombra dura 4 px), los títulos en minúscula y los tokens de estado se mantienen.

---

## 11. Tokens completos

### 11.1 Colores

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `amarillo-mellis` | #ffd000 | #ffd000 | Color de marca. Fondos de botones principales, bloques, mellis y destacados. Texto negro encima (12,8:1). Nunca texto blanco encima ni como texto sobre blanco. |
| `amarillo-claro` | #fff3b0 | #fff3b0 | Tinte para fondos de avisos, filas resaltadas y chips seleccionados. Texto negro o amarillo-texto encima. |
| `amarillo-profundo` | #f2b705 | #f2b705 | Hover del botón amarillo y mejillas del mellis blanco. Solo fondos o ilustración. |
| `amarillo-texto` | #7a5c00 | #7a5c00 | El único amarillo para texto chico sobre blanco o crema (6,3:1). Montos y rótulos destacados. |
| `negro` | #111111 | #111111 | Tinta de marca: línea del logo, bordes y sombra de los tickets, texto principal. |
| `blanco` | #ffffff | #ffffff | Tarjetas, el mellis de atrás y texto sobre negro. |
| `crema` | #fffbea | #fffbea | Blanco cálido para el fondo de página y la papelería. Evita el blanco puro en superficies grandes. |
| `fondo` | #fffbea | #111111 | Fondo de página. |
| `superficie` | #ffffff | #1c1c1c | Tarjetas tipo ticket, modales, campos. |
| `superficie-alt` | #fff3b0 | #2a2a2a | Barras, opciones no elegidas, encabezados de tabla. |
| `texto` | #111111 | #ffffff | Texto principal sobre fondo y superficie. |
| `texto-suave` | #5c5c5c | #c4c4c4 | Texto secundario, ayudas y fechas (6,5:1 en claro, 9,8:1 en oscuro). |
| `tinta` | #111111 | #ffd000 | Borde de 2 px y sombra dura de los tickets y botones; anillo de foco. |
| `linea` | #e6dfc4 | #3a3a3a | Separadores suaves y bordes punteados dentro de una tarjeta. Decorativo, no para controles. |
| `accion` | = `amarillo-mellis` | = `amarillo-mellis` | Fondo del botón principal en los dos temas. |
| `sobre-accion` | = `negro` | = `negro` | Texto e ícono sobre accion. |
| `exito` | #1f6b45 | #7fd3a3 | Texto de estados confirmado, listo y finalizado. |
| `exito-fondo` | #dcefe2 | #12301f | Fondo de la insignia de éxito. |
| `aviso` | #7a5c00 | #ffd000 | Texto de alertas de ficha y turno solicitado. |
| `aviso-fondo` | #fff3b0 | #332a00 | Fondo de alertas y del estado solicitado. |
| `peligro` | #b42318 | #ff8a80 | Texto de cancelado y cuidados críticos. |
| `peligro-fondo` | #fde4e1 | #3a1512 | Fondo de la insignia de peligro. |
| `info` | #1f4f7a | #8cc2f0 | Texto del estado en atención. |
| `info-fondo` | #dde9f3 | #142636 | Fondo de la insignia de info. |

### 11.2 Escala tipográfica

| Estilo | Familia | Tamaño / interlineado | Peso | Uso |
|---|---|---|---|---|
| `logotipo` | display | 56px / 1 | 600 | Solo para el logotipo, en minúscula. |
| `titulo-1` | display | 40px / 44px | 600 | Portadas y hero. En minúscula. |
| `titulo-2` | display | 28px / 32px | 600 | Títulos de sección. |
| `titulo-3` | display | 20px / 26px | 600 | Títulos de tarjeta. |
| `precio` | display | 28px / 1 | 700 | Montos del cotizador, con cifras tabulares. |
| `cuerpo-grande` | texto | 18px / 28px | 400 | Bajadas de hero. |
| `cuerpo` | texto | 16px / 25px | 400 | Texto corrido. |
| `cuerpo-fuerte` | texto | 16px / 25px | 700 | Énfasis dentro del texto. |
| `boton` | texto | 16px / 16px | 800 | Botones y acciones (mínimo 14 px). |
| `secundario` | texto | 14px / 21px | 400 | Ayudas, notas y pies. |
| `etiqueta` | datos | 12px / 16px | 700 | Rótulos en mayúscula, estados y datos del ticket. Nunca menos de 12 px. |

Fuentes en la web app: cargar **Sora**, **Nunito** y **Space Mono** con `next/font/google`; si se agrega el archivo de **Oddval SemiBold**, cargarlo con `next/font/local` y ponerlo primero en `--font-display`.

### 11.3 Espaciado, radios, sombra y bordes

| Token | Valor | Uso |
|---|---|---|
| `espacio-1` | 4px | Entre ícono y texto chico. |
| `espacio-2` | 8px | Entre chips. |
| `espacio-3` | 12px | Dentro de chips y filas. |
| `espacio-4` | 16px | Margen lateral en el celular. |
| `espacio-5` | 20px | Relleno de tarjetas. |
| `espacio-6` | 24px | Entre tarjetas. |
| `espacio-8` | 32px | Entre secciones. |
| `espacio-12` | 48px | Aire de portadas. |
| `radio-sm` | 6px | Campos, chips cuadrados. |
| `radio-md` | 10px | Botones y tickets. |
| `radio-lg` | 18px | Fotos, íconos de servicio, posteos. |
| `radio-pill` | 999px | Insignias de estado y etiquetas. |
| `sombra-ticket` | 4px 4px 0 0 #111111 | Sombra dura de tickets y botones. Al presionar baja a 1px 1px. |
| `borde-ticket` | 2px | Grosor de borde en tinta para tickets, botones y fotos. |
| `trazo-icono` | 1.75px | Trazo de los íconos de interfaz. |

### 11.4 CSS listo para pegar (`@theme` de Tailwind 4 o `:root`)

```css
:root {
  --amarillo-mellis: #ffd000;
  --amarillo-claro: #fff3b0;
  --amarillo-profundo: #f2b705;
  --amarillo-texto: #7a5c00;
  --negro: #111111;
  --blanco: #ffffff;
  --crema: #fffbea;
  --fondo: #fffbea;
  --superficie: #ffffff;
  --superficie-alt: #fff3b0;
  --texto: #111111;
  --texto-suave: #5c5c5c;
  --tinta: #111111;
  --linea: #e6dfc4;
  --accion: var(--amarillo-mellis);
  --sobre-accion: var(--negro);
  --exito: #1f6b45;
  --exito-fondo: #dcefe2;
  --aviso: #7a5c00;
  --aviso-fondo: #fff3b0;
  --peligro: #b42318;
  --peligro-fondo: #fde4e1;
  --info: #1f4f7a;
  --info-fondo: #dde9f3;
  --espacio-1: 4px;
  --espacio-2: 8px;
  --espacio-3: 12px;
  --espacio-4: 16px;
  --espacio-5: 20px;
  --espacio-6: 24px;
  --espacio-8: 32px;
  --espacio-12: 48px;
  --radio-sm: 6px;
  --radio-md: 10px;
  --radio-lg: 18px;
  --radio-pill: 999px;
  --sombra-ticket: 4px 4px 0 0 #111111;
  --borde-ticket: 2px;
  --trazo-icono: 1.75px;
  --font-display: "Oddval", "Sora", ui-rounded, system-ui, sans-serif;
  --font-texto: "Nunito", ui-rounded, "Segoe UI", system-ui, sans-serif;
  --font-datos: "Space Mono", ui-monospace, Consolas, monospace;
}

[data-theme="oscuro"] {
  --fondo: #111111;
  --superficie: #1c1c1c;
  --superficie-alt: #2a2a2a;
  --texto: #ffffff;
  --texto-suave: #c4c4c4;
  --tinta: #ffd000;
  --linea: #3a3a3a;
  --exito: #7fd3a3;
  --exito-fondo: #12301f;
  --aviso: #ffd000;
  --aviso-fondo: #332a00;
  --peligro: #ff8a80;
  --peligro-fondo: #3a1512;
  --info: #8cc2f0;
  --info-fondo: #142636;
  --sombra-ticket: 4px 4px 0 0 #ffd000;
}
```

## 12. Componentes

### Logo

Imagotipo de Pet Mellis: el isotipo de los mellis a la izquierda (o arriba) y el logotipo «pet mellis» en Oddval SemiBold, en minúscula, con el descriptor «peluquería canina» en Space Mono.

#### Versiones
- **Horizontal (principal):** header de la web app, firma de mail, tarjeta, vidriera.
- **Vertical:** posteos cuadrados, bolsas, stickers.
- **Isotipo solo:** cuando el nombre ya está escrito cerca o el espacio es chico.
- **Avatar:** un solo mellis blanco sobre círculo amarillo, para redes y WhatsApp Business.

#### Reglas
- Área de seguridad: alrededor del logo, dejar libre al menos la altura de una oreja del mellis (¼ del alto del isotipo).
- Tamaño mínimo: isotipo 24 px de alto; imagotipo horizontal 120 px de ancho.
- Fondos permitidos: crema, blanco, amarillo (versión blanca y negra) y negro.
- No: cambiar los colores de los mellis, separar las cabezas, rotar, agregar sombras o degradados, poner el logo sobre una foto sin una placa crema o amarilla detrás.
- El logotipo final se entrega en curvas: escribir «pet mellis» en Oddval SemiBold en Figma o Illustrator, ajustar el espacio entre letras a −2 % y convertir a contornos.

### Botón

Botón tipo ticket: borde de 2 px en `tinta`, esquinas `radio-md` y sombra dura `sombra-ticket`; al presionarlo «se hunde» (la sombra baja a 1 px).

- **Principal:** fondo `accion` (amarillo) y texto `sobre-accion` (negro). Una sola acción principal por pantalla: «Reservar turno», «Confirmar», «Guardar atención».
- **Secundario:** fondo `superficie`, texto `texto`.
- **Oscuro:** fondo `negro`, texto `amarillo-mellis`. Para WhatsApp y acciones sobre fondo amarillo.
- **Deshabilitado:** fondo `superficie-alt`, texto `texto-suave`, sin sombra, y un mensaje debajo con lo que falta.
- Texto en Nunito 800 de 16 px (mínimo 14 px). Nunca texto blanco sobre amarillo.
- Foco visible: contorno de 2 px en `tinta` separado 3 px.

### Tarjeta de servicio

Ticket con el ícono de servicio, el nombre en `titulo-3`, una línea de descripción en `texto-suave` y el pie con el precio «desde» (`precio`) y la duración (`etiqueta`).

- El ícono va en una placa `amarillo-claro` de 64 px con borde `tinta` y `radio-lg`.
- La insignia «Popular» es negra con texto amarillo; una sola por fila.
- El precio de la tarjeta no incluye el recargo por nudos (va aparte en el resumen).
- Quien la usa provee: ícono (de *Iconos de servicio*), nombre, descripción, precio ya formateado con `Intl.NumberFormat('es-AR')` y duración.

### Etiqueta

Dos familias de píldoras (`radio-pill`):

- **Estado de turno** (Space Mono 12 px en mayúscula): solicitado → `aviso`; confirmado y listo → `exito`; en atención → `info`; finalizado → `texto-suave`; cancelado → `peligro`. Cada una con su fondo `*-fondo`.
- **Etiqueta rápida de la ficha** (Nunito 800 de 14 px, borde `tinta`): elegida = fondo `amarillo-mellis`; las de cuidado (miedo al secador, no tolera las uñas, muerde al cepillar) usan `aviso` para que la peluquera las vea antes de empezar.
- El color nunca es la única señal: siempre va el texto del estado.

### Navegación

- **Header:** a ancho completo, fondo `negro`, logo horizontal en blanco con descriptor amarillo, pestaña activa en `amarillo-mellis` con texto negro. Uno solo por layout.
- **Barra inferior (celular, < 768 px):** fondo `superficie`, borde superior `tinta`, ícono de interfaz de 22 px y texto de 12 px en Nunito 800; la activa en amarillo.
- El panel de la peluquera usa los mismos colores con menú lateral negro.


## 13. Archivos de marca

### Logos

El isotipo son **los mellis**: dos cabezas peludas recién peinadas, una amarilla adelante y una blanca con moño atrás.
Todos los archivos están dibujados con línea **negra #111111**; el de una tinta tiene relleno blanco y se puede recolorear entero a negro o blanco.

- `isotipo-mellis.svg`: versión principal, fondo transparente. Usarla sobre blanco o crema.
- `isotipo-mellis-sobre-amarillo.svg`: para fondos amarillos (los mellis pasan a blanco y negro).
- `isotipo-mellis-sobre-negro.svg`: para fondos negros.
- `isotipo-mellis-una-tinta.svg`: sellos, grabados, impresión a un color.
- `avatar-redes.svg`: foto de perfil de Instagram, Facebook y WhatsApp Business.
- `favicon.svg`: ícono de la web app (pestaña y acceso directo).

El logotipo «pet mellis» se compone con **Oddval SemiBold** en minúscula. Ver la vista *Logo* para las versiones horizontal y vertical.
Tamaño mínimo del isotipo: 24 px de alto en pantalla, 10 mm en papel.

### Iconos de servicio

Un mellis amarillo con el accesorio del servicio (tijera, burbujas, peine, alicate, cepillo, gota, diente, escudo, moño, planilla).
Relleno **amarillo #FFD000**, accesorio **blanco**, línea **negra #111111** de 2,4 px a 64 px.
Se usan en las tarjetas de servicio del cotizador, en la vidriera y en las historias destacadas de Instagram. Tamaño mínimo: 40 px.

### Iconos de interfaz

Íconos de línea para la web app: 24 x 24, trazo de **1,75 px**, puntas redondeadas, en **negro #111111**.
En el código se pintan con `currentColor` (el archivo trae negro para poder verlo). Sobre negro se usan en blanco o amarillo.
Nunca reemplazar estos íconos por emojis.

### Patron

Mellis y patitas alternados en un módulo de 120 x 120 px.
- `patron-amarillo.svg`: línea negra al 100 % sobre amarillo. Bolsas, stickers, fondo de posteos.
- `patron-crema-10.svg`: línea negra al 12 % sobre crema. Fondos de la web app y papelería.
- `patron-negro.svg`: línea amarilla al 35 % sobre negro. Historias y portadas.
- `modulo-patron.svg`: el módulo suelto para armar otros fondos.
El patrón nunca va detrás de texto chico: debajo de un párrafo se usa la versión al 12 %.


### 13.1 Isotipo (SVG)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 150" width="230" height="150"><title>Pet Mellis, isotipo</title><g transform="translate(0 0) scale(1)"><path d="M125.63 53.18A9.42 9.42 0 0 1 136.16 65.18A9.42 9.42 0 0 1 133.35 80.9A9.42 9.42 0 0 1 119.31 88.5A9.42 9.42 0 0 1 104.61 82.26A9.42 9.42 0 0 1 100.33 66.88A9.42 9.42 0 0 1 109.68 53.94A9.42 9.42 0 0 1 125.63 53.18Z" fill="#FFFFFF" stroke="#111111" stroke-width="5" stroke-linejoin="round"/><path d="M204.75 53.18A9.42 9.42 0 0 1 215.28 65.18A9.42 9.42 0 0 1 212.47 80.9A9.42 9.42 0 0 1 198.43 88.5A9.42 9.42 0 0 1 183.73 82.26A9.42 9.42 0 0 1 179.45 66.88A9.42 9.42 0 0 1 188.8 53.94A9.42 9.42 0 0 1 204.75 53.18Z" fill="#FFFFFF" stroke="#111111" stroke-width="5" stroke-linejoin="round"/><path d="M165.99 14.7A14.05 14.05 0 0 1 187.57 24.76A14.05 14.05 0 0 1 201.23 44.27A14.05 14.05 0 0 1 203.3 67.99A14.05 14.05 0 0 1 193.24 89.57A14.05 14.05 0 0 1 173.73 103.23A14.05 14.05 0 0 1 150.01 105.3A14.05 14.05 0 0 1 128.43 95.24A14.05 14.05 0 0 1 114.77 75.73A14.05 14.05 0 0 1 112.7 52.01A14.05 14.05 0 0 1 122.76 30.43A14.05 14.05 0 0 1 142.27 16.77A14.05 14.05 0 0 1 165.99 14.7Z" fill="#FFFFFF" stroke="#111111" stroke-width="5" stroke-linejoin="round"/><path d="M136.38 60.92Q142.36 67.5 148.34 60.92" fill="none" stroke="#111111" stroke-width="4.25" stroke-linecap="round"/><path d="M167.66 60.92Q173.64 67.5 179.62 60.92" fill="none" stroke="#111111" stroke-width="4.25" stroke-linecap="round"/><circle cx="132.7" cy="72.42" r="4.6" fill="#F2B705"/><circle cx="183.3" cy="72.42" r="4.6" fill="#F2B705"/><ellipse cx="158" cy="70.12" rx="5.98" ry="4.14" fill="#111111"/><path d="M158 74.26v3.22M151.56 76.56Q154.78 81.62 158 77.48Q161.22 81.62 164.44 76.56" fill="none" stroke="#111111" stroke-width="4.25" stroke-linecap="round" stroke-linejoin="round"/><g transform="rotate(-18 177.32 24.12)"><path d="M177.32 24.12L161.68 14.74Q159.33 24.12 161.68 33.5Z" fill="#FFD000" stroke="#111111" stroke-width="4.25" stroke-linejoin="round"/><path d="M177.32 24.12L192.96 14.74Q195.31 24.12 192.96 33.5Z" fill="#FFD000" stroke="#111111" stroke-width="4.25" stroke-linejoin="round"/><circle cx="177.32" cy="24.12" r="3.75" fill="#FFD000" stroke="#111111" stroke-width="4.25"/></g><path d="M39.5 77.51A10.24 10.24 0 0 1 53.04 88.37A10.24 10.24 0 0 1 53 105.72A10.24 10.24 0 0 1 39.4 116.51A10.24 10.24 0 0 1 22.49 112.61A10.24 10.24 0 0 1 15 96.95A10.24 10.24 0 0 1 22.57 81.33A10.24 10.24 0 0 1 39.5 77.51Z" fill="#FFD000" stroke="#111111" stroke-width="5" stroke-linejoin="round"/><path d="M125.5 77.51A10.24 10.24 0 0 1 139.04 88.37A10.24 10.24 0 0 1 139 105.72A10.24 10.24 0 0 1 125.4 116.51A10.24 10.24 0 0 1 108.49 112.61A10.24 10.24 0 0 1 101 96.95A10.24 10.24 0 0 1 108.57 81.33A10.24 10.24 0 0 1 125.5 77.51Z" fill="#FFD000" stroke="#111111" stroke-width="5" stroke-linejoin="round"/><path d="M78 36A15.27 15.27 0 0 1 103 42.7A15.27 15.27 0 0 1 121.3 61A15.27 15.27 0 0 1 128 86A15.27 15.27 0 0 1 121.3 111A15.27 15.27 0 0 1 103 129.3A15.27 15.27 0 0 1 78 136A15.27 15.27 0 0 1 53 129.3A15.27 15.27 0 0 1 34.7 111A15.27 15.27 0 0 1 28 86A15.27 15.27 0 0 1 34.7 61A15.27 15.27 0 0 1 53 42.7A15.27 15.27 0 0 1 78 36Z" fill="#FFD000" stroke="#111111" stroke-width="5" stroke-linejoin="round"/><path d="M54.5 87Q61 94.15 67.5 87" fill="none" stroke="#111111" stroke-width="4.25" stroke-linecap="round"/><path d="M88.5 87Q95 94.15 101.5 87" fill="none" stroke="#111111" stroke-width="4.25" stroke-linecap="round"/><ellipse cx="78" cy="97" rx="6.5" ry="4.5" fill="#111111"/><path d="M78 101.5v3.5M71 104Q74.5 109.5 78 105Q81.5 109.5 85 104" fill="none" stroke="#111111" stroke-width="4.25" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
```

### 13.2 Avatar para redes (SVG)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><title>Pet Mellis, avatar</title><circle cx="60" cy="60" r="60" fill="#FFD000"/><path d="M35.36 54.57A6.55 6.55 0 0 1 44.03 61.52A6.55 6.55 0 0 1 44 72.62A6.55 6.55 0 0 1 35.3 79.53A6.55 6.55 0 0 1 24.47 77.03A6.55 6.55 0 0 1 19.68 67.01A6.55 6.55 0 0 1 24.52 57.01A6.55 6.55 0 0 1 35.36 54.57Z" fill="#FFFFFF" stroke="#111111" stroke-width="4.2" stroke-linejoin="round"/><path d="M90.4 54.57A6.55 6.55 0 0 1 99.07 61.52A6.55 6.55 0 0 1 99.04 72.62A6.55 6.55 0 0 1 90.34 79.53A6.55 6.55 0 0 1 79.51 77.03A6.55 6.55 0 0 1 74.72 67.01A6.55 6.55 0 0 1 79.56 57.01A6.55 6.55 0 0 1 90.4 54.57Z" fill="#FFFFFF" stroke="#111111" stroke-width="4.2" stroke-linejoin="round"/><path d="M60 28A9.77 9.77 0 0 1 76 32.29A9.77 9.77 0 0 1 87.71 44A9.77 9.77 0 0 1 92 60A9.77 9.77 0 0 1 87.71 76A9.77 9.77 0 0 1 76 87.71A9.77 9.77 0 0 1 60 92A9.77 9.77 0 0 1 44 87.71A9.77 9.77 0 0 1 32.29 76A9.77 9.77 0 0 1 28 60A9.77 9.77 0 0 1 32.29 44A9.77 9.77 0 0 1 44 32.29A9.77 9.77 0 0 1 60 28Z" fill="#FFFFFF" stroke="#111111" stroke-width="4.2" stroke-linejoin="round"/><path d="M44.96 60.64Q49.12 65.22 53.28 60.64" fill="none" stroke="#111111" stroke-width="3.57" stroke-linecap="round"/><path d="M66.72 60.64Q70.88 65.22 75.04 60.64" fill="none" stroke="#111111" stroke-width="3.57" stroke-linecap="round"/><circle cx="42.4" cy="68.64" r="3.2" fill="#F2B705"/><circle cx="77.6" cy="68.64" r="3.2" fill="#F2B705"/><ellipse cx="60" cy="67.04" rx="4.16" ry="2.88" fill="#111111"/><path d="M60 69.92v2.24M55.52 71.52Q57.76 75.04 60 72.16Q62.24 75.04 64.48 71.52" fill="none" stroke="#111111" stroke-width="3.57" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

### 13.3 Favicon (SVG)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><title>Pet Mellis, favicon</title><rect width="32" height="32" rx="8" fill="#FFD000"/><path d="M9.69 15.11A1.68 1.68 0 0 1 11.91 16.89A1.68 1.68 0 0 1 11.9 19.73A1.68 1.68 0 0 1 9.67 21.5A1.68 1.68 0 0 1 6.9 20.86A1.68 1.68 0 0 1 5.67 18.3A1.68 1.68 0 0 1 6.91 15.73A1.68 1.68 0 0 1 9.69 15.11Z" fill="#FFFFFF" stroke="#111111" stroke-width="1.8" stroke-linejoin="round"/><path d="M23.79 15.11A1.68 1.68 0 0 1 26.01 16.89A1.68 1.68 0 0 1 26 19.73A1.68 1.68 0 0 1 23.77 21.5A1.68 1.68 0 0 1 21 20.86A1.68 1.68 0 0 1 19.77 18.3A1.68 1.68 0 0 1 21.01 15.73A1.68 1.68 0 0 1 23.79 15.11Z" fill="#FFFFFF" stroke="#111111" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 8.3A2.5 2.5 0 0 1 20.1 9.4A2.5 2.5 0 0 1 23.1 12.4A2.5 2.5 0 0 1 24.2 16.5A2.5 2.5 0 0 1 23.1 20.6A2.5 2.5 0 0 1 20.1 23.6A2.5 2.5 0 0 1 16 24.7A2.5 2.5 0 0 1 11.9 23.6A2.5 2.5 0 0 1 8.9 20.6A2.5 2.5 0 0 1 7.8 16.5A2.5 2.5 0 0 1 8.9 12.4A2.5 2.5 0 0 1 11.9 9.4A2.5 2.5 0 0 1 16 8.3Z" fill="#FFFFFF" stroke="#111111" stroke-width="1.8" stroke-linejoin="round"/><path d="M12.15 16.66Q13.21 17.84 14.28 16.66" fill="none" stroke="#111111" stroke-width="1.53" stroke-linecap="round"/><path d="M17.72 16.66Q18.79 17.84 19.85 16.66" fill="none" stroke="#111111" stroke-width="1.53" stroke-linecap="round"/><ellipse cx="16" cy="18.3" rx="1.07" ry="0.74" fill="#111111"/><path d="M16 19.04v0.57M14.85 19.45Q15.43 20.35 16 19.62Q16.57 20.35 17.15 19.45" fill="none" stroke="#111111" stroke-width="1.53" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

### 13.4 Íconos de interfaz (sprite SVG, trazo 1,75)

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <symbol id="i-pata" viewBox="0 0 24 24"><g fill="#111111" stroke="none"><ellipse cx="7" cy="9" rx="1.8" ry="2.4"/><ellipse cx="17" cy="9" rx="1.8" ry="2.4"/><ellipse cx="10" cy="5" rx="1.7" ry="2.2"/><ellipse cx="14" cy="5" rx="1.7" ry="2.2"/><path d="M12 11.5c-3 0-5.5 3.6-5.5 5.6 0 1.6 1.3 2.4 2.7 2.4 1.2 0 1.8-.6 2.8-.6s1.6.6 2.8.6c1.4 0 2.7-.8 2.7-2.4 0-2-2.5-5.6-5.5-5.6Z"/></g></symbol>
  <symbol id="i-tijera" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></symbol>
  <symbol id="i-bano" viewBox="0 0 24 24"><path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Z"/><path d="M6 12V5.5A2.5 2.5 0 0 1 10.5 4"/><path d="M7 20l-1 2M17 20l1 2"/></symbol>
  <symbol id="i-cepillo" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6" rx="2"/><path d="M6 10v8M9 10v10M12 10v8M15 10v10M18 10v8"/></symbol>
  <symbol id="i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
  <symbol id="i-ubicacion" viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></symbol>
  <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6L4 20Z"/><path d="M9.5 9.5c0 2.5 2.5 5 5 5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2Z"/></symbol>
  <symbol id="i-inicio" viewBox="0 0 24 24"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z"/></symbol>
  <symbol id="i-cotizar" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></symbol>
  <symbol id="i-calendario" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></symbol>
  <symbol id="i-libreta" viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></symbol>
  <symbol id="i-flecha" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-alerta" viewBox="0 0 24 24"><path d="M12 4 21 19H3L12 4Z"/><path d="M12 10v4M12 17h.01"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></symbol>
  <symbol id="i-usuario" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></symbol>
  <symbol id="i-grafico" viewBox="0 0 24 24"><path d="M4 20V4M4 20h16"/><path d="m7 15 4-4 3 3 5-6"/></symbol>
</svg>
<!-- uso: <svg class="icon"><use href="#i-calendario"/></svg> -->
```

Los íconos de servicio (mellis con accesorio) y las variantes del logo y del patrón están generados como SVG; se pueden exportar como archivos aparte si hacen falta.

## 14. Pendientes de marca

- Componer el logotipo «pet mellis» en Oddval SemiBold y convertirlo a curvas (Figma o Illustrator).
- Confirmar con el equipo si la marca pública es «Pet Mellis» o «Los Mellis».
- Actualizar la sección 7 de `CLAUDE.md` con los tokens de la sección 11.
