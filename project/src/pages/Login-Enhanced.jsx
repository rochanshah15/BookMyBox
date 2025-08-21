import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../api.jsx';
import GoogleLoginButton from '../components/common/GoogleLoginButton.jsx';
import { animations, gradientText, shadows, glassMorphism } from '../utils/animations';
import { EnhancedButton, EnhancedCard, EnhancedInput } from '../components/common/EnhancedComponents';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, logout, generalError: authContextGeneralError } = useAuth();
  const navigate = useNavigate();

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -100])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])

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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    logout();

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        const userRole = result.user?.role;
        if (userRole) {
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
          navigate('/user-dashboard');
        }
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else if (result.error) {
          setErrors({ general: result.error });
        } else {
          setErrors({ general: 'An unknown error occurred during login.' });
        }
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setErrors({ general: 'Network error or unhandled exception. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Background Elements */}
      <motion.div 
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
        style={{ y: y2 }}
      />

      <motion.div
        {...animations.pageTransition}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <EnhancedCard glass className="p-8 backdrop-blur-xl border-0">
          {/* Enhanced Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className={`mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center ${shadows.strong} mb-6`}
            >
              <motion.div
                {...animations.iconPulse}
                className="text-white font-bold text-xl"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
            </motion.div>
            
            <motion.h2 
              className={`text-3xl font-bold mb-3 ${gradientText}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Welcome Back
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Sign in to your BookMyBox account and continue your sports journey
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Enhanced Error Display */}
            {(errors.general || authContextGeneralError) && (
              <motion.div
                {...animations.slideInUp}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 backdrop-blur-sm"
              >
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {errors.general || authContextGeneralError}
                </p>
              </motion.div>
            )}

            <div className="space-y-5">
              {/* Enhanced Email Field */}
              <motion.div {...animations.formField}>
                <EnhancedInput
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail size={18} />}
                  error={errors.email}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </motion.div>

              {/* Enhanced Password Field */}
              <motion.div {...animations.formField}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`
                        w-full px-4 py-3 pl-10 pr-12
                        bg-white dark:bg-gray-800 
                        border border-gray-300 dark:border-gray-600 
                        rounded-xl 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-300
                        ${shadows.soft}
                        hover:${shadows.medium}
                        focus:${shadows.strong}
                        ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}
                      `}
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <motion.button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Options Row */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Enhanced Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <EnhancedButton
                type="submit"
                disabled={loading}
                loading={loading}
                icon={!loading && <ArrowRight size={20} />}
                className="w-full"
                size="lg"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </EnhancedButton>
            </motion.div>

            {/* Enhanced Divider */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </motion.div>

            {/* Enhanced Google Login */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <GoogleLoginButton 
                setLoading={setLoading} 
                setErrors={setErrors} 
              />
            </motion.div>

            {/* Enhanced Footer */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </motion.div>
          </motion.form>
        </EnhancedCard>
      </motion.div>
    </div>
  );
};

export default Login;
