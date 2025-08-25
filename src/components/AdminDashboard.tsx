"use client";

import { usePermissions, useRoleAccess, usePermissionGroups } from "@/hooks/useRoles";
import { PermissionGate, AdminOnly, ModeratorOnly } from "./PermissionGate";
import { ROLES, PERMISSIONS } from "@/lib/roles";
import { useState } from "react";

export function AdminDashboard() {
  const { role, roleInfo, permissions, roleLevel } = usePermissions();
  const { isAdmin, isModerator, canManageUsers, canModerateContent } = useRoleAccess();
  const permissionGroups = usePermissionGroups();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user can access admin dashboard
  if (!isAdmin && !isModerator) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
              Access Denied
            </h1>
            <p className="text-red-700 dark:text-red-300">
              You don't have permission to access the admin dashboard. 
              This area is restricted to administrators and moderators only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome, {roleInfo?.name}! You have {permissions.length} permissions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {[
              { id: 'overview', name: 'Overview', permission: null },
              { id: 'users', name: 'User Management', permission: 'users:read' },
              { id: 'content', name: 'Content Management', permission: 'content:moderate' },
              { id: 'system', name: 'System Settings', permission: 'system:settings' },
              { id: 'roles', name: 'Role Management', permission: 'users:write' },
            ].map((tab) => (
              <PermissionGate key={tab.id} permissions={tab.permission ? [tab.permission] : []}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.name}
                </button>
              </PermissionGate>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'system' && <SystemTab />}
          {activeTab === 'roles' && <RolesTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { role, roleInfo, permissions } = usePermissions();
  const { isAdmin, isModerator } = useRoleAccess();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Role Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Your Role</h3>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{roleInfo?.name}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{roleInfo?.description}</p>
        </div>

        {/* Permissions Count */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h3 className="font-medium text-green-900 dark:text-green-200 mb-2">Permissions</h3>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{permissions.length}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Active permissions</p>
        </div>

        {/* Access Level */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <h3 className="font-medium text-purple-900 dark:text-purple-200 mb-2">Access Level</h3>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {isAdmin ? 'Full' : isModerator ? 'Moderate' : 'Limited'}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">System access</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <PermissionGate permissions={['users:read']}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View Users
            </button>
          </PermissionGate>
          
          <PermissionGate permissions={['content:moderate']}>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Moderate Content
            </button>
          </PermissionGate>
          
          <AdminOnly>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              System Settings
            </button>
          </AdminOnly>
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">User Management</h2>
      
      <PermissionGate permissions={['users:read']}>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-300">
            User management interface would go here. You can view, edit, and manage user accounts.
          </p>
        </div>
      </PermissionGate>
    </div>
  );
}

function ContentTab() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Content Management</h2>
      
      <PermissionGate permissions={['content:moderate']}>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-300">
            Content moderation interface would go here. You can review, approve, and manage content.
          </p>
        </div>
      </PermissionGate>
    </div>
  );
}

function SystemTab() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Settings</h2>
      
      <AdminOnly>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-300">
            System configuration interface would go here. Only administrators can access this area.
          </p>
        </div>
      </AdminOnly>
    </div>
  );
}

function RolesTab() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Role Management</h2>
      
      <PermissionGate permissions={['users:write']}>
        <div className="space-y-4">
          {Object.values(ROLES).map((role) => (
            <div key={role.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{role.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{role.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Level: {role.level} • Permissions: {role.permissions.length}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {role.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PermissionGate>
    </div>
  );
}
