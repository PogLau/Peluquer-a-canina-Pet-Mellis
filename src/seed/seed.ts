import type { Payload } from 'payload'

import { extras, pricingConfig, servicios } from '../lib/catalogo-demo'
import { loadCatalog } from '../lib/catalogo'
import { buildQuote, type Coat, type Size } from '../lib/pricing'

import { arDate } from './fechas'
import { ATENCIONES_TOBY, ETIQUETAS, HORARIOS_DEMO, PERROS, TURNOS } from './datos'

/*
  Datos de demo (CLAUDE.md §9). Borra los datos del negocio y los vuelve a cargar,
  así se puede correr las veces que haga falta. No toca usuarios ni imágenes,
  salvo crear o actualizar el usuario de la peluquera si el .env lo define.
*/

const BUSINESS_COLLECTIONS = [
  'atenciones',
  'turnos',
  'mascotas',
  'tutores',
  'servicios',
  'extras',
  'etiquetas',
] as const

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
      horarios: HORARIOS_DEMO,
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
        precioGigante: s.precios.gigante,
        aplicaRecargoManto: s.aplicaRecargoManto,
        popular: s.popular ?? false,
        orden,
      },
    })
    servicioIds.set(s.id, doc.id)
  }

  const extraIds = new Map<string, number>()
  for (const [orden, e] of extras.entries()) {
    const doc = await payload.create({
      collection: 'extras',
      data: {
        nombre: e.nombre,
        slug: e.id,
        tipo: e.tipo ?? 'fijo',
        precio: e.precio,
        orden,
      },
    })
    extraIds.set(e.id, doc.id)
  }

  const etiquetaIds = new Map<string, number>()
  for (const e of ETIQUETAS) {
    const doc = await payload.create({ collection: 'etiquetas', data: e })
    etiquetaIds.set(e.nombre, doc.id)
  }
  log(
    `Catálogo: ${servicios.length} servicios, ${extras.length} extras, ${ETIQUETAS.length} etiquetas`,
  )

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
      {
        tamano: perro.tamano,
        manto: perro.manto,
        nudos: t.nudos,
        servicioIds: t.servicios,
        extraIds: t.extras ?? [],
      },
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
        escaneo: t.escaneo ?? null,
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
        precioEstimado: 50000,
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
        precioFinal: 52000,
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
    const existing = await payload.find({
      collection: 'usuarios',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'usuarios',
        id: existing.docs[0].id,
        data: { password, rol: 'peluquera' },
      })
    } else {
      await payload.create({
        collection: 'usuarios',
        data: { email, password, nombre: 'Peluquera', rol: 'peluquera' },
      })
    }
    log(`Usuario de la peluquera listo (${email})`)
  } else {
    log('Sin DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD en .env: no se creó el usuario de la peluquera')
  }
}
