import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, DollarSign, TrendingUp, Search, Filter, Edit, Trash2, Eye, Shield, AlertTriangle, CheckCircle, X, Clock } from 'lucide-react'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'
import { useAuth } from '../hooks/useAuth'
import { useBox } from '../context/BoxContext'
import Modal from '../components/common/Modal'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBox, setSelectedBox] = useState(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const { user } = useAuth()
  const { pendingBoxes, fetchPendingBoxes, approveBox, rejectBox } = useBox()

  useEffect(() => {
    fetchPendingBoxes()
  }, [fetchPendingBoxes])

  // Mock data
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Bookings',
      value: '1,234',
      change: '+8%',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Platform Revenue',
      value: '₹4,56,789',
      change: '+15%',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Approvals',
      value: pendingBoxes.length,
      change: pendingBoxes.length > 0 ? 'Needs attention' : 'All clear',
      icon: AlertTriangle,
      color: pendingBoxes.length > 0 ? 'bg-orange-500' : 'bg-green-500'
    }
  ]

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Platform Revenue (₹)',
        data: [65000, 78000, 82000, 95000, 105000, 120000],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const sportsData = {
    labels: ['Cricket', 'Football', 'Tennis', 'Badminton', 'Basketball', 'Pickleball'],
    datasets: [
      {
        data: [35, 25, 15, 12, 8, 5],
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
        ],
        borderWidth: 0,
      },
    ],
  }

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [120, 190, 300, 500, 200, 300],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
    ],
  }

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', bookings: 12, joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Owner', status: 'Active', bookings: 0, joinDate: '2024-01-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', bookings: 5, joinDate: '2024-01-05' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Owner', status: 'Active', bookings: 0, joinDate: '2024-01-20' },
  ]

  const boxes = [
    { id: 1, name: 'Elite Cricket Box', owner: 'John Owner', sport: 'Cricket', location: 'Mumbai', status: 'Approved', bookings: 45, revenue: 36000 },
    { id: 2, name: 'Football Arena', owner: 'Jane Owner', sport: 'Football', location: 'Delhi', status: 'Pending', bookings: 32, revenue: 19200 },
    { id: 3, name: 'Tennis Court Pro', owner: 'Mike Owner', sport: 'Tennis', location: 'Bangalore', status: 'Approved', bookings: 28, revenue: 11200 },
    { id: 4, name: 'Badminton Center', owner: 'Sarah Owner', sport: 'Badminton', location: 'Chennai', status: 'Rejected', bookings: 0, revenue: 0 },
  ]

  const bookings = [
    { id: 1, user: 'John Doe', box: 'Elite Cricket Box', date: '2024-01-15', amount: 1600, status: 'Confirmed', owner: 'John Owner' },
    { id: 2, user: 'Jane Smith', box: 'Football Arena', date: '2024-01-14', amount: 600, status: 'Completed', owner: 'Jane Owner' },
    { id: 3, user: 'Mike Johnson', box: 'Tennis Court Pro', date: '2024-01-13', amount: 800, status: 'Cancelled', owner: 'Mike Owner' },
    { id: 4, user: 'Sarah Wilson', box: 'Elite Cricket Box', date: '2024-01-12', amount: 1600, status: 'Completed', owner: 'John Owner' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'approvals', label: `Box Approvals ${pendingBoxes.length > 0 ? `(${pendingBoxes.length})` : ''}` },
    { id: 'users', label: 'Users' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' }
  ]

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  const handleApproveBox = async (boxId) => {
    const result = await approveBox(boxId)
    if (result.success) {
      alert(result.message)
      fetchPendingBoxes() // Refresh the list
    } else {
      alert(result.error)
    }
  }

  const handleRejectBox = async (boxId) => {
    const result = await rejectBox(boxId, rejectionReason)
    if (result.success) {
      alert(result.message)
      setShowApprovalModal(false)
      setSelectedBox(null)
      setRejectionReason('')
      fetchPendingBoxes() // Refresh the list
    } else {
      alert(result.error)
    }
  }

  const openRejectModal = (box) => {
    setSelectedBox(box)
    setShowApprovalModal(true)
  }

  const totalPlatformRevenue = 66720 // Mock calculation
  const activeUsers = users.filter(user => user.status === 'Active').length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-max section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {user?.first_name || user?.name?.split('@')[0] || user?.name || 'Admin'}! 🛡️
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Monitor and manage the entire BookMyBox platform</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium dark:text-gray-200">Platform Admin</span>
                </div>
              </div>
              {pendingBoxes.length > 0 && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={16} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      {pendingBoxes.length} pending approval{pendingBoxes.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.title === 'Pending Approvals' && pendingBoxes.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Shield size={32} className="mx-auto text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
          </div>
          
          <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CheckCircle size={32} className="mx-auto text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Box Approvals</h3>
            <p className="text-sm text-gray-600">Review and approve new facilities</p>
            {pendingBoxes.length > 0 && (
              <span className="inline-block mt-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                {pendingBoxes.length} pending
              </span>
            )}
          </div>
          
          <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <DollarSign size={32} className="mx-auto text-purple-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Revenue Reports</h3>
            <p className="text-sm text-gray-600">View platform financial analytics</p>
          </div>
          
          <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <TrendingUp size={32} className="mx-auto text-orange-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Platform Analytics</h3>
            <p className="text-sm text-gray-600">Comprehensive usage statistics</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card p-6">
                    <h4 className="font-medium mb-4">Platform Revenue Trend</h4>
                    <Line data={revenueData} options={chartOptions} />
                  </div>
                  <div className="card p-6">
                    <h4 className="font-medium mb-4">User Growth</h4>
                    <Bar data={userGrowthData} options={chartOptions} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="font-medium mb-4">Recent Platform Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">New box approved: Elite Cricket Box</span>
                        </div>
                        <span className="text-xs text-green-700">2 min ago</span>
                      </div>
                      <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">New user registered: John Doe</span>
                        </div>
                        <span className="text-xs text-blue-700">15 min ago</span>
                      </div>
                      {pendingBoxes.length > 0 && (
                        <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">{pendingBoxes.length} box{pendingBoxes.length > 1 ? 'es' : ''} pending approval</span>
                          </div>
                          <button
                            onClick={() => setActiveTab('approvals')}
                            className="text-xs text-yellow-700 hover:text-yellow-800 font-medium"
                          >
                            Review Now
                          </button>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-3 px-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Commission payment processed: ₹3,600</span>
                        </div>
                        <span className="text-xs text-purple-700">2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-medium mb-4">Sports Distribution</h4>
                    <Doughnut data={sportsData} options={doughnutOptions} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card p-6">
                    <h4 className="font-medium mb-4">Platform Health</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">System Uptime</span>
                        <span className="font-medium text-green-600">99.9%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="font-medium">{activeUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Response Time</span>
                        <span className="font-medium">120ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Error Rate</span>
                        <span className="font-medium text-green-600">0.1%</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-medium mb-4">Revenue Breakdown</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Commission (10%)</span>
                        <span className="font-medium">₹{totalPlatformRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Processing Fees</span>
                        <span className="font-medium">₹12,450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subscription Fees</span>
                        <span className="font-medium">₹8,900</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm font-medium">Total Revenue</span>
                        <span className="font-bold text-primary-600">₹{(totalPlatformRevenue + 12450 + 8900).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-medium mb-4">Top Performing Cities</h4>
                    <div className="space-y-3">
                      {[
                        { city: 'Mumbai', bookings: 45, percentage: 35 },
                        { city: 'Delhi', bookings: 32, percentage: 25 },
                        { city: 'Bangalore', bookings: 28, percentage: 22 },
                        { city: 'Chennai', bookings: 23, percentage: 18 }
                      ].map((city) => (
                        <div key={city.city} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{city.city}</span>
                            <span className="font-medium">{city.bookings} bookings</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-500 h-2 rounded-full transition-all duration-500" 
                              style={{width: `${city.percentage}%`}}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Box Approvals Tab */}
            {activeTab === 'approvals' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Box Approval Queue</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {pendingBoxes.length} pending approval{pendingBoxes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {pendingBoxes.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No boxes pending approval at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pendingBoxes.map((box) => (
                      <motion.div
                        key={box.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card overflow-hidden"
                      >
                        <div className="relative">
                          <img
                            src={box.image}
                            alt={box.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-300 px-2 py-1 rounded-lg flex items-center space-x-1">
                            <Clock size={14} className="text-yellow-600" />
                            <span className="text-xs font-medium text-yellow-800">Pending</span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 text-lg">{box.name}</h4>
                            <p className="text-sm text-gray-600">by {box.owner}</p>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Sports Available:</p>
                              <p className="font-medium">{box.sports?.join(', ')}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Location:</p>
                                <p className="font-medium">{box.location}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Price/Hour:</p>
                                <p className="font-medium">₹{box.price}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Capacity:</p>
                                <p className="font-medium">{box.capacity} players</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Submitted:</p>
                                <p className="font-medium">{new Date(box.submittedAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600">Description:</p>
                              <p className="text-sm text-gray-800">{box.description}</p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600">Amenities:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {box.amenities?.map((amenity) => (
                                  <span
                                    key={amenity}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => openRejectModal(box)}
                              className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                            >
                              <X size={16} />
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => handleApproveBox(box.id)}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <CheckCircle size={16} />
                              <span>Approve</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter size={16} />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Bookings</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user.name.charAt(0)}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Owner' 
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'Admin'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'Active' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{user.bookings}</td>
                          <td className="py-3 px-4">{new Date(user.joinDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-600 hover:text-primary-600">
                                <Eye size={16} />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-primary-600">
                                <Edit size={16} />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Booking Management</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg">
                      <option>All Status</option>
                      <option>Confirmed</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Box</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Owner</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Commission</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {booking.user.charAt(0)}
                              </div>
                              <span>{booking.user}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{booking.box}</td>
                          <td className="py-3 px-4">{booking.owner}</td>
                          <td className="py-3 px-4">{booking.date}</td>
                          <td className="py-3 px-4 font-medium">₹{booking.amount}</td>
                          <td className="py-3 px-4 font-medium text-green-600">₹{Math.round(booking.amount * 0.1)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'Confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'Completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-600 hover:text-primary-600">
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <h3 className="text-lg font-semibold">Platform Analytics</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card p-6">
                    <h4 className="font-medium mb-4">Revenue Growth</h4>
                    <Line data={revenueData} options={chartOptions} />
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-medium mb-4">User Acquisition</h4>
                    <Bar data={userGrowthData} options={chartOptions} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="card p-6">
                    <h4 className="font-medium mb-4">Platform Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Users</span>
                        <span className="font-medium">{users.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Boxes</span>
                        <span className="font-medium">{boxes.filter(b => b.status === 'Approved').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Bookings</span>
                        <span className="font-medium">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Platform Commission</span>
                        <span className="font-medium">₹{totalPlatformRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-medium mb-4">User Engagement</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Daily Active Users</span>
                        <span className="font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Session Duration</span>
                        <span className="font-medium">12 min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bounce Rate</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">User Retention</span>
                        <span className="font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-medium mb-4">Business Health</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue Growth</span>
                        <span className="font-medium text-green-600">+15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Customer Satisfaction</span>
                        <span className="font-medium">4.7/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Churn Rate</span>
                        <span className="font-medium text-green-600">5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Support Tickets</span>
                        <span className="font-medium">23</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Platform Reports</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <DollarSign size={32} className="text-green-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Revenue Report</h4>
                    <p className="text-sm text-gray-600 mb-4">Detailed financial analytics and commission tracking</p>
                    <button className="btn-primary w-full">Generate Report</button>
                  </div>
                  
                  <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <Users size={32} className="text-blue-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">User Analytics</h4>
                    <p className="text-sm text-gray-600 mb-4">User behavior, engagement, and growth metrics</p>
                    <button className="btn-primary w-full">Generate Report</button>
                  </div>
                  
                  <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <Calendar size={32} className="text-purple-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Booking Report</h4>
                    <p className="text-sm text-gray-600 mb-4">Booking trends, patterns, and performance analysis</p>
                    <button className="btn-primary w-full">Generate Report</button>
                  </div>
                  
                  <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <TrendingUp size={32} className="text-orange-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Performance Report</h4>
                    <p className="text-sm text-gray-600 mb-4">Platform performance and operational metrics</p>
                    <button className="btn-primary w-full">Generate Report</button>
                  </div>
                  
                  <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <Shield size={32} className="text-red-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Security Report</h4>
                    <p className="text-sm text-gray-600 mb-4">Security incidents, user activity, and system logs</p>
                    <button className="btn-primary w-full">Generate Report</button>
                  </div>
                  
                  <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <Eye size={32} className="text-indigo-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Custom Report</h4>
                    <p className="text-sm text-gray-600 mb-4">Create custom reports with specific parameters</p>
                    <button className="btn-primary w-full">Create Report</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => {
          setShowApprovalModal(false)
          setSelectedBox(null)
          setRejectionReason('')
        }}
        title="Reject Box Application"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to reject the application for{' '}
            <strong>{selectedBox?.name}</strong>?
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason (Optional)
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="input-field"
              rows="3"
              placeholder="Provide a reason for rejection to help the owner improve their application..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowApprovalModal(false)
                setSelectedBox(null)
                setRejectionReason('')
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleRejectBox(selectedBox?.id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject Application
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminDashboard