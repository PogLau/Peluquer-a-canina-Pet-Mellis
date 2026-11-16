import { describe, expect, it } from 'vitest'

import { whatsappLink } from '@/lib/whatsapp'

describe('whatsappLink', () => {
  it('limpia el número y codifica el mensaje', () => {
    expect(whatsappLink('+54 9 11 2233-4455', 'Hola, ¿tenés turno?')).toBe(
      'https://wa.me/5491122334455?text=Hola%2C%20%C2%BFten%C3%A9s%20turno%3F',
    )
  })

  it('sin mensaje devuelve solo el número', () => {
    expect(whatsappLink('5491122334455')).toBe('https://wa.me/5491122334455')
  })

  it('rechaza números inválidos', () => {
    expect(() => whatsappLink('123')).toThrow()
  })
})
