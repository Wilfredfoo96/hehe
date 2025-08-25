// Role and Permission Types
export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: UserRole;
  name: string;
  description: string;
  permissions: string[];
  level: number; // Higher number = more privileges
}

// Define available permissions
export const PERMISSIONS = {
  // User Management
  'users:read': { id: 'users:read', name: 'Read Users', description: 'View user profiles and information' },
  'users:write': { id: 'users:write', name: 'Write Users', description: 'Create, update, and delete users' },
  'users:delete': { id: 'users:delete', name: 'Delete Users', description: 'Permanently remove users' },
  
  // Content Management
  'content:read': { id: 'content:read', name: 'Read Content', description: 'View all content' },
  'content:write': { id: 'content:write', name: 'Write Content', description: 'Create and edit content' },
  'content:delete': { id: 'content:delete', name: 'Delete Content', description: 'Remove content' },
  'content:moderate': { id: 'content:moderate', name: 'Moderate Content', description: 'Review and approve content' },
  
  // System Management
  'system:settings': { id: 'system:settings', name: 'System Settings', description: 'Modify system configuration' },
  'system:logs': { id: 'system:logs', name: 'System Logs', description: 'View system logs and analytics' },
  
  // Dashboard Access
  'dashboard:admin': { id: 'dashboard:admin', name: 'Admin Dashboard', description: 'Access admin dashboard' },
  'dashboard:moderator': { id: 'dashboard:moderator', name: 'Moderator Dashboard', description: 'Access moderator dashboard' },
  'dashboard:user': { id: 'dashboard:user', name: 'User Dashboard', description: 'Access user dashboard' },
} as const;

// Define roles with their permissions
export const ROLES: Record<UserRole, Role> = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: Object.keys(PERMISSIONS),
    level: 100,
  },
  moderator: {
    id: 'moderator',
    name: 'Moderator',
    description: 'Content moderation and user management',
    permissions: [
      'users:read',
      'content:read',
      'content:write',
      'content:moderate',
      'dashboard:moderator',
    ],
    level: 50,
  },
  user: {
    id: 'user',
    name: 'User',
    description: 'Standard user with basic permissions',
    permissions: [
      'content:read',
      'content:write',
      'dashboard:user',
    ],
    level: 10,
  },
  guest: {
    id: 'guest',
    name: 'Guest',
    description: 'Limited access, no authentication required',
    permissions: [
      'content:read',
    ],
    level: 0,
  },
};

// Utility Functions
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const role = ROLES[userRole];
  return role ? role.permissions.includes(permission) : false;
}

export function hasAnyPermission(userRole: UserRole, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: UserRole, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function getRoleLevel(role: UserRole): number {
  return ROLES[role]?.level || 0;
}

export function canAccessRole(currentRole: UserRole, targetRole: UserRole): boolean {
  return getRoleLevel(currentRole) >= getRoleLevel(targetRole);
}

export function getRolePermissions(role: UserRole): string[] {
  return ROLES[role]?.permissions || [];
}

export function getRoleByName(name: string): Role | undefined {
  return Object.values(ROLES).find(role => role.name.toLowerCase() === name.toLowerCase());
}

// Permission Groups for easier checking
export const PERMISSION_GROUPS = {
  userManagement: ['users:read', 'users:write', 'users:delete'],
  contentManagement: ['content:read', 'content:write', 'content:delete', 'content:moderate'],
  systemManagement: ['system:settings', 'system:logs'],
  dashboardAccess: ['dashboard:admin', 'dashboard:moderator', 'dashboard:user'],
} as const;
