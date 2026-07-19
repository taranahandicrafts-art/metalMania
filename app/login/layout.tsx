import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth-guard';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthSession();

  if (user) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {children}
    </div>
  );
}
