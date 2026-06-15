import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('id');

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'convencion26');

    // Find registration with this ticket ID
    const registration = await db.collection('registrations').findOne({ ticketId });

    if (!registration || !registration.comprobante) {
      return NextResponse.json({ error: 'Comprobante no encontrado para este ID' }, { status: 404 });
    }

    const base64Data = registration.comprobante; // e.g. "data:image/jpeg;base64,..."
    const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);

    if (!match) {
      return NextResponse.json({ error: 'Formato de archivo inválido' }, { status: 500 });
    }

    const contentType = match[1];
    const dataBuffer = Buffer.from(match[2], 'base64');

    return new Response(dataBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
