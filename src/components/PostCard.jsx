import React from 'react'
import appwriteService from "../appwrite/configDB"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage}) {
    const previewUrl = appwriteService.getFileView(featuredImage);
    
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4 h-80 flex flex-col'>
            <div className='w-full h-48 flex justify-center items-center mb-4 overflow-hidden'>
                {previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt={title}
                        className='rounded-xl object-cover w-full h-full'
                    />
                ) : (
                    <div className='w-full h-full bg-gray-200 rounded-xl flex items-center justify-center'>
                        <span className='text-gray-500 text-sm'>No Image</span>
                    </div>
                )}
            </div>
            <div className='flex-grow flex items-start'>
                <h2 className='text-xl font-bold overflow-hidden' style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>{title}</h2>
            </div>
        </div>
    </Link>
  )
}


export default PostCard