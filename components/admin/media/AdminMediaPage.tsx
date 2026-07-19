import { connectDB } from '@/lib/db';
import Media from '@/models/Media';
import { AdminMediaClient } from '@/components/admin/media/AdminMediaClient';

export async function AdminMediaPage() {
  await connectDB();
  const media = await Media.find().sort('-created_at').limit(100).lean();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
      <AdminMediaClient initialMedia={JSON.parse(JSON.stringify(media))} />
    </div>
  );
}
