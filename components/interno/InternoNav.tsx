'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, LogOut } from 'lucide-react';
import { WHATSAPP_REGISTRO_GRUPO_URL } from '@/constants/whatsapp';

const LINKS = [
  { href: '/interno/contenido', label: 'Contenido' },
  { href: '/interno/comprobantes', label: 'Comprobantes' },
] as const;

export default function InternoNav() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/interno/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    window.location.href = '/interno/login';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            pathname === href
              ? 'border-[#fe9800] text-[#fe9800] bg-[#fe9800]/10'
              : 'border-white/15 hover:border-[#fe9800] hover:text-[#fe9800]'
          }`}
        >
          {label}
        </Link>
      ))}
      <Link
        href="/sellos-qr"
        className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:border-[#fe9800] hover:text-[#fe9800] transition-colors"
      >
        QR Sellos <ExternalLink className="w-3.5 h-3.5" />
      </Link>
      <a
        href={WHATSAPP_REGISTRO_GRUPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 border border-[#25D366]/40 text-[#25D366] px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/10 transition-colors"
      >
        Grupo WA
      </a>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" /> Salir
      </button>
    </div>
  );
}
