export const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
} as const;

export const PERMISSIONS = {
  // User management
  MANAGE_USERS: "manage_users",
  VIEW_USERS: "view_users",
  
  // Content management
  MANAGE_CONTENT: "manage_content",
  MODERATE_CONTENT: "moderate_content",
  UPLOAD_CONTENT: "upload_content",
  
  // System management
  MANAGE_SYSTEM: "manage_system",
  VIEW_ANALYTICS: "view_analytics",
  
  // Basic permissions
  VIEW_CONTENT: "view_content",
  CREATE_COMMENT: "create_comment",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.MODERATOR]: 2,
  [ROLES.USER]: 1,
} as const;

export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.MODERATOR]: "Moderator",
  [ROLES.USER]: "User",
} as const;

export function hasRole(userRole: Role | null, requiredRole: Role): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canAccess(userRole: Role | null, requiredRole: Role): boolean {
  return hasRole(userRole, requiredRole);
}
