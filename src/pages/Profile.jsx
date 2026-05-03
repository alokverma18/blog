import React from 'react'
import { Container } from '../components'
import { useSelector } from 'react-redux'

function Profile() {
  const userData = useSelector((state) => state.auth.userData)

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please login to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <p className="text-primary-100">Your account information</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Avatar Section */}
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                  {(() => {
                    if (!userData?.name) return userData.email[0].toUpperCase();
                    const names = userData.name.split(' ');
                    if (names.length >= 2) {
                      return names[0][0] + names[names.length - 1][0];
                    }
                    return userData.name[0].toUpperCase();
                  })()}
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userData.name || 'User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <p className="text-gray-900 dark:text-white">{userData.name || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <p className="text-gray-900 dark:text-white">{userData.email}</p>
                  </div>
                </div>

                {/* Account Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Account ID</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{userData.$id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(userData.$createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Profile
