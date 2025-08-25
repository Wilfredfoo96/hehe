"use client";

import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";
import { 
  UserRole, 
  ROLES, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  getRoleLevel,
  canAccessRole,
  getRolePermissions,
  PERMISSION_GROUPS
} from "@/lib/roles";

// Default role for unauthenticated users
const DEFAULT_ROLE: UserRole = 'guest';

export function useUserRole(): UserRole {
  const { user, isLoaded } = useUser();
  
  return useMemo(() => {
    if (!isLoaded || !user) {
      return DEFAULT_ROLE;
    }
    
    // Get role from Clerk user metadata
    // You can set this in Clerk dashboard or via API
    const userRole = user.publicMetadata?.role as UserRole;
    
    // Validate the role exists, fallback to 'user' if invalid
    if (userRole && ROLES[userRole]) {
      return userRole;
    }
    
    // Default role for authenticated users
    return 'user';
  }, [user, isLoaded]);
}

export function usePermissions() {
  const userRole = useUserRole();
  
  return useMemo(() => {
    const permissions = getRolePermissions(userRole);
    
    return {
      permissions,
      hasPermission: (permission: string) => hasPermission(userRole, permission),
      hasAnyPermission: (permissions: string[]) => hasAnyPermission(userRole, permissions),
      hasAllPermissions: (permissions: string[]) => hasAllPermissions(userRole, permissions),
      role: userRole,
      roleInfo: ROLES[userRole],
      roleLevel: getRoleLevel(userRole),
    };
  }, [userRole]);
}

export function useRoleAccess() {
  const userRole = useUserRole();
  
  return useMemo(() => {
    return {
      canAccessRole: (targetRole: UserRole) => canAccessRole(userRole, targetRole),
      canManageUsers: hasPermission(userRole, 'users:write'),
      canModerateContent: hasPermission(userRole, 'content:moderate'),
      canDeleteContent: hasPermission(userRole, 'content:delete'),
      canAccessAdmin: hasPermission(userRole, 'dashboard:admin'),
      canAccessModerator: hasPermission(userRole, 'dashboard:moderator'),
      isAdmin: userRole === 'admin',
      isModerator: userRole === 'moderator' || userRole === 'admin',
      isUser: userRole === 'user' || userRole === 'moderator' || userRole === 'admin',
    };
  }, [userRole]);
}

export function usePermissionGroups() {
  const { hasPermission } = usePermissions();
  const userRole = useUserRole();
  
  return useMemo(() => {
    return {
      userManagement: {
        canRead: hasPermission('users:read'),
        canWrite: hasPermission('users:write'),
        canDelete: hasPermission('users:delete'),
        hasAny: hasAnyPermission(userRole, PERMISSION_GROUPS.userManagement),
        hasAll: hasAllPermissions(userRole, PERMISSION_GROUPS.userManagement),
      },
      contentManagement: {
        canRead: hasPermission('content:read'),
        canWrite: hasPermission('content:write'),
        canDelete: hasPermission('content:delete'),
        canModerate: hasPermission('content:moderate'),
        hasAny: hasAnyPermission(userRole, PERMISSION_GROUPS.contentManagement),
        hasAll: hasAllPermissions(userRole, PERMISSION_GROUPS.contentManagement),
      },
      systemManagement: {
        canAccessSettings: hasPermission('system:settings'),
        canAccessLogs: hasPermission('system:logs'),
        hasAny: hasAnyPermission(userRole, PERMISSION_GROUPS.systemManagement),
        hasAll: hasAllPermissions(userRole, PERMISSION_GROUPS.systemManagement),
      },
      dashboardAccess: {
        canAccessAdmin: hasPermission('dashboard:admin'),
        canAccessModerator: hasPermission('dashboard:moderator'),
        canAccessUser: hasPermission('dashboard:user'),
        hasAny: hasAnyPermission(userRole, PERMISSION_GROUPS.dashboardAccess),
        hasAll: hasAllPermissions(userRole, PERMISSION_GROUPS.dashboardAccess),
      },
    };
  }, [hasPermission, userRole]);
}

// Hook for checking if user can access a specific route or feature
export function useAccessControl(requiredPermissions: string[], requireAll: boolean = false) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();
  
  return useMemo(() => {
    if (requireAll) {
      return hasAllPermissions(requiredPermissions);
    }
    return hasAnyPermission(requiredPermissions);
  }, [requiredPermissions, requireAll, hasAllPermissions, hasAnyPermission]);
}

// Hook for role-based component rendering
export function useRoleBasedRender() {
  const userRole = useUserRole();
  const { permissions } = usePermissions();
  
  return useMemo(() => {
    return {
      // Render based on role
      renderForRole: (role: UserRole, content: React.ReactNode) => {
        return userRole === role ? content : null;
      },
      
      // Render for multiple roles
      renderForRoles: (roles: UserRole[], content: React.ReactNode) => {
        return roles.includes(userRole) ? content : null;
      },
      
      // Render for role level and above
      renderForRoleLevel: (minRole: UserRole, content: React.ReactNode) => {
        return getRoleLevel(userRole) >= getRoleLevel(minRole) ? content : null;
      },
      
      // Render based on permission
      renderWithPermission: (permission: string, content: React.ReactNode) => {
        return hasPermission(userRole, permission) ? content : null;
      },
      
      // Render based on multiple permissions
      renderWithPermissions: (permissions: string[], content: React.ReactNode, requireAll: boolean = false) => {
        if (requireAll) {
          return hasAllPermissions(userRole, permissions) ? content : null;
        }
        return hasAnyPermission(userRole, permissions) ? content : null;
      },
    };
  }, [userRole, permissions]);
}
