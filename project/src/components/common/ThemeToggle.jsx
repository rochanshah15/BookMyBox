import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative inline-flex items-center justify-center
                w-10 h-10 rounded-lg
                bg-gray-100 hover:bg-gray-200 
                dark:bg-gray-800 dark:hover:bg-gray-700
                text-gray-600 dark:text-gray-300
                transition-all duration-200
                ${className}
            `}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-5 h-5">
                <Sun 
                    size={20} 
                    className={`
                        absolute inset-0 transition-all duration-300
                        ${isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}
                    `}
                />
                <Moon 
                    size={20} 
                    className={`
                        absolute inset-0 transition-all duration-300
                        ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}
                    `}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
