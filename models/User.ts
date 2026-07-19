import mongoose, { Schema, Document, Model, CallbackError } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { UserRole, Timestamps } from '@/types';

export interface IUser extends Document, Timestamps {
  name: string;
  email: string;
  email_verified: Date | null;
  image: string | null;
  password?: string;
  role: UserRole;
  permissions: string[];
  is_active: boolean;
}

interface IUserModel extends Model<IUser> {
  build(data: Partial<IUser>): IUser;
}

const UserSchema = createBaseSchema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
  },
  email_verified: {
    type: Date,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ['superadmin', 'admin', 'editor', 'manager'],
      message: '{VALUE} is not a valid role',
    },
    default: 'editor',
    required: [true, 'Role is required'],
  },
  permissions: {
    type: [String],
    default: [],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

UserSchema.index({ role: 1, is_active: 1 });
UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { password: { $exists: true } },
  },
);

UserSchema.pre('save', function preSave(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

UserSchema.pre('findOneAndUpdate', function preFindOneAndUpdate(next) {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update?.email) {
    update.email = (update.email as string).toLowerCase();
  }
  next();
});

UserSchema.statics.build = function build(data: Partial<IUser>): IUser {
  return new this(data);
};

UserSchema.virtual('is_superadmin').get(function isSuperadmin(): boolean {
  return this.role === 'superadmin';
});

const User = (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
