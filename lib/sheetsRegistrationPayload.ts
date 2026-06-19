import type { RegistrationDetails } from '@/types';

/** Payload para el webhook de Google Sheets — claves alineadas a Inscripciones COMEV 2026 */
export function buildSheetsRegistrationPayload(
  payload: RegistrationDetails & { updatedAt?: string }
) {
  const phone = payload.phone || '';
  const partnerPhone = payload.partnerPhone || '';

  return {
    ticketId: payload.ticketId || '',
    name: payload.name || '',
    email: payload.email || '',
    // Columnas oficiales del Drive
    'Celular ppal': phone,
    'Celular pareja': partnerPhone,
    // Alias frecuentes en scripts anteriores
    phone,
    partnerPhone,
    celular: phone,
    celularPpal: phone,
    celular_ppal: phone,
    CelularPpal: phone,
    Telefono: phone,
    WhatsApp: phone,
    celularPareja: partnerPhone,
    celular_pareja: partnerPhone,
    CelularPareja: partnerPhone,
    celularAcompanante: partnerPhone,
    celularacompanante: partnerPhone,
    company: payload.company || '',
    city: payload.city || '',
    position: payload.position || '',
    badgeRole: payload.badgeRole || '',
    ticketType: payload.ticketType || '',
    status: payload.status || 'pendiente',
    partnerName: payload.partnerName || '',
    partnerEmail: payload.partnerEmail || '',
    nombreAcompanante: payload.partnerName || '',
    correoAcompanante: payload.partnerEmail || '',
    nombreacompanante: payload.partnerName || '',
    correoacompanante: payload.partnerEmail || '',
    comprobante: payload.comprobante ? 'SÍ' : 'NO',
    registeredAt: payload.registeredAt || new Date().toLocaleDateString('es-MX'),
    updatedAt: payload.updatedAt || new Date().toISOString(),
  };
}
