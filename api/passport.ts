import { getDb } from './_db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const db = await getDb();
    const data = req.body;
    if (!data.email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const email = data.email.toLowerCase().trim();
    const payload = {
      ...data,
      email,
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

    return res.status(200).json({ success: true, matchedCount: result.matchedCount, upsertedCount: result.upsertedCount });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
