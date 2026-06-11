export interface SelloInfo {
  id: number;
  name: string;
  desc: string;
  date: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export const SELLOS_INFO: SelloInfo[] = [
  { id: 1, name: 'Flash Back', desc: 'Rompe Hielo 80s', date: 'Jue 3 Sep · Hacienda San José · 7 PM', color: '#d946ef', bgClass: 'bg-[#1e0a2e]', borderClass: 'border-[#d946ef]', textClass: 'text-[#d946ef]' },
  { id: 2, name: 'Hora Cero', desc: 'Inauguración Oficial', date: 'Vie 4 Sep · Centro de Exposiciones', color: '#f59e0b', bgClass: 'bg-[#1c0a00]', borderClass: 'border-[#f59e0b]', textClass: 'text-[#f59e0b]' },
  { id: 3, name: 'Liderazgo · Innovación', desc: 'Conferencias Magistrales · Néstor Guerra', date: 'Vie 4 Sep · Sala Principal', color: '#06b6d4', bgClass: 'bg-[#020e1a]', borderClass: 'border-[#06b6d4]', textClass: 'text-[#06b6d4]' },
  { id: 4, name: 'Somos COMEV', desc: 'Foto del Recuerdo', date: 'Vie 4 Sep · Centro de Convenciones', color: '#f8fafc', bgClass: 'bg-[#0f172a]', borderClass: 'border-[#f8fafc]', textClass: 'text-[#f8fafc]' },
  { id: 5, name: 'Ejecutivo Distinguido', desc: 'Cena de Gala · Oscar Gardea Acosta', date: 'Vie 4 Sep · Hotel María Bonita', color: '#facc15', bgClass: 'bg-[#00082e]', borderClass: 'border-[#1d4ed8]', textClass: 'text-[#facc15]' },
  { id: 6, name: 'Paisajes y Tradición', desc: 'Experiencia Regional', date: 'Sáb 5 Sep · Excursión', color: '#10b981', bgClass: 'bg-[#00150a]', borderClass: 'border-[#10b981]', textClass: 'text-[#10b981]' },
  { id: 7, name: 'Toma de Protesta', desc: 'Nuevo Consejo 2026–2027', date: 'Sáb 5 Sep · Cena de Cierre', color: '#f43f5e', bgClass: 'bg-[#1a0008]', borderClass: 'border-[#f43f5e]', textClass: 'text-[#f43f5e]' },
];

export const SELLO_COUNT = SELLOS_INFO.length;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://convencion26.vercel.app';

export function isValidSelloId(id: number): boolean {
  return Number.isInteger(id) && id >= 1 && id <= SELLO_COUNT;
}

export function parseSelloParam(value: string | null | undefined): number | null {
  if (!value) return null;
  const id = parseInt(value, 10);
  return isValidSelloId(id) ? id : null;
}

export function getSelloQrUrl(selloId: number, origin?: string): string {
  const base = origin || SITE_URL;
  return `${base.replace(/\/$/, '')}/?sello=${selloId}#pasaporte`;
}

export function getSelloById(id: number): SelloInfo | undefined {
  return SELLOS_INFO.find(s => s.id === id);
}
