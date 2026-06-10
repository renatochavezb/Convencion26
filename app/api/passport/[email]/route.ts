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
    const passport = await db.collection('passports').findOne({ email });
    if (!passport) {
      return NextResponse.json({ error: 'Passport not found' }, { status: 404 });
    }
    return NextResponse.json(passport);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
