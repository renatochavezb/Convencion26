import { getDb } from '../_db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const db = await getDb();
    // In Vercel, dynamic routing query variables are in req.query
    const { email: emailParam } = req.query;
    if (!emailParam || typeof emailParam !== 'string') {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    const email = emailParam.toLowerCase().trim();
    const registration = await db.collection('registrations').findOne({ email });
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    return res.status(200).json(registration);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
