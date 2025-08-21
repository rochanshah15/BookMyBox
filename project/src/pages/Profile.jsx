import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Camera, Edit2, Save, X, Info } from 'lucide-react';
import { useAuth } from '../api.jsx'; // Correct path to your api.jsx

const Profile = () => {
  const { user, fetchUserProfile, updateProfile, generalError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    bio: '',
    preferredSports: [],
    emergencyContact: '',
    address: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [globalProfileError, setGlobalProfileError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const sports = ['Cricket', 'Football', 'Tennis', 'Badminton', 'Basketball', 'Pickleball', 'Volleyball', 'Table Tennis'];

  // Effect 1: Sync formData when the `user` object from context changes. This is correct.
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        dateOfBirth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
        bio: user.bio || '',
        preferredSports: user.preferred_sports || [],
        emergencyContact: user.emergency_contact || '',
        address: user.address || ''
      });
      setProfileLoading(false);
      setGlobalProfileError(null);
      setFormErrors({});
      setSaveSuccess(false);
    } else {
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', location: '', dateOfBirth: '', bio: '',
        preferredSports: [], emergencyContact: '', address: ''
      });
      setProfileLoading(false);
    }
  }, [user]);

  // Effect 2: Fetch user profile data on initial component mount if needed.
  useEffect(() => {
    const initialLoad = async () => {
      if (!user) {
        setProfileLoading(true);
        setGlobalProfileError(null);
        await fetchUserProfile();
        setProfileLoading(false);
      } else {
        setProfileLoading(false);
      }
    };
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSportToggle = (sport) => {
    setFormData(prev => {
      const updatedSports = prev.preferredSports.includes(sport)
        ? prev.preferredSports.filter(s => s !== sport)
        : [...prev.preferredSports, sport];
      return { ...prev, preferredSports: updatedSports };
    });
    setSaveSuccess(false);
    if (formErrors.preferredSports) {
      setFormErrors(prev => ({ ...prev, preferredSports: undefined }));
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setGlobalProfileError(null);
    setFormErrors({});
    setSaveSuccess(false);

    const dataToSave = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      location: formData.location,
      date_of_birth: formData.dateOfBirth,
      bio: formData.bio,
      preferred_sports: formData.preferredSports,
      emergency_contact: formData.emergencyContact,
      address: formData.address
    };

    const result = await updateProfile(dataToSave);

    if (result.success) {
      console.log('Profile saved successfully:', result.data);
      // ✅ FIX: The fetchUserProfile() call is removed from here.
      // The context update from updateProfile() is enough to trigger the useEffect hook,
      // which handles syncing the form data.
      setIsEditing(false);
      setSaveSuccess(true);
    } else {
      console.error('Failed to save profile:', result.error || result.errors);
      if (result.errors) {
        const mappedErrors = {};
        for (const key in result.errors) {
          const frontendKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          mappedErrors[frontendKey] = result.errors[key];
        }
        setFormErrors(mappedErrors);
        setGlobalProfileError('Please correct the errors in the form.');
      } else {
        setGlobalProfileError(result.error || 'An unexpected error occurred during save.');
      }
    }
    setSaveLoading(false);
  };

  const handleCancelEdit = () => {
    // This is correct: it resets the form using the source of truth (the 'user' object from context)
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        dateOfBirth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
        bio: user.bio || '',
        preferredSports: user.preferred_sports || [],
        emergencyContact: user.emergency_contact || '',
        address: user.address || ''
      });
    }
    setIsEditing(false);
    setGlobalProfileError(null);
    setFormErrors({});
    setSaveSuccess(false);
  };
  
  // (The rest of your JSX remains the same as it is well-structured)

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  if (!user && !profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <p className="text-lg text-gray-700 dark:text-gray-300">Please log in to view your profile.</p>
      </div>
    );
  }

  const displayName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || user?.email || '';
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 transition-all duration-300">
      <div className="pt-24 sm:pt-28 lg:pt-32 pb-12 px-4 sm:px-6 lg:px-8 safe-area-top mobile-compact">
        <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Enhanced Header with Gradient */}
          <div className="relative mb-8 sm:mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Profile Settings
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
                    Manage your personal information and preferences
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 w-full sm:w-auto justify-center"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Edit2 size={20} className="relative z-10" />
                    <span className="relative z-10">Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Error/Success Messages */}
          {(globalProfileError || generalError) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl flex items-center space-x-3 mb-6 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl"></div>
              <Info size={22} className="flex-shrink-0 relative z-10" />
              <p className="font-medium relative z-10">{globalProfileError || generalError}</p>
            </motion.div>
          )}

          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 text-green-700 dark:text-green-400 px-6 py-4 rounded-xl flex items-center space-x-3 mb-6 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl"></div>
              <Info size={22} className="flex-shrink-0 relative z-10" />
              <p className="font-medium relative z-10">Profile updated successfully!</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Enhanced Profile Picture & Basic Info */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
              >
                {/* Glassmorphism Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:scale-[1.02]">
                  
                  {/* Profile Header with Avatar */}
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <div className="relative">
                      {/* Avatar Container */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-0.5">
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                            <span className="relative z-10">{avatarLetter}</span>
                          </div>
                        </div>
                        
                        {/* Edit Button */}
                        {isEditing && (
                          <button className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-2 shadow-xl border-2 border-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 group">
                            <Camera size={14} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Name and Email */}
                    <div className="text-center space-y-2">
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {displayName}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium px-4 py-2 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg">
                        {formData.email}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Contact Info Cards */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30 hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-all duration-300">
                      <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <Phone size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Phone</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{formData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30 hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-all duration-300">
                      <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <MapPin size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Location</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{formData.location || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30 hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-all duration-300">
                      <div className="flex-shrink-0 p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Calendar size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Birthday</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Preferred Sports - Display Mode */}
              {!isEditing && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative group mt-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-500 group-hover:shadow-2xl">
                    <h3 className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-lg mb-4 flex items-center space-x-2">
                      <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z"/>
                        </svg>
                      </div>
                      <span>Preferred Sports</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.preferredSports.length > 0 ? (
                        formData.preferredSports.map((sport) => (
                          <span
                            key={sport}
                            className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm"
                          >
                            {sport}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No preferred sports selected.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Enhanced Detailed Information */}
            <div className="xl:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-all duration-500 group-hover:shadow-3xl">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 sm:mb-8 flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                      <User size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>Personal Information</span>
                  </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Enhanced First Name */}
                  <div className="group">
                    <label className="flex text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 items-center space-x-2">
                      <span>First Name</span>
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base font-medium"
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && <div className="text-red-500 text-xs mt-2 font-medium">{formErrors.firstName[0]}</div>}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 font-medium break-words">{formData.firstName || 'N/A'}</p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Last Name */}
                  <div className="group">
                    <label className="flex text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 items-center space-x-2">
                      <span>Last Name</span>
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base font-medium"
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && <div className="text-red-500 text-xs mt-2 font-medium">{formErrors.lastName[0]}</div>}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 font-medium break-words">{formData.lastName || 'N/A'}</p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Email (Read-only) */}
                  <div className="lg:col-span-2 group">
                    <label className="flex text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 items-center space-x-2">
                      <Mail size={16} className="text-blue-500" />
                      <span>Email Address</span>
                    </label>
                    <div className="relative">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm sm:text-base text-blue-800 dark:text-blue-300 font-medium break-all">{formData.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Phone Number */}
                  <div className="group">
                    <label className="flex text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 items-center space-x-2">
                      <Phone size={16} className="text-green-500" />
                      <span>Phone Number</span>
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base font-medium"
                          placeholder="Enter your phone number"
                        />
                        {formErrors.phone && <div className="text-red-500 text-xs mt-2 font-medium">{formErrors.phone[0]}</div>}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 font-medium break-words">{formData.phone || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Date of Birth */}
                  <div className="group">
                    <label className="flex text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 items-center space-x-2">
                      <Calendar size={16} className="text-purple-500" />
                      <span>Date of Birth</span>
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base font-medium"
                        />
                        {formErrors.dateOfBirth && <div className="text-red-500 text-xs mt-2 font-medium">{formErrors.dateOfBirth[0]}</div>}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 font-medium">{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mt-6">
                  {/* Location, Address, Bio, Emergency Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="input-field"
                        />
                        {formErrors.location && <div className="text-red-500 text-xs mt-1">{formErrors.location[0]}</div>}
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-200">{formData.location || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                    {isEditing ? (
                      <>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="2"
                          className="input-field"
                        />
                        {formErrors.address && <div className="text-red-500 text-xs mt-1">{formErrors.address[0]}</div>}
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-200">{formData.address || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Bio</label>
                    {isEditing ? (
                      <>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="3"
                          className="input-field text-sm sm:text-base"
                          placeholder="Tell us about yourself..."
                        />
                        {formErrors.bio && <div className="text-red-500 text-xs mt-1">{formErrors.bio[0]}</div>}
                      </>
                    ) : (
                      <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 break-words">{formData.bio || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Emergency Contact</label>
                    {isEditing ? (
                      <>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          className="input-field text-sm sm:text-base"
                        />
                        {formErrors.emergencyContact && <div className="text-red-500 text-xs mt-1">{formErrors.emergencyContact[0]}</div>}
                      </>
                    ) : (
                      <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 break-words">{formData.emergencyContact || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Sports Preferences - Edit Mode */}
                {isEditing && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Preferred Sports</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {sports.map((sport) => (
                        <label key={sport} className="flex items-center space-x-2 cursor-pointer p-1">
                          <input
                            type="checkbox"
                            checked={formData.preferredSports.includes(sport)}
                            onChange={() => handleSportToggle(sport)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                          />
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{sport}</span>
                        </label>
                      ))}
                    </div>
                    {formErrors.preferredSports && <div className="text-red-500 text-xs mt-1">{formErrors.preferredSports[0]}</div>}
                  </div>
                )}

                {/* Enhanced Action Buttons in Edit Mode */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                      onClick={handleCancelEdit}
                      className="group relative overflow-hidden w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
                      disabled={saveLoading}
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
                      disabled={saveLoading}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      {saveLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                      ) : (
                        <Save size={18} className="relative z-10" />
                      )}
                      <span className="relative z-10">{saveLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;