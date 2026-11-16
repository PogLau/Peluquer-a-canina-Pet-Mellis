import type { Payload } from 'payload'

import { extras, pricingConfig, servicios } from '../lib/catalogo-demo'
import { loadCatalog } from '../lib/catalogo'
import type { AppointmentStatus } from '../lib/estados'
import { buildQuote, type Coat, type Knots, type Size } from '../lib/pricing'

import { arDate } from './fechas'

/*
  Datos de demo (CLAUDE.md §9). Borra los datos del negocio y los vuelve a cargar,
  así se puede correr las veces que haga falta. No toca usuarios ni imágenes,
  salvo crear o actualizar el usuario de la peluquera si el .env lo define.
*/

const ETIQUETAS: Array<{ nombre: string; tipo: 'alerta' | 'info' }> = [
  { nombre: 'tranquilo', tipo: 'info' },
  { nombre: 'nervioso', tipo: 'alerta' },
  { nombre: 'miedo al secador', tipo: 'alerta' },
  { nombre: 'no tolera las uñas', tipo: 'alerta' },
  { nombre: 'muerde al cepillar', tipo: 'alerta' },
  { nombre: 'nudos en orejas', tipo: 'info' },
  { nombre: 'piel sensible', tipo: 'alerta' },
  { nombre: 'alérgico', tipo: 'alerta' },
  { nombre: 'cachorro', tipo: 'info' },
  { nombre: 'perro mayor', tipo: 'info' },
]

// Teléfonos ficticios: 54 9 11 0000-00XX
const PERROS: Array<{
  nombre: string
  raza: string
  tamano: Size
  manto: Coat
  pesoKg: number
  etiquetas: string[]
  cuidados?: string
  tutor: { nombre: string; whatsapp: string; zona: string }
}> = [
  {
    nombre: 'Toby',
    raza: 'Caniche Toy',
    tamano: 'chico',
    manto: 'rizado',
    pesoKg: 4,
    etiquetas: ['nudos en orejas', 'miedo al secador'],
    cuidados: 'Secador en temperatura baja y de a poco. Revisar nudos detrás de las orejas.',
    tutor: { nombre: 'Sofía Romero', whatsapp: '5491100000001', zona: 'Merlo centro' },
  },
  {
    nombre: 'Luna',
    raza: 'Golden Retriever',
    tamano: 'grande',
    manto: 'largo',
    pesoKg: 30,
    etiquetas: ['tranquilo'],
    tutor: { nombre: 'Martín Gómez', whatsapp: '5491100000002', zona: 'Parque San Martín' },
  },
  {
    nombre: 'Coco',
    raza: 'Shih Tzu',
    tamano: 'chico',
    manto: 'largo',
    pesoKg: 6,
    etiquetas: ['piel sensible'],
    cuidados: 'Usar shampoo hipoalergénico.',
    tutor: { nombre: 'Carla Benítez', whatsapp: '5491100000003', zona: 'Libertad' },
  },
  {
    nombre: 'Max',
    raza: 'Schnauzer Miniatura',
    tamano: 'chico',
    manto: 'rizado',
    pesoKg: 7,
    etiquetas: ['nervioso', 'no tolera las uñas'],
    cuidados: 'No tolera las uñas: usar técnica gradual y empezar por ahí.',
    tutor: { nombre: 'Diego Acosta', whatsapp: '5491100000004', zona: 'Merlo centro' },
  },
  {
    nombre: 'Bella',
    raza: 'Bichón Maltés',
    tamano: 'chico',
    manto: 'rizado',
    pesoKg: 5,
    etiquetas: ['perro mayor'],
    cuidados: 'Tiene 12 años: pausas cortas y piso antideslizante.',
    tutor: { nombre: 'Elena Ruiz', whatsapp: '5491100000005', zona: 'Pontevedra' },
  },
]

