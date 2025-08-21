import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Star, MapPin, Users, Map, X, ArrowRight, Sparkles, Target, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBox } from '../context/BoxContext';
import { useDebounce } from '../hooks/useDebounce';
import Loader from '../components/common/Loader';
import NearbyBoxesMap from '../components/maps/NearbyBoxesMap';
import { animations, gradientText, shadows, useScrollAnimation, glassMorphism } from '../utils/animations';
import { EnhancedButton, EnhancedCard, EnhancedInput, EnhancedBadge } from '../components/common/EnhancedComponents';

const BoxListings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('rating');
    const [showFilters, setShowFilters] = useState(false);
    const [showMap, setShowMap] = useState(false);
    
    const [localFilters, setLocalFilters] = useState({
        sport: '',
        location: '',
        priceRange: [0, 5000],
        rating: 0
    });

    const { boxes, loading, error, setFilters, clearFiltersAndRefresh } = useBox();
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const apiFilters = {
            search: debouncedSearchTerm,
            sport: localFilters.sport,
            location: localFilters.location,
            min_price: localFilters.priceRange[0],
            max_price: localFilters.priceRange[1],
            min_rating: localFilters.rating
        };
        
        setFilters(apiFilters);
    }, [debouncedSearchTerm, localFilters, setFilters]);

    const clearAllFilters = useCallback(() => {
        setSearchTerm('');
        setLocalFilters({
            sport: '',
            location: '',
            priceRange: [0, 5000],
            rating: 0
        });
        clearFiltersAndRefresh();
    }, [clearFiltersAndRefresh]);

    const handleFilterChange = useCallback((key, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const sortedBoxes = [...boxes].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
            case 'price-high':
                return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
            case 'rating':
                return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const sports = ['Cricket', 'Football', 'Badminton', 'Padel', 'Squash', 'Basketball', 'Multisport', 'Skating', 'Cycling', 'Futsal', 'Watersports', 'Yoga', 'Archery'];
    const locations = [
        'Ahmedabad', 'Kolkata', 'Goa', 'Jaipur', 'Lucknow', 'Bhopal',
        'Indore', 'Chandigarh', 'Hyderabad', 'Chennai', 'Bengaluru',
        'Pune', 'Delhi', 'Mumbai'
    ];

    const BoxCard = ({ box, index }) => (
        <motion.div
            variants={animations.staggerItem}
            className="group"
        >
            <EnhancedCard hover className="overflow-hidden p-0 h-full">
                <div className="relative overflow-hidden">
                    <img
                        src={box.image}
                        alt={box.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.div 
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center space-x-1"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-900">{box.rating}</span>
                    </motion.div>

                    <div className="absolute top-4 left-4">
                        <EnhancedBadge variant="primary" size="sm">
                            {box.sport || 'Multi-sport'}
                        </EnhancedBadge>
                    </div>

                    {/* Hover overlay */}
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                    >
                        <EnhancedButton
                            as={Link}
                            to={`/boxes/${box.id}`}
                            variant="secondary"
                            size="sm"
                            icon={<ArrowRight size={16} />}
                            className="bg-white/90 text-gray-900 backdrop-blur-sm"
                        >
                            View Details
                        </EnhancedButton>
                    </motion.div>
                </div>
                
                <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {box.name}
                        </h3>
                        <span className={`text-xl font-bold ${gradientText}`}>
                            ₹{box.price}/hr
                        </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin size={16} className="mr-2 text-blue-500" />
                            <span className="text-sm">{box.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Users size={16} className="mr-2 text-green-500" />
                            <span className="text-sm">Up to {box.capacity} players</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock size={16} className="mr-2 text-purple-500" />
                            <span className="text-sm">Available today</span>
                        </div>
                    </div>

                    <EnhancedButton
                        as={Link}
                        to={`/boxes/${box.id}`}
                        className="w-full"
                        size="md"
                        icon={<Target size={16} />}
                    >
                        Book Now
                    </EnhancedButton>
                </div>
            </EnhancedCard>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            {/* Enhanced Header */}
            <motion.section 
                className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                {...animations.pageTransition}
            >
                {/* Background Elements */}
                <motion.div 
                    className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
                    {...animations.cardFloat}
                />

                <div className="max-w-7xl mx-auto">
                    <motion.div
                        {...animations.slideInUp}
                        {...useScrollAnimation()}
                        className="text-center mb-12"
                    >
                        <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${gradientText}`}>
                            Discover Sports Boxes
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Find and book the perfect sports facility for your game from our curated collection of premium venues
                        </p>
                    </motion.div>

                    {/* Enhanced Search and Controls */}
                    <motion.div 
                        className="max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <EnhancedCard glass className="p-6 backdrop-blur-xl border-0">
                            <div className="flex flex-col lg:flex-row gap-4 items-center">
                                {/* Enhanced Search */}
                                <div className="flex-1 w-full">
                                    <EnhancedInput
                                        icon={<Search size={20} />}
                                        placeholder="Search by name, sport, or location..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full text-lg"
                                    />
                                </div>

                                {/* Enhanced Controls */}
                                <div className="flex gap-3 w-full lg:w-auto">
                                    <EnhancedButton
                                        variant={showFilters ? 'primary' : 'secondary'}
                                        onClick={() => setShowFilters(!showFilters)}
                                        icon={<Filter size={18} />}
                                        className="flex-1 lg:flex-none"
                                    >
                                        Filters
                                    </EnhancedButton>

                                    <EnhancedButton
                                        variant={showMap ? 'primary' : 'secondary'}
                                        onClick={() => setShowMap(!showMap)}
                                        icon={<Map size={18} />}
                                        className="flex-1 lg:flex-none"
                                    >
                                        Map
                                    </EnhancedButton>

                                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                                        <motion.button
                                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-md' : ''}`}
                                            onClick={() => setViewMode('grid')}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Grid size={18} className={viewMode === 'grid' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'} />
                                        </motion.button>
                                        <motion.button
                                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-md' : ''}`}
                                            onClick={() => setViewMode('list')}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <List size={18} className={viewMode === 'list' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'} />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </EnhancedCard>
                    </motion.div>
                </div>
            </motion.section>

            {/* Enhanced Filters Panel */}
            {showFilters && (
                <motion.section 
                    className="px-4 sm:px-6 lg:px-8 pb-8"
                    {...animations.slideInUp}
                >
                    <div className="max-w-7xl mx-auto">
                        <EnhancedCard glass className="p-6 backdrop-blur-xl border-0">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Filter Results
                                </h3>
                                <div className="flex gap-3">
                                    <EnhancedButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllFilters}
                                    >
                                        Clear All
                                    </EnhancedButton>
                                    <motion.button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X size={20} />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Sport Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sport
                                    </label>
                                    <select
                                        value={localFilters.sport}
                                        onChange={(e) => handleFilterChange('sport', e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="">All Sports</option>
                                        {sports.map(sport => (
                                            <option key={sport} value={sport}>{sport}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <select
                                        value={localFilters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Minimum Rating
                                    </label>
                                    <select
                                        value={localFilters.rating}
                                        onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value={0}>Any Rating</option>
                                        <option value={4}>4+ Stars</option>
                                        <option value={4.5}>4.5+ Stars</option>
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="rating">Highest Rated</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name">Name A-Z</option>
                                    </select>
                                </div>
                            </div>
                        </EnhancedCard>
                    </div>
                </motion.section>
            )}

            {/* Enhanced Map View */}
            {showMap && (
                <motion.section 
                    className="px-4 sm:px-6 lg:px-8 pb-8"
                    {...animations.slideInUp}
                >
                    <div className="max-w-7xl mx-auto">
                        <EnhancedCard className="p-0 overflow-hidden">
                            <div className="h-96">
                                <NearbyBoxesMap boxes={sortedBoxes} />
                            </div>
                        </EnhancedCard>
                    </div>
                </motion.section>
            )}

            {/* Enhanced Results Section */}
            <section className="px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-7xl mx-auto">
                    {/* Results Header */}
                    <motion.div 
                        className="flex items-center justify-between mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {sortedBoxes.length} Sports Boxes Found
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {searchTerm && `Results for "${searchTerm}"`}
                            </p>
                        </div>
                        
                        {(searchTerm || localFilters.sport || localFilters.location || localFilters.rating > 0) && (
                            <EnhancedButton
                                variant="ghost"
                                onClick={clearAllFilters}
                                icon={<X size={16} />}
                            >
                                Clear Filters
                            </EnhancedButton>
                        )}
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center py-16">
                            <Loader text="Finding perfect sports boxes..." />
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <motion.div 
                            className="text-center py-16"
                            {...animations.slideInUp}
                        >
                            <EnhancedCard className="max-w-md mx-auto p-8 text-center">
                                <div className="text-red-500 mb-4">
                                    <X size={48} className="mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Oops! Something went wrong
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {error}
                                </p>
                                <EnhancedButton onClick={() => window.location.reload()}>
                                    Try Again
                                </EnhancedButton>
                            </EnhancedCard>
                        </motion.div>
                    )}

                    {/* Enhanced Results Grid */}
                    {!loading && !error && (
                        <>
                            {sortedBoxes.length === 0 ? (
                                <motion.div 
                                    className="text-center py-16"
                                    {...animations.slideInUp}
                                >
                                    <EnhancedCard className="max-w-md mx-auto p-8 text-center">
                                        <motion.div 
                                            className="text-gray-400 mb-4"
                                            {...animations.iconBounce}
                                        >
                                            <Sparkles size={48} className="mx-auto" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            No boxes found
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            Try adjusting your search criteria or clear the filters
                                        </p>
                                        <EnhancedButton onClick={clearAllFilters}>
                                            Clear All Filters
                                        </EnhancedButton>
                                    </EnhancedCard>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className={`grid gap-8 ${
                                        viewMode === 'grid' 
                                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                                            : 'grid-cols-1'
                                    }`}
                                    variants={animations.staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                >
                                    {sortedBoxes.map((box, index) => (
                                        <BoxCard key={box.id} box={box} index={index} />
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BoxListings;
