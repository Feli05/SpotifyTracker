/**
 * MongoDB service for the song import script
 */

import { MongoClient, Db, Collection } from 'mongodb';
import { SongDocument } from '../models/types';
import { DB_NAME, ENV } from '../utils/config';

let client: MongoClient;

/**
 * Connect to MongoDB and verify the connection
 */
export async function connectToMongoDB(): Promise<MongoClient> {
  console.log(`Attempting to connect to MongoDB with URI: ${ENV.MONGODB_URI.substring(0, 20)}...`);
  client = new MongoClient(ENV.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Verify the connection by listing databases
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log("MongoDB ping result:", result);
    
    // List available databases to verify
    const dbs = await client.db().admin().listDatabases();
    console.log("Available MongoDB databases:", dbs.databases.map(db => db.name).join(", "));
    
    return client;
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    throw new Error(`Failed to connect to MongoDB: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Initialize the database with required collections and indexes
 */
export async function initDatabase(client: MongoClient): Promise<Db> {
  const db = client.db(DB_NAME);
  console.log(`Using database: ${DB_NAME}`);
  
  // Create index on spotifyId for faster lookups and to enforce uniqueness
  const songsCollection = db.collection('songs');
  console.log("Creating indexes on songs collection...");
  
  try {
    await songsCollection.createIndex({ spotifyId: 1 }, { unique: true });
    await songsCollection.createIndex({ genre: 1 }); // For faster queries by genre
    await songsCollection.createIndex({ popularity: -1 }); // For sorting by popularity
    console.log("Indexes created successfully");
  } catch (indexError) {
    console.error("Error creating indexes:", indexError);
    // Continue even if index creation fails
  }
  
  return db;
}

/**
 * Get the count of existing songs for a specific genre
 */
export async function getExistingSongCount(collection: Collection, genre: string): Promise<number> {
  return collection.countDocuments({ genre });
}

/**
 * Insert song documents into the database
 */
export async function insertSongs(collection: Collection, documents: SongDocument[]): Promise<number> {
  if (documents.length === 0) return 0;
  
  try {
    const result = await collection.insertMany(documents);
    return result.insertedCount;
  } catch (error) {
    console.error("Error inserting songs:", error);
    return 0;
  }
}

/**
 * Close the MongoDB connection
 */
export async function closeMongoDBConnection(): Promise<void> {
  if (client) {
    try {
      await client.close();
      console.log('MongoDB connection closed');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
} 