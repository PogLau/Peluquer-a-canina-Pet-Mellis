import type { AppointmentStatus } from '../lib/estados'
import type { Coat, Knots, Size } from '../lib/pricing'
import type { EscaneoTurno } from '../lib/ia/cuidado'

/*
  Datos de demo (CLAUDE.md §9), sin dependencias de la base: los usan el seed de Payload
  y la demo que corre en el navegador (GitHub Pages). Teléfonos y personas son ficticios.
*/

export const HORARIOS_DEMO = (['martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const).map(
  (dia) => ({
    dia,
    abre: '09:00',
    cierra: '18:00',
  }),
)

export const ETIQUETAS: Array<{ nombre: string; tipo: 'alerta' | 'info' }> = [
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
export const PERROS: Array<{
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

export const TURNOS: Array<{
  perro: string
  dias: number
  hora: string
  estado: AppointmentStatus
  servicios: string[]
  extras?: string[]
  nudos: Knots
  origen: 'web' | 'panel'
  notasCliente?: string
  escaneo?: EscaneoTurno
}> = [
  // Hoy
  {
    perro: 'Coco',
    dias: 0,
    hora: '10:00',
    estado: 'listo',
    servicios: ['bano-higienico'],
    nudos: 'sin',
    origen: 'panel',
  },
  {
    perro: 'Toby',
    dias: 0,
    hora: '12:00',
    estado: 'en_atencion',
    servicios: ['bano-corte'],
    extras: ['antipulgas'],
    nudos: 'moderados',
    origen: 'web',
  },
  {
    perro: 'Max',
    dias: 0,
    hora: '14:30',
    estado: 'confirmado',
    servicios: ['bano-corte', 'unas'],
    nudos: 'leves',
    origen: 'panel',
  },
  {
    perro: 'Luna',
    dias: 0,
    hora: '16:00',
    estado: 'confirmado',
    servicios: ['deslanado'],
    nudos: 'sin',
    origen: 'panel',
  },
  // Solicitudes pendientes
  {
    perro: 'Bella',
    dias: 1,
    hora: '11:00',
    estado: 'solicitado',
    servicios: ['bano-higienico'],
    extras: ['medicado'],
    nudos: 'leves',
    origen: 'web',
    notasCliente: '¿Puede ser a la mañana? Gracias.',
    // Pedido hecho desde IA Scan & Care con una foto de ejemplo
    escaneo: {
      raza: 'Bichón Maltés',
      textura: 'rizado',
      hidratacion: 'baja',
      nudos: 'leves',
      tratamiento: 'hidratacion-profunda',
      origen: 'ejemplo',
    },
  },
  {
    perro: 'Luna',
    dias: 3,
    hora: '15:00',
    estado: 'solicitado',
    servicios: ['bano-corte'],
    nudos: 'moderados',
    origen: 'web',
  },
]

// Evolución de Toby con el secador: de mucho miedo a tolerarlo mejor
export const ATENCIONES_TOBY = [
  {
    dias: -56,
    puntajes: { secador: 1, unas: 4, bano: 4, desenredado: 3 },
    etiquetas: ['miedo al secador', 'nudos en orejas'],
    notaInterna: 'Tembló todo el secado. Hubo que cortar y terminar con toalla.',
    resumenTutor:
      'Toby se portó bien en el baño. El secador le dio mucho miedo: la próxima vamos más despacio.',
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
