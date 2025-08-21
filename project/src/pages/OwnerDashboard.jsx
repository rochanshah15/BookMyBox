// Enhanced OwnerDashboard.jsx

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, TrendingUp, Calendar, DollarSign, Users, Star, Clock, BarChart3, AlertCircle, CheckCircle, Activity, Target, Info, CreditCard, Sparkles, Building, Award } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, Filler,
} from 'chart.js';

import AddBoxForm from '../components/boxes/AddBoxForm';
import ViewBoxModal from '../components/boxes/ViewBoxModal';
import { useAuth, api } from '../api.jsx';
import { useBox } from '../context/BoxContext';
import { 
  EnhancedRevenueTrend, 
  EnhancedSportDistribution, 
  BookingActivityChart, 
  PeakHoursChart, 
  MonthlySpendingChart 
} from '../components/common/AdvancedCharts';
import { animations, gradientText, shadows, glassMorphism, useScrollAnimation } from '../utils/animations';
import { EnhancedButton, EnhancedCard, EnhancedBadge } from '../components/common/EnhancedComponents';
import useCountAnimation from '../hooks/useCountAnimation';

// ChartJS Registration
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, Filler);

// Enhanced helper component for sections that don't have backend data yet
const Placeholder = ({ text, icon: Icon = AlertCircle }) => (
  <motion.div 
    className="text-center py-16"
    {...animations.slideInUp}
  >
    <EnhancedCard className="max-w-md mx-auto p-8 text-center">
      <motion.div 
        className="text-gray-400 mb-4"
        {...animations.iconBounce}
      >
        <Icon size={48} className="mx-auto" />
      </motion.div>
      <p className="text-gray-500 dark:text-gray-400">{text}</p>
    </EnhancedCard>
  </motion.div>
);

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBoxModal, setShowAddBoxModal] = useState(false);
  const [showEditBoxModal, setShowEditBoxModal] = useState(false);
  const [showViewBoxModal, setShowViewBoxModal] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { refreshAll } = useBox();

  // Fetch all dashboard data
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/owner_dashboard/stats/');
      setDashboardData(response.data);
    } catch (error) {
      setError("Failed to fetch dashboard data. Please try again later.");
      setDashboardData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchAllData();
    }
  }, [user?.id, fetchAllData]);

  // Success handler for the AddBoxForm
  const handleAddBoxSuccess = () => {
    setShowAddBoxModal(false);
    fetchAllData();
    refreshAll();
  };

  // Success handler for the EditBoxForm
  const handleEditBoxSuccess = () => {
    setShowEditBoxModal(false);
    setSelectedBox(null);
    fetchAllData();
    refreshAll();
  };

  const handleViewBox = (box) => {
    setSelectedBox(box);
    setShowViewBoxModal(true);
  };

  const handleEditBox = (box) => {
    setSelectedBox(box);
    setShowEditBoxModal(true);
  };

  // Data derivation from API
  const {
    total_revenue = 0,
    total_bookings = 0,
    active_boxes_count = 0,
    pending_boxes_count = 0,
    rejected_boxes_count = 0,
    avg_rating = '0.0',
    revenue_chart_labels = [],
    revenue_chart_data = [],
    bookings_chart_labels = [],
    bookings_chart_data = [],
    sports_distribution = {},
    recent_bookings = [],
    all_owner_boxes = []
  } = dashboardData || {};

  // Enhanced Animated Stats Card Component
  const AnimatedStatsCard = ({ stat, index }) => {
    const countValue = stat.title === 'Total Revenue' 
      ? total_revenue 
      : stat.title === 'Avg Rating' 
        ? avg_rating 
        : stat.value;
        
    const count = useCountAnimation(countValue, 2000, true);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="group"
      >
        <EnhancedCard hover className="p-6 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl -translate-y-8 translate-x-8"
            {...animations.cardFloat}
          />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {stat.title}
              </p>
              <p className={`text-3xl font-bold ${gradientText}`}>
                {stat.title === 'Total Revenue' ? `₹${count}` : count}
              </p>
            </div>
            <motion.div 
              className={`p-4 rounded-2xl ${stat.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <stat.icon size={32} className={`${stat.color.replace('bg-', 'text-')}`} />
            </motion.div>
          </div>
        </EnhancedCard>
      </motion.div>
    );
  };

  // UI Data & Options
  const stats = [
    { title: 'Total Revenue', value: parseFloat(total_revenue).toLocaleString(), icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Bookings', value: total_bookings, icon: Calendar, color: 'bg-blue-500' },
    { title: 'Active Boxes', value: active_boxes_count, icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'Avg Rating', value: avg_rating, icon: Star, color: 'bg-orange-500' }
  ];

  const revenueData = {
    labels: revenue_chart_labels,
    datasets: [{ 
      label: 'Revenue (₹)', 
      data: revenue_chart_data, 
      borderColor: 'rgb(16, 185, 129)', 
      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
      tension: 0.4, 
      fill: true 
    }],
  };

  const bookingsData = {
    labels: bookings_chart_labels,
    datasets: [{ 
      label: 'Bookings', 
      data: bookings_chart_data, 
      backgroundColor: 'rgba(59, 130, 246, 0.8)', 
      borderRadius: 4 
    }],
  };

  const sportsData = {
    labels: Object.keys(sports_distribution),
    datasets: [{ 
      data: Object.values(sports_distribution), 
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'], 
      borderWidth: 0 
    }],
  };
  
  const chartOptions = { 
    responsive: true, 
    plugins: { legend: { position: 'top' } }, 
    scales: { y: { beginAtZero: true } } 
  };
  
  const doughnutOptions = { 
    responsive: true, 
    plugins: { legend: { position: 'bottom' } } 
  };

  // Enhanced render logic
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          {...animations.slideInUp}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md mx-auto p-8"
          {...animations.slideInUp}
        >
          <EnhancedCard className="p-8 text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 dark:text-red-400 font-medium mb-6">{error}</p>
            <EnhancedButton onClick={() => window.location.reload()}>
              Try Again
            </EnhancedButton>
          </EnhancedCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20 overflow-x-hidden">
      {/* Enhanced Background Elements */}
      <motion.div 
        className="fixed top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-3xl"
        {...animations.cardFloat}
      />
      <motion.div 
        className="fixed bottom-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-r from-pink-400/10 to-blue-500/10 rounded-full blur-3xl"
        {...animations.cardFloat}
        transition={{ delay: 1, ...animations.cardFloat.transition }}
      />

      <div className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <motion.div 
            className="mb-8 sm:mb-12"
            {...animations.pageTransition}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                  <motion.div
                    className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl self-start"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Building size={24} className="text-white sm:w-8 sm:h-8" />
                  </motion.div>
                  <div>
                    <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 ${gradientText}`}>
                      Welcome back, {user?.first_name || user?.email?.split('@')[0] || 'Owner'}!
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 flex items-center">
                      <Sparkles size={16} className="mr-2 text-blue-500 sm:w-5 sm:h-5" />
                      Manage your sports facilities and track performance
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 sm:space-x-4"
              >
                <EnhancedButton
                  onClick={() => setShowAddBoxModal(true)}
                  icon={<Plus size={18} />}
                  className="group w-full sm:w-auto"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Add New Box</span>
                </EnhancedButton>
                
                {pending_boxes_count > 0 && (
                  <EnhancedCard className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 p-4">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                          {pending_boxes_count} box{pending_boxes_count > 1 ? 'es' : ''} pending
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          Awaiting approval
                        </p>
                      </div>
                    </div>
                  </EnhancedCard>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12"
            variants={animations.staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {stats.map((stat, index) => (
              <AnimatedStatsCard key={stat.title} stat={stat} index={index} />
            ))}
          </motion.div>

          {/* Enhanced Tabs Navigation */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <EnhancedCard className="p-0 overflow-hidden backdrop-blur-xl border-0">
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <nav className="flex flex-wrap gap-1 px-4 sm:px-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                  {[
                    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
                    { id: 'boxes', label: 'My Boxes', icon: <Building size={18} /> },
                    { id: 'bookings', label: 'Bookings', icon: <Calendar size={18} /> },
                    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm lg:text-base transition-all duration-300 rounded-t-xl whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <span className={activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : ''}>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                          layoutId="activeTabIndicator"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div 
                    className="space-y-8"
                    {...animations.slideInUp}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <EnhancedCard className="p-6">
                        <h4 className={`font-bold text-lg mb-4 ${gradientText}`}>Revenue Trend</h4>
                        {revenue_chart_data.length > 0 ? (
                          <Line data={revenueData} options={chartOptions} />
                        ) : (
                          <Placeholder text="No revenue data available" icon={TrendingUp} />
                        )}
                      </EnhancedCard>
                      
                      <EnhancedCard className="p-6">
                        <h4 className={`font-bold text-lg mb-4 ${gradientText}`}>Weekly Bookings</h4>
                        {bookings_chart_data.length > 0 ? (
                          <Bar data={bookingsData} options={chartOptions} />
                        ) : (
                          <Placeholder text="No booking data available" icon={Calendar} />
                        )}
                      </EnhancedCard>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <EnhancedCard className="p-6">
                          <h4 className={`font-bold text-lg mb-6 ${gradientText}`}>Recent Bookings</h4>
                          <div className="space-y-3">
                            {recent_bookings.length > 0 ? recent_bookings.slice(0, 5).map((booking, index) => (
                              <motion.div 
                                key={booking.id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {booking.user_name || 'Customer'}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {booking.box_name} • {new Date(booking.date).toLocaleDateString()}
                                  </p>
                                  {booking.time_slot && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                      {booking.time_slot}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold text-lg ${gradientText}`}>
                                    ₹{booking.amount}
                                  </p>
                                  <EnhancedBadge variant="primary" size="sm">
                                    Confirmed
                                  </EnhancedBadge>
                                </div>
                              </motion.div>
                            )) : (
                              <Placeholder text="No recent bookings" icon={Calendar} />
                            )}
                          </div>
                        </EnhancedCard>
                      </div>
                      
                      <EnhancedCard className="p-6">
                        <h4 className={`font-bold text-lg mb-4 ${gradientText}`}>Sports Distribution</h4>
                        {sportsData.labels.length > 0 ? (
                          <Doughnut data={sportsData} options={doughnutOptions} />
                        ) : (
                          <Placeholder text="No sports data available" icon={Activity} />
                        )}
                      </EnhancedCard>
                    </div>
                  </motion.div>
                )}

                {/* Boxes Tab */}
                {activeTab === 'boxes' && (
                  <motion.div 
                    className="space-y-6"
                    {...animations.slideInUp}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={`text-2xl font-bold ${gradientText}`}>My Sports Boxes</h3>
                      <EnhancedButton
                        onClick={() => setShowAddBoxModal(true)}
                        icon={<Plus size={20} />}
                      >
                        Add New Box
                      </EnhancedButton>
                    </div>
                    
                    {all_owner_boxes.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {all_owner_boxes.map((box, index) => (
                          <motion.div 
                            key={box.id}
                            variants={animations.staggerItem}
                            className="group"
                          >
                            <EnhancedCard hover className="p-4 sm:p-6 h-full">
                              <div className="relative mb-4">
                                <img
                                  src={
                                    box.image 
                                      ? (box.image.startsWith('http') 
                                          ? box.image 
                                          : `http://localhost:8000${box.image}`)
                                      : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
                                  }
                                  alt={box.name}
                                  className="w-full h-40 sm:h-48 object-cover rounded-xl"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80'
                                  }}
                                />
                                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                                  <EnhancedBadge 
                                    variant={
                                      box.status === 'approved' ? 'success' : 
                                      box.status === 'pending' ? 'warning' : 'danger'
                                    }
                                    size="sm"
                                  >
                                    {box.status}
                                  </EnhancedBadge>
                                </div>
                              </div>
                              
                              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                                {box.name}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 mb-3">
                                {box.location}
                              </p>
                              <p className={`text-xl font-bold mb-4 ${gradientText}`}>
                                ₹{box.price}/hour
                              </p>
                              
                              <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                                <EnhancedButton 
                                  variant="secondary" 
                                  size="sm" 
                                  icon={<Eye size={14} />}
                                  onClick={() => handleViewBox(box)}
                                  className="w-full sm:w-auto"
                                >
                                  <span className="hidden sm:inline">View</span>
                                  <span className="sm:hidden">View Details</span>
                                </EnhancedButton>
                                <EnhancedButton 
                                  variant="secondary" 
                                  size="sm" 
                                  icon={<Edit size={14} />}
                                  onClick={() => handleEditBox(box)}
                                  className="w-full sm:w-auto"
                                >
                                  <span className="hidden sm:inline">Edit</span>
                                  <span className="sm:hidden">Edit Box</span>
                                </EnhancedButton>
                              </div>
                            </EnhancedCard>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <Placeholder text="No boxes found. Add your first sports box!" icon={Building} />
                    )}
                  </motion.div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                  <motion.div 
                    className="space-y-6"
                    {...animations.slideInUp}
                  >
                    <h3 className={`text-2xl font-bold ${gradientText}`}>Recent Bookings</h3>
                    {recent_bookings.length > 0 ? (
                      <div className="space-y-4">
                        {recent_bookings.map((booking, index) => (
                          <motion.div 
                            key={booking.id}
                            variants={animations.staggerItem}
                          >
                            <EnhancedCard hover className="p-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {booking.user_name || 'Customer'}
                                  </h4>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {booking.box_name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-500">
                                    {new Date(booking.date).toLocaleDateString()} • {booking.time_slot}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-xl font-bold ${gradientText}`}>
                                    ₹{booking.amount}
                                  </p>
                                  <EnhancedBadge variant="primary" size="sm">
                                    Confirmed
                                  </EnhancedBadge>
                                </div>
                              </div>
                            </EnhancedCard>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <Placeholder text="No bookings found" icon={Calendar} />
                    )}
                  </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <motion.div 
                    className="space-y-8"
                    {...animations.slideInUp}
                  >
                    <h3 className={`text-xl sm:text-2xl font-bold ${gradientText}`}>Business Analytics</h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                      <EnhancedCard className="p-4 sm:p-6">
                        <h4 className={`font-bold text-base sm:text-lg mb-4 ${gradientText}`}>Revenue Analytics</h4>
                        {revenue_chart_data.length > 0 ? (
                          <Line data={revenueData} options={chartOptions} />
                        ) : (
                          <Placeholder text="No revenue analytics available" icon={TrendingUp} />
                        )}
                      </EnhancedCard>
                      
                      <EnhancedCard className="p-4 sm:p-6">
                        <h4 className={`font-bold text-base sm:text-lg mb-4 ${gradientText}`}>Booking Trends</h4>
                        {bookings_chart_data.length > 0 ? (
                          <Bar data={bookingsData} options={chartOptions} />
                        ) : (
                          <Placeholder text="No booking trends available" icon={BarChart3} />
                        )}
                      </EnhancedCard>
                    </div>
                  </motion.div>
                )}
              </div>
            </EnhancedCard>
          </motion.div>
        </div>
      </div>

      {/* Add Box Modal */}
      <AddBoxForm 
        isOpen={showAddBoxModal} 
        onClose={() => setShowAddBoxModal(false)} 
        onSuccess={handleAddBoxSuccess} 
      />

      {/* Edit Box Modal */}
      <AddBoxForm 
        isOpen={showEditBoxModal} 
        onClose={() => setShowEditBoxModal(false)} 
        onSuccess={handleEditBoxSuccess}
        editMode={true}
        boxData={selectedBox}
      />

      {/* View Box Modal */}
      {showViewBoxModal && selectedBox && (
        <ViewBoxModal 
          isOpen={showViewBoxModal}
          onClose={() => setShowViewBoxModal(false)}
          box={selectedBox}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;