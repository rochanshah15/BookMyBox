import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, MapPin, Clock } from 'lucide-react'
import { useBox } from '../context/BoxContext'
import Loader from '../components/common/Loader'
import { useAuth } from '../api.jsx'

const Home = () => {
  const { featuredBoxes, popularBoxes, fetchFeaturedBoxes, fetchPopularBoxes } = useBox()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // console.log('Home component mounted. Attempting to fetch data...');
    fetchFeaturedBoxes()
    fetchPopularBoxes()
  }, [])

  const sports = [
    {
      name: 'Cricket',
      icon: '🏏',
      description: 'Box Cricket, Practice Nets',
      color: 'bg-green-500'
    },
    {
      name: 'Football',
      icon: '⚽',
      description: '5-a-side, 7-a-side',
      color: 'bg-blue-500'
    },
    {
      name: 'Tennis',
      icon: '🎾',
      description: 'Singles & Doubles Courts',
      color: 'bg-yellow-500'
    },
    {
      name: 'Badminton',
      icon: '🏸',
      description: 'Indoor Courts',
      color: 'bg-red-500'
    },
    {
      name: 'Basketball',
      icon: '🏀',
      description: 'Half & Full Courts',
      color: 'bg-orange-500'
    },
    {
      name: 'Pickleball',
      icon: '🏓',
      description: 'Modern Courts',
      color: 'bg-purple-500'
    }
  ]

  const stats = [
    { number: '500+', label: 'Sports Boxes' },
    { number: '50+', label: 'Cities' },
    { number: '10K+', label: 'Happy Users' },
    { number: '4.8', label: 'Average Rating' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container-max section-padding py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Book Your Perfect
                <span className="block text-accent-500">Sports Box</span>
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed">
                Discover and book premium sports facilities near you. 
                From cricket boxes to tennis courts, find your game today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/boxes"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Explore Boxes</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 text-center"
                >
                  Join Now
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <img
                  src="https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg"
                  alt="Sports facility"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl font-bold text-accent-500">{stat.number}</div>
                      <div className="text-sm text-primary-100">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-20 bg-white">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Sport
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From cricket to basketball, find the perfect facility for your favorite sport
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map((sport, index) => (
              <motion.div
                key={sport.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className={`${sport.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4`}>
                  {sport.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{sport.name}</h3>
                <p className="text-gray-600">{sport.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Boxes */}
      <section className="py-20 bg-gray-50">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Boxes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked premium sports facilities with top ratings
            </p>
          </motion.div>

          {featuredBoxes.length === 0 ? (
            <div className="flex justify-center">
              <Loader text="Loading featured boxes..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBoxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg flex items-center space-x-1">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{box.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{box.name}</h3>
                      <span className="text-primary-600 font-bold">₹{box.price}/hr</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{box.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Users size={16} className="mr-1" />
                      <span className="text-sm">Up to {box.capacity} players</span>
                    </div>
                    <Link
                      to={`/boxes/${box.id}`}
                      className="w-full btn-primary text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Boxes */}
      <section className="py-20 bg-white">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Most popular sports boxes based on user bookings and ratings
            </p>
          </motion.div>

          {popularBoxes.length === 0 ? (
            <div className="flex justify-center">
              <Loader text="Loading popular boxes..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularBoxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-accent-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Trending
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{box.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{box.sport}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-bold text-sm">₹{box.price}/hr</span>
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-500 fill-current mr-1" />
                        <span className="text-sm">{box.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-max section-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Play?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of sports enthusiasts who trust BookMyBox for their game time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/boxes"
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Browse All Boxes
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
                >
                  Create Account
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home