const TURNOS: Array<{
  perro: string
  dias: number
  hora: string
  estado: AppointmentStatus
  servicios: string[]
  extras?: string[]
  nudos: Knots
  origen: 'web' | 'panel'
  notasCliente?: string
}> = [
  // Hoy
  { perro: 'Coco', dias: 0, hora: '10:00', estado: 'listo', servicios: ['bano-cepillado'], nudos: 'sin', origen: 'panel' },
  { perro: 'Toby', dias: 0, hora: '12:00', estado: 'en_atencion', servicios: ['bano-corte'], extras: ['oidos'], nudos: 'moderados', origen: 'web' },
  { perro: 'Max', dias: 0, hora: '14:30', estado: 'confirmado', servicios: ['bano-corte', 'unas'], nudos: 'leves', origen: 'panel' },
  { perro: 'Luna', dias: 0, hora: '16:00', estado: 'confirmado', servicios: ['deslanado'], nudos: 'sin', origen: 'panel' },
  // Solicitudes pendientes
  { perro: 'Bella', dias: 1, hora: '11:00', estado: 'solicitado', servicios: ['bano-cepillado'], extras: ['perfume'], nudos: 'leves', origen: 'web', notasCliente: '¿Puede ser a la mañana? Gracias.' },
  { perro: 'Luna', dias: 3, hora: '15:00', estado: 'solicitado', servicios: ['bano-corte'], nudos: 'moderados', origen: 'web' },
]

// Evolución de Toby con el secador: de mucho miedo a tolerarlo mejor
const ATENCIONES_TOBY = [
  {
    dias: -56,
    puntajes: { secador: 1, unas: 4, bano: 4, desenredado: 3 },
    etiquetas: ['miedo al secador', 'nudos en orejas'],
    notaInterna: 'Tembló todo el secado. Hubo que cortar y terminar con toalla.',
    resumenTutor: 'Toby se portó bien en el baño. El secador le dio mucho miedo: la próxima vamos más despacio.',
    recomendacion: 'Secador en temperatura baja, a distancia, con pausas.',
  },
  {
    dias: -28,
    puntajes: { secador: 2, unas: 4, bano: 5, desenredado: 3 },
    etiquetas: ['miedo al secador', 'nudos en orejas'],
    notaInterna: 'Con pausas cada 3 minutos tolera más. Premio al final ayudó.',
    resumenTutor: 'Toby toleró un poco mejor el secador. Seguimos con pausas cortas.',
    recomendacion: 'Mantener pausas cada 3 minutos y premio al final.',
  },
  {
    dias: -14,
    puntajes: { secador: 4, unas: 5, bano: 5, desenredado: 4 },
    etiquetas: ['nudos en orejas'],
    notaInterna: 'Primera vez que se queda quieto todo el secado.',
    resumenTutor: 'Toby tolera cada vez mejor el secador. La próxima seguimos de a poco.',
    recomendacion: 'Probar secado completo con una sola pausa.',
  },
]

const BUSINESS_COLLECTIONS = ['atenciones', 'turnos', 'mascotas', 'tutores', 'servicios', 'extras', 'etiquetas'] as const

