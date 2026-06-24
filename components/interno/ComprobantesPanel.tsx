'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  FileImage,
  Loader2,
  RefreshCw,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import InternoNav from '@/components/interno/InternoNav';

interface ComprobanteItem {
  name: string;
  email: string;
  phone: string;
  ticketId: string;
  company: string;
  city: string;
  status: string;
  ticketType: string;
  partnerName: string;
  registeredAt: string;
  updatedAt: string;
  hasComprobante: boolean;
  comprobanteKb: number;
}

interface Summary {
  total: number;
  conComprobante: number;
  sinComprobante: number;
  mostrando: number;
}

type Filter = 'all' | 'con' | 'sin';

function statusLabel(status: string): string {
  if (status === 'confirmado') return 'Confirmado';
  if (status === 'pendiente') return 'Pendiente';
  return status;
}

export default function ComprobantesPanel() {
  const [items, setItems] = useState<ComprobanteItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [preview, setPreview] = useState<ComprobanteItem | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (filter !== 'all') params.set('filter', filter);

      const res = await fetch(`/api/interno/comprobantes?${params.toString()}`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('No se pudo cargar la lista. Recarga la página.');
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar registros');

      setItems(data.items || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [query, filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  return (
    <div className="min-h-screen bg-[#000814] text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#fe9800] text-xs font-bold tracking-[0.2em] uppercase">COMEV 2026 · Interno</p>
            <h1 className="text-2xl font-black italic uppercase mt-1 flex items-center gap-2">
              <FileImage className="w-6 h-6 text-[#fe9800]" />
              Comprobantes de inscripción
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Revisa quién subió comprobante en el sitio y quién solo quedó registrado sin archivo.
            </p>
          </div>
          <InternoNav />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Registros', value: summary.total },
              { label: 'Con comprobante', value: summary.conComprobante, accent: 'text-emerald-400' },
              { label: 'Sin comprobante', value: summary.sinComprobante, accent: 'text-amber-300' },
              { label: 'Mostrando', value: summary.mostrando },
            ].map(({ label, value, accent }) => (
              <div key={label} className="border border-white/10 bg-[#040d1a] px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
                <p className={`text-2xl font-black mt-1 ${accent || 'text-white'}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, correo, referencia, teléfono..."
              className="w-full bg-[#040d1a] border border-white/10 pl-10 pr-3 py-3 text-sm text-white focus:border-[#fe9800] outline-none"
            />
          </div>
          <div className="flex gap-2">
            {([
              ['all', 'Todos'],
              ['con', 'Con archivo'],
              ['sin', 'Sin archivo'],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                  filter === id
                    ? 'border-[#fe9800] text-[#fe9800] bg-[#fe9800]/10'
                    : 'border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="px-4 py-3 border border-white/10 text-slate-400 hover:text-white disabled:opacity-50"
              aria-label="Actualizar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm border border-red-500/30 bg-red-950/30 px-4 py-3">{error}</p>
        )}

        <div className="border border-white/10 overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-white/5 text-left">
              <tr className="text-[10px] uppercase tracking-widest text-slate-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Celular</th>
                <th className="px-4 py-3">Referencia</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Comprobante</th>
                <th className="px-4 py-3">Actualizado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                    Cargando registros...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No hay registros con esos filtros.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={`${item.email}-${item.ticketId}`} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{item.name || '—'}</p>
                      {item.partnerName && (
                        <p className="text-[11px] text-slate-500 mt-0.5">+ {item.partnerName}</p>
                      )}
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.company}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{item.email}</td>
                    <td className="px-4 py-3 text-slate-300">{item.phone || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#fe9800]">{item.ticketId || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs uppercase tracking-wide text-slate-300">
                        {statusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.hasComprobante ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase">
                          <CheckCircle2 className="w-4 h-4" />
                          Sí · {item.comprobanteKb} KB
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase">
                          <XCircle className="w-4 h-4" />
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString('es-MX', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : item.registeredAt || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {item.hasComprobante && item.ticketId ? (
                        <button
                          type="button"
                          onClick={() => setPreview(item)}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#fe9800] hover:text-white"
                        >
                          <Eye className="w-4 h-4" /> Ver
                        </button>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {preview && preview.ticketId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl border border-white/10 bg-[#040d1a] shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Comprobante</p>
                <p className="font-bold text-white">{preview.name}</p>
                <p className="text-xs text-slate-400">{preview.ticketId}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="p-2 text-slate-400 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-black/40 min-h-[320px] flex items-center justify-center">
              <img
                src={`/api/comprobante?id=${encodeURIComponent(preview.ticketId)}`}
                alt={`Comprobante de ${preview.name}`}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>
            <div className="px-4 py-3 border-t border-white/10 flex justify-between gap-3 text-xs text-slate-400">
              <span>{preview.email}</span>
              <a
                href={`/api/comprobante?id=${encodeURIComponent(preview.ticketId)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fe9800] hover:text-white font-bold uppercase tracking-wider"
              >
                Abrir archivo
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
