import { getDb } from '../_db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const db = await getDb();
    const { email: emailParam } = req.query;
    if (!emailParam || typeof emailParam !== 'string') {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    const email = emailParam.toLowerCase().trim();
    const passport = await db.collection('passports').findOne({ email });
    if (!passport) {
      return res.status(404).json({ error: 'Passport not found' });
    }
    return res.status(200).json(passport);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
