import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';
import { mergeSelloState } from '@/lib/sellos';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'convencion26');
    const data = await req.json();
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const email = data.email.toLowerCase().trim();

    const existing = await db.collection('passports').findOne({ email });
    const { sellos, sellosQr } = mergeSelloState(existing, {
      sellos: data.sellos,
      sellosQr: data.sellosQr,
    });

    const payload = {
      ...data,
      email,
      sellos,
      sellosQr,
      updatedAt: new Date().toISOString()
    };

    delete payload._id;

    const result = await db.collection('passports').updateOne(
      { email },
      { $set: payload },
      { upsert: true }
    );

    // Also save/update the photoUrl in the registrations collection if it exists
    if (payload.photoUrl) {
      await db.collection('registrations').updateOne(
        { email },
        { $set: { photoUrl: payload.photoUrl } }
      );
    }

    return NextResponse.json({ success: true, matchedCount: result.matchedCount, upsertedCount: result.upsertedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
