import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, api } from '../api.jsx'; // Import 'api' from your Auth context file
import { useBooking } from '../context/BookingContext';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import {
  Calendar,
  Clock,
  CreditCard,
  Trophy,
  Heart,
  Users,
  CheckCircle,
  XCircle,
  Info,
  Clock as ClockCounterClockwise,
  TrendingUp,
  Target,
  Activity,
  BarChart3,
  Sparkles,
  Star,
  MapPin
} from 'lucide-react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  EnhancedSportDistribution,
  BookingActivityChart,
  PeakHoursChart,
  MonthlySpendingChart,
} from '../components/common/AdvancedCharts';
import { animations, gradientText, shadows, glassMorphism, useScrollAnimation } from '../utils/animations';
import { EnhancedButton, EnhancedCard, EnhancedBadge } from '../components/common/EnhancedComponents';
import Badge from '../components/common/Badge';
import GamificationStats from '../components/common/GamificationStats';


// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBooking();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [userGameStats, setUserGameStats] = useState(null);
  const [favoriteBoxes, setFavoriteBoxes] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [gamificationLoading, setGamificationLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);

  // Fetch Analytics Data (memoized)
  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    setAnalyticsLoading(true);
    try {
      const response = await api.get(`/dashboard/analytics/`);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      toast.error('Failed to load analytics data.');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [user]);

  // Fetch Achievements (memoized)
  const fetchAchievements = useCallback(async () => {
    if (!user) return;
    setAchievementsLoading(true);
    try {
      const response = await api.get(`/dashboard/achievements/`);
      setAchievements(response.data.achievements || response.data || []);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      toast.error('Failed to load achievements.');
    } finally {
      setAchievementsLoading(false);
    }
  }, [user]);

  // Fetch Gamification Stats (memoized)
  const fetchGamificationStats = useCallback(async () => {
    if (!user) return;
    setGamificationLoading(true);
    try {
      const response = await api.get(`/dashboard/gamification-stats/`);
      setUserGameStats(response.data);
    } catch (err) {
      console.error('Error fetching gamification stats:', err);
      // Don't show error toast for this as it's optional feature
    } finally {
      setGamificationLoading(false);
    }
  }, [user]);

  // Fetch Favorite Boxes (memoized)
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    setFavoritesLoading(true);
    try {
      const response = await api.get(`/dashboard/favorites/`);
      console.log("FAVORITES DATA:", JSON.stringify(response.data, null, 2));
      setFavoriteBoxes(response.data);
    } catch (err) {
      console.error('Error fetching favorite boxes:', err);
      toast.error('Failed to load favorite boxes.');
    } finally {
      setFavoritesLoading(false);
    }
  }, [user]);

  const removeFavorite = useCallback(async (boxId) => {
    if (!user) return;
    
    try {
      await api.delete(`/dashboard/favorites/${boxId}/remove/`);
      toast.success('Box removed from favorites successfully!');
      // Refresh the favorites list
      fetchFavorites();
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove box from favorites.');
    }
  }, [user, fetchFavorites]);


  // useEffect to call all dashboard data fetches
  useEffect(() => {
    if (user && user.id) {
      fetchBookings(user.id);
      fetchAnalytics();
      fetchAchievements();
      fetchGamificationStats();
      fetchFavorites();
    }
  }, [user, fetchBookings, fetchAnalytics, fetchAchievements, fetchGamificationStats, fetchFavorites]);

  // useEffect for handling favorite-added event
  useEffect(() => {
    const handler = () => fetchFavorites();
    window.addEventListener('favorite-added', handler);
    return () => window.removeEventListener('favorite-added', handler);
  }, [fetchFavorites]);


  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Open Cancel Modal
  const openCancelModal = (booking) => {
    setSelectedBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  // Close Cancel Modal
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedBookingToCancel(null);
  };

  // Confirm Cancellation
  const confirmCancelBooking = async () => {
    if (selectedBookingToCancel) {
      const { success } = await cancelBooking(selectedBookingToCancel.id);
      if (success) {
        toast.success('Booking cancelled successfully!');
        if (user && user.id) {
          fetchBookings(user.id); // Re-fetch bookings
          fetchAnalytics(); // Re-fetch analytics to update spent
        }
      } else {
        toast.error('Failed to cancel booking.');
      }
      closeCancelModal();
    }
  };


  // --- Chart Data & Options ---
  const doughnutData = {
    labels: analyticsData?.sport_distribution?.map(item => item.sport) || ['No Data'],
    datasets: [{
      data: analyticsData?.sport_distribution?.map(item => item.percentage) || [100],
      backgroundColor: analyticsData?.sport_distribution?.length > 0 ? ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#00BCD4'] : ['#cccccc'],
      hoverOffset: 4
    }]
  };

  const lineData = {
    labels: analyticsData?.monthly_spending?.map(item => item.month) || [],
    datasets: [{
      label: 'Monthly Spending (₹)',
      data: analyticsData?.monthly_spending?.map(item => item.total_spent) || [],
      borderColor: 'rgb(16, 185, 129)',
      tension: 0.1,
      fill: false,
    }]
  };

  const barData = {
    labels: analyticsData?.activity_by_day?.map(item => item.day_of_week) || [],
    datasets: [{
      label: 'Hours Played',
      data: analyticsData?.activity_by_day?.map(item => item.total_hours) || [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };


  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          font: {
            size: 14,
          },
          color: '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + '%';
            }
            return label;
          },
        },
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Spending',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          callback: function (value) {
            return '₹' + value;
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Activity by Day of Week',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        title: {
          display: true,
          text: 'Hours Played',
        },
      },
    },
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Please log in to view your dashboard.</p>
      </div>
    );
  }

  // Filter bookings for upcoming
  const upcomingBookings = bookings.filter(b => {
    const bookingDateTime = new Date(`${b.date}T${b.start_time}:00`);
    return bookingDateTime > new Date();
  }).sort((a, b) => new Date(`${a.date}T${a.start_time}:00`) - new Date(`${b.date}T${b.start_time}:00`));

  // Filter bookings for past bookings
  const pastBookings = bookings.filter(b => {
    const bookingDateTime = new Date(`${b.date}T${b.start_time}:00`);
    return bookingDateTime <= new Date();
  }).sort((a, b) => new Date(`${b.date}T${b.start_time}:00`) - new Date(`${a.date}T${a.start_time}:00`));

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

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <motion.div 
          className="max-w-7xl mx-auto"
          {...animations.pageTransition}
        >
          <EnhancedCard className="overflow-hidden backdrop-blur-xl border-0">
            {/* Enhanced Header */}
            <motion.div 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-6 sm:p-8 text-white relative overflow-hidden"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"
                {...animations.cardFloat}
              />
              
              <div className="relative z-10 flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h1 className="text-3xl lg:text-4xl font-bold flex items-center">
                    <motion.div
                      className="mr-4 p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Users size={36} />
                    </motion.div>
                    Welcome back, {user.first_name || user.username?.split('@')[0] || 'Champion'}!
                  </h1>
                  <p className="mt-3 text-lg opacity-90 flex items-center">
                    <Sparkles size={18} className="mr-2" />
                    {user.email}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <EnhancedButton
                    onClick={handleLogout}
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                  >
                    Logout
                  </EnhancedButton>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Navigation Tabs */}
            <motion.div 
              className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <nav className="flex flex-wrap gap-1 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                {[
                  { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
                  { id: 'bookings', label: 'My Bookings', icon: <Calendar size={18} /> },
                  { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
                  { id: 'achievements', label: 'Achievements', icon: <Trophy size={18} /> },
                  { id: 'favorites', label: 'Favorites', icon: <Heart size={18} /> }
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
            </motion.div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 sm:p-6 rounded-lg shadow flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Total Bookings</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {loading ? '...' : bookings.length}
                    </p>
                  </div>
                  <Calendar size={32} className="text-blue-400 sm:w-12 sm:h-12" />
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-4 sm:p-6 rounded-lg shadow flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">This Month's Bookings</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {analyticsLoading ? '...' : (analyticsData?.this_month_bookings || 0)}
                    </p>
                  </div>
                  <ClockCounterClockwise size={32} className="text-green-400 sm:w-12 sm:h-12" />
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 sm:p-6 rounded-lg shadow flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Total Spent</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {analyticsLoading ? '...' : `₹${(analyticsData?.total_spent || 0).toFixed(2)}`}
                    </p>
                  </div>
                  <CreditCard size={32} className="text-purple-400 sm:w-12 sm:h-12" />
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 sm:p-6 rounded-lg shadow flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-medium text-yellow-600 dark:text-yellow-400">Favorite Boxes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {favoritesLoading ? '...' : (favoriteBoxes.length || 0)}
                    </p>
                  </div>
                  <Heart size={32} className="text-yellow-400 sm:w-12 sm:h-12" />
                </div>
              </div>

              {/* Recent Activity & Gamification Overview */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Activity</h3>
                  {loading ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading recent activity...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-4 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p>No recent activity. <button onClick={() => navigate('/boxes')} className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Book a session!</button></p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 4).map((booking) => (
                        <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150 gap-3 sm:gap-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                              {(booking.box?.sport || booking.box_sport)?.charAt(0).toUpperCase() ?? 'S'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{booking.box?.name || booking.box_name || 'Unknown Box'}</p>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {new Date(booking.date).toLocaleDateString()} • {booking.start_time} - {booking.end_time}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-start">
                            <span className="text-primary-600 dark:text-primary-400 font-medium">₹{booking.total_amount}</span>
                            <p className={`text-xs font-semibold ${booking.booking_status === 'Cancelled' ? 'text-red-500' : 'text-green-500'}`}>
                              {booking.booking_status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                    <Trophy className="mr-2 text-yellow-500" size={20} />
                    Your Level
                  </h3>
                  {gamificationLoading ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading...</div>
                  ) : userGameStats ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                          {userGameStats.points >= 1000 ? '5' : 
                           userGameStats.points >= 500 ? '4' : 
                           userGameStats.points >= 200 ? '3' : 
                           userGameStats.points >= 50 ? '2' : '1'}
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {userGameStats.points >= 1000 ? 'Sports Legend' : 
                           userGameStats.points >= 500 ? 'Sports Master' : 
                           userGameStats.points >= 200 ? 'Sports Expert' : 
                           userGameStats.points >= 50 ? 'Sports Enthusiast' : 'Beginner'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{userGameStats.points} points</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Badges</span>
                          <span className="font-medium">{userGameStats.badges_earned || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">This Week</span>
                          <span className="font-medium">{userGameStats.weekly_bookings || 0}/3</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setActiveTab('achievements')}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                      >
                        View All Achievements
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Start booking to begin your journey!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* My Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>

              {loading ? (
                <div className="text-center py-10 text-gray-500">Loading your bookings...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">Error: {error}</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg shadow-sm">
                  <p className="text-lg text-gray-600 mb-4">You don't have any bookings yet.</p>
                  <button
                    onClick={() => navigate('/boxes')}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-200 text-lg"
                  >
                    Find a Box and Book Now!
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <CheckCircle size={24} className="mr-2 text-green-500" />
                      Upcoming Bookings ({upcomingBookings.length})
                    </h3>
                    {upcomingBookings.length === 0 ? (
                      <p className="text-gray-600 dark:text-gray-400">No upcoming bookings.</p>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <div key={booking.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 dark:bg-blue-900/30">
                            <div>
                              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{booking.box?.name || booking.box_name || 'Unknown Box'}</p>
                              <p className="text-gray-700 dark:text-gray-300">
                                {new Date(booking.date).toLocaleDateString()} at {booking.start_time} - {booking.end_time} ({booking.duration} hr)
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">Total: ₹{booking.total_amount}</p>
                            </div>
                            <div className="mt-3 sm:mt-0">
                              {booking.booking_status === 'Confirmed' ? (
                                <button
                                  onClick={() => openCancelModal(booking)}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center"
                                >
                                  <XCircle size={20} className="mr-2" />
                                  Cancel Booking
                                </button>
                              ) : (
                                <span className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full">
                                  {booking.booking_status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <ClockCounterClockwise size={24} className="mr-2 text-gray-500" />
                      Past Bookings ({pastBookings.length})
                    </h3>
                    {pastBookings.length === 0 ? (
                      <p className="text-gray-600 dark:text-gray-400">No past bookings.</p>
                    ) : (
                      <div className="space-y-4">
                        {pastBookings.map((booking) => (
                          <div key={booking.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 dark:bg-gray-700">
                            <div>
                              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{booking.box?.name || booking.box_name || 'Unknown Box'}</p>
                              <p className="text-gray-700 dark:text-gray-300">
                                {new Date(booking.date).toLocaleDateString()} at {booking.start_time} - {booking.end_time} ({booking.duration} hr)
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">Total: ₹{booking.total_amount}</p>
                            </div>
                            <div>
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${booking.booking_status === 'Cancelled' ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
                                {booking.booking_status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 size={28} className="text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Your Performance & Activity Analytics
                </h2>
              </div>
              
              {analyticsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : !analyticsData ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <Activity size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No analytics data available.</p>
                </div>
              ) : (
                <>
                  {/* Enhanced Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium opacity-90">Total Hours Played</p>
                          <p className="text-3xl font-bold mt-1">
                            {(analyticsData?.total_hours_played ?? 0).toFixed(1)}
                            <span className="text-xl ml-1">hrs</span>
                          </p>
                        </div>
                        <Clock size={32} className="opacity-80" />
                      </div>
                      <div className="mt-2 text-sm opacity-80">
                        {analyticsData?.total_hours_played > 50 ? 'Sports enthusiast! 🏆' : 
                         analyticsData?.total_hours_played > 20 ? 'Getting active! 💪' : 
                         'Just getting started! 🌟'}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium opacity-90">Average Rating</p>
                          <p className="text-3xl font-bold mt-1">
                            {(analyticsData?.average_rating ?? 0).toFixed(1)} / 5
                          </p>
                        </div>
                        <Trophy size={32} className="opacity-80" />
                      </div>
                      <div className="mt-2 text-sm opacity-80">
                        {analyticsData?.average_rating >= 4.5 ? 'Excellent experience! ⭐' : 
                         analyticsData?.average_rating >= 4.0 ? 'Great satisfaction! 👍' : 
                         'Room for improvement 📈'}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium opacity-90">Avg Cost / Session</p>
                          <p className="text-3xl font-bold mt-1">
                            ₹{(analyticsData?.average_cost_per_session ?? 0).toFixed(0)}
                          </p>
                        </div>
                        <CreditCard size={32} className="opacity-80" />
                      </div>
                      <div className="mt-2 text-sm opacity-80">
                        {analyticsData?.average_cost_per_session < 500 ? 'Budget friendly! 💰' : 
                         analyticsData?.average_cost_per_session < 1000 ? 'Good value 💵' : 
                         'Premium choices 🌟'}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium opacity-90">Cancellation Rate</p>
                          <p className="text-3xl font-bold mt-1">
                            {(analyticsData?.cancellation_rate ?? 0).toFixed(1)}%
                          </p>
                        </div>
                        <Target size={32} className="opacity-80" />
                      </div>
                      <div className="mt-2 text-sm opacity-80">
                        {analyticsData?.cancellation_rate < 10 ? 'Very reliable! ✅' : 
                         analyticsData?.cancellation_rate < 25 ? 'Pretty good 👌' : 
                         'Try to plan better 📅'}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Spending Trend */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp size={20} className="text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Monthly Spending Trend
                        </h3>
                      </div>
                      <MonthlySpendingChart
                        data={{
                          labels: analyticsData?.monthly_spending?.map(item => item.month) || [],
                          values: analyticsData?.monthly_spending?.map(item => item.total_spent) || [],
                        }}
                        loading={analyticsLoading}
                      />
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Track your investment in sports activities over time
                      </div>
                    </div>

                    {/* Sport Distribution */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <Activity size={20} className="text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Favorite Sports
                        </h3>
                      </div>
                      <EnhancedSportDistribution
                        data={{
                          labels: analyticsData?.sport_distribution?.map(item => item.sport) || [],
                          values: analyticsData?.sport_distribution?.map(item => item.percentage) || [],
                        }}
                        loading={analyticsLoading}
                      />
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Your sports preferences based on booking history
                      </div>
                    </div>

                    {/* Activity by Day */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <Calendar size={20} className="text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Weekly Activity Pattern
                        </h3>
                      </div>
                      <BookingActivityChart
                        data={{
                          labels: analyticsData?.activity_by_day?.map(item => item.day_of_week) || [],
                          values: analyticsData?.activity_by_day?.map(item => item.total_hours) || [],
                        }}
                        loading={analyticsLoading}
                      />
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        When you're most active during the week
                      </div>
                    </div>

                    {/* Peak Booking Hours */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock size={20} className="text-orange-600" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Peak Booking Hours
                        </h3>
                      </div>
                      <PeakHoursChart
                        data={{
                          labels: analyticsData?.peak_booking_hours?.map(item => item.hour_range) || [],
                          values: analyticsData?.peak_booking_hours?.map(item => item.percentage) || [],
                        }}
                        loading={analyticsLoading}
                      />
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Your preferred time slots for sports activities
                      </div>
                    </div>
                  </div>

                  {/* Insights Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Info size={20} className="mr-2 text-blue-600" />
                      Your Sports Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 dark:text-white">Most Active Sport</p>
                        <p className="text-blue-600 dark:text-blue-400">
                          {analyticsData?.sport_distribution?.[0]?.sport || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 dark:text-white">Total Investment</p>
                        <p className="text-green-600 dark:text-green-400">
                          ₹{(analyticsData?.total_spent || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 dark:text-white">This Month</p>
                        <p className="text-purple-600 dark:text-purple-400">
                          {analyticsData?.this_month_bookings || 0} bookings
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 dark:text-white">Consistency Score</p>
                        <p className="text-orange-600 dark:text-orange-400">
                          {analyticsData?.cancellation_rate < 10 ? 'Excellent' : 
                           analyticsData?.cancellation_rate < 25 ? 'Good' : 'Needs Improvement'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy size={28} className="text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Your Gaming Progress & Achievements
                </h2>
              </div>

              {/* Gamification Stats */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Sparkles className="mr-2 text-purple-600" />
                  Your Sports Journey
                </h3>
                <GamificationStats userStats={userGameStats} loading={gamificationLoading} />
              </div>

              {/* Achievements Grid */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Trophy className="mr-2 text-yellow-600" />
                  Achievement Badges
                </h3>
                
                {achievementsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : !Array.isArray(achievements) || achievements.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                    <Trophy size={64} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">No achievements unlocked yet!</p>
                    <p className="text-gray-500 dark:text-gray-500">Keep booking sessions to earn your first badge.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {achievements.filter(Boolean).map((achievement, idx) => {
                      // Determine badge type based on achievement name
                      let badgeType = 'default';
                      const name = achievement?.name?.toLowerCase() || '';
                      if (name.includes('first') || name.includes('timer')) badgeType = 'bronze';
                      else if (name.includes('weekly') || name.includes('warrior')) badgeType = 'silver';
                      else if (name.includes('regular') || name.includes('player')) badgeType = 'gold';
                      else if (name.includes('sports') || name.includes('enthusiast')) badgeType = 'platinum';
                      else if (name.includes('spender') || name.includes('big')) badgeType = 'gold';
                      else if (name.includes('monthly') || name.includes('champion')) badgeType = 'platinum';

                      return (
                        <Badge
                          key={achievement?.id || achievement?.name || idx}
                          name={achievement?.name || 'Achievement'}
                          description={achievement?.description || ''}
                          earned={achievement?.earned || false}
                          type={badgeType}
                          size="md"
                        />
                      );
                    })}
                  </div>
                )}

                {/* Achievement Progress */}
                {achievements.length > 0 && (
                  <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <TrendingUp className="mr-2 text-green-600" />
                      Progress Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {achievements.filter(a => a?.earned).length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Badges Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {achievements.length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Total Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {achievements.length > 0 ? Math.round((achievements.filter(a => a?.earned).length / achievements.length) * 100) : 0}%
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Completion Rate</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Achievement Progress</span>
                        <span>{achievements.filter(a => a?.earned).length} / {achievements.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${achievements.length > 0 ? (achievements.filter(a => a?.earned).length / achievements.length) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Favorite Boxes</h2>
              {favoritesLoading ? (
                <div className="text-center py-10 text-gray-500">Loading your favorite boxes...</div>
              ) : !Array.isArray(favoriteBoxes) || favoriteBoxes.length === 0 ? (
                <div className="text-center py-10 text-gray-600 bg-gray-50 rounded-lg">
                  <p>No favorite boxes added yet. Click the heart icon on box pages to save them!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteBoxes.filter(Boolean).map((fav, idx) => {
                    // Use flat structure as per backend response
                    return (
                      <div key={fav.id} className="bg-white p-6 rounded-lg shadow flex flex-col justify-between border border-gray-200 hover:shadow-md transition-shadow duration-150">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{fav.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{fav.location}</p>
                          <p className="text-primary-600 font-medium text-lg mt-2">₹{fav.price_per_hour} / hour</p>
                          <p className="text-gray-700 text-sm mt-2">{fav.description}</p>
                          {fav.added_on && (
                            <p className="text-gray-500 text-xs mt-2">Added on: {new Date(fav.added_on).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => navigate(`/boxes/${fav.id}`)}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                          >
                            View Box
                          </button>
                          <button
                            onClick={() => removeFavorite(fav.id)}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </EnhancedCard>
    </motion.div>
  </div>

      {/* Cancel Confirmation Modal */}
      <Transition appear show={isCancelModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeCancelModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <Info size={24} className="mr-2 text-blue-500" />
                    Confirm Cancellation
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to cancel your booking for{' '}
                      <span className="font-semibold">{selectedBookingToCancel?.box?.name}</span> on{' '}
                      <span className="font-semibold">
                        {selectedBookingToCancel?.date ? new Date(selectedBookingToCancel.date).toLocaleDateString() : ''}
                      </span>{' '}
                      at <span className="font-semibold">{selectedBookingToCancel?.start_time}</span>?
                    </p>
                    <p className="text-xs text-orange-500 mt-2">
                      Please note: Cancellations made within 2 hours of the booking time are not allowed.
                      (This policy is handled by the backend.)
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeCancelModal}
                    >
                      Keep Booking
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={confirmCancelBooking}
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UserDashboard;