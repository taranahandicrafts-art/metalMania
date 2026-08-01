import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin',
};

// The dashboard and other non-essential sections are disabled for the current
// phase. Send admins straight to the Products section on landing.
export default function AdminIndexPage() {
  redirect('/admin/products');
}
