import QRCode from 'qrcode';
import { SELLOS_INFO, getSelloQrUrl } from '@/constants/sellos';
import Link from 'next/link';
import QrDownloadButton from '@/components/QrDownloadButton';

const QR_OPTIONS = {
  margin: 2,
  color: { dark: '#000814', light: '#ffffff' },
} as const;

async function getQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: 'svg',
    width: 280,
    ...QR_OPTIONS,
  });
}

async function getQrPngDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 800,
    ...QR_OPTIONS,
  });
}

function selloFilename(id: number, name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `comev-sello-${id}-${slug}`;
}

export default async function SellosQrPage() {
  const sellos = await Promise.all(
    SELLOS_INFO.map(async (sello) => {
      const url = getSelloQrUrl(sello.id);
      const [svg, pngDataUrl] = await Promise.all([getQrSvg(url), getQrPngDataUrl(url)]);
      return { ...sello, url, svg, pngDataUrl, filename: selloFilename(sello.id, sello.name) };
    })
  );

  return (
    <div className="min-h-screen bg-[#000814] text-white print:bg-white print:text-black">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .qr-card { break-inside: avoid; page-break-inside: avoid; border: 1px solid #ccc !important; }
        }
        .qr-svg-wrap svg {
          display: block;
          width: 220px;
          height: 220px;
        }
      `}} />

      <header className="no-print border-b border-white/10 px-6 py-5 max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[#fe9800] text-xs font-bold tracking-[0.2em] uppercase">COMEV 2026</p>
          <h1 className="text-2xl font-black italic uppercase mt-1">QR de Sellos</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Imprime o muestra estos códigos en cada estación del evento. Al escanearlos, el participante registra el sello en su pasaporte digital de forma permanente.
          </p>
        </div>
        <Link
          href="/#pasaporte"
          className="px-4 py-2 rounded-lg border border-white/15 text-sm hover:border-[#fe9800] hover:text-[#fe9800] transition-colors"
        >
          ← Volver al pasaporte
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sellos.map((sello) => (
          <article
            key={sello.id}
            className="qr-card rounded-2xl border border-white/10 bg-[#040d1a] p-6 flex flex-col items-center text-center print:bg-white print:border-gray-300"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black mb-3"
              style={{ background: `${sello.color}22`, color: sello.color, border: `2px solid ${sello.color}` }}
            >
              {sello.id}
            </div>

            <h2 className="font-black italic uppercase text-lg leading-tight">{sello.name}</h2>
            <p className="text-slate-400 text-xs uppercase tracking-wide mt-1">{sello.desc}</p>
            <p className="text-slate-500 text-[10px] mt-1">{sello.date}</p>

            <div
              className="qr-svg-wrap my-5 p-3 bg-white rounded-xl"
              dangerouslySetInnerHTML={{ __html: sello.svg }}
              aria-label={`QR sello ${sello.id} — ${sello.name}`}
              role="img"
            />

            <p className="text-[10px] text-slate-500 break-all leading-relaxed max-w-[260px]">{sello.url}</p>
            <p className="text-[9px] text-[#fe9800] uppercase tracking-widest mt-3 font-bold">
              Escanear para sello {sello.id}
            </p>

            <QrDownloadButton
              pngDataUrl={sello.pngDataUrl}
              filename={sello.filename}
            />
          </article>
        ))}
      </main>

      <footer className="no-print max-w-6xl mx-auto px-6 pb-10 text-slate-500 text-xs">
        <p>Los sellos registrados por QR no pueden eliminarse. Los sellos agregados manualmente (mantén presionado en el pasaporte) sí pueden quitarse.</p>
      </footer>
    </div>
  );
}
