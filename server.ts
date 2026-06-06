import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, then fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'convencion26';

// Support body parsing (JSON and encoded url), max 20mb for base64 passport image upload
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

let dbClient: MongoClient | null = null;

async function getDb() {
  if (dbClient) {
    return dbClient.db(DB_NAME);
  }
  try {
    dbClient = new MongoClient(MONGODB_URI);
    await dbClient.connect();
    console.log(`Successfully connected to MongoDB database: ${DB_NAME}`);
    return dbClient.db(DB_NAME);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    dbClient = null;
    throw error;
  }
}

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    const db = await getDb();
    const admin = db.admin();
    const status = await admin.serverStatus();
    res.json({ status: 'ok', database: 'connected', version: status.version });
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
    res.json({ success: true, matchedCount: result.matchedCount, upsertedCount: result.upsertedCount });
  } catch (err: any) {
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

app.listen(PORT, () => {
  console.log(`[Backend Server] listening on http://localhost:${PORT}`);
});
