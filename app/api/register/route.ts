import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'convencion26');
    const data = await req.json();
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const email = data.email.toLowerCase().trim();
    const payload = {
      ...data,
      email,
      updatedAt: new Date().toISOString()
    };
    
    // Prevent Mongo immutable _id error
    delete payload._id;

    const result = await db.collection('registrations').updateOne(
      { email },
      { $set: payload },
      { upsert: true }
    );
    return NextResponse.json({ success: true, matchedCount: result.matchedCount, upsertedCount: result.upsertedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
