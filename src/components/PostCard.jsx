import React from 'react'
import appwriteService from "../appwrite/configDB"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage, userName, $createdAt}) {
    const previewUrl = appwriteService.getFileView(featuredImage);
    
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
  return (
    <Link to={`/post/${$id}`} className='block group'>
        <div className='w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col'>
            {/* Image Container */}
            <div className='w-full h-48 flex justify-center items-center overflow-hidden bg-gray-100 dark:bg-gray-900'>
                {previewUrl ? (
                    <div className='relative w-full h-full'>
                        <img 
                            src={previewUrl} 
                            alt={title}
                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                    <div class='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                                        <div class='text-center'>
                                            <svg class='w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                            </svg>
                                            <span class='text-gray-500 dark:text-gray-400 text-sm font-medium'>Image Error</span>
                                        </div>
                                    </div>
                                `;
                            }}
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </div>
                ) : (
                    <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                        <div className='text-center'>
                            <svg className='w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                            <span className='text-gray-500 dark:text-gray-400 text-sm font-medium'>No Image</span>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Content Container */}
            <div className='flex flex-col p-5'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white overflow-hidden leading-tight mb-2' style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {title}
                </h2>
                
                {/* Author and Date */}
                <div className='flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1'>
                    <span>By {userName || 'Anonymous'}</span>
                    <span className='mx-2'>•</span>
                    <span>{formatDate($createdAt)}</span>
                </div>
                
                {/* Read more indicator */}
                <div className='flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200'>
                    <span>Read more</span>
                    <svg className='w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default PostCard