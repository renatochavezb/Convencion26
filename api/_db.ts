import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

if (!process.env.VERCEL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'convencion26';

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

async function connectClient(): Promise<MongoClient> {
  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI no está configurada. Añádela en .env.local (local) o en Variables de Entorno de Vercel (producción).'
    );
  }

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global.__mongoClientPromise = client.connect().then(() => {
      console.log(`Connected to MongoDB database: ${DB_NAME}`);
      return client;
    });
  }

  return global.__mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await connectClient();
  return client.db(DB_NAME);
}
