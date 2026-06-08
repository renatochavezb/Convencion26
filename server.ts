import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { getDb } from './api/_db.ts';

// Load .env.local first, then fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Support body parsing (JSON and encoded url), max 20mb for base64 passport image upload
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Normalize request URL path for Vercel vs Local environment compatibility.
// If Vercel strips the '/api' prefix, we add it back so Express routing matches.
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    res.json({ status: 'ok', database: 'connected' });
  } catch (err: any) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

// GET /api/register/:email
app.get('/api/register/:email', async (req, res) => {
  try {
    const db = await getDb();
    const email = req.params.email.toLowerCase().trim();
    const registration = await db.collection('registrations').findOne({ email });
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json(registration);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/register
app.post('/api/register', async (req, res) => {
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
    
    // Prevent Mongo immutable _id error
    delete payload._id;

    const result = await db.collection('registrations').updateOne(
      { email },
      { $set: payload },
      { upsert: true }
    );
    res.json({ success: true, matchedCount: result.matchedCount, upsertedCount: result.upsertedCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/passport/:email
app.get('/api/passport/:email', async (req, res) => {
  try {
    const db = await getDb();
    const email = req.params.email.toLowerCase().trim();
    const passport = await db.collection('passports').findOne({ email });
    if (!passport) {
      return res.status(404).json({ error: 'Passport not found' });
    }
    res.json(passport);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/passport
app.post('/api/passport', async (req, res) => {
  console.log(`[POST /api/passport] Received save request.`);
  try {
    const db = await getDb();
    const data = req.body;
    console.log(`[POST /api/passport] Data keys: ${Object.keys(data || {}).join(', ')}`);
    if (!data.email) {
      console.warn(`[POST /api/passport] Warning: Missing email in payload.`);
      return res.status(400).json({ error: 'Email is required' });
    }
    const email = data.email.toLowerCase().trim();
    console.log(`[POST /api/passport] Target Email: ${email}`);
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
    console.log(`[POST /api/passport] Saved to 'passports'. Matched: ${result.matchedCount}, Upserted: ${result.upsertedCount}`);

    // Also save/update the photoUrl in the registrations collection if it exists
    if (payload.photoUrl) {
      console.log(`[POST /api/passport] Sinking photoUrl to registrations (Length: ${payload.photoUrl.length} chars)`);
      const regResult = await db.collection('registrations').updateOne(
        { email },
        { $set: { photoUrl: payload.photoUrl } }
      );
      console.log(`[POST /api/passport] Sunk to 'registrations'. Matched: ${regResult.matchedCount}`);
    } else {
      console.log(`[POST /api/passport] No photoUrl to sink.`);
    }

    res.json({ success: true, matchedCount: result.matchedCount, upsertedCount: result.upsertedCount });
  } catch (err: any) {
    console.error(`[POST /api/passport] Error during save:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Serve static assets in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Backend Server] listening on http://localhost:${PORT}`);
  });
}

export default app;
