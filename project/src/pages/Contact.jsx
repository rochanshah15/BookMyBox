import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Sparkles, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from 'emailjs-com';
import { animations, gradientText, shadows, glassMorphism, useScrollAnimation } from '../utils/animations';
import { EnhancedButton, EnhancedCard, EnhancedInput, EnhancedBadge } from '../components/common/EnhancedComponents';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({}); // State for validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear the error for the field being changed
    setErrors(prev => ({
      ...prev,
      [name]: '' // Clear specific error when input changes
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Name validation: required and at least 2 characters
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full Name must be at least 2 characters.';
      isValid = false;
    }

    // Email validation using a common regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Phone number validation: optional but if provided, must be a valid 10-digit Indian number
    // Regex for Indian mobile numbers: starts with 6, 7, 8, or 9, followed by 9 digits
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone.trim() && !indianPhoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number (e.g., 9876543210).';
      isValid = false;
    }
    // If phone number was mandatory, uncomment the following:
    // if (!formData.phone.trim()) {
    //   newErrors.phone = 'Phone number is required.';
    //   isValid = false;
    // } else if (!indianPhoneRegex.test(formData.phone)) {
    //   newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    //   isValid = false;
    // }


    // Subject validation: required
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
      isValid = false;
    }

    // Message validation: required and at least 10 characters
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
      isValid = false;
    }

    setErrors(newErrors); // Update the errors state
    return isValid; // Return overall validity
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    if (!validateForm()) {
      setSubmitMessage('Please correct the errors in the form before submitting.');
      // Keep isSubmitting false as we didn't attempt submission
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(''); // Clear previous messages before new attempt

    // EmailJS Service ID, Template ID, and Public Key
    const serviceID = 'service_rbqoepu';
    const templateID = 'template_j10de66';
    const publicKey = 'vGIRnQaLowt7o31fg';

    try {
      await emailjs.sendForm(serviceID, templateID, e.target, publicKey);
      setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
      // Clear form data on successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general'
      });
      setErrors({}); // Clear all validation errors on success
    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitMessage('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@bookmybox.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 98253 27667',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'D/89 Ananya Society, Ahmedabad, Gujarat - 380050',
      description: 'Come say hello at our office'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Mon-Fri: 8am-6pm, Sat: 9am-4pm',
      description: 'We\'re here to help'
    }
  ];

  const faqItems = [
    {
      question: 'How do I book a sports box?',
      answer: 'Simply browse our available boxes, select your preferred date and time, and complete the booking with payment. You\'ll receive instant confirmation.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 2 hours before the scheduled time for a full refund. Cancellations within 2 hours incur a 50% charge.'
    },
    {
      question: 'How do I become a partner facility?',
      answer: 'Contact us through the form below or call our partnership team. We\'ll guide you through the onboarding process and requirements.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets for secure and convenient payments.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Enhanced Background Elements */}
      <motion.div 
        className="fixed top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
        {...animations.cardFloat}
      />
      <motion.div 
        className="fixed bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-blue-500/10 rounded-full blur-3xl"
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
              <MessageCircle size={20} />
              <span className="font-semibold">We're Here to Help</span>
            </motion.div>
            
            <h1 className={`text-5xl lg:text-7xl font-bold mb-8 ${gradientText}`}>
              Get in Touch
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Contact Info Cards */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                variants={animations.staggerItem}
                className="group"
              >
                <EnhancedCard hover className="p-8 text-center h-full">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <info.icon size={32} className="text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-200 font-semibold mb-2">{info.details}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
                </EnhancedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Contact Form & Map */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Enhanced Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <EnhancedCard className="p-8 backdrop-blur-xl border-0">
                <div className="flex items-center mb-8">
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MessageCircle className="text-white" size={24} />
                  </motion.div>
                  <h2 className={`text-3xl font-bold ${gradientText}`}>Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Full Name *
                      </label>
                      <EnhancedInput
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <motion.p 
                          className="text-red-500 text-xs mt-2 flex items-center"
                          {...animations.slideInUp}
                        >
                          <AlertCircle size={14} className="mr-1" />
                          {errors.name}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Phone Number
                      </label>
                      <EnhancedInput
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <motion.p 
                          className="text-red-500 text-xs mt-2 flex items-center"
                          {...animations.slideInUp}
                        >
                          <AlertCircle size={14} className="mr-1" />
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Email Address *
                    </label>
                    <EnhancedInput
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <motion.p 
                        className="text-red-500 text-xs mt-2 flex items-center"
                        {...animations.slideInUp}
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Inquiry Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="technical">Technical Issue</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Subject *
                    </label>
                    <EnhancedInput
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Brief subject of your message"
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <motion.p 
                        className="text-red-500 text-xs mt-2 flex items-center"
                        {...animations.slideInUp}
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {errors.subject}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className={`w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none ${errors.message ? 'border-red-500' : ''}`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <motion.p 
                        className="text-red-500 text-xs mt-2 flex items-center"
                        {...animations.slideInUp}
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {errors.message}
                      </motion.p>
                    )}
                  </div>

                  <EnhancedButton
                    type="submit"
                    loading={isSubmitting}
                    className="w-full group"
                    size="lg"
                    icon={<Send size={20} className="group-hover:translate-x-1 transition-transform" />}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </EnhancedButton>
                  
                  {submitMessage && (
                    <motion.div 
                      className={`text-center p-4 rounded-xl flex items-center justify-center space-x-2 ${
                        submitMessage.includes('successfully') 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}
                      {...animations.slideInUp}
                    >
                      {submitMessage.includes('successfully') ? (
                        <CheckCircle size={20} />
                      ) : (
                        <AlertCircle size={20} />
                      )}
                      <span>{submitMessage}</span>
                    </motion.div>
                  )}
                </form>
              </EnhancedCard>
            </motion.div>

            {/* Enhanced Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Enhanced Map */}
              <EnhancedCard className="p-0 overflow-hidden">
                <div className="h-80 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                    {...animations.cardFloat}
                  />
                  <div className="text-center relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MapPin size={64} className="text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className={`text-2xl font-bold mb-2 ${gradientText}`}>Visit Our Office</h3>
                    <p className="text-gray-600 dark:text-gray-300">Mumbai Headquarters</p>
                    <EnhancedBadge variant="primary" className="mt-4">
                      Interactive Map Coming Soon
                    </EnhancedBadge>
                  </div>
                </div>
              </EnhancedCard>

              {/* Enhanced Office Hours */}
              <EnhancedCard hover className="p-6">
                <div className="flex items-center mb-6">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl mr-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Clock className="text-white" size={20} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Office Hours</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { days: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
                    { days: 'Saturday', hours: '9:00 AM - 4:00 PM' },
                    { days: 'Sunday', hours: 'Closed' }
                  ].map((schedule, index) => (
                    <motion.div 
                      key={schedule.days}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{schedule.days}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{schedule.hours}</span>
                    </motion.div>
                  ))}
                </div>
              </EnhancedCard>

              {/* Enhanced Quick Links */}
              <EnhancedCard hover className="p-6">
                <div className="flex items-center mb-6">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mr-4"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="text-white" size={20} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Links</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Frequently Asked Questions', href: '#faq' },
                    { title: 'Support Center', href: '/support' },
                    { title: 'Partner with Us', href: '/partnership' },
                    { title: 'Careers', href: '/careers' }
                  ].map((link, index) => (
                    <motion.a
                      key={link.title}
                      href={link.href}
                      className="block p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="flex items-center justify-between">
                        {link.title}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.a>
                  ))}
                </div>
              </EnhancedCard>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced FAQ Section */}
      <motion.section 
        className="py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        id="faq"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            {...animations.slideInUp}
            {...useScrollAnimation()}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={20} />
              <span className="font-semibold">Common Questions</span>
            </motion.div>
            
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${gradientText}`}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find quick answers to common questions about BookMyBox
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="space-y-6"
              variants={animations.staggerContainer}
              initial="initial"
              whileInView="animate"
            >
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={animations.staggerItem}
                  className="group"
                >
                  <EnhancedCard hover className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </EnhancedCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;