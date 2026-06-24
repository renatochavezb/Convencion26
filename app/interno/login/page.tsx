'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/interno/contenido';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/interno/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Acceso denegado');
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000814] flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-[#fe9800]/30 bg-[#040d1a] p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#fe9800]/10 border border-[#fe9800]/30 text-[#fe9800] mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <p className="text-[#fe9800] text-xs font-bold tracking-[0.2em] uppercase">COMEV · Interno</p>
          <h1 className="text-white font-black text-2xl uppercase italic mt-2">Acceso restringido</h1>
          <p className="text-slate-400 text-sm mt-2">Solo equipo COMEV / EVM Chihuahua</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] text-slate-400 uppercase block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#000814] border border-white/10 px-3 py-3 text-white focus:border-[#fe9800] outline-none"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-red-400 text-xs bg-red-950/40 border border-red-500/30 px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#fe9800] hover:bg-white disabled:opacity-50 text-[#000814] font-bold uppercase tracking-wider py-3 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function InternoLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000814]" />}>
      <LoginForm />
    </Suspense>
  );
}
