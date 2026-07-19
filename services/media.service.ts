import { connectDB } from '@/lib/db';
import Media from '@/models/Media';

export async function saveMedia(data: Record<string, unknown>) {
  await connectDB();
  return Media.create(data);
}

export async function deleteMedia(id: string) {
  await connectDB();
  const media = await Media.findByIdAndDelete(id);
  if (!media) throw new Error('Media not found');
  return media;
}

export async function listMedia(options: {
  page?: number;
  limit?: number;
  type?: string;
  folder?: string;
  search?: string;
}) {
  await connectDB();
  const { page = 1, limit = 50, type, folder, search } = options;

  const query: Record<string, unknown> = {};
  if (type) query.resource_type = type;
  if (folder) query.folder = folder;
  if (search) query.public_id = { $regex: search, $options: 'i' };

  const [media, total] = await Promise.all([
    Media.find(query).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Media.countDocuments(query),
  ]);

  return { media, total, page, totalPages: Math.ceil(total / limit) };
}

export async function searchMedia(q: string) {
  await connectDB();
  return Media.find({ public_id: { $regex: q, $options: 'i' } }).limit(20).lean();
}

export async function getUsageReferences(publicId: string) {
  await connectDB();
  return Media.findOne({ public_id: publicId }).select('used_in').lean();
}
