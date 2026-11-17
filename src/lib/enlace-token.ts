import { randomBytes } from 'node:crypto'

/*
  Código del enlace personal del cliente (/mi/<token>).
  32 caracteres URL-safe con 192 bits al azar: no se puede adivinar ni recorrer.
*/

export const TOKEN_LENGTH = 32

export function generarToken(): string {
  return randomBytes(24).toString('base64url')
}

export function esTokenValido(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{32}$/.test(value)
}
