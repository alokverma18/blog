import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../appwrite/auth';
import { login } from '../store/authSlice';

function OAuthSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let isProcessing = false;
    
    const handleOAuthCallback = async () => {
      if (isProcessing) return; // Prevent duplicate calls
      isProcessing = true;
      try {
        const userData = await authService.handleOAuthSuccess();
        
        if (userData) {
          // Clean user data to avoid Redux serialization warnings
          const cleanUserData = {
            $id: userData.$id,
            name: userData.name,
            email: userData.email,
            $createdAt: userData.$createdAt,
            $updatedAt: userData.$updatedAt,
            status: userData.status,
            emailVerification: userData.emailVerification
          };
          dispatch(login(cleanUserData));
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}

export default OAuthSuccess;
