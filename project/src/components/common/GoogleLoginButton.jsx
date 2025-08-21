import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginButton = ({ setLoading, setErrors }) => {
  const navigate = useNavigate();

  // Check if Google OAuth is configured
  const isGoogleConfigured = import.meta.env.VITE_GOOGLE_CLIENT_ID && 
                           import.meta.env.VITE_GOOGLE_CLIENT_ID !== "your_actual_client_id_here";

  // Debug logging
  React.useEffect(() => {
    console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    console.log('Current Origin:', window.location.origin);
    console.log('Is Google Configured:', isGoogleConfigured);
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setErrors({});
    
    try {
      // Decode the JWT credential to get user info
      const googleUser = jwtDecode(credentialResponse.credential);
      
      // Send to your backend
      const response = await fetch('http://localhost:8000/api/user/google-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: googleUser.email,
          first_name: googleUser.given_name,
          last_name: googleUser.family_name || '',
          google_id: googleUser.sub,
          profile_picture: googleUser.picture
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Store tokens and user data
        localStorage.setItem('accessToken', result.tokens.access);
        localStorage.setItem('refreshToken', result.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        if (result.needs_onboarding) {
          // Redirect to onboarding flow
          navigate('/onboarding', { 
            state: { 
              user: result.user,
              isNewUser: result.is_new_user 
            } 
          });
        } else {
          // Navigate based on user role
          const userRole = result.user?.role;
          switch (userRole) {
            case 'admin':
              navigate('/admin-dashboard');
              break;
            case 'owner':
              navigate('/owner-dashboard');
              break;
            default:
              navigate('/user-dashboard');
          }
        }
      } else {
        setErrors({ general: result.errors?.detail || 'Google login failed' });
      }
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({ general: 'Failed to process Google login' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setErrors({ general: 'Google login failed. Please try again.' });
  };

  // If Google OAuth is not configured, show a setup message
  if (!isGoogleConfigured) {
    return (
      <div className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-gray-50">
        <svg className="w-5 h-5 mr-2 text-gray-400" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google OAuth Setup Required
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleFailure}
      theme="outline"
      size="large"
      width="100%"
      text="continue_with"
    />
  );
};

export default GoogleLoginButton;
