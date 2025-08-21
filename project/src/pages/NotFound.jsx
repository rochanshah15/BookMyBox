import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Sparkles } from 'lucide-react';
import { EnhancedButton } from '../components/common/EnhancedComponents';
import { animations, gradientText, glassMorphism } from '../utils/animations';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div 
                    className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Floating Sports Icons */}
                <div className="absolute -top-20 -left-20 opacity-20">
                    <motion.div
                        animate={{ 
                            rotate: [0, 360],
                            y: [0, -20, 0]
                        }}
                        transition={{ 
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-6xl"
                    >
                        🏀
                    </motion.div>
                </div>
                
                <div className="absolute -top-10 -right-20 opacity-20">
                    <motion.div
                        animate={{ 
                            rotate: [360, 0],
                            y: [0, -15, 0]
                        }}
                        transition={{ 
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="text-5xl"
                    >
                        ⚽
                    </motion.div>
                </div>

                <div className="absolute -bottom-10 -left-10 opacity-20">
                    <motion.div
                        animate={{ 
                            rotate: [0, -360],
                            y: [0, -10, 0]
                        }}
                        transition={{ 
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        className="text-4xl"
                    >
                        🏸
                    </motion.div>
                </div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`${glassMorphism} p-8 rounded-3xl border border-white/20`}
                >
                    {/* 404 Number */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20,
                            delay: 0.2 
                        }}
                        className={`text-8xl md:text-9xl font-bold mb-6 leading-none ${gradientText}`}
                    >
                        404
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Oops! Page Not Found
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                    >
                        The page you're looking for seems to have wandered off the field. 
                        Let's get you back to booking amazing sports facilities!
                    </motion.p>

                    {/* Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mb-8"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Here's what you can do:
                        </h3>
                        <div className="grid gap-3 text-left">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span>Check the URL for typos</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                <span>Browse our available sports boxes</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                                <span>Visit our homepage to start fresh</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link to="/">
                            <EnhancedButton
                                variant="primary"
                                size="lg"
                                icon={<Home size={20} />}
                                className="min-w-[200px]"
                            >
                                Go to Homepage
                            </EnhancedButton>
                        </Link>
                        
                        <Link to="/boxes">
                            <EnhancedButton
                                variant="secondary"
                                size="lg"
                                icon={<Search size={20} />}
                                className="min-w-[200px]"
                            >
                                Browse Sports Boxes
                            </EnhancedButton>
                        </Link>
                    </motion.div>

                    {/* Help Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-8 text-sm text-gray-500 dark:text-gray-400"
                    >
                        <p>Still having trouble? Our AI chatbot in the bottom-right corner can help!</p>
                    </motion.div>
                </motion.div>

                {/* Sparkles Animation */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                rotate: `${i * 45}deg`,
                                transformOrigin: '0 200px'
                            }}
                            animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.25,
                                ease: "easeInOut"
                            }}
                        >
                            <Sparkles size={16} className="text-blue-400/50" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
