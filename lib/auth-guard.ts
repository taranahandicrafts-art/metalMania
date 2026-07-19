import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { can, getPermissionsForRole } from '@/lib/permissions';
import type { IUser } from '@/models/User';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: IUser['role'];
  permissions: string[];
  image?: string | null;
}

export interface AuthResult {
  user: SessionUser | null;
  error: string | null;
}

export async function getAuthSession(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as SessionUser;
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getAuthSession();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requirePermission(permission: string): Promise<SessionUser> {
  const user = await requireAuth();
  if (!can(user.role, permission, user.permissions)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export function getDefaultPermissions(role: IUser['role']): string[] {
  return getPermissionsForRole(role);
}
