/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, SchemaOptions } from 'mongoose';

const baseSchemaOptions: SchemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(_doc: unknown, ret: Record<string, unknown>) {
      ret.id = (ret._id as string)?.toString();
      delete ret.__v;
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(_doc: unknown, ret: Record<string, unknown>) {
      ret.id = (ret._id as string)?.toString();
      delete ret.__v;
      delete ret._id;
    },
  },
};

export function createBaseSchema<T>(
  definition: Record<string, unknown>,
  options?: Partial<SchemaOptions>,
): Schema<T> {
  return new Schema(definition, {
    ...baseSchemaOptions,
    ...options,
  } as any) as unknown as Schema<T>;
}
