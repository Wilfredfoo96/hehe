"use client";

import Link from "next/link";

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/profile"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-lg">👤</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Create/Edit Profile</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set up your user profile</p>
            </div>
          </Link>

          <Link
            href="/users"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-lg">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Browse Users</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View all user profiles</p>
            </div>
          </Link>

                     <Link
             href="/profile/view"
             className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
           >
             <div className="flex-shrink-0">
               <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                 <span className="text-purple-600 dark:text-purple-400 text-lg">🔍</span>
               </div>
             </div>
             <div className="ml-4">
               <h3 className="font-medium text-gray-900 dark:text-white">Search Profiles</h3>
               <p className="text-sm text-gray-600 dark:text-gray-400">Find specific users</p>
             </div>
           </Link>

           <Link
             href="/reels"
             className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
           >
             <div className="flex-shrink-0">
               <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                 <span className="text-orange-600 dark:text-orange-400 text-lg">🎬</span>
               </div>
             </div>
             <div className="ml-4">
               <h3 className="font-medium text-gray-900 dark:text-white">Browse Reels</h3>
               <p className="text-sm text-gray-600 dark:text-gray-400">Watch and share videos</p>
             </div>
           </Link>

          <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400 text-lg">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-600 dark:text-gray-400">Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Information */}
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Getting Started</h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Create Your Profile</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start by creating your user profile with your personal and company information.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Connect with Others</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse other user profiles and connect with people in your industry.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Build Your Network</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use the platform to build professional relationships and grow your business network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
