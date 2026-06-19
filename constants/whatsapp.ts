/** Grupo "¡VIVA CHIHUAHUA!" — revelación del Ejecutivo Distinguido Nacional */
export const WHATSAPP_EJECUTIVO_URL =
  process.env.NEXT_PUBLIC_VITE_WHATSAPP_EJECUTIVO_URL ||
  'https://chat.whatsapp.com/GuhC4PJ0XCd6VZmVxFaGr7';

/** Grupo de WhatsApp para convencionistas registrados */
export const WHATSAPP_REGISTRO_GRUPO_URL =
  process.env.NEXT_PUBLIC_VITE_WHATSAPP_REGISTRO_GRUPO_URL ||
  process.env.NEXT_PUBLIC_VITE_WHATSAPP_EJECUTIVO_URL ||
  'https://chat.whatsapp.com/GuhC4PJ0XCd6VZmVxFaGr7';

/** Chat directo de WhatsApp para registro e informes — Carnet de Acceso */
export const WHATSAPP_INFORMES_URL =
  process.env.NEXT_PUBLIC_VITE_WHATSAPP_INFORMES_URL ||
  'https://wa.me/526142278711';

const WHATSAPP_GROUP_JOINED_KEY = 'comev_whatsapp_grupo_2026';

/** Abre el invite del grupo (requiere un toque en WhatsApp para unirse). */
export function joinWhatsAppRegistrationGroup(force = false): void {
  if (typeof window === 'undefined') return;
  if (!force && localStorage.getItem(WHATSAPP_GROUP_JOINED_KEY)) return;
  localStorage.setItem(WHATSAPP_GROUP_JOINED_KEY, '1');
  window.open(WHATSAPP_REGISTRO_GRUPO_URL, '_blank', 'noopener,noreferrer');
}
