import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Map, ChevronDown } from 'lucide-react'
import { useAuth } from '../../api.jsx'
import ThemeToggle from './ThemeToggle'
import NearbyBoxesMap from '../maps/NearbyBoxesMap'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  // Handle scroll effect for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const getDashboardRoute = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard'
      case 'owner':
        return '/owner-dashboard'
      default:
        return '/user-dashboard'
    }
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Browse Boxes', path: '/boxes' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 }
  }

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0, y: -20 },
    animate: { opacity: 1, height: 'auto', y: 0 },
    exit: { opacity: 0, height: 0, y: -20 }
  }

  const userMenuVariants = {
    initial: { opacity: 0, scale: 0.95, y: -10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 }
  }

  return (
    <>
      <motion.header 
        variants={headerVariants}
        initial="initial"
        animate="animate"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-gray-800/20' 
            : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                <span className="font-bold text-lg">BMB</span>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex flex-col"
              >
                <span className="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  BookMyBox
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Sports Made Easy
                </span>
              </motion.div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                  >
                    <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {item.name}
                    </span>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
              
              <motion.button
                onClick={() => setShowMap(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 border border-transparent hover:border-blue-200/50 dark:hover:border-blue-800/50"
              >
                <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Map size={18} />
                  </motion.div>
                  <span>Nearby Boxes</span>
                </span>
              </motion.button>
            </nav>

            {/* Enhanced Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ThemeToggle />
              </motion.div>
              
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 px-4 py-2.5 rounded-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-800 dark:text-white text-sm">
                        {user?.name}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        user?.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                        user?.role === 'owner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        variants={userMenuVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute right-0 mt-2 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 overflow-hidden"
                      >
                        <Link
                          to={getDashboardRoute()}
                          className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50/70 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <User size={16} className="text-white" />
                            </div>
                            <span className="font-medium">Dashboard</span>
                          </div>
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 transition-all duration-200 group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <User size={16} className="text-white" />
                            </div>
                            <span className="font-medium">Profile</span>
                          </div>
                        </Link>
                        <hr className="my-2 border-gray-200/50 dark:border-gray-700/50" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-red-50/70 dark:hover:bg-red-900/20 transition-all duration-200 group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <LogOut size={16} className="text-white" />
                            </div>
                            <span className="font-medium">Logout</span>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-4 py-2 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl border border-transparent hover:border-blue-300/30"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ThemeToggle />
              </motion.div>
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-800/70 text-gray-600 dark:text-gray-300 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="lg:hidden border-t border-gray-200/50 dark:border-gray-700/50 py-4 backdrop-blur-xl"
              >
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    onClick={() => {
                      setShowMap(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-purple-50/70 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                  >
                    <Map size={20} />
                    <span>Nearby Boxes</span>
                  </motion.button>
                  
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Welcome, {user?.name}
                      </div>
                      <Link
                        to={getDashboardRoute()}
                        className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50/70 dark:hover:bg-blue-900/20 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={20} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium py-3 px-4 rounded-xl hover:bg-purple-50/70 dark:hover:bg-purple-900/20 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={20} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium py-3 px-4 rounded-xl hover:bg-red-50/70 dark:hover:bg-red-900/20 transition-all duration-300"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <Link
                        to="/login"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl text-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Nearby Boxes Map */}
      <NearbyBoxesMap
        isOpen={showMap}
        onClose={() => setShowMap(false)}
      />
    </>
  )
}

export default Header