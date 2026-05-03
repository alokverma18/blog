import React, {useEffect, useState, useMemo} from 'react'
import appwriteService from "../appwrite/configDB";
import {Container, PostCard} from '../components'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import { useSelector } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('login')
    const { isDark } = useTheme()
    const authStatus = useSelector((state) => state.auth.status)
    const { register, handleSubmit } = useForm()

    const handleLogin = async (data) => {
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if(userData) {
                    window.location.reload() // Reload to update auth state
                }
            }
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await authService.loginWithGoogle()
        } catch (error) {
            console.error('Google login failed:', error)
        }
    }

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
            <div className="w-full py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
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
        </div>
        )
    }

    if (!loading && posts.length === 0 && !authStatus) {
        return (
            <div className="w-full py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
                        {/* Left Content - Welcome Message */}
                        <div className="flex-1">
                            <div className="text-center mb-12">
                                <svg className='w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' />
                                </svg>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                    Welcome to Blog Express
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                                    Discover amazing stories and insights from our community. Sign in to start reading or create your own posts.
                                </p>
                            </div>
                        </div>

                        {/* Right Sidebar - Authentication Forms */}
                        <div className="lg:w-[420px]">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 min-h-[400px] flex flex-col">
                                {/* Tabs */}
                                <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab('login')}
                                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                                            activeTab === 'login'
                                                ? 'bg-primary-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('signup')}
                                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                                            activeTab === 'signup'
                                                ? 'bg-primary-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className="flex-1 flex flex-col">
                                    {/* Login Form */}
                                    {activeTab === 'login' && (
                                        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 flex-1 flex flex-col justify-center">
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                {...register("email", {
                                                    required: true,
                                                    validate: {
                                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                                        "Email address must be a valid address",
                                                        }
                                                    })}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-offset-transparent ring-offset-white"
                                                />
                                            <input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...register("password", {
                                                    required: true,
                                                })}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-offset-transparent ring-offset-white"
                                                />
                                            <button
                                                type="submit"
                                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 py-3"
                                            >
                                                Sign In
                                            </button>
                                        </form>
                                    )}

                                    {/* Signup Form */}
                                    {activeTab === 'signup' && (
                                        <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Sign up quickly and securely with Google
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64L3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07L3.66 2.84C.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        Continue with Google
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
        )
    }

    return (
        <div className='w-full py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]'>
            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
                    {/* Left Content - Hero and Posts */}
                    <div className="flex-1">
                        {/* Hero Section */}
                        <div className="text-center mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                Discover Amazing Stories
                            </h1>
                            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Explore insights, tutorials, and experiences from our community of writers
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-10 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                    </div>

                    {/* Right Sidebar - Authentication Forms */}
                    {!authStatus && (
                        <div className="lg:w-[420px]">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 min-h-[400px] flex flex-col">
                                {/* Tabs */}
                                <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab('login')}
                                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                                            activeTab === 'login'
                                                ? 'bg-primary-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('signup')}
                                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                                            activeTab === 'signup'
                                                ? 'bg-primary-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className="flex-1 flex flex-col">
                                    {/* Login Form */}
                                    {activeTab === 'login' && (
                                        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 flex-1 flex flex-col justify-center">
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                {...register("email", {
                                                    required: true,
                                                    validate: {
                                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                                        "Email address must be a valid address",
                                                        }
                                                    })}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-offset-transparent ring-offset-white"
                                                />
                                            <input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...register("password", {
                                                    required: true,
                                                })}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-offset-transparent ring-offset-white"
                                                />
                                            <button
                                                type="submit"
                                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 py-3"
                                            >
                                                Sign In
                                            </button>
                                        </form>
                                    )}

                                    {/* Signup Form */}
                                    {activeTab === 'signup' && (
                                        <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Sign up quickly and securely with Google
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64L3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07L3.66 2.84C.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        Continue with Google
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    )
}

export default Home
