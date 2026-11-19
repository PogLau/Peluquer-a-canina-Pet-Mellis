import { canClientCancel, type LibretaMascota, type TurnoCliente } from '@/lib/cliente/libreta'
import type { MascotaDelTutor } from '@/lib/cliente/reserva'
import { dayRangeAR } from '@/lib/dates'
import { buildFicha, suggestRecommendation } from '@/lib/ficha'
import { parseEscaneo } from '@/lib/ia/cuidado'
import {
  lapsedClients,
  monthAR,
  summarize,
  topServices,
  weekAR,
  type TurnoInforme,
} from '@/lib/informes'
import type { DatosRegistro } from '@/lib/panel/atenciones'
import type { Reporte } from '@/lib/panel/informes'
import type { AtencionPanel } from '@/lib/panel/mascotas'
import { filaDeExtra, preciosDeServicio, type PreciosEditables } from '@/lib/panel/precios'
import type { TurnoPanel } from '@/lib/panel/turnos'

import type { DemoState, DTurno } from './estado'

/*
  Convierten el estado de la demo a las mismas formas de datos que usan las pantallas de la app real,
  así la demo reutiliza sus componentes sin cambios.
*/

const nombreServicio = (s: DemoState, id: string) =>
  s.servicios.find((x) => x.id === id)?.nombre ?? id

export function toTurnoPanel(s: DemoState, t: DTurno): TurnoPanel {
  const m = s.mascotas.find((x) => x.id === t.mascotaId)
  const tutor = s.tutores.find((x) => x.id === t.tutorId)
  return {
    id: t.id,
    fechaHora: t.fechaHora,
    estado: t.estado,
    origen: t.origen,
    precioEstimado: t.precioEstimado,
    notasCliente: t.notasCliente || null,
    escaneo: parseEscaneo(t.escaneo),
    servicios: t.servicios.map((id) => nombreServicio(s, id)),
    mascota: {
      id: m?.id ?? 0,
      nombre: m?.nombre ?? 'Mascota',
      raza: m?.raza || null,
      cuidadosEspeciales: m?.cuidadosEspeciales || null,
      alertas: (m?.etiquetaIds ?? [])
        .map((id) => s.etiquetas.find((e) => e.id === id))
        .filter((e) => e?.tipo === 'alerta')
        .map((e) => e!.nombre),
    },
    tutor: {
      id: tutor?.id ?? 0,
      nombre: tutor?.nombre ?? 'Tutor',
      whatsapp: tutor?.whatsapp ?? '',
    },
    atencionRegistrada: s.atenciones.some((a) => a.turnoId === t.id),
  }
}

const porFecha = (a: DTurno, b: DTurno) => a.fechaHora.localeCompare(b.fechaHora)

export function turnosHoy(s: DemoState, now = new Date()): TurnoPanel[] {
  const { desde, hasta } = dayRangeAR(now)
  return s.turnos
    .filter(
      (t) =>
        t.fechaHora >= desde &&
        t.fechaHora < hasta &&
        t.estado !== 'cancelado' &&
        t.estado !== 'solicitado',
    )
    .sort(porFecha)
    .map((t) => toTurnoPanel(s, t))
}

export function solicitudes(s: DemoState): TurnoPanel[] {
  return s.turnos
    .filter((t) => t.estado === 'solicitado')
    .sort(porFecha)
    .map((t) => toTurnoPanel(s, t))
}

