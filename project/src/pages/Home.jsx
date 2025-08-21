import React, { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, MapPin, Play, Shield, Zap, Heart, Trophy, Clock, Target } from 'lucide-react'
import { useBox } from '../context/BoxContext'
import Loader from '../components/common/Loader'
import Chatbot from '../components/common/Chatbot'
import { useAuth } from '../api.jsx'
import useCountAnimation from '../hooks/useCountAnimation'
import { animations, gradientText, shadows, useScrollAnimation, glassMorphism } from '../utils/animations'
import { EnhancedButton, EnhancedCard, EnhancedStatsCard } from '../components/common/EnhancedComponents'

const Home = () => {
  const { featuredBoxes, popularBoxes, fetchFeaturedBoxes, fetchPopularBoxes } = useBox()
  const { isAuthenticated } = useAuth()
  const [startCounting, setStartCounting] = useState(false)
  const statsRef = useRef(null)

  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const y3 = useTransform(scrollY, [0, 300], [0, -25])

  useEffect(() => {
    fetchFeaturedBoxes()
    fetchPopularBoxes()
  }, [])

  // Enhanced stats data
  const stats = [
    { number: 150, label: 'Sports Boxes', icon: MapPin, color: 'blue' },
    { number: 2500, label: 'Happy Users', icon: Users, color: 'green' },
    { number: 8750, label: 'Total Bookings', icon: Trophy, color: 'orange' },
    { number: 4.8, label: 'Average Rating', icon: Star, color: 'purple' }
  ]

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !startCounting) {
          setStartCounting(true)
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [startCounting])

  const sports = [
    {
      name: 'Cricket',
      icon: '🏏',
      description: 'Box Cricket, Practice Nets',
      gradient: 'from-green-400 to-emerald-600',
      hoverGradient: 'from-green-500 to-emerald-700'
    },
    {
      name: 'Football',
      icon: '⚽',
      description: '5-a-side, 7-a-side',
      gradient: 'from-blue-400 to-blue-600',
      hoverGradient: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Tennis',
      icon: '🎾',
      description: 'Singles & Doubles Courts',
      gradient: 'from-yellow-400 to-orange-500',
      hoverGradient: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'Badminton',
      icon: '🏸',
      description: 'Indoor Courts',
      gradient: 'from-red-400 to-pink-500',
      hoverGradient: 'from-red-500 to-pink-600'
    },
    {
      name: 'Basketball',
      icon: '🏀',
      description: 'Half & Full Courts',
      gradient: 'from-orange-400 to-red-500',
      hoverGradient: 'from-orange-500 to-red-600'
    },
    {
      name: 'Pickleball',
      icon: '🏓',
      description: 'Modern Courts',
      gradient: 'from-purple-400 to-indigo-500',
      hoverGradient: 'from-purple-500 to-indigo-600'
    }
  ]

  // Enhanced Animated Stat Card Component
  const AnimatedStatCard = ({ stat, index, startAnimation }) => {
    const animatedValue = useCountAnimation(stat.number, 2000 + index * 200, startAnimation)
    const IconComponent = stat.icon
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
        className="relative group"
      >
        <EnhancedCard 
          hover 
          className={`text-center p-6 bg-gradient-to-br ${stat.color === 'blue' ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' : 
            stat.color === 'green' ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' :
            stat.color === 'orange' ? 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20' :
            'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'} 
            border-0 backdrop-blur-lg`}
        >
          <motion.div
            className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${
              stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
              stat.color === 'green' ? 'from-green-500 to-green-600' :
              stat.color === 'orange' ? 'from-orange-500 to-orange-600' :
              'from-purple-500 to-purple-600'
            } flex items-center justify-center text-white ${shadows.medium}`}
            {...animations.iconFloat}
          >
            <IconComponent size={20} />
          </motion.div>
          <motion.div 
            className={`text-3xl font-bold mb-2 ${gradientText}`}
            animate={startAnimation ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          >
            {startAnimation ? animatedValue : '0'}
          </motion.div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</div>
        </EnhancedCard>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Enhanced Hero Section with Parallax */}
      <motion.section 
        className="relative pt-20 pb-24 lg:pt-24 lg:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden"
        {...animations.pageTransition}
      >
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
          style={{ y: y2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-300/10 to-cyan-300/10 rounded-full blur-3xl"
          style={{ y: y3 }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              {...animations.slideInLeft}
              {...useScrollAnimation()}
              className="space-y-8"
            >
              <motion.h1 
                className={`text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] pb-2`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className={`${gradientText} leading-[1.1] pb-1 block`}>Book Your Perfect</span>
                <motion.span 
                  className="block text-gray-900 dark:text-white mt-3 leading-[1.1] pb-1"
                  initial={{ opacity: 0, rotateX: -90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Sports Box
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl pt-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Experience premium sports facilities with seamless booking, 
                state-of-the-art equipment, and community-driven experiences.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <EnhancedButton 
                  as={Link} 
                  to="/boxes" 
                  size="lg"
                  icon={<ArrowRight size={20} />}
                  className="min-w-[200px]"
                >
                  Explore Boxes
                </EnhancedButton>
                
                <EnhancedButton 
                  variant="secondary" 
                  size="lg"
                  icon={<Play size={20} />}
                  className="min-w-[200px]"
                >
                  Watch Demo
                </EnhancedButton>
              </motion.div>
            </motion.div>
            
            {/* Right Content - Enhanced Stats Card */}
            <motion.div
              {...animations.slideInRight}
              {...useScrollAnimation()}
              className="relative"
            >
              <EnhancedCard glass className="p-8 backdrop-blur-xl">
                <div className="relative">
                  <img
                    src="http://localhost:8000/media/box_images/pexels-grizzlybear-399187.jpg"
                    alt="Sports Box"
                    className={`w-full h-64 object-cover rounded-2xl mb-6 ${shadows.medium}`}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                </div>
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-4 leading-[1.3] pb-1 ${gradientText}`}>
                    Find Your Perfect Box
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Over <span className="font-bold text-blue-600">1000+</span> sports boxes available across India
                  </p>
                </div>
                
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 gap-4" ref={statsRef}>
                  {stats.map((stat, index) => (
                    <AnimatedStatCard 
                      key={stat.label}
                      stat={stat}
                      index={index}
                      startAnimation={startCounting}
                    />
                  ))}
                </div>
              </EnhancedCard>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Sports Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...animations.slideInUp}
            {...useScrollAnimation()}
            className="text-center mb-20"
          >
            <h2 className={`text-4xl lg:text-5xl font-bold mb-8 leading-[1.2] pb-2 ${gradientText}`}>
              Popular Sports
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Find premium facilities for your favorite sports across multiple cities with professional equipment
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {sports.map((sport, index) => (
              <motion.div
                key={sport.name}
                variants={animations.staggerItem}
                className="group cursor-pointer"
              >
                <EnhancedCard 
                  hover 
                  className="p-8 text-center h-full relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${sport.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <motion.div 
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${sport.gradient} flex items-center justify-center text-4xl mx-auto mb-6 ${shadows.medium} group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    {...animations.iconBounce}
                  >
                    {sport.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 leading-[1.3] pb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sport.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                    {sport.description}
                  </p>
                  
                  <motion.div 
                    className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                  >
                    <EnhancedButton 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      Find {sport.name} Boxes
                    </EnhancedButton>
                  </motion.div>
                </EnhancedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Features Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            {...animations.slideInUp}
            {...useScrollAnimation()}
          >
            <h2 className={`text-4xl lg:text-5xl font-bold mb-8 leading-[1.2] pb-2 ${gradientText}`}>
              Why Choose BookMyBox?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We provide the best sports facility booking experience with cutting-edge technology and unmatched service
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={animations.staggerItem}>
              <EnhancedCard hover className="text-center h-full p-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  {...animations.iconPulse}
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 leading-[1.3] pb-1 text-gray-900 dark:text-white">
                  Secure Booking
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Advanced security measures ensure your bookings and payments are always protected with industry-standard encryption and fraud protection.
                </p>
              </EnhancedCard>
            </motion.div>

            <motion.div variants={animations.staggerItem}>
              <EnhancedCard hover className="text-center h-full p-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  {...animations.iconBounce}
                >
                  <Zap className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 leading-[1.3] pb-1 text-gray-900 dark:text-white">
                  Instant Confirmation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get immediate booking confirmations with real-time availability updates, instant notifications, and seamless calendar integration.
                </p>
              </EnhancedCard>
            </motion.div>

            <motion.div variants={animations.staggerItem}>
              <EnhancedCard hover className="text-center h-full p-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  {...animations.iconRotate}
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 leading-[1.3] pb-1 text-gray-900 dark:text-white">
                  Community Driven
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join a vibrant community of sports enthusiasts, connect with like-minded players, and participate in tournaments and events.
                </p>
              </EnhancedCard>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Featured Boxes */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...animations.slideInUp}
            {...useScrollAnimation()}
            className="text-center mb-20"
          >
            <h2 className={`text-4xl lg:text-5xl font-bold mb-8 leading-[1.2] pb-2 ${gradientText}`}>
              Featured Boxes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Handpicked premium sports facilities with top ratings, state-of-the-art equipment, and exceptional service
            </p>
          </motion.div>

          {featuredBoxes.length === 0 ? (
            <div className="flex justify-center">
              <Loader text="Loading featured boxes..." />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={animations.staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featuredBoxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  variants={animations.staggerItem}
                  className="group"
                >
                  <EnhancedCard hover className="overflow-hidden p-0 h-full">
                    <div className="relative overflow-visible">
                      <img
                        src={box.image}
                        alt={box.name}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <motion.div 
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center space-x-1 shadow-lg z-20"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-900">{box.rating}</span>
                      </motion.div>

                      <div className="absolute top-3 left-3">
                        <motion.span 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg z-20"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          Featured
                        </motion.span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold leading-[1.3] pb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {box.name}
                        </h3>
                        <span className={`text-xl font-bold ${gradientText}`}>
                          ₹{box.price}/hr
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin size={16} className="mr-2 text-blue-500" />
                          <span className="text-sm">{box.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Users size={16} className="mr-2 text-green-500" />
                          <span className="text-sm">Up to {box.capacity} players</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Target size={16} className="mr-2 text-purple-500" />
                          <span className="text-sm">{box.sport || 'Multi-sport'}</span>
                        </div>
                      </div>

                      <EnhancedButton
                        as={Link}
                        to={`/boxes/${box.id}`}
                        className="w-full"
                        size="md"
                      >
                        View Details
                      </EnhancedButton>
                    </div>
                  </EnhancedCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Enhanced Popular Boxes */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...animations.slideInUp}
            {...useScrollAnimation()}
            className="text-center mb-20"
          >
            <h2 className={`text-4xl lg:text-5xl font-bold mb-8 leading-[1.2] pb-2 ${gradientText}`}>
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Most popular sports boxes based on user bookings, ratings, and community recommendations
            </p>
          </motion.div>

          {popularBoxes.length === 0 ? (
            <div className="flex justify-center">
              <Loader text="Loading popular boxes..." />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={animations.staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {popularBoxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  variants={animations.staggerItem}
                  className="group"
                >
                  <EnhancedCard hover className="overflow-hidden p-0 h-full">
                    <div className="relative overflow-visible">
                      <img
                        src={box.image}
                        alt={box.name}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      <motion.div 
                        className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg z-20 min-w-fit"
                        {...animations.iconPulse}
                      >
                        <Trophy size={10} />
                        <span className="whitespace-nowrap">Trending</span>
                      </motion.div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold leading-[1.3] pb-1 text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {box.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {box.sport || 'Multi-sport facility'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm ${gradientText}`}>
                          ₹{box.price}/hr
                        </span>
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium">{box.rating}</span>
                        </div>
                      </div>
                    </div>
                  </EnhancedCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Enhanced CTA Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background Elements */}
        <motion.div 
          className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative">
          <EnhancedCard glass className="p-12 lg:p-16 backdrop-blur-xl border-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className={`text-4xl lg:text-6xl font-bold mb-10 leading-[1.1] pb-2 ${gradientText}`}
                {...animations.slideInUp}
              >
                Ready to Play?
              </motion.h2>
              
              <motion.p 
                className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Join thousands of sports enthusiasts who trust BookMyBox for their game time. 
                Book your next adventure today!
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <EnhancedButton 
                  as={Link} 
                  to="/boxes" 
                  size="xl"
                  icon={<ArrowRight size={24} />}
                  className="min-w-[250px] text-lg"
                >
                  Browse All Boxes
                </EnhancedButton>
                
                {!isAuthenticated && (
                  <EnhancedButton 
                    as={Link} 
                    to="/signup" 
                    variant="secondary" 
                    size="xl"
                    icon={<Users size={24} />}
                    className="min-w-[250px] text-lg"
                  >
                    Create Account
                  </EnhancedButton>
                )}
              </motion.div>

              {/* Enhanced Trust Indicators */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-3xl font-bold mb-2 leading-[1.2] pb-1 ${gradientText}`}>
                    150+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Premium Facilities
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-3xl font-bold mb-2 leading-[1.2] pb-1 ${gradientText}`}>
                    2.5K+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Happy Members
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-3xl font-bold mb-2 leading-[1.2] pb-1 ${gradientText}`}>
                    8.7K+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Successful Bookings
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-3xl font-bold mb-2 leading-[1.2] pb-1 ${gradientText}`}>
                    4.8★
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Rating
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </EnhancedCard>
        </div>
      </motion.section>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  )
}

export default Home
