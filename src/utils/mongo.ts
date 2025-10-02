import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo() {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(env.MONGODB_URI);
  mongoose.connection.on('connected', () => console.log('Mongo connected'));
  mongoose.connection.on('error', err => console.error('Mongo error', err));
}