function atencionesDe(s: DemoState, mascotaId: number): AtencionPanel[] {
  return s.atenciones
    .filter((a) => a.mascotaId === mascotaId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((a) => ({
      id: a.id,
      fecha: a.fecha,
      servicios: a.servicios.map((id) => nombreServicio(s, id)),
      precioFinal: a.precioFinal,
      etiquetas: a.etiquetaIds
        .map((id) => s.etiquetas.find((e) => e.id === id))
        .filter((e) => !!e)
        .map((e) => ({ nombre: e!.nombre, tipo: e!.tipo })),
      notaInterna: a.notaInterna || null,
      resumenTutor: a.resumenTutor || null,
      recomendacion: a.recomendacion || null,
    }))
}

export function fichaDe(s: DemoState, mascotaId: number, now = new Date()) {
  const m = s.mascotas.find((x) => x.id === mascotaId)
  if (!m) return null
  const tutor = s.tutores.find((t) => t.id === m.tutorId)!
  const atenciones = atencionesDe(s, m.id)
  const ficha = buildFicha(
    s.atenciones
      .filter((a) => a.mascotaId === m.id)
      .map((a) => ({ fecha: a.fecha, puntajes: a.puntajes })),
  )
  const desde = dayRangeAR(now).desde
  return {
    mascota: m,
    tutor,
    etiquetas: m.etiquetaIds.map((id) => s.etiquetas.find((e) => e.id === id)!).filter(Boolean),
    atenciones,
    ficha,
    recomendacionSugerida: suggestRecommendation(ficha),
    proximos: s.turnos
      .filter(
        (t) =>
          t.mascotaId === m.id &&
          t.fechaHora >= desde &&
          t.estado !== 'cancelado' &&
          t.estado !== 'finalizado',
      )
      .sort(porFecha)
      .map((t) => toTurnoPanel(s, t)),
  }
}

/** Datos para «Registrar atención». Los ids numéricos de servicios son su posición (+1) en el catálogo. */
export function datosRegistro(s: DemoState, turnoId: number): DatosRegistro | null {
  const t = s.turnos.find((x) => x.id === turnoId)
  if (!t) return null
  const m = s.mascotas.find((x) => x.id === t.mascotaId)
  const ficha = buildFicha(
    s.atenciones
      .filter((a) => a.mascotaId === t.mascotaId)
      .map((a) => ({ fecha: a.fecha, puntajes: a.puntajes })),
  )
  return {
    turno: toTurnoPanel(s, t),
    serviciosTurno: t.servicios
      .map((id) => s.servicios.findIndex((x) => x.id === id) + 1)
      .filter((n) => n > 0),
    servicios: s.servicios.map((x, i) => ({ id: i + 1, nombre: x.nombre })),
    etiquetas: s.etiquetas.map((e) => ({ id: e.id, nombre: e.nombre, tipo: e.tipo })),
    etiquetasMascota: m?.etiquetaIds ?? [],
    recomendacionSugerida: suggestRecommendation(ficha),
    atencionExistente: s.atenciones.find((a) => a.turnoId === t.id)?.id ?? null,
  }
}

export const servicioPorIndice = (s: DemoState, n: number) => s.servicios[n - 1]?.id

export function mascotasDelCliente(s: DemoState): MascotaDelTutor[] {
  return s.mascotas
    .filter((m) => m.tutorId === s.clienteId)
    .map((m) => ({
      id: m.id,
      nombre: m.nombre,
      raza: m.raza || null,
      tamano: m.tamano,
      manto: m.manto,
    }))
}

export function turnosCliente(s: DemoState, now = new Date()) {
  const inicioHoy = dayRangeAR(now).desde
  const turnos: TurnoCliente[] = s.turnos
    .filter((t) => t.tutorId === s.clienteId)
    .sort((a, b) => b.fechaHora.localeCompare(a.fechaHora))
    .map((t) => ({
      id: t.id,
      fechaHora: t.fechaHora,
      estado: t.estado,
      mascota: s.mascotas.find((m) => m.id === t.mascotaId)?.nombre ?? '',
      servicios: t.servicios.map((id) => nombreServicio(s, id)),
      precioEstimado: t.precioEstimado,
      puedeCancelar: canClientCancel(t.estado, t.fechaHora, now),
    }))
  const esProximo = (t: TurnoCliente) =>
    t.estado === 'en_atencion' ||
    t.estado === 'listo' ||
    ((t.estado === 'solicitado' || t.estado === 'confirmado') && t.fechaHora >= inicioHoy)
  return {
    proximos: turnos.filter(esProximo).reverse(),
    pasados: turnos.filter((t) => !esProximo(t)),
  }
}

/** Libreta del cliente: sin la nota interna, como en la app real. */
export function libretaCliente(s: DemoState): LibretaMascota[] {
  return s.mascotas
    .filter((m) => m.tutorId === s.clienteId)
    .map((m) => {
      const visitas = atencionesDe(s, m.id).map((a) => ({
        id: a.id,
        fecha: a.fecha,
        servicios: a.servicios,
        resumenTutor: a.resumenTutor,
        recomendacion: a.recomendacion,
      }))
      return {
        id: m.id,
        nombre: m.nombre,
        raza: m.raza || null,
        tamano: m.tamano,
        manto: m.manto,
        pesoKg: m.pesoKg,
        cuidadosEspeciales: m.cuidadosEspeciales || null,
        etiquetas: m.etiquetaIds
          .map((id) => s.etiquetas.find((e) => e.id === id)?.nombre)
          .filter((n): n is string => !!n),
        visitas,
        proximaRecomendacion: visitas.find((v) => v.recomendacion)?.recomendacion ?? null,
      }
    })
}

export function reporte(s: DemoState, now = new Date()): Reporte {
  const turnos: TurnoInforme[] = s.turnos.map((t) => ({
    id: t.id,
    fechaHora: t.fechaHora,
    estado: t.estado,
    precioEstimado: t.precioEstimado,
    precioFinal: s.atenciones.find((a) => a.turnoId === t.id)?.precioFinal ?? null,
    servicios: t.servicios.map((id) => nombreServicio(s, id)),
    tutor: s.tutores.find((x) => x.id === t.tutorId)?.nombre ?? '',
    mascota: s.mascotas.find((x) => x.id === t.mascotaId)?.nombre ?? '',
  }))
  const ultima = new Map<number, string>()
  for (const a of s.atenciones) {
    const tutor = s.mascotas.find((m) => m.id === a.mascotaId)?.tutorId
    if (tutor && (!ultima.has(tutor) || ultima.get(tutor)! < a.fecha)) ultima.set(tutor, a.fecha)
  }
  const ahora = now.toISOString()
  const clientes = s.tutores.map((t) => ({
    id: t.id,
    nombre: t.nombre,
    whatsapp: t.whatsapp,
    mascotas: s.mascotas.filter((m) => m.tutorId === t.id).map((m) => m.nombre),
    ultimaVisita: ultima.get(t.id) ?? null,
    tieneTurnoProximo: s.turnos.some(
      (x) =>
        x.tutorId === t.id &&
        x.fechaHora >= ahora &&
        (x.estado === 'solicitado' || x.estado === 'confirmado'),
    ),
  }))
  const semana = weekAR(now)
  const mes = monthAR(now)
  return {
    semana: summarize(turnos, semana),
    mes: summarize(turnos, mes),
    servicios: topServices(turnos, mes),
    sinVolver: lapsedClients(clientes, now),
    turnosMes: turnos.filter((t) => t.fechaHora >= mes.desde && t.fechaHora < mes.hasta),
  }
}

/** Precios con la forma de la tabla editable del panel (ids numéricos = posición + 1). */
export function preciosEditables(s: DemoState): PreciosEditables {
  return {
    servicios: s.servicios.map((x, i) => ({
      id: i + 1,
      nombre: x.nombre,
      ...preciosDeServicio(x),
      aplicaRecargoManto: x.aplicaRecargoManto,
      popular: x.popular ?? false,
      activo: x.activo,
    })),
    extras: s.extras.map((x, i) => ({
      id: i + 1,
      nombre: x.nombre,
      ...filaDeExtra(x),
      activo: x.activo,
    })),
    multiplicadores: {
      corto: String(s.pricing.multiplicadoresManto.corto),
      largo: String(s.pricing.multiplicadoresManto.largo),
      rizado: String(s.pricing.multiplicadoresManto.rizado),
    },
    recargos: {
      leves: String(s.pricing.recargosNudos.leves),
      moderados: String(s.pricing.recargosNudos.moderados),
      severos: String(s.pricing.recargosNudos.severos),
    },
  }
}
