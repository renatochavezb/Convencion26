import { getDb } from './_db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const uri = process.env.MONGODB_URI || '';
  const maskedUri = uri ? uri.replace(/:([^@]+)@/, ':****@') : 'undefined';

  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return res.status(200).json({
      status: 'ok',
      database: 'connected',
      uri: maskedUri,
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err.message,
      uri: maskedUri,
    });
  }
}
