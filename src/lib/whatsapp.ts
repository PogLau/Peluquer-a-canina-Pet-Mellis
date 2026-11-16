/**
 * Arma un enlace wa.me con el mensaje ya escrito. No envía nada: la persona lo revisa y lo manda.
 * @param phone Número en formato internacional (por ejemplo 5491122334455). Se ignoran espacios, guiones y «+».
 */
export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 8) throw new Error('Número de WhatsApp inválido')
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
