import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MapPin, Building, BriefcaseBusiness, UserCheck } from 'lucide-react';

const OnboardingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isNewUser } = location.state || {};
  
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    role: user?.role || 'user',
    business_name: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    if (formData.role === 'owner' && !formData.business_name) {
      newErrors.business_name = 'Business name is required for property owners';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/user/complete-onboarding/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(result.user));
        
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
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: 'Failed to complete onboarding. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'Sports Player', icon: UserCheck },
    { value: 'owner', label: 'Facility Owner', icon: Building },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-12 w-12 bg-primary-500 rounded-lg flex items-center justify-center"
          >
            <span className="text-white font-bold text-xl">BMB</span>
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isNewUser ? 'Welcome to BookMyBox! ' : ''}
            Just a few more details to get started
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3"
            >
              <p className="text-sm text-red-600">{errors.general}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="+91 98765 43210"
                  disabled={loading}
                />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  rows={3}
                  className={`input-field pl-10 resize-none ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Mumbai, Maharashtra, India"
                  disabled={loading}
                />
              </div>
              {errors.location && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.location}
                </motion.p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Name Field (Conditional) */}
            {formData.role === 'owner' && (
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Business Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BriefcaseBusiness className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="business_name"
                    name="business_name"
                    type="text"
                    value={formData.business_name}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.business_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Elite Sports Complex"
                    disabled={loading}
                  />
                </div>
                {errors.business_name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.business_name}
                  </motion.p>
                )}
              </div>
            )}
          </div>

          <div>
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Complete Setup'
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
