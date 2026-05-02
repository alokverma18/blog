import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/configDB";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import "../components/PostForm/post-content.css";

export default function Post() {
    const [post, setPost] = useState(null);
    const { id } = useParams(); // This is actually the $id now
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (id) {
            appwriteService.getPost(id).then((post) => {
                if (post) {
                    setPost(post);
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [id, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                if (post.featuredImage) {
                    appwriteService.deleteFile(post.featuredImage);
                }
                navigate("/");
            }
        });
    };

    const previewUrl = appwriteService.getFileView(post?.featuredImage);

    return post ? (
        <div className="py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            <Container>
                <div className="w-full mb-6 relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={post.title}
                            className="w-full h-auto max-h-[500px] object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                    <div class='w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                                        <div class='text-center'>
                                            <svg class='w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                            </svg>
                                            <span class='text-gray-500 dark:text-gray-400 text-sm font-medium'>Image Error</span>
                                        </div>
                                    </div>
                                `;
                            }}
                        />
                    ) : (
                        <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <div className="text-center">
                                <svg className='w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">No Image</span>
                            </div>
                        </div>
                    )}

                    {isAuthor && (
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <button 
                                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
                                    title="Edit post"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </Link>
                            <button 
                                className="w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
                                onClick={deletePost}
                                title="Delete post"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 -mt-8 relative z-10">
                    <div className="w-full mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>By {post.userName || 'Anonymous'}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.$createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="prose prose-lg dark:prose-invert max-w-none browser-css">
                        {parse(post.content)}
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}