import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/configDB";

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <div className="w-full py-8 min-h-screen">
                <Container>
                    <div className="text-center mb-8">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto animate-pulse"></div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[...Array(6)].map((_, index) => (
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
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    All Posts
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Browse all posts from our community
                </p>
            </div>

            {/* Posts Grid - Different layout from Home */}
            {posts.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {posts.map((post) => (
                        <PostCard key={post.$id} {...post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg className='w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No posts yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Be the first to create a post!
                    </p>
                </div>
            )}
        </Container>
    </div>
  )
}

export default AllPosts