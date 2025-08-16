import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, MapPin, Users, Wifi, Car, Coffee, Shield, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import Calendar from 'react-calendar';
import { useBox } from '../context/BoxContext';
import { useBooking } from '../context/BookingContext';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-calendar/dist/Calendar.css';

// Assuming your api.js exports an axios instance
import { api, useAuth } from '../api.jsx'; // Adjust this path if your axios instance is exported differently
import { toast } from 'react-toastify';

const BoxDetails = () => {
    const { id } = useParams();
    const [box, setBox] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [duration, setDuration] = useState(1);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingData, setBookingData] = useState(null); // Still useful to hold temporary data for booking submission
    const [error, setError] = useState(null); // State for handling fetch errors
    const { boxes } = useBox(); // Keeping useBox for potential general box list, but fetching specific details via API
    const { createBooking } = useBooking();
    const { isAuthenticated, user } = useAuth();

    // Check if box is already in favorites on mount or when user/box changes
    useEffect(() => {
        const checkFavorite = async () => {
            if (!user || !box?.id) return;
            try {
                const res = await api.get('/dashboard/favorites/');
                const favs = res.data || [];
                setIsFavorite(favs.some(fav => fav.id === box.id));
            } catch (e) {
                // Ignore error
            }
        };
        checkFavorite();
    }, [user, box?.id]);

    const handleAddToFavorites = async () => {
        if (!user) {
            toast.info('Please login to add to favorites');
            return;
        }
        setFavoriteLoading(true);
        try {
            await api.post('/dashboard/favorites/', { box_id: box.id });
            toast.success('Added to favorites!');
            setIsFavorite(true);
            window.dispatchEvent(new Event('favorite-added'));
        } catch (err) {
            toast.error('Could not add to favorites');
        } finally {
            setFavoriteLoading(false);
        }
    };

    // ...existing code...

    useEffect(() => {
        const fetchBoxDetails = async () => {
            setLoading(true);
            setError(null); // Clear previous errors
            try {
                // Fetch box details from the backend using the imported 'api' (Axios instance)
                const response = await api.get(`/boxes/${id}/`); // Adjust this endpoint to your actual backend API
                const fetchedBox = response.data;

                // Ensure rating is a number (backend might send it as string or number)
                if (fetchedBox && typeof fetchedBox.rating === 'string') {
                    fetchedBox.rating = parseFloat(fetchedBox.rating);
                }
                // Default to 0 if rating is null/undefined
                if (fetchedBox && (fetchedBox.rating === undefined || fetchedBox.rating === null)) {
                    fetchedBox.rating = 0;
                }

                setBox(fetchedBox);
            } catch (err) {
                console.error('Error fetching box details:', err);
                setError('Failed to load box details. Please try again later.');
                setBox(null); // Ensure box is null on error
            } finally {
                setLoading(false);
            }
        };

        fetchBoxDetails();
    }, [id]); // Depend only on 'id' as 'boxes' context might not always have full details

    const timeSlots = [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00'
    ];

    const amenityIcons = {
        'Changing Room': Users,
        'Parking': Car,
        'Equipment': Shield,
        'WiFi': Wifi,
        'Refreshments': Coffee,
        'Security': Shield
    };

    // This function now directly handles the booking submission to the backend
    const confirmBooking = async () => {
        if (!isAuthenticated) {
            alert('Please login to book a box');
            return;
        }

        if (!selectedTimeSlot) {
            alert('Please select a time slot');
            return;
        }

        const startTimeParts = selectedTimeSlot.split(':');
        const startHour = parseInt(startTimeParts[0]);
        const startMinute = parseInt(startTimeParts[1]);

        const endHour = (startHour + duration) % 24;
        const endMinute = startMinute;

        const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

        const bookingPayload = {
            user: user.id, // Assuming user.id is available from useAuth
            // --- MODIFIED HERE ---
            // Changed 'box' to 'boxId' to match backend expectation
            boxId: box.id,
            date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
            // Changed 'start_time' to 'startTime' to match backend expectation
            startTime: selectedTimeSlot,
            end_time: endTime, // Keep as is if backend expects snake_case for end_time
            duration: duration, // 'duration' key is already correct
            // Changed 'total_amount' to 'totalAmount' for consistency, assuming backend also expects this
            totalAmount: parseFloat((box.price * duration).toFixed(2)),
            paymentStatus: 'Not Required', // Changed 'payment_status' to 'paymentStatus'
            bookingStatus: 'Confirmed', // Changed 'booking_status' to 'bookingStatus'
            // --- END MODIFIED ---
        };

        setBookingLoading(true);
        setShowBookingModal(false); // Close the confirmation modal immediately

        try {
            // Call the createBooking function from your BookingContext
            // This function should use axios internally to send data to your backend
            const result = await createBooking(bookingPayload);

            if (result.success) {
                alert('Booking confirmed successfully! 🎉');
                // Reset booking form fields
                setSelectedTimeSlot('');
                setDuration(1);
                setSelectedDate(new Date());
            } else {
                console.error('Backend booking creation failed:', result.error);
                alert(`Booking failed: ${result.error || 'Please try again.'} 🙁`);
            }
        } catch (error) {
            console.error('Booking confirmation error:', error);
            alert('Booking failed due to an unexpected error. Please contact support. 😟');
        } finally {
            setBookingLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
                <Loader text="Loading box details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
                    <Link to="/boxes" className="btn-primary">
                        Browse Other Boxes
                    </Link>
                </div>
            </div>
        );
    }

    if (!box) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Box not found</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">The box you are looking for does not exist or has been removed.</p>
                    <Link to="/boxes" className="btn-primary">
                        Browse Other Boxes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Back Button */}
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors duration-200">
                <div className="container-max section-padding py-4">
                    <Link
                        to="/boxes"
                        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Boxes
                    </Link>
                </div>
            </div>

            <div className="container-max section-padding py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-0 overflow-hidden"
                        >
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                navigation
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 5000 }}
                                className="h-96"
                            >
                                {box.images?.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={image}
                                            alt={`${box.name} - Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>

                        {/* Box Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{box.name}</h1>
                                    <div className="flex items-center space-x-4 text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin size={18} className="mr-1" />
                                            <span>{box.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users size={18} className="mr-1" />
                                            <span>Up to {box.capacity} players</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center mb-2">
                                        <Star size={20} className="text-yellow-500 fill-current mr-1" />
                                        <span className="text-xl font-bold">
                                            {typeof box.rating === 'number' ? box.rating.toFixed(1) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="text-2xl font-bold text-primary-600">₹{box.price}/hr</div>
                                    {/* Add to Favorites Button */}
                                    {user && (
                                        <button
                                            onClick={handleAddToFavorites}
                                            className={`mt-3 px-4 py-2 rounded-lg shadow w-full transition-colors
                                                ${isFavorite ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                                            disabled={isFavorite || favoriteLoading}
                                        >
                                            {isFavorite ? 'Added' : (favoriteLoading ? 'Adding...' : 'Add to Favorites')}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {box.fullDescription || box.description}
                                </p>
                            </div>
                        </motion.div>

                        {/* Amenities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card p-6"
                        >
                            <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {box.amenities.map((amenity, index) => {
                                    const IconComponent = amenityIcons[amenity] || Shield;
                                    return (
                                        <div key={index} className="flex items-center space-x-2">
                                            <IconComponent size={18} className="text-primary-500" />
                                            <span className="text-gray-700">{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Rules */}
                        {box.rules && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="card p-6"
                            >
                                <h3 className="text-lg font-semibold mb-4">Rules & Guidelines</h3>
                                <ul className="space-y-2">
                                    {box.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-primary-500 mr-2">•</span>
                                            <span className="text-gray-700">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Reviews */}
                        {box.reviews && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="card p-6"
                            >
                                <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                                <div className="space-y-4">
                                    {box.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                                                        {review.user.charAt(0)}
                                                    </div>
                                                    <span className="font-medium">{review.user}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            className={`${
                                                                i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600">{review.comment}</p>
                                            <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card p-6 sticky top-8"
                        >
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <CalendarIcon size={20} className="mr-2" />
                                Book This Box
                            </h3>

                            {/* Calendar */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date
                                </label>
                                <Calendar
                                    onChange={setSelectedDate}
                                    value={selectedDate}
                                    minDate={new Date()}
                                    className="w-full"
                                />
                            </div>

                            {/* Time Slots */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Time Slot
                                </label>
                                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTimeSlot(time)}
                                            className={`p-2 text-sm rounded border transition-colors ${
                                                selectedTimeSlot === time
                                                    ? 'bg-primary-500 text-white border-primary-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (hours)
                                </label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    {[1, 2, 3, 4, 5, 6].map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour} hour{hour > 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Summary */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span>Price per hour:</span>
                                    <span>₹{box.price}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span>Duration:</span>
                                    <span>{duration} hour{duration > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                                    <span>Total:</span>
                                    <span className="text-primary-600">₹{box.price * duration}</span>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button
                                onClick={() => setShowBookingModal(true)} // Still opens confirmation modal first
                                className="w-full btn-primary"
                            >
                                Book Now
                            </button>

                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Free cancellation up to 2 hours before booking time
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            <Modal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                title="Confirm Booking"
                size="medium"
            >
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">{box.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p>Date: {selectedDate.toLocaleDateString()}</p>
                            <p>Time: {(() => {
                                const startTimeParts = selectedTimeSlot.split(':');
                                const startHour = parseInt(startTimeParts[0]);
                                const startMinute = parseInt(startTimeParts[1]);
                                const endHour = (startHour + duration) % 24;
                                const endMinute = startMinute;
                                return `${selectedTimeSlot} - ${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
                            })()}</p>
                            <p>Duration: {duration} hour{duration > 1 ? 's' : ''}</p>
                            <p className="font-semibold text-lg text-primary-600">
                                Total: ₹{box.price * duration}
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowBookingModal(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmBooking} // This now directly calls confirmBooking
                            disabled={bookingLoading}
                            className="flex-1 btn-primary disabled:opacity-50"
                        >
                            {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BoxDetails;