import { EVENTO_CONTEXTO, type ContenidoTipo, type ContenidoTema } from '@/data/contenidoEvento';

function hasGeminiApiKey(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
}

export interface ImagenContent {
  promptImagen: string;
  copyWhatsapp: string;
  textoEnImagen: string;
  hashtags: string;
  notasDiseno: string;
}

export interface ReelContent {
  hook: string;
  guion: { escena: string; textoEnPantalla: string; visual: string }[];
  promptVideoIA: string;
  copyWhatsapp: string;
  musicaSugerida: string;
  duracionSegundos: number;
}

export interface CarruselSlide {
  slide: number;
  titulo: string;
  cuerpo: string;
  promptImagen: string;
}

export interface CarruselContent {
  slides: CarruselSlide[];
  copyWhatsapp: string;
  ctaFinal: string;
}

export type GeneratedContenido =
  | { tipo: 'imagen'; data: ImagenContent }
  | { tipo: 'reel'; data: ReelContent }
  | { tipo: 'carrusel'; data: CarruselContent };

function buildSystemPrompt(tipo: ContenidoTipo, tema: ContenidoTema, notas?: string): string {
  const ctx = EVENTO_CONTEXTO;
  return `Eres el estratega de contenido de COMEV (Ejecutivos de Ventas y Mercadotecnia de Chihuahua).
Generas material listo para publicar en el GRUPO DE WHATSAPP de la convención y redes sociales.

EVENTO:
- ${ctx.nombre}
- Fechas: ${ctx.fechas}
- Sede: ${ctx.sede}
- Inversión: Individual ${ctx.inscripcionIndividual} | Pareja ${ctx.inscripcionPareja}
- Sitio: ${ctx.sitio}
- Speakers: ${ctx.speakers.join('; ')}
- Tono: ${ctx.tono}
- Colores: ${ctx.coloresMarca}
- Hashtags base: ${ctx.hashtag}

TEMA DEL CONTENIDO: ${tema}
FORMATO SOLICITADO: ${tipo}
${notas ? `NOTAS ADICIONALES DEL EQUIPO: ${notas}` : ''}

Responde ÚNICAMENTE con JSON válido (sin markdown, sin \`\`\`), en español mexicano, copy persuasivo pero elegante.
`;
}

function schemaForTipo(tipo: ContenidoTipo): string {
  if (tipo === 'imagen') {
    return `{
  "promptImagen": "prompt detallado en inglés para Midjourney/DALL-E/Flux: estilo, composición, colores COMEV",
  "copyWhatsapp": "texto listo para pegar en WhatsApp (2-4 párrafos cortos, emojis moderados)",
  "textoEnImagen": "texto corto que iría sobre la imagen (headline + subtítulo)",
  "hashtags": "hashtags separados por espacio",
  "notasDiseno": "tipografía, logo COMEV, safe zones para stories"
}`;
  }
  if (tipo === 'reel') {
    return `{
  "hook": "primera frase que detiene el scroll (max 12 palabras)",
  "guion": [{"escena": "1", "textoEnPantalla": "...", "visual": "descripción del clip"}],
  "promptVideoIA": "prompt para Runway/Pika/CapCut IA si aplica",
  "copyWhatsapp": "caption para acompañar el reel en WhatsApp",
  "musicaSugerida": "estilo de música trending apropiado",
  "duracionSegundos": 30
}`;
  }
  return `{
  "slides": [{"slide": 1, "titulo": "...", "cuerpo": "...", "promptImagen": "prompt EN para esta slide"}],
  "copyWhatsapp": "texto introductorio para el carrusel en WhatsApp",
  "ctaFinal": "llamada a la acción final (registro, grupo, etc.)"
}`;
}

function parseJsonResponse<T>(raw: string): T {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('La IA no devolvió JSON válido');
  return JSON.parse(jsonMatch[0]) as T;
}

