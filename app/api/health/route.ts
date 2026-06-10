import { NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';

export async function GET() {
  const uri = process.env.MONGODB_URI || '';
  const maskedUri = uri ? uri.replace(/:([^@]+)@/, ':****@') : 'undefined';

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'convencion26');
    await db.command({ ping: 1 });
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      uri: maskedUri,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: err.message,
      uri: maskedUri,
    }, { status: 500 });
  }
}