export async function seed(payload: Payload, log: (msg: string) => void = () => {}) {
  for (const collection of BUSINESS_COLLECTIONS) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
  log('Datos anteriores borrados')

  await payload.updateGlobal({
    slug: 'configuracion',
    data: {
      direccion: 'Merlo, Buenos Aires',
      duracionTurnoMin: 60,
      horarios: (['martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const).map((dia) => ({
        dia,
        abre: '09:00',
        cierra: '18:00',
      })),
      multiplicadoresManto: pricingConfig.multiplicadoresManto,
      recargosNudos: {
        leves: pricingConfig.recargosNudos.leves,
        moderados: pricingConfig.recargosNudos.moderados,
        severos: pricingConfig.recargosNudos.severos,
      },
    },
  })

  const servicioIds = new Map<string, number>()
  for (const [orden, s] of servicios.entries()) {
    const doc = await payload.create({
      collection: 'servicios',
      data: {
        nombre: s.nombre,
        slug: s.id,
        descripcion: s.descripcion,
        duracion: s.duracion,
        precioChico: s.precios.chico,
        precioMediano: s.precios.mediano,
        precioGrande: s.precios.grande,
        aplicaRecargoManto: s.aplicaRecargoManto,
        popular: s.popular ?? false,
        orden,
      },
    })
    servicioIds.set(s.id, doc.id)
  }

  const extraIds = new Map<string, number>()
  for (const [orden, e] of extras.entries()) {
    const doc = await payload.create({ collection: 'extras', data: { nombre: e.nombre, slug: e.id, precio: e.precio, orden } })
    extraIds.set(e.id, doc.id)
  }

  const etiquetaIds = new Map<string, number>()
  for (const e of ETIQUETAS) {
    const doc = await payload.create({ collection: 'etiquetas', data: e })
    etiquetaIds.set(e.nombre, doc.id)
  }
  log(`Catálogo: ${servicios.length} servicios, ${extras.length} extras, ${ETIQUETAS.length} etiquetas`)

  const perros = new Map<string, { id: number; tutorId: number; tamano: Size; manto: Coat }>()
  for (const p of PERROS) {
    const tutor = await payload.create({ collection: 'tutores', data: p.tutor })
    const mascota = await payload.create({
      collection: 'mascotas',
      data: {
        nombre: p.nombre,
        tutor: tutor.id,
        raza: p.raza,
        tamano: p.tamano,
        manto: p.manto,
        pesoKg: p.pesoKg,
        cuidadosEspeciales: p.cuidados,
        etiquetas: p.etiquetas.map((n) => etiquetaIds.get(n)!),
      },
    })
    perros.set(p.nombre, { id: mascota.id, tutorId: tutor.id, tamano: p.tamano, manto: p.manto })
  }
  log(`${PERROS.length} tutores con sus mascotas`)

  // Los precios estimados salen del catálogo recién guardado, igual que en el cotizador
  const catalog = await loadCatalog(payload)
  for (const t of TURNOS) {
    const perro = perros.get(t.perro)!
    const quote = buildQuote(
      { tamano: perro.tamano, manto: perro.manto, nudos: t.nudos, servicioIds: t.servicios, extraIds: t.extras ?? [] },
      catalog,
      catalog.config,
    )
    await payload.create({
      collection: 'turnos',
      data: {
        fechaHora: arDate(t.dias, t.hora),
        estado: t.estado,
        tutor: perro.tutorId,
        mascota: perro.id,
        servicios: t.servicios.map((s) => servicioIds.get(s)!),
        extras: (t.extras ?? []).map((e) => extraIds.get(e)!),
        nudos: t.nudos,
        precioEstimado: quote.total,
        origen: t.origen,
        notasCliente: t.notasCliente,
      },
    })
  }
  log(`${TURNOS.length} turnos (4 hoy y 2 solicitudes)`)

  const toby = perros.get('Toby')!
  for (const a of ATENCIONES_TOBY) {
    const turno = await payload.create({
      collection: 'turnos',
      data: {
        fechaHora: arDate(a.dias, '11:00'),
        estado: 'finalizado',
        tutor: toby.tutorId,
        mascota: toby.id,
        servicios: [servicioIds.get('bano-corte')!],
        nudos: 'moderados',
        precioEstimado: 13700,
        origen: 'panel',
      },
    })
    await payload.create({
      collection: 'atenciones',
      data: {
        fecha: arDate(a.dias, '13:00'),
        mascota: toby.id,
        turno: turno.id,
        serviciosRealizados: [servicioIds.get('bano-corte')!],
        precioFinal: 13700,
        puntajes: a.puntajes,
        etiquetas: a.etiquetas.map((n) => etiquetaIds.get(n)!),
        notaInterna: a.notaInterna,
        resumenTutor: a.resumenTutor,
        recomendacion: a.recomendacion,
      },
    })
  }
  log(`${ATENCIONES_TOBY.length} atenciones de Toby (evolución con el secador)`)

  const email = process.env.DEMO_ADMIN_EMAIL
  const password = process.env.DEMO_ADMIN_PASSWORD
  if (email && password) {
    const existing = await payload.find({ collection: 'usuarios', where: { email: { equals: email } }, limit: 1 })
    if (existing.docs[0]) {
      await payload.update({ collection: 'usuarios', id: existing.docs[0].id, data: { password, rol: 'peluquera' } })
    } else {
      await payload.create({ collection: 'usuarios', data: { email, password, nombre: 'Peluquera', rol: 'peluquera' } })
    }
    log(`Usuario de la peluquera listo (${email})`)
  } else {
    log('Sin DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD en .env: no se creó el usuario de la peluquera')
  }
}
