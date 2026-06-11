"use client";

import { Download } from 'lucide-react';

interface QrDownloadButtonProps {
  pngDataUrl: string;
  filename: string;
  label?: string;
}

export default function QrDownloadButton({ pngDataUrl, filename, label = 'Descargar imagen' }: QrDownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pngDataUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="no-print mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:border-[#fe9800] hover:text-[#fe9800] hover:bg-[#fe9800]/10 transition-colors cursor-pointer"
    >
      <Download className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
