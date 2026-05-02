import React, {useEffect, useState, useMemo} from 'react'
import appwriteService from "../appwrite/configDB";
import {Container, PostCard} from '../components'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const { isDark } = useTheme()

    useEffect(() => {
        setLoading(true)
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    const filteredPosts = useMemo(() => {
        if (!searchTerm) return posts
        return posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [posts, searchTerm])

    if (loading) {
        return (
            <div className="w-full py-8 min-h-screen">
                <Container>
                    {/* Hero Skeleton */}
                    <div className="text-center mb-12">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto animate-pulse"></div>
                    </div>
                    
                    {/* Search Skeleton */}
                    <div className="max-w-2xl mx-auto mb-12">
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

    if (posts.length === 0) {
        return (
            <div className="w-full py-16 min-h-screen">
                <Container>
                    <div className="text-center">
                        <div className="mb-8">
                            <svg className='w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' />
                            </svg>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Welcome to Blog Express
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                                Discover amazing stories and insights from our community. Login to start reading or create your own posts.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8 min-h-screen'>
            <Container>
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Discover Amazing Stories
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore insights, tutorials, and experiences from our community of writers
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-12 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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

                {/* Results Count */}
                {searchTerm && (
                    <div className="mb-8">
                        <p className="text-gray-600 dark:text-gray-400">
                            Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} matching "{searchTerm}"
                        </p>
                    </div>
                )}

                {/* Posts Grid */}
                {filteredPosts.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {filteredPosts.map((post) => (
                            <PostCard key={post.$id} {...post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className='w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No posts found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try adjusting your search terms or browse all posts
                        </p>
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

export default Home