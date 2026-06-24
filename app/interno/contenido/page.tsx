import type { Metadata } from 'next';
import ContenidoStudio from '@/components/interno/ContenidoStudio';

export const metadata: Metadata = {
  title: 'Studio de Contenido · COMEV Interno',
  robots: { index: false, follow: false },
};

export default function InternoContenidoPage() {
  return <ContenidoStudio />;
}
