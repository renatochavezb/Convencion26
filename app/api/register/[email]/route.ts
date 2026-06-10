import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'convencion26');
    const { email: emailParam } = await params;
    if (!emailParam) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }
    const email = decodeURIComponent(emailParam).toLowerCase().trim();
    const registration = await db.collection('registrations').findOne({ email });
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    return NextResponse.json(registration);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
