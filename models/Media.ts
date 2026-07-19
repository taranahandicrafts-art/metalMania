import mongoose, { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, MediaResourceType, MediaUsedIn } from '@/types';

export interface IMedia extends Document, Timestamps {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  resource_type: MediaResourceType;
  width: number | null;
  height: number | null;
  bytes: number;
  folder: string;
  tags: string[];
  alt: string | null;
  used_in: MediaUsedIn | null;
}

interface IMediaModel extends Model<IMedia> {
  build(data: Partial<IMedia>): IMedia;
}

const MediaUsedInSchema = new MongooseSchema(
  {
    model: {
      type: String,
      enum: {
        values: ['products', 'categories', 'reviews', null],
        message: '{VALUE} is not a valid model reference',
      },
      default: null,
    },
    field: { type: String, default: null },
    id: { type: MongooseSchema.Types.ObjectId, default: null },
  },
  { _id: false },
);

const MediaSchema = createBaseSchema<IMedia>({
  public_id: {
    type: String,
    required: [true, 'Cloudinary public_id is required'],
    unique: true,
  },
  url: {
    type: String,
    required: [true, 'Media URL is required'],
  },
  secure_url: {
    type: String,
    required: [true, 'Secure media URL is required'],
  },
  format: {
    type: String,
    required: [true, 'File format is required'],
    lowercase: true,
  },
  resource_type: {
    type: String,
    enum: {
      values: ['image', 'video', 'raw'],
      message: '{VALUE} is not a valid resource type',
    },
    required: [true, 'Resource type is required'],
    index: true,
  },
  width: {
    type: Number,
    default: null,
    min: [0, 'Width must be positive'],
  },
  height: {
    type: Number,
    default: null,
    min: [0, 'Height must be positive'],
  },
  bytes: {
    type: Number,
    required: [true, 'File size is required'],
    min: [1, 'File size must be positive'],
  },
  folder: {
    type: String,
    required: [true, 'Folder path is required'],
    index: true,
  },
  tags: {
    type: [String],
    default: [],
    index: true,
  },
  alt: {
    type: String,
    default: null,
    maxlength: [125, 'Alt text should not exceed 125 characters'],
  },
  used_in: {
    type: MediaUsedInSchema,
    default: null,
  },
});

MediaSchema.index({ resource_type: 1, created_at: -1 });
MediaSchema.index({ 'used_in.model': 1, 'used_in.id': 1 });
MediaSchema.index({ format: 1, resource_type: 1 });

MediaSchema.statics.build = function build(data: Partial<IMedia>): IMedia {
  return new this(data);
};

MediaSchema.virtual('is_image').get(function isImage(): boolean {
  return this.resource_type === 'image';
});

MediaSchema.virtual('is_video').get(function isVideo(): boolean {
  return this.resource_type === 'video';
});

MediaSchema.virtual('size_kb').get(function sizeKb(): string {
  return (this.bytes / 1024).toFixed(1);
});

MediaSchema.virtual('size_mb').get(function sizeMb(): string {
  return (this.bytes / (1024 * 1024)).toFixed(2);
});

MediaSchema.virtual('thumbnail_url').get(function thumbnailUrl(): string {
  if (this.resource_type === 'image') {
    return this.url.replace('/upload/', '/upload/w_200,q_auto,f_auto/');
  }
  return this.url;
});

const Media = (mongoose.models.Media as IMediaModel) ||
  mongoose.model<IMedia, IMediaModel>('Media', MediaSchema);

export default Media;
