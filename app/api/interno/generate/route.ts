import { NextRequest, NextResponse } from 'next/server';
import { CONTENIDO_TEMAS, type ContenidoTipo, type ContenidoTema } from '@/data/contenidoEvento';
import { generateContenido } from '@/lib/contentGenerator';

const VALID_TIPOS: ContenidoTipo[] = ['imagen', 'reel', 'carrusel'];
const VALID_TEMAS = new Set(CONTENIDO_TEMAS.map((t) => t.id));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tipo = body.tipo as ContenidoTipo;
    const tema = body.tema as ContenidoTema;
    const notas = typeof body.notas === 'string' ? body.notas.slice(0, 500) : undefined;

    if (!VALID_TIPOS.includes(tipo)) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }
    if (!VALID_TEMAS.has(tema)) {
      return NextResponse.json({ error: 'Tema inválido' }, { status: 400 });
    }

    const result = await generateContenido(tipo, tema, notas);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al generar contenido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
