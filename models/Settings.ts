import mongoose, { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, SettingsKey } from '@/types';

export interface ISettings extends Document, Timestamps {
  key: SettingsKey;
  value: Record<string, unknown>;
  description: string | null;
  updated_by_id: Types.ObjectId | null;
}

interface ISettingsModel extends Model<ISettings> {
  build(data: Partial<ISettings>): ISettings;
  getByKey(key: SettingsKey): Promise<Record<string, unknown> | null>;
  upsert(key: SettingsKey, value: Record<string, unknown>, userId?: Types.ObjectId): Promise<ISettings>;
}

const SettingsSchema = createBaseSchema<ISettings>({
  key: {
    type: String,
    required: [true, 'Settings key is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [100, 'Key cannot exceed 100 characters'],
  },
  value: {
    type: MongooseSchema.Types.Mixed,
    required: [true, 'Settings value is required'],
  },
  description: {
    type: String,
    default: null,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  updated_by_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
});

SettingsSchema.statics.build = function build(data: Partial<ISettings>): ISettings {
  return new this(data);
};

SettingsSchema.statics.getByKey = async function getByKey(
  key: SettingsKey,
): Promise<Record<string, unknown> | null> {
  const doc = await this.findOne({ key }).lean();
  return doc ? (doc as ISettings).value : null;
};

SettingsSchema.statics.upsert = async function upsert(
  key: SettingsKey,
  value: Record<string, unknown>,
  userId?: Types.ObjectId,
): Promise<ISettings> {
  return this.findOneAndUpdate(
    { key },
    { value, updated_by_id: userId ?? null },
    { upsert: true, new: true, runValidators: true },
  );
};

const Settings = (mongoose.models.Settings as ISettingsModel) ||
  mongoose.model<ISettings, ISettingsModel>('Settings', SettingsSchema);

export default Settings;
