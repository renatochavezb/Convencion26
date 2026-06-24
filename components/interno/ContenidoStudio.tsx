'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  Loader2,
  Image as ImageIcon,
  Film,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import InternoNav from '@/components/interno/InternoNav';
import { CONTENIDO_TEMAS, type ContenidoTipo, type ContenidoTema } from '@/data/contenidoEvento';
import type { GeneratedContenido } from '@/lib/contentGenerator';

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white/10 bg-[#000814]/60">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#fe9800]">{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="p-3 text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto">
        {text}
      </pre>
    </div>
  );
}

const TIPOS: { id: ContenidoTipo; label: string; icon: typeof ImageIcon; desc: string }[] = [
  { id: 'imagen', label: 'Imagen', icon: ImageIcon, desc: 'Prompt + copy para post estático' },
  { id: 'reel', label: 'Reel', icon: Film, desc: 'Guion, hook y caption' },
  { id: 'carrusel', label: 'Carrusel', icon: LayoutGrid, desc: 'Slides con prompts y copy' },
];

export default function ContenidoStudio() {
  const [tipo, setTipo] = useState<ContenidoTipo>('imagen');
  const [tema, setTema] = useState<ContenidoTema>('inscripciones');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedContenido | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/interno/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, tema, notas: notas.trim() || undefined }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('El servidor no respondió correctamente. Recarga la página e intenta de nuevo.');
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al generar');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000814] text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#fe9800] text-xs font-bold tracking-[0.2em] uppercase">COMEV 2026 · Interno</p>
            <h1 className="text-2xl font-black italic uppercase mt-1 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#fe9800]" />
              Studio de Contenido WhatsApp
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Genera prompts para imágenes, guiones de reels y carruseles con copy listo para el grupo.
            </p>
          </div>
          <InternoNav />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[340px_1fr] gap-8">
        {/* Panel de configuración */}
        <aside className="space-y-6">
          <section>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Formato
            </h2>
            <div className="space-y-2">
              {TIPOS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setTipo(id); setResult(null); }}
                  className={`w-full text-left p-3 border transition-all ${
                    tipo === id
                      ? 'border-[#fe9800] bg-[#fe9800]/10'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm uppercase">
                    <Icon className="w-4 h-4 text-[#fe9800]" />
                    {label}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Tema
            </h2>
            <select
              value={tema}
              onChange={(e) => { setTema(e.target.value as ContenidoTema); setResult(null); }}
              className="w-full bg-[#040d1a] border border-white/10 px-3 py-2.5 text-sm text-white focus:border-[#fe9800] outline-none"
            >
              {CONTENIDO_TEMAS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-2">
              {CONTENIDO_TEMAS.find((t) => t.id === tema)?.descripcion}
            </p>
          </section>

          <section>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Notas (opcional)
            </h2>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej. mencionar descuento TAR, fecha límite de pago..."
              rows={3}
              className="w-full bg-[#040d1a] border border-white/10 px-3 py-2 text-sm text-white focus:border-[#fe9800] outline-none resize-none"
            />
          </section>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#fe9800] hover:bg-white disabled:opacity-60 text-[#000814] font-bold uppercase tracking-wider py-4 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generar contenido
              </>
            )}
          </button>

          {error && (
            <p className="text-red-400 text-xs border border-red-500/30 bg-red-950/30 px-3 py-2">{error}</p>
          )}
        </aside>

        {/* Resultados */}
        <section className="space-y-4 min-h-[400px]">
          {!result && !loading && (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-lg p-12 text-center">
              <div>
                <Sparkles className="w-10 h-10 text-[#fe9800]/40 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  Elige formato y tema, luego pulsa <strong className="text-white">Generar contenido</strong>.
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Usa Gemini si hay API key; si no, plantillas base del evento.
                </p>
              </div>
            </div>
          )}

          {result?.tipo === 'imagen' && (
            <div className="space-y-4">
              <h3 className="font-black uppercase italic text-lg text-[#fe9800]">Post de imagen</h3>
              <CopyBlock label="Prompt para IA (Midjourney / DALL·E / Flux)" text={result.data.promptImagen} />
              <CopyBlock label="Texto sobre la imagen" text={result.data.textoEnImagen} />
              <CopyBlock label="Copy para WhatsApp" text={result.data.copyWhatsapp} />
              <CopyBlock label="Hashtags" text={result.data.hashtags} />
              <CopyBlock label="Notas de diseño" text={result.data.notasDiseno} />
            </div>
          )}

          {result?.tipo === 'reel' && (
            <div className="space-y-4">
              <h3 className="font-black uppercase italic text-lg text-[#fe9800]">
                Reel · {result.data.duracionSegundos}s
              </h3>
              <CopyBlock label="Hook (primeros 3 seg)" text={result.data.hook} />
              <CopyBlock
                label="Guion escena por escena"
                text={result.data.guion
                  .map((g) => `Escena ${g.escena}\n📱 Texto: ${g.textoEnPantalla}\n🎬 Visual: ${g.visual}`)
                  .join('\n\n---\n\n')}
              />
              <CopyBlock label="Prompt video IA (Runway / CapCut)" text={result.data.promptVideoIA} />
              <CopyBlock label="Copy para WhatsApp" text={result.data.copyWhatsapp} />
              <CopyBlock label="Música sugerida" text={result.data.musicaSugerida} />
            </div>
          )}

          {result?.tipo === 'carrusel' && (
            <div className="space-y-4">
              <h3 className="font-black uppercase italic text-lg text-[#fe9800]">
                Carrusel · {result.data.slides.length} slides
              </h3>
              <CopyBlock label="Copy introductorio WhatsApp" text={result.data.copyWhatsapp} />
              {result.data.slides.map((slide) => (
                <div key={slide.slide} className="border border-white/10 p-4 space-y-3">
                  <p className="font-mono text-[#fe9800] text-xs font-bold">SLIDE {slide.slide}</p>
                  <CopyBlock label="Título" text={slide.titulo} />
                  <CopyBlock label="Cuerpo" text={slide.cuerpo} />
                  <CopyBlock label="Prompt imagen" text={slide.promptImagen} />
                </div>
              ))}
              <CopyBlock label="CTA final" text={result.data.ctaFinal} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
