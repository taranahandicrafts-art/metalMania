import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';

export async function getSettings() {
  await connectDB();
  const settings = await Settings.find().lean();
  const map: Record<string, unknown> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

export async function updateSetting(key: string, value: unknown) {
  await connectDB();
  return Settings.upsert(key as import('@/types').SettingsKey, value as Record<string, unknown>);
}

export async function getSetting(key: string) {
  await connectDB();
  return Settings.findOne({ key }).lean();
}
