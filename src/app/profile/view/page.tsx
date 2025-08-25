"use client";

import { useState, useEffect } from "react";
import { useUserByUsername } from "@/hooks/useConvex";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProfileViewPage() {
  const [username, setUsername] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const user = useUserByUsername(searchUsername);
  const searchParams = useSearchParams();
  
  // Check for username in URL params on component mount
  useEffect(() => {
    const usernameParam = searchParams.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
      setSearchUsername(usernameParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSearchUsername(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">View Profile</h1>
            <p className="text-gray-600">Search for a user profile by username</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username to search"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </form>

          {/* Profile Display */}
          {searchUsername && (
            <div>
              {user === undefined ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading profile...</p>
                </div>
              ) : user === null ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No profile found for username: <strong>{searchUsername}</strong></p>
                  <Link 
                    href="/profile" 
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700 underline"
                  >
                    Create a new profile
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Display Name</label>
                        <p className="mt-1 text-gray-900">{user.display_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <p className="mt-1 text-gray-900">{user.username}</p>
                      </div>
                      {user.bio && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Bio</label>
                          <p className="mt-1 text-gray-900">{user.bio}</p>
                        </div>
                      )}
                      {user.profile_img && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                          <img 
                            src={user.profile_img} 
                            alt="Profile" 
                            className="mt-2 w-24 h-24 rounded-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Information */}
                  {(user.company_name || user.company_type || user.company_number) && (
                    <div className="border-b border-gray-200 pb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.company_name && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <p className="mt-1 text-gray-900">{user.company_name}</p>
                          </div>
                        )}
                        {user.company_type && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Company Type</label>
                            <p className="mt-1 text-gray-900">{user.company_type}</p>
                          </div>
                        )}
                        {user.company_number && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Company Number</label>
                            <p className="mt-1 text-gray-900">{user.company_number}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Address Information */}
                  {(user.address || user.city || user.state || user.postal || user.country) && (
                    <div className="pb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.address && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Street Address</label>
                            <p className="mt-1 text-gray-900">{user.address}</p>
                          </div>
                        )}
                        {user.city && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <p className="mt-1 text-gray-900">{user.city}</p>
                          </div>
                        )}
                        {user.state && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">State/Province</label>
                            <p className="mt-1 text-gray-900">{user.state}</p>
                          </div>
                        )}
                        {user.postal && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Postal/ZIP Code</label>
                            <p className="mt-1 text-gray-900">{user.postal}</p>
                          </div>
                        )}
                        {user.country && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <p className="mt-1 text-gray-900">{user.country}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span> {new Date(user.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/profile"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create/Edit Profile
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
