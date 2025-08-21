import React from 'react';
import { motion } from 'framer-motion';
import { animations, glassMorphism, shadows } from '../../utils/animations';

// Enhanced Button Component
export const EnhancedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  loading = false,
  ...props 
}) => {
  const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 rounded-xl";
  
  const variants = {
    primary: `bg-gradient-to-r from-blue-600 to-purple-600 text-white ${shadows.medium} hover:${shadows.strong}`,
    secondary: `bg-white/10 backdrop-blur-sm text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800`,
    ghost: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(variant === 'primary' ? animations.buttonPrimary : animations.buttonSecondary)}
      disabled={loading}
      {...props}
    >
      {loading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          {...animations.spinner}
        >
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
        </motion.div>
      )}
      <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && <span>{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
};

// Enhanced Card Component
export const EnhancedCard = ({ 
  children, 
  className = '', 
  hover = true, 
  float = false,
  glass = false,
  ...props 
}) => {
  const baseClasses = `rounded-2xl p-6 transition-all duration-300 ${
    glass ? glassMorphism : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
  } ${shadows.soft}`;

  const motionProps = {
    ...(hover ? animations.cardHover : {}),
    ...(float ? animations.cardFloat : {})
  };

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Input Component
export const EnhancedInput = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <motion.div 
      className="space-y-2"
      {...animations.formField}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 ${icon ? 'pl-10' : ''} 
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-600 
            rounded-xl 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-300
            ${shadows.soft}
            hover:${shadows.medium}
            focus:${shadows.strong}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

// Enhanced Modal Component
export const EnhancedModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      {...animations.modalOverlay}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className={`relative w-full ${sizes[size]} ${glassMorphism} rounded-2xl p-6`}
        {...animations.modalContent}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
};

// Enhanced Loading Component
export const EnhancedLoader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full`}
        {...animations.spinner}
      />
      <motion.p 
        className="mt-4 text-gray-600 dark:text-gray-400"
        {...animations.fadeIn}
      >
        {text}
      </motion.p>
    </div>
  );
};

// Enhanced Badge Component
export const EnhancedBadge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  pulse = false 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]} ${sizes[size]}
        ${shadows.soft}
      `}
      {...(pulse ? animations.iconPulse : {})}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.span>
  );
};

// Enhanced Stats Card
export const EnhancedStatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  gradient = 'blue' 
}) => {
  const gradients = {
    blue: 'from-blue-500 to-purple-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
    purple: 'from-purple-500 to-pink-500'
  };

  return (
    <EnhancedCard hover className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradients[gradient]} opacity-10 rounded-full -mr-10 -mt-10`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <motion.p 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              {...animations.countUp}
            >
              {value}
            </motion.p>
          </div>
          <motion.div 
            className={`p-3 rounded-xl bg-gradient-to-br ${gradients[gradient]} text-white`}
            {...animations.iconFloat}
          >
            {icon}
          </motion.div>
        </div>
        {trend && (
          <motion.div 
            className="mt-4 flex items-center text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">vs last month</span>
          </motion.div>
        )}
      </div>
    </EnhancedCard>
  );
};
