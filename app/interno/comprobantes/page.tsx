import type { Metadata } from 'next';
import ComprobantesPanel from '@/components/interno/ComprobantesPanel';

export const metadata: Metadata = {
  title: 'Comprobantes · COMEV Interno',
  robots: { index: false, follow: false },
};

export default function InternoComprobantesPage() {
  return <ComprobantesPanel />;
}
