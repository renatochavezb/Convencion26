/** Contexto del evento para prompts de contenido interno */
export const EVENTO_CONTEXTO = {
  nombre: 'Convención Nacional COMEV 2026 — ¡VIVA CHIHUAHUA!',
  hashtag: '#COMEV2026 #VivaChihuahua #EVMChihuahua',
  fechas: '3, 4 y 5 de septiembre de 2026',
  sede: 'Hotel María Bonita, Chihuahua',
  whatsappGrupo: 'Grupo oficial COMEV en WhatsApp',
  inscripcionIndividual: '$4,000 MXN',
  inscripcionPareja: '$7,500 MXN',
  sitio: 'convencion26.vercel.app',
  tono: 'profesional, energético, norteño, empresarial, sin clichés vacíos',
  coloresMarca: 'naranja #fe9800, azul marino #000814, morado acento',
  speakers: [
    'Néstor Guerra — IA y negocios (keynote)',
    'Claudia Alcalá & Humberto Nevárez — Cumbre de Ventas',
    'Ejecutivo Distinguido Nacional (revelación en convención)',
  ],
  bullets: [
    'Casos reales de la industria',
    'Herramientas concretas para ventas y liderazgo',
    'Networking con ejecutivos de la región',
    'Pasaporte digital con sellos QR en el evento',
  ],
} as const;

export type ContenidoTipo = 'imagen' | 'reel' | 'carrusel';

export type ContenidoTema =
  | 'inscripciones'
  | 'countdown'
  | 'speakers'
  | 'sede'
  | 'ejecutivo'
  | 'recordatorio_pago'
  | 'networking'
  | 'general';

export const CONTENIDO_TEMAS: { id: ContenidoTema; label: string; descripcion: string }[] = [
  { id: 'inscripciones', label: 'Inscripciones abiertas', descripcion: 'CTA para registrarse y asegurar lugar' },
  { id: 'countdown', label: 'Cuenta regresiva', descripcion: 'Urgencia y fecha del evento' },
  { id: 'speakers', label: 'Conferencistas', descripcion: 'Destacar ponencias y valor académico' },
  { id: 'sede', label: 'Hotel sede', descripcion: 'María Bonita, Chihuahua, logística' },
  { id: 'ejecutivo', label: 'Ejecutivo Distinguido', descripcion: 'Revelación y gala' },
  { id: 'recordatorio_pago', label: 'Recordatorio de pago', descripcion: 'Datos bancarios y comprobante' },
  { id: 'networking', label: 'Networking / pasaporte', descripcion: 'Sellos QR y conexiones' },
  { id: 'general', label: 'General / mix', descripcion: 'Mensaje amplio de convención' },
];
