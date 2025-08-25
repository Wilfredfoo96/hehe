"use client";

import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";

interface PermissionGateProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallback?: ReactNode;
}

interface RoleBasedProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ 
  children, 
  allowedRoles = [], 
  fallback = null 
}: PermissionGateProps) {
  const { user } = useUser();
  
  if (!user) {
    return fallback;
  }

  // Check if user has any of the allowed roles
  const hasRole = allowedRoles.some(role => 
    user.publicMetadata.role === role
  );

  if (!hasRole) {
    return fallback;
  }

  return <>{children}</>;
}

export function AdminOnly({ children, fallback }: RoleBasedProps) {
  return (
    <PermissionGate allowedRoles={["admin"]} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function ModeratorOnly({ children, fallback }: RoleBasedProps) {
  return (
    <PermissionGate allowedRoles={["admin", "moderator"]} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function UserOnly({ children, fallback }: RoleBasedProps) {
  return (
    <PermissionGate allowedRoles={["admin", "moderator", "user"]} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}
