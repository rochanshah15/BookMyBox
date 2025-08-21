import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Ensure this matches your Django backend's base URL
const API_BASE_URL = 'http://localhost:8000/api'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState(null);

  // Helper function to clear auth state
  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setGeneralError(null);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  // Function to refresh token
  const refreshAuthToken = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (!currentRefreshToken) {
      console.warn("No refresh token available. Cannot refresh.");
      logout();
      return false;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/user/token/refresh/`, { refresh: currentRefreshToken });
      const newAccessToken = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        setGeneralError("Session expired. Please log in again.");
      } else {
        setGeneralError("Failed to refresh session.");
      }
      logout();
      return false;
    }
  }, [logout]);

  // --- FIX 1: MODIFIED fetchUser TO RETURN DATA ---
  // This function now returns the fetched user data, making it more versatile.
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      return null; // <-- RETURN NULL on failure
    }
    try {
      const response = await api.get('/user_profile/my-profile/');  // FIXED: Changed to correct endpoint
      const fetchedUserData = response.data;  // FIXED: No need for .user since CompleteProfileSerializer returns data directly

      setUser(fetchedUserData);
      localStorage.setItem('user', JSON.stringify(fetchedUserData));
      
      return fetchedUserData; // <-- RETURN THE NEW USER DATA

    } catch (error) {
      console.error('Failed to fetch user data with current token:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.warn("Access token invalid. Attempting refresh...");
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          try {
            const retryResponse = await api.get('/user_profile/my-profile/');  // FIXED: Changed to correct endpoint
            const retriedUserData = retryResponse.data;  // FIXED: No need for .user

            setUser(retriedUserData);
            localStorage.setItem('user', JSON.stringify(retriedUserData));

            return retriedUserData; // <-- RETURN THE NEW USER DATA ON RETRY
          } catch (retryError) {
            console.error('Failed to fetch user after token refresh:', retryError);
            logout();
          }
        }
      } else {
        setGeneralError("Failed to load user data.");
      }
      return null; // <-- RETURN NULL on any failure
    }
  }, [refreshAuthToken, logout]);

  // Axios interceptors
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes('/token/refresh/')
        ) {
          originalRequest._retry = true;
          const refreshed = await refreshAuthToken();
          if (refreshed) {
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAuthToken, logout]);

  // Login Function
  const login = async (credentials) => {
    setGeneralError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login/`, credentials);
      const { access, refresh, user: userData } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      const errorData = error.response?.data;
      let errorMessage = 'An unexpected error occurred during login.';
      if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (errorData?.non_field_errors) {
        errorMessage = errorData.non_field_errors[0];
      }
      setGeneralError(errorMessage);
      return { success: false, error: errorMessage, errors: errorData };
    }
  }; 

  // Signup Function
  const signup = async (userData) => {
    setGeneralError(null);
    try {
      const response = await api.post('/user/register/', userData); 
      const { user: registeredUser, tokens } = response.data;
      const { access, refresh } = tokens;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(registeredUser)); 

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(registeredUser);
      
      return { success: true, user: registeredUser };
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      const errorData = err.response?.data;
      let errorMessage = 'An unexpected error occurred during signup.';
      if (errorData) {
        if (errorData.detail) errorMessage = errorData.detail;
        else if (errorData.email) errorMessage = "An account with this email already exists.";
        else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors.join(', ');
        
        setGeneralError(errorMessage);
        return { success: false, error: errorMessage, errors: errorData };
      }
      setGeneralError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // --- FIX 2: MODIFIED fetchUserProfile TO AVOID STALE STATE ---
  // This function now returns the fresh data it gets directly from fetchUser.
  const fetchUserProfile = useCallback(async () => {
    setGeneralError(null);
    const freshUserData = await fetchUser(); // <-- CAPTURE the fresh data
    
    if (freshUserData) {
      return { success: true, data: freshUserData }; // <-- RETURN the fresh data
    } else {
      return { success: false, error: generalError || 'Failed to fetch profile.' };
    }
  }, [fetchUser, generalError]); // <-- REMOVED 'user' dependency

  // Update Profile Function
  const updateProfile = async (profileData) => {
    setGeneralError(null);
    try {
      const response = await api.patch('/user_profile/my-profile/update/', profileData);  // FIXED: Changed to correct endpoint
      const updatedPartialUserData = response.data;  // FIXED: CompleteProfileSerializer returns data directly

      // Merge with existing user data to prevent data loss on partial updates
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const mergedUser = { ...currentUser, ...updatedPartialUserData };

      setUser(mergedUser);
      localStorage.setItem('user', JSON.stringify(mergedUser));

      return { success: true, data: mergedUser };
    } catch (err) {
      console.error('Failed to update user profile:', err.response?.data || err.message);
      const errorData = err.response?.data;
      let errorMessage = 'An unexpected error occurred.';

      if (errorData) {
        if (errorData.detail) errorMessage = errorData.detail;
        else errorMessage = 'Validation error. Please check your inputs.';
        
        setGeneralError(errorMessage);
        return { success: false, error: errorMessage, errors: errorData };
      }
      
      setGeneralError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Initial load to check for token and fetch user
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true); 
      await fetchUser(); 
      setLoading(false); 
    };
    initializeAuth();
  }, [fetchUser]);

  const authContextValue = {
    user,
    loading,
    generalError,
    login,
    signup,
    logout,
    fetchUserProfile,
    updateProfile,
    isAuthenticated: !!user, 
    accessToken,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};