function fallbackImagen(tema: ContenidoTema): ImagenContent {
  return {
    promptImagen: `Professional corporate event poster, COMEV 2026 convention Chihuahua Mexico, deep navy blue background #000814, orange accent #fe9800, modern executives networking, hotel ballroom, text space for headline, photorealistic, 4k, theme: ${tema}`,
    copyWhatsapp: `🌟 *¡VIVA CHIHUAHUA!* — Convención Nacional COMEV 2026\n\n📅 3, 4 y 5 de septiembre\n📍 Hotel María Bonita, Chihuahua\n\nAsegura tu lugar: ${EVENTO_CONTEXTO.sitio}\n\n${EVENTO_CONTEXTO.hashtag}`,
    textoEnImagen: 'COMEV 2026\n¡VIVA CHIHUAHUA!\n3–5 SEP · CHIHUAHUA',
    hashtags: EVENTO_CONTEXTO.hashtag,
    notasDiseno: 'Logo COMEV arriba. Tipografía bold sans-serif. Dejar margen inferior para WhatsApp preview.',
  };
}

function fallbackReel(tema: ContenidoTema): ReelContent {
  return {
    hook: '¿Listo para la convención empresarial del año?',
    guion: [
      { escena: '1', textoEnPantalla: 'COMEV 2026', visual: 'Logo animado sobre fondo azul marino' },
      { escena: '2', textoEnPantalla: '3–5 SEP · CHIHUAHUA', visual: 'Drone hotel sede al atardecer' },
      { escena: '3', textoEnPantalla: 'Inscríbete ya', visual: 'Manos con credencial y QR pasaporte' },
    ],
    promptVideoIA: `Cinematic vertical 9:16 corporate event teaser, Chihuahua convention, orange and navy, fast cuts, ${tema}`,
    copyWhatsapp: `🎬 Te compartimos el reel oficial de la convención.\n\nRegístrate en ${EVENTO_CONTEXTO.sitio} y únete al grupo de WhatsApp para más novedades.`,
    musicaSugerida: 'Corporate upbeat / motivacional sin copyright',
    duracionSegundos: 30,
  };
}

function fallbackCarrusel(tema: ContenidoTema): CarruselContent {
  return {
    slides: [
      { slide: 1, titulo: 'COMEV 2026', cuerpo: 'La convención empresarial más importante del norte', promptImagen: 'Event logo slide navy orange minimal' },
      { slide: 2, titulo: '3–5 Septiembre', cuerpo: 'Hotel María Bonita · Chihuahua', promptImagen: 'Luxury hotel exterior Chihuahua sunset' },
      { slide: 3, titulo: 'Conferencistas de clase mundial', cuerpo: 'IA, ventas y casos reales', promptImagen: 'Business keynote speaker stage lights' },
      { slide: 4, titulo: 'Inscríbete', cuerpo: `Desde ${EVENTO_CONTEXTO.inscripcionIndividual}`, promptImagen: 'Digital ticket badge orange accent' },
    ],
    copyWhatsapp: `Desliza el carrusel 👉 Toda la info de COMEV 2026 en 4 slides.\n\nTema: ${tema}`,
    ctaFinal: `Regístrate: ${EVENTO_CONTEXTO.sitio}`,
  };
}

async function generateWithGemini(
  tipo: ContenidoTipo,
  tema: ContenidoTema,
  notas?: string
): Promise<GeneratedContenido> {
  const { GoogleGenAI } = await import('@google/genai');
  const apiKey = process.env.GEMINI_API_KEY!;
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `${buildSystemPrompt(tipo, tema, notas)}

Estructura JSON exacta:
${schemaForTipo(tipo)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text;
  if (!text) throw new Error('Respuesta vacía de Gemini');

  if (tipo === 'imagen') {
    return { tipo, data: parseJsonResponse<ImagenContent>(text) };
  }
  if (tipo === 'reel') {
    return { tipo, data: parseJsonResponse<ReelContent>(text) };
  }
  return { tipo, data: parseJsonResponse<CarruselContent>(text) };
}

export async function generateContenido(
  tipo: ContenidoTipo,
  tema: ContenidoTema,
  notas?: string
): Promise<GeneratedContenido> {
  if (!hasGeminiApiKey()) {
    if (tipo === 'imagen') return { tipo, data: fallbackImagen(tema) };
    if (tipo === 'reel') return { tipo, data: fallbackReel(tema) };
    return { tipo, data: fallbackCarrusel(tema) };
  }

  try {
    return await generateWithGemini(tipo, tema, notas);
  } catch {
    if (tipo === 'imagen') return { tipo, data: fallbackImagen(tema) };
    if (tipo === 'reel') return { tipo, data: fallbackReel(tema) };
    return { tipo, data: fallbackCarrusel(tema) };
  }
}
