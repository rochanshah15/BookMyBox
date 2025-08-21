import { motion } from 'framer-motion'
import { Target, Users, Award, Zap, Heart, Shield, Sparkles, Star, ArrowRight } from 'lucide-react'
import { animations, gradientText, shadows, glassMorphism, useScrollAnimation } from '../utils/animations'
import { EnhancedButton, EnhancedCard, EnhancedBadge } from '../components/common/EnhancedComponents'
import useCountAnimation from '../hooks/useCountAnimation'
import { Link } from 'react-router-dom'

const About = () => {
  const features = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make sports accessible to everyone by providing easy booking of premium sports facilities across India.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a community of sports enthusiasts who can connect, play, and grow together.'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'All our partner facilities are verified and maintain the highest standards of quality and safety.'
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book your favorite sports box in seconds with our streamlined booking process.'
    },
    {
      icon: Heart,
      title: 'Passion Driven',
      description: 'Created by sports lovers, for sports lovers. We understand what players need.'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your data and payments are protected with industry-leading security measures.'
    }
  ]

  const team = [
    {
      name: 'Rochan shah',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      bio: 'Tech enthusiast with expertise in building scalable platforms.'
    },
    {
      name: 'khush shah',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
      bio: 'passionate about sports and technology.'
    },
    {
      name: 'pushya shah',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
      bio: 'Sports facility management expert with 10+ years experience.'
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Marketing',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
      bio: 'Digital marketing specialist passionate about sports and community building.'
    }
  ]

  const AnimatedStatCard = ({ stat, index }) => {
    const count = useCountAnimation(stat.number, 2000, true);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="text-center"
        {...useScrollAnimation()}
      >
        <EnhancedCard hover glass className="p-6 backdrop-blur-xl border-0">
          <div className={`text-4xl lg:text-5xl font-bold mb-2 ${gradientText}`}>
            {count}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
        </EnhancedCard>
      </motion.div>
    );
  };

  const stats = [
    { number: '500+', label: 'Sports Facilities' },
    { number: '50+', label: 'Cities' },
    { number: '10K+', label: 'Happy Users' },
    { number: '1M+', label: 'Bookings Completed' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Enhanced Background Elements */}
      <motion.div 
        className="fixed top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
        {...animations.cardFloat}
      />
      <motion.div 
        className="fixed bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-blue-500/10 rounded-full blur-3xl"
        {...animations.cardFloat}
        transition={{ delay: 1, ...animations.cardFloat.transition }}
      />
      
      {/* Enhanced Hero Section */}
      <motion.section 
        className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        {...animations.pageTransition}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center max-w-4xl mx-auto relative z-10"
            {...animations.slideInUp}
            {...useScrollAnimation()}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={20} />
              <span className="font-semibold">India's #1 Sports Booking Platform</span>
            </motion.div>
            
            <h1 className={`text-5xl lg:text-7xl font-bold mb-8 ${gradientText}`}>
              About BookMyBox
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12">
              We're revolutionizing how people discover, book, and enjoy sports facilities. 
              Our platform connects sports enthusiasts with premium venues across India, 
              making it easier than ever to play your favorite sport.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/boxes">
                <EnhancedButton
                  size="lg"
                  className="group"
                  icon={<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                >
                  Explore Facilities
                </EnhancedButton>
              </Link>
              <Link to="/contact">
                <EnhancedButton
                  variant="secondary"
                  size="lg"
                  className="group"
                  icon={<Heart size={20} className="group-hover:text-red-500 transition-colors" />}
                >
                  Join Our Community
                </EnhancedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Stats Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...animations.slideInUp}
          >
            <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${gradientText}`}>
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trusted by thousands of sports enthusiasts across India
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {stats.map((stat, index) => (
              <AnimatedStatCard key={stat.label} stat={stat} index={index} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Features Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            {...animations.slideInUp}
            {...useScrollAnimation()}
          >
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${gradientText}`}>
              Why Choose BookMyBox?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're more than just a booking platform. We're your partner in making sports accessible and enjoyable.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={animations.staggerItem}
                className="group"
              >
                <EnhancedCard hover className="p-8 text-center h-full">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon size={36} className="text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </EnhancedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Team Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            {...animations.slideInUp}
            {...useScrollAnimation()}
          >
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${gradientText}`}>
              Meet Our Dream Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Passionate individuals working together to transform the sports booking experience in India.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                variants={animations.staggerItem}
                className="group"
              >
                <EnhancedCard hover className="p-6 text-center h-full">
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-blue-100 dark:ring-blue-900/30 group-hover:ring-blue-200 dark:group-hover:ring-blue-800/50 transition-all duration-300"
                    />
                    <motion.div
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Star size={16} className="text-white fill-current" />
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {member.name}
                  </h3>
                  <EnhancedBadge variant="primary" size="sm" className="mb-4">
                    {member.role}
                  </EnhancedBadge>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {member.bio}
                  </p>
                </EnhancedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Story Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`text-4xl lg:text-5xl font-bold mb-8 ${gradientText}`}>
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="text-lg">
                  BookMyBox was born from a simple frustration: finding and booking quality sports facilities was unnecessarily complicated. Our founders, all avid sports players, experienced firsthand the challenges of coordinating games with friends.
                </p>
                <p className="text-lg">
                  In 2025, we set out to solve this problem by creating a platform that would make sports booking as easy as ordering food online. We started with a handful of cricket boxes in Mumbai and have since expanded to over 500 facilities across 50+ cities.
                </p>
                <p className="text-lg">
                  Today, BookMyBox is India's leading sports facility booking platform, trusted by thousands of players and facility owners. But we're just getting started – our vision is to make sports accessible to every Indian, in every city, at every skill level.
                </p>
              </div>
              
              <motion.div 
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <EnhancedBadge variant="primary" size="lg">Founded in 2023</EnhancedBadge>
                <EnhancedBadge variant="secondary" size="lg">500+ Facilities</EnhancedBadge>
                <EnhancedBadge variant="primary" size="lg">50+ Cities</EnhancedBadge>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <EnhancedCard className="p-0 overflow-hidden">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg"
                    alt="Sports facility"
                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div 
                    className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                  >
                    <h3 className="text-xl font-bold mb-2">Premium Sports Facilities</h3>
                    <p className="text-sm opacity-90">Experience the best sports infrastructure across India</p>
                  </motion.div>
                </div>
              </EnhancedCard>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                #1
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced CTA Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800" />
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          {...animations.cardFloat}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"
          {...animations.cardFloat}
          transition={{ delay: 1, ...animations.cardFloat.transition }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center text-white">
          <motion.div
            className="max-w-4xl mx-auto"
            {...animations.slideInUp}
            {...useScrollAnimation()}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Heart size={20} className="text-red-400" />
              <span className="font-semibold">Join Our Growing Community</span>
            </motion.div>
            
            <h2 className="text-4xl lg:text-6xl font-bold mb-8">
              Ready to Play?
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 mb-12 leading-relaxed">
              Whether you're a player looking for your next game or a facility owner wanting to reach more customers, we're here to help you succeed.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              variants={animations.staggerContainer}
              initial="initial"
              whileInView="animate"
            >
              <motion.div variants={animations.staggerItem}>
                <Link to="/boxes">
                  <EnhancedButton
                    size="xl"
                    className="bg-white text-blue-600 hover:bg-gray-100 group"
                    icon={<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                  >
                    Start Playing Today
                  </EnhancedButton>
                </Link>
              </motion.div>
              
              <motion.div variants={animations.staggerItem}>
                <Link to="/contact">
                  <EnhancedButton
                    variant="secondary"
                    size="xl"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm group"
                    icon={<Users size={20} className="group-hover:scale-110 transition-transform" />}
                  >
                    Partner With Us
                  </EnhancedButton>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default About