import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X, Send } from 'lucide-react';
import { api } from '../../api.jsx';
import { EnhancedButton } from './EnhancedComponents';
import { toast } from 'react-toastify';

const AddReviewForm = ({ isOpen, onClose, boxId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post(`/boxes/public/${boxId}/add_review/`, {
        rating: rating,
        comment: comment.trim()
      });

      toast.success('Review added successfully!');
      onReviewAdded?.(response.data);
      onClose();
      
      // Reset form
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Error adding review:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          'Failed to add review. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Your Review</h2>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this sports box..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.length}/500 characters
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3">
            <EnhancedButton
              type="button"
              onClick={handleClose}
              variant="secondary"
              size="md"
              className="flex-1"
            >
              Cancel
            </EnhancedButton>
            <EnhancedButton
              type="submit"
              variant="primary"
              size="md"
              className="flex-1"
              loading={isSubmitting}
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              icon={<Send size={16} />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </EnhancedButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddReviewForm;
