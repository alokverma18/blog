import React, { useState, useEffect } from 'react'
import { Container, Button, Input } from '../components'
import { useSelector, useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { login } from '../store/authSlice'

function Profile() {
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [message, setMessage] = useState('')

  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || ''
      })
    }
  }, [userData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const updatedUser = await authService.updateName(formData.name)
      dispatch(login(updatedUser))
      setEditMode(false)
      setMessage('Profile updated successfully')
    } catch (error) {
      setMessage('Error updating profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

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
              <p className="text-primary-100">Manage your account information</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Avatar Section */}
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                  {userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : userData.email[0].toUpperCase()}
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userData.name || 'User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-6">
                  <div>
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Input
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true} // Email cannot be changed
                      placeholder="Enter your email"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email address cannot be changed
                    </p>
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

                {/* Message */}
                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes('Error') 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {message}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex gap-4">
                  {editMode ? (
                    <>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        bgColor="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                        onClick={() => {
                          setEditMode(false)
                          setFormData({
                            name: userData.name || '',
                            email: userData.email || ''
                          })
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="flex-1"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Profile
