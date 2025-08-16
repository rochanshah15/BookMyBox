import { motion } from 'framer-motion'
import { Target, Users, Award, Zap, Heart, Shield } from 'lucide-react'

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
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      bio: 'Former national cricket player with 15+ years in sports management.'
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
      bio: 'Tech enthusiast with expertise in building scalable platforms.'
    },
    {
      name: 'Amit Patel',
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

  const stats = [
    { number: '500+', label: 'Sports Facilities' },
    { number: '50+', label: 'Cities' },
    { number: '10,000+', label: 'Happy Users' },
    { number: '1M+', label: 'Bookings Completed' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About BookMyBox
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              We're revolutionizing how people discover, book, and enjoy sports facilities. 
              Our platform connects sports enthusiasts with premium venues across India, 
              making it easier than ever to play your favorite sport.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BookMyBox?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're more than just a booking platform. We're your partner in making sports accessible and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={32} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Passionate individuals working together to transform the sports booking experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  BookMyBox was born from a simple frustration: finding and booking quality sports facilities was unnecessarily complicated. Our founders, all avid sports players, experienced firsthand the challenges of coordinating games with friends.
                </p>
                <p>
                  In 2023, we set out to solve this problem by creating a platform that would make sports booking as easy as ordering food online. We started with a handful of cricket boxes in Mumbai and have since expanded to over 500 facilities across 50+ cities.
                </p>
                <p>
                  Today, BookMyBox is India's leading sports facility booking platform, trusted by thousands of players and facility owners. But we're just getting started – our vision is to make sports accessible to every Indian, in every city, at every skill level.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg"
                alt="Sports facility"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-primary-600 bg-opacity-20 rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-max section-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Join the BookMyBox Community
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Whether you're a player looking for your next game or a facility owner wanting to reach more customers, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/boxes" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                Start Playing
              </a>
              <a href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                Partner With Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About