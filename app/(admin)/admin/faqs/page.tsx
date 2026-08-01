import { connectDB } from '@/lib/db';
import FAQ from '@/models/FAQ';
import { requirePermission } from '@/lib/auth-guard';
import AdminFAQClient from './AdminFAQClient';

export default async function AdminFAQsPage() {
  await requirePermission('settings:read');
  await connectDB();

  const raw = await FAQ.find().sort({ sort_order: 1, created_at: 1 }).lean();
  const faqs = JSON.parse(JSON.stringify(raw));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Home FAQs</h2>
        <p className="text-sm text-muted-foreground">
          Manage frequently asked questions shown on the home page.
        </p>
      </div>
      <AdminFAQClient initialFaqs={faqs} />
    </div>
  );
}
