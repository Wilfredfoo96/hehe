"use client";

import { useAllUsers } from "@/hooks/useConvex";
import Link from "next/link";
import Image from "next/image";

export default function UsersPage() {
  const users = useAllUsers();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Users</h1>
            <p className="text-gray-600">Browse all user profiles in the system</p>
          </div>

          {users === undefined ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No users found.</p>
              <Link 
                href="/profile" 
                className="mt-4 inline-block text-blue-600 hover:text-blue-700 underline"
              >
                Create the first profile
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  {/* Profile Image */}
                  {user.profile_img && (
                    <div className="text-center mb-4">
                      <Image 
                        src={user.profile_img} 
                        alt={user.display_name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover mx-auto"
                      />
                    </div>
                  )}
                  
                  {/* User Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {user.display_name}
                    </h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {user.bio}
                    </p>
                  )}

                  {/* Company Info */}
                  {user.company_name && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Company:</span> {user.company_name}
                      </p>
                      {user.company_type && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Type:</span> {user.company_type}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Location */}
                  {(user.city || user.country) && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {[user.city, user.state, user.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <div className="text-center">
                    <Link
                      href={`/profile/view?username=${user.username}`}
                      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/profile"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create New Profile
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
