import mongoose from 'mongoose';
import { connectDB } from './db';

export async function initializeDatabase(): Promise<void> {
  await connectDB();
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function getDatabaseStatus(): string {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] ?? 'unknown';
}

export { connectDB } from './db';
