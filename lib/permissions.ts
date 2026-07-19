export const PERMISSIONS: Record<string, string[]> = {
  superadmin: ['*'],
  admin: [
    'product:create',
    'product:read',
    'product:update',
    'product:delete',
    'category:create',
    'category:read',
    'category:update',
    'category:delete',
    'order:create',
    'order:read',
    'order:update',
    'order:delete',
    'review:moderate',
    'review:read',
    'inventory:read',
    'inventory:update',
    'media:create',
    'media:read',
    'media:delete',
    'analytics:read',
    'settings:read',
    'settings:update',
  ],
  editor: [
    'product:create',
    'product:read',
    'product:update',
    'product:delete',
    'category:create',
    'category:read',
    'category:update',
    'category:delete',
    'review:moderate',
    'review:read',
    'media:create',
    'media:read',
    'media:delete',
  ],
  manager: [
    'order:create',
    'order:read',
    'order:update',
    'order:delete',
    'inventory:read',
    'inventory:update',
  ],
};

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS][number];

export function can(role: string, permission: string, userPermissions?: string[]): boolean {
  if (role === 'superadmin') return true;
  if (userPermissions && userPermissions.length > 0) {
    return userPermissions.includes('*') || userPermissions.includes(permission);
  }
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAny(role: string, permissions: string[], userPermissions?: string[]): boolean {
  return permissions.some((permission) => can(role, permission, userPermissions));
}

export function canAll(role: string, permissions: string[], userPermissions?: string[]): boolean {
  return permissions.every((permission) => can(role, permission, userPermissions));
}

export function getPermissionsForRole(role: string): string[] {
  return PERMISSIONS[role] ?? [];
}
