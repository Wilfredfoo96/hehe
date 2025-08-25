import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";

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

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MODERATOR]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.CREATE_COMMENT,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.UPLOAD_CONTENT,
    PERMISSIONS.CREATE_COMMENT,
  ],
};

export function usePermissions() {
  const { user } = useUser();
  
  return useMemo(() => {
    if (!user) return [];
    
    const userRole = user.publicMetadata.role as Role || ROLES.USER;
    return ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS[ROLES.USER];
  }, [user]);
}

export function useRoleAccess() {
  const { user } = useUser();
  
  return useMemo(() => {
    if (!user) return { role: null, hasRole: false };
    
    const userRole = user.publicMetadata.role as Role || ROLES.USER;
    return {
      role: userRole,
      hasRole: true,
      isAdmin: userRole === ROLES.ADMIN,
      isModerator: userRole === ROLES.MODERATOR || userRole === ROLES.ADMIN,
      isUser: true,
    };
  }, [user]);
}

export function usePermissionGroups() {
  const permissions = usePermissions();
  
  return useMemo(() => {
    return {
      canManageUsers: permissions.includes(PERMISSIONS.MANAGE_USERS),
      canViewUsers: permissions.includes(PERMISSIONS.VIEW_USERS),
      canManageContent: permissions.includes(PERMISSIONS.MANAGE_CONTENT),
      canModerateContent: permissions.includes(PERMISSIONS.MODERATE_CONTENT),
      canUploadContent: permissions.includes(PERMISSIONS.UPLOAD_CONTENT),
      canManageSystem: permissions.includes(PERMISSIONS.MANAGE_SYSTEM),
      canViewAnalytics: permissions.includes(PERMISSIONS.VIEW_ANALYTICS),
      canViewContent: permissions.includes(PERMISSIONS.VIEW_CONTENT),
      canCreateComment: permissions.includes(PERMISSIONS.CREATE_COMMENT),
    };
  }, [permissions]);
}
