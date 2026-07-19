import mongoose, { Document, Model, Schema as MongooseSchema, Types, CallbackError } from 'mongoose';
import { createBaseSchema } from './BaseSchema';
import type { Timestamps, CategoryAncestor, CategorySEO } from '@/types';

export interface ICategory extends Document, Timestamps {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: Types.ObjectId | null;
  ancestors: CategoryAncestor[];
  sort_order: number;
  is_active: boolean;
  seo: CategorySEO;
  product_count: number;
}

interface ICategoryModel extends Model<ICategory> {
  build(data: Partial<ICategory>): ICategory;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildAncestors(parent: ICategory | null): CategoryAncestor[] {
  if (!parent) return [];
  return [
    ...(parent.ancestors || []),
    { _id: parent._id, name: parent.name, slug: parent.slug },
  ];
}

const AncestorSchema = new MongooseSchema(
  {
    _id: { type: MongooseSchema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { _id: false },
);

const CategorySEOSchema = new MongooseSchema(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
  },
  { _id: false },
);

const CategorySchema = createBaseSchema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [100, 'Category name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: null,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  image: {
    type: String,
    default: null,
  },
  parent_id: {
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    default: null,
    index: true,
  },
  ancestors: {
    type: [AncestorSchema],
    default: [],
  },
  sort_order: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  seo: {
    type: CategorySEOSchema,
    default: () => ({}),
  },
  product_count: {
    type: Number,
    default: 0,
  },
});

CategorySchema.index({ parent_id: 1, sort_order: 1 });
CategorySchema.index({ 'ancestors._id': 1 });
CategorySchema.index({ is_active: 1, parent_id: 1, sort_order: 1 });
CategorySchema.index({ product_count: -1, is_active: 1 });

CategorySchema.pre<ICategory>('validate', async function preValidate(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = slugify(this.name);
  }

  if (this.isModified('parent_id') && this.parent_id) {
    if (this.parent_id.equals(this._id)) {
      return next(new Error('Category cannot be its own parent'));
    }

    const CategoryModel = mongoose.model<ICategory>('Category');
    const parent = await CategoryModel.findById(this.parent_id).lean();
    if (parent) {
      const isDescendant = (parent as unknown as ICategory).ancestors?.some(
        (a: CategoryAncestor) => a._id.toString() === this._id.toString(),
      );
      if (isDescendant) {
        return next(new Error('Circular reference detected: ancestor cannot be a descendant'));
      }
    }
  }

  next();
});

CategorySchema.pre<ICategory>('save', async function preSave(next) {
  if (this.isModified('parent_id')) {
    if (this.parent_id) {
      const CategoryModel = mongoose.model<ICategory>('Category');
      const parent = await CategoryModel.findById(this.parent_id).lean();
      this.ancestors = buildAncestors(parent as unknown as ICategory | null);
    } else {
      this.ancestors = [];
    }
  }
  next();
});

CategorySchema.pre('findOneAndUpdate', async function preFindOneAndUpdate(next) {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update?.parent_id !== undefined) {
    const doc = await this.model.findOne(this.getQuery()).lean();
    if (doc) {
      const CategoryModel = mongoose.model<ICategory>('Category');
      if (update.parent_id === null) {
        this.set({ ancestors: [] });
      } else {
        const parent = await CategoryModel.findById(update.parent_id).lean();
        if (!parent) {
          return next(new Error('Parent category not found'));
        }
        if ((parent as unknown as ICategory)._id.toString() === (doc as unknown as ICategory)._id.toString()) {
          return next(new Error('Category cannot be its own parent'));
        }
        this.set({ ancestors: buildAncestors(parent as unknown as ICategory | null) });
      }
    }
  }
  next();
});

CategorySchema.statics.build = function build(data: Partial<ICategory>): ICategory {
  return new this(data);
};

CategorySchema.virtual('level').get(function level(): number {
  return this.ancestors?.length || 0;
});

CategorySchema.virtual('path').get(function path(): string {
  if (!this.ancestors || this.ancestors.length === 0) return this.name;
  return [...this.ancestors.map((a) => a.name), this.name].join(' > ');
});

const Category = (mongoose.models.Category as ICategoryModel) ||
  mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema);

export default Category;
