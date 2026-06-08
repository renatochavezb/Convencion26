import { getDb } from './_db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const db = await getDb();
    const admin = db.admin();
    const status = await admin.serverStatus();
    return res.status(200).json({ status: 'ok', database: 'connected', version: status.version });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
}
