import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';

function buildSearchQuery(q: string) {
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = { $regex: escaped, $options: 'i' };
  return {
    $or: [
      { name: regex },
      { email: regex },
      { ticketId: regex },
      { phone: regex },
      { company: regex },
      { city: regex },
    ],
  };
}

function hasComprobanteQuery() {
  return { comprobante: { $exists: true, $type: 'string', $ne: '' } };
}

function sinComprobanteQuery() {
  return {
    $or: [
      { comprobante: { $exists: false } },
      { comprobante: null },
      { comprobante: '' },
    ],
  };
}

function mergeQuery(...parts: Record<string, unknown>[]) {
  const active = parts.filter((part) => Object.keys(part).length > 0);
  if (active.length === 0) return {};
  if (active.length === 1) return active[0];
  return { $and: active };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';
    const filter = searchParams.get('filter') || 'all';

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'convencion26');
    const collection = db.collection('registrations');

    const searchQuery = q ? buildSearchQuery(q) : {};
    let listQuery = searchQuery;

    if (filter === 'con') {
      listQuery = mergeQuery(searchQuery, hasComprobanteQuery());
    } else if (filter === 'sin') {
      listQuery = mergeQuery(searchQuery, sinComprobanteQuery());
    }

    const [docs, total, conComprobante, sinComprobante] = await Promise.all([
      collection
        .find(listQuery)
        .project({
          name: 1,
          email: 1,
          phone: 1,
          ticketId: 1,
          company: 1,
          city: 1,
          status: 1,
          ticketType: 1,
          partnerName: 1,
          registeredAt: 1,
          updatedAt: 1,
          comprobante: 1,
        })
        .sort({ updatedAt: -1 })
        .limit(500)
        .toArray(),
      collection.countDocuments(searchQuery),
      collection.countDocuments(mergeQuery(searchQuery, hasComprobanteQuery())),
      collection.countDocuments(mergeQuery(searchQuery, sinComprobanteQuery())),
    ]);

    const items = docs.map((doc) => {
      const comprobante = typeof doc.comprobante === 'string' ? doc.comprobante : '';
      const hasComp = comprobante.length > 0;

      return {
        name: doc.name || '',
        email: doc.email || '',
        phone: doc.phone || '',
        ticketId: doc.ticketId || '',
        company: doc.company || '',
        city: doc.city || '',
        status: doc.status || 'pendiente',
        ticketType: doc.ticketType || '',
        partnerName: doc.partnerName || '',
        registeredAt: doc.registeredAt || '',
        updatedAt: doc.updatedAt || '',
        hasComprobante: hasComp,
        comprobanteKb: hasComp ? Math.round(comprobante.length / 1024) : 0,
      };
    });

    return NextResponse.json({
      items,
      summary: {
        total,
        conComprobante,
        sinComprobante,
        mostrando: items.length,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al consultar registros';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
