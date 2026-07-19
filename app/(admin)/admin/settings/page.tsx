import { connectDB } from '@/lib/db';
import Settings from '@/models/Settings';
import { getAuthSession } from '@/lib/auth-guard';
import { SettingsForm } from './SettingsForm';

export const metadata = { title: 'Settings | Admin' };

export default async function AdminSettingsPage() {
  await getAuthSession();
  await connectDB();

  const allSettings = await Settings.find().lean();
  const settingsMap: Record<string, Record<string, unknown>> = {};
  allSettings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </div>
      <SettingsForm initialData={JSON.parse(JSON.stringify(settingsMap))} />
    </div>
  );
}
