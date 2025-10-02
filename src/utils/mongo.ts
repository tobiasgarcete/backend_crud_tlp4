import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo() {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI no esta configurada');
  await mongoose.connect(env.MONGODB_URI);
  mongoose.connection.on('conectado', () => console.log('Mongo conectado'));
  mongoose.connection.on('error', err => console.error('Mongo error', err));
}
