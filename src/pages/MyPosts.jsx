import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container, PostCard, Button } from '../components'
import appwriteService from '../appwrite/configDB'
import { Query } from 'appwrite'
import { useTheme } from '../context/ThemeContext.jsx'

function MyPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { isDark } = useTheme()
  const userData = useSelector((state) => state.auth.userData)

  useEffect(() => {
    if (userData) {
      setLoading(true)
      appwriteService.getPosts([Query.equal("userId", userData.$id)]).then((posts) => {
        if (posts) {
          setPosts(posts.documents)
        }
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    }
  }, [userData])

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [posts, searchTerm])

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please login to view your posts</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
        <Container>
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse"></div>
          </div>
          
          {/* Search Skeleton */}
          <div className="max-w-2xl mb-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Post Cards Skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, index) => (
              <div key={index} className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse'>
                <div className='h-48 bg-gray-200 dark:bg-gray-700'></div>
                <div className='p-6'>
                  <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3'></div>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='w-full py-8 min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Posts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage and view all your published posts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {posts.filter(post => post.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {posts.filter(post => post.status === 'inactive').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Drafts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <svg className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <Link to="/add-post">
            <Button className="px-6 py-3">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Button>
          </Link>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} matching "{searchTerm}"
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredPosts.map((post) => (
              <div key={post.$id} className="relative group">
                <PostCard {...post} />
                
                {/* Quick Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex gap-1">
                    <Link
                      to={`/edit-post/${post.$id}`}
                      className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      title="Edit post"
                    >
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className='w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No posts found' : 'No posts yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all posts'
                : 'Start by creating your first blog post'
              }
            </p>
            {!searchTerm && (
              <Link to="/add-post">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Post
                </Button>
              </Link>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default MyPosts
