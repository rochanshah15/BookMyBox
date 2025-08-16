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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your personal information and preferences</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit2 size={20} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* General Error/Success Messages */}
          {(globalProfileError || generalError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-6"
            >
              <Info size={20} />
              <p className="text-sm font-medium">{globalProfileError || generalError}</p>
            </motion.div>
          )}

          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-6"
            >
              <Info size={20} />
              <p className="text-sm font-medium">Profile updated successfully!</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 text-center"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto">
                    {avatarLetter}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{displayName}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{formData.email}</p>

                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formData.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{formData.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Preferred Sports - Display Mode */}
              {!isEditing && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-6 mt-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Preferred Sports</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredSports.length > 0 ? (
                      formData.preferredSports.map((sport) => (
                        <span
                          key={sport}
                          className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                        >
                          {sport}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No preferred sports selected.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="input-field"
                        />
                        {formErrors.firstName && <div className="text-red-500 text-xs mt-1">{formErrors.firstName[0]}</div>}
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-200">{formData.firstName || 'N/A'}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="input-field"
                        />
                        {formErrors.lastName && <div className="text-red-500 text-xs mt-1">{formErrors.lastName[0]}</div>}
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-200">{formData.lastName || 'N/A'}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <p className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">{formData.email || 'N/A'}</p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    {isEditing ? (
                      <>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-field"
                        />
                        {formErrors.phone && <div className="text-red-500 text-xs mt-1">{formErrors.phone[0]}</div>}
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-200">{formData.phone || 'N/A'}</p>
                    )}
                  </div>
                  
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                    {isEditing ? (
                      <>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="input-field"
                        />
                        {formErrors.dateOfBirth && <div className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth[0]}</div>}
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-200">{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                    {isEditing ? (
                      <>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="3"
                          className="input-field"
                          placeholder="Tell us about yourself..."
                        />
                        {formErrors.bio && <div className="text-red-500 text-xs mt-1">{formErrors.bio[0]}</div>}
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-200">{formData.bio || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Contact</label>
                    {isEditing ? (
                      <>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          className="input-field"
                        />
                        {formErrors.emergencyContact && <div className="text-red-500 text-xs mt-1">{formErrors.emergencyContact[0]}</div>}
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-200">{formData.emergencyContact || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Sports Preferences - Edit Mode */}
                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preferred Sports</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {sports.map((sport) => (
                        <label key={sport} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.preferredSports.includes(sport)}
                            onChange={() => handleSportToggle(sport)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{sport}</span>
                        </label>
                      ))}
                    </div>
                    {formErrors.preferredSports && <div className="text-red-500 text-xs mt-1">{formErrors.preferredSports[0]}</div>}
                  </div>
                )}

                {/* Action Buttons in Edit Mode */}
                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      disabled={saveLoading}
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center space-x-2"
                      disabled={saveLoading}
                    >
                      {saveLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save size={20} />
                      )}
                      <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;