import { motion } from 'framer-motion';
import { X, MapPin, Users, Star, DollarSign, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

const ViewBoxModal = ({ isOpen, onClose, box }) => {
  if (!isOpen || !box) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{box.name}</h2>
            <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(box.status)}`}>
                {getStatusIcon(box.status)}
                <span className="ml-1 capitalize">{box.status}</span>
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Box Image */}
          {box.image && (
            <div className="mb-6">
              <img 
                src={box.image.startsWith('http') ? box.image : `http://localhost:8000${box.image}`}
                alt={box.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          )}

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPin size={18} className="text-blue-500 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">Location</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{box.location}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign size={18} className="text-green-500 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">Price</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">₹{box.price}/hour</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Users size={18} className="text-purple-500 mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">Capacity</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{box.capacity} people</p>
            </div>

            {box.avg_rating && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Star size={18} className="text-yellow-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">Rating</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{box.avg_rating}/5</p>
              </div>
            )}

            {box.created_at && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar size={18} className="text-indigo-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">Created</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(box.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Sports */}
          {box.sports && box.sports.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Available Sports</h3>
              <div className="flex flex-wrap gap-2">
                {box.sports.map((sport, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {box.amenities && box.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {box.amenities.map((amenity, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-2 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm"
                  >
                    <CheckCircle size={14} className="mr-2" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {box.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{box.description}</p>
            </div>
          )}

          {/* Full Description */}
          {box.full_description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Full Description</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{box.full_description}</p>
            </div>
          )}

          {/* Rules */}
          {box.rules && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rules</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{box.rules}</p>
            </div>
          )}

          {/* Contact Info */}
          {box.contact_info && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
              <p className="text-gray-600 dark:text-gray-300">{box.contact_info}</p>
            </div>
          )}

          {/* Coordinates */}
          {(box.latitude || box.longitude) && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Coordinates</h3>
              <div className="grid grid-cols-2 gap-4">
                {box.latitude && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Latitude:</span>
                    <p className="text-gray-900 dark:text-white">{box.latitude}</p>
                  </div>
                )}
                {box.longitude && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Longitude:</span>
                    <p className="text-gray-900 dark:text-white">{box.longitude}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewBoxModal;
