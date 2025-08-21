import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Building, BriefcaseBusiness } from 'lucide-react'
import { useAuth } from '../api.jsx'
import GoogleLoginButton from '../components/common/GoogleLoginButton.jsx'

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    location: '',
    role: 'user',
    business_name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showconfirm_password, setShowconfirm_password] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  // FIX: Destructure 'signup' instead of 'register'
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    if (name === 'email' && errors.email && errors.email.includes("already exists")) {
        setErrors(prev => ({ ...prev, email: '' }));
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required'
    }
    
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password'
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required'
    }

    if (formData.role === 'owner' && !formData.business_name) {
      newErrors.business_name = 'Business name is required for property owners'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})
    
    try {
      // FIX: Call 'signup' instead of 'register'
      const result = await signup(formData)
      
      if (result.success) {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in to continue.' 
          } 
        })
      } else {
        if (result.error && typeof result.error === 'object') {
            const mappedErrors = {};
            for (const key in result.error) {
                if (key === 'non_field_errors' || key === 'detail') {
                    mappedErrors.general = Array.isArray(result.error[key]) ? result.error[key].join(', ') : result.error[key];
                } else {
                    mappedErrors[key] = Array.isArray(result.error[key]) ? result.error[key].join(', ') : result.error[key];
                }
            }
            setErrors(mappedErrors);
        } else {
          setErrors({ general: result.error || 'Registration failed. Please try again.' })
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: 'user', label: 'User', icon: User },
    { value: 'owner', label: 'Property Owner', icon: Building },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us to get started with your journey
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
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.first_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="John"
                    disabled={loading}
                  />
                </div>
                {errors.first_name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.first_name}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`input-field ${errors.last_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Doe"
                  disabled={loading}
                />
                {errors.last_name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.last_name}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
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

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showconfirm_password ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`input-field pl-10 pr-10 ${errors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowconfirm_password(!showconfirm_password)}
                    disabled={loading}
                  >
                    {showconfirm_password ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.confirm_password}
                  </motion.p>
                )}
              </div>
            </div>
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
                'Create Account'
              )}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <div>
            <GoogleLoginButton 
              setLoading={setLoading} 
              setErrors={setErrors} 
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default Signup;