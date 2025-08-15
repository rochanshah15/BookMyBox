// OwnerDashboard.jsx

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, TrendingUp, Calendar, DollarSign, Users, Star, Clock, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, Filler,
} from 'chart.js';

import AddBoxForm from '../components/boxes/AddBoxForm';
import { useAuth, api } from '../api.jsx'; // Using your api instance
import { useBox } from '../context/BoxContext'; // Added for global box refresh

// ChartJS Registration (no changes)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, Filler);

// A helper component for sections that don't have backend data yet
const Placeholder = ({ text }) => (
  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
    <p className="text-gray-500">{text}</p>
  </div>
);

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBoxModal, setShowAddBoxModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { refreshAll } = useBox(); // Added for global box refresh

  // --- MODIFIED: Single, efficient function to fetch all dashboard data ---
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

  // --- SUCCESS HANDLER for the AddBoxForm ---
  const handleAddBoxSuccess = () => {
    setShowAddBoxModal(false);
    fetchAllData(); // Re-fetch all data to update the dashboard
    refreshAll(); // Also refresh global box data for BoxListings page
  };

  // --- DATA DERIVATION (Connecting API data to UI) ---
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

  // --- UI Data & Options (Now fully dynamic) ---
  const stats = [
    { title: 'Total Revenue', value: `₹${parseFloat(total_revenue).toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Bookings', value: total_bookings, icon: Calendar, color: 'bg-blue-500' },
    { title: 'Active Boxes', value: active_boxes_count, icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'Avg Rating', value: avg_rating, icon: Star, color: 'bg-orange-500' }
  ];

  const revenueData = {
    labels: revenue_chart_labels,
    datasets: [{ label: 'Revenue (₹)', data: revenue_chart_data, borderColor: 'rgb(16, 185, 129)', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4, fill: true }],
  };

  const bookingsData = {
    labels: bookings_chart_labels,
    datasets: [{ label: 'Bookings', data: bookings_chart_data, backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 4 }],
  };

  const sportsData = {
    labels: Object.keys(sports_distribution),
    datasets: [{ data: Object.values(sports_distribution), backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'], borderWidth: 0 }],
  };
  
  const chartOptions = { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };
  const doughnutOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } };
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'boxes', label: 'My Boxes' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'analytics', label: 'Analytics' },
  ];
  const getStatusColor = (status) => { /* ... no changes ... */ };
  const getStatusIcon = (status) => { /* ... no changes ... */ };

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-max section-padding">
        {/* Header (Restored with dynamic pending count) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              {/* Replace user?.name with user?.first_name || user?.email || 'Owner' for better fallback */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.first_name || user?.email || 'Owner'}! 🏢</h1>
              <p className="text-gray-600">Manage your sports facilities and track performance</p>
            </div>
            {pending_boxes_count > 0 && (
              <div className="hidden md:flex bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">{pending_boxes_count} box{pending_boxes_count > 1 ? 'es are' : ' is'} pending approval</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards (Restored and dynamic) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}><stat.icon size={24} className="text-white" /></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* --- TABS --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{tab.label}</button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab (Fully Restored) */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card p-6"><h4 className="font-medium mb-4">Revenue Trend</h4><Line data={revenueData} options={chartOptions} /></div>
                  <div className="card p-6"><h4 className="font-medium mb-4">Weekly Bookings</h4><Bar data={bookingsData} options={chartOptions} /></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 card p-6"><h4 className="font-medium mb-4">Recent Bookings</h4>
                    <div className="space-y-3">
                      {recent_bookings.length > 0 ? recent_bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{booking.user_name || 'Customer'}</p>
                            <p className="text-sm text-gray-600">{booking.box_name} • {new Date(booking.date).toLocaleDateString()}</p>
                          </div>
                          <p className="font-medium">₹{booking.amount}</p>
                        </div>
                      )) : <Placeholder text="No recent bookings." />}
                    </div>
                  </div>
                  <div className="card p-6"><h4 className="font-medium mb-4">Sports Distribution</h4>
                    {sportsData.labels.length > 0 ? <Doughnut data={sportsData} options={doughnutOptions} /> : <Placeholder text="No sports data." />}
                  </div>
                </div>
              </div>
            )}

            {/* My Boxes Tab (Fully Restored) */}
            {activeTab === 'boxes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">My Sports Boxes</h3>
                  <button onClick={() => setShowAddBoxModal(true)} className="btn-primary flex items-center space-x-2"><Plus size={20} /><span>Add New Box</span></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between"><p className="text-sm text-green-600">Approved</p><p className="text-2xl font-bold text-green-800">{active_boxes_count}</p></div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between"><p className="text-sm text-yellow-600">Pending</p><p className="text-2xl font-bold text-yellow-800">{pending_boxes_count}</p></div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between"><p className="text-sm text-red-600">Rejected</p><p className="text-2xl font-bold text-red-800">{rejected_boxes_count || 0}</p></div>
                </div>
                {all_owner_boxes.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {all_owner_boxes.map((box) => (
                      <motion.div key={box.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img src={box.image || '/default-box-image.jpg'} alt={box.name} className="w-full h-48 object-cover" />
                          <div className="absolute top-4 right-4"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(box.status)}`}>{box.status}</span></div>
                        </div>
                        <div className="p-4">
                           <h4 className="font-semibold text-gray-900 truncate">{box.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{box.location}</p>
                           {box.status === 'rejected' && box.rejection_reason && (<div className="bg-red-100 text-red-800 text-xs p-2 rounded mb-3"><strong>Reason:</strong> {box.rejection_reason}</div>)}
                          <div className="flex items-center justify-end space-x-2"><button className="p-2 text-gray-500 hover:text-primary-600 rounded"><Eye size={16} /></button><button className="p-2 text-gray-500 hover:text-primary-600 rounded"><Edit size={16} /></button><button className="p-2 text-gray-500 hover:text-red-600 rounded"><Trash2 size={16} /></button></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : <Placeholder text="You haven't added any boxes yet. Click 'Add New Box' to start!" />}
              </div>
            )}

            {/* Bookings Tab (Fully Restored) */}
            {activeTab === 'bookings' && (
               <div className="space-y-6">
                 <h3 className="text-lg font-semibold">Recent Bookings Across All Your Venues</h3>
                 <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead><tr className="border-b"><th className="text-left p-3">Customer</th><th className="text-left p-3">Box</th><th className="text-left p-3">Date</th><th className="text-left p-3">Amount</th><th className="text-left p-3">Status</th></tr></thead>
                     <tbody>
                       {recent_bookings.length > 0 ? recent_bookings.map((booking) => (
                         <tr key={booking.id} className="border-b hover:bg-gray-50">
                           <td className="p-3">{booking.user_name}</td><td className="p-3">{booking.box_name}</td><td className="p-3">{new Date(booking.date).toLocaleDateString()}</td><td className="p-3">₹{booking.amount}</td><td className="p-3"><span className="capitalize">{booking.status}</span></td>
                         </tr>
                       )) : <tr><td colSpan="5"><Placeholder text="No bookings found." /></td></tr>}
                     </tbody>
                   </table>
                 </div>
               </div>
            )}

            {/* Analytics Tab (Restored with Placeholders) */}
            {activeTab === 'analytics' && (
                <div className="space-y-8">
                    <h3 className="text-lg font-semibold">Business Analytics</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card p-6"><h4 className="font-medium mb-4">Revenue Analytics</h4><Line data={revenueData} options={chartOptions} /></div>
                        <div className="card p-6"><h4 className="font-medium mb-4">Booking Trends</h4><Bar data={bookingsData} options={chartOptions} /></div>
                    </div>
                    <Placeholder text="Advanced analytics like Peak Hours and Customer Insights are coming soon!" />
                </div>
            )}

          </div>
        </motion.div>
      </div>

      {/* Add Box Modal */}
      <AddBoxForm isOpen={showAddBoxModal} onClose={() => setShowAddBoxModal(false)} onSuccess={handleAddBoxSuccess} />
    </div>
  );
};

export default OwnerDashboard;