import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth-guard';
import { AdminSidebar, AdminHeader } from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthSession();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:ml-60 transition-all duration-300">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>
                Signed in as <span className="font-medium text-foreground">{user.name}</span>
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="capitalize hidden sm:inline">{user.role}</span>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
