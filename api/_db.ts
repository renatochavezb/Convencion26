import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load environmental variables for local environment
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'convencion26';

let dbClient: MongoClient | null = null;

export async function getDb() {
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
