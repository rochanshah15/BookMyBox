import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Star, MapPin, Users, Map, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBox } from '../context/BoxContext';
import { useDebounce } from '../hooks/useDebounce';
import Loader from '../components/common/Loader';
import NearbyBoxesMap from '../components/maps/NearbyBoxesMap';

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
        // Allow search terms of any length including single characters
        const apiFilters = {
            search: debouncedSearchTerm,
            sport: localFilters.sport,
            location: localFilters.location,
            min_price: localFilters.priceRange[0],
            max_price: localFilters.priceRange[1],
            min_rating: localFilters.rating
        };
        
        console.log("BoxListings: Sending filters to context:", apiFilters);
        console.log("BoxListings: searchTerm:", searchTerm, "debouncedSearchTerm:", debouncedSearchTerm);
        setFilters(apiFilters);
    }, [debouncedSearchTerm, localFilters, setFilters]);

    const clearAllFilters = useCallback(() => {
        console.log("BoxListings: Clearing all filters");
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

    // Sorting is done on the client-side after fetching
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

    console.log("BoxListings: boxes from context:", boxes.length, "boxes");
    console.log("BoxListings: sortedBoxes:", sortedBoxes.length, "boxes");
    console.log("BoxListings: loading:", loading, "error:", error);
    console.log("BoxListings: current filters:", localFilters);
    console.log("BoxListings: current searchTerm:", searchTerm);

    const sports = ['Cricket', 'Football', 'Badminton', 'Padel', 'Squash', 'Basketball', 'Multisport', 'Skating', 'Cycling', 'Futsal', 'Watersports', 'Yoga', 'Archery'];
    const locations = [
        'Ahmedabad', 'Kolkata', 'Goa', 'Jaipur', 'Lucknow', 'Bhopal',
        'Indore', 'Chandigarh', 'Hyderabad', 'Chennai', 'Bengaluru',
        'Pune', 'Delhi', 'Mumbai'
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
            <div className="container-max section-padding">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Sports Boxes</h1>
                    <p className="text-gray-600 dark:text-gray-400">Find the perfect sports facility for your game</p>
                </motion.div>

                {/* Search and Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-200"
                >
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search by box name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearAllFilters}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Controls - Responsive Layout */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            {/* First Row: Map and Filters buttons */}
                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={() => setShowMap(true)}
                                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base flex-1 sm:flex-initial"
                                >
                                    <Map size={18} />
                                    <span className="hidden xs:inline">View on Map</span>
                                    <span className="xs:hidden">Map</span>
                                </button>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm sm:text-base flex-1 sm:flex-initial ${
                                        showFilters
                                            ? 'bg-primary-500 text-white border-primary-500'
                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <Filter size={18} />
                                    <span>Filters</span>
                                </button>
                            </div>

                            {/* Second Row: Sort and View Mode */}
                            <div className="flex gap-2 sm:gap-3 sm:ml-auto">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="rating">Sort by Rating</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                        title="Grid View"
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                                        title="List View"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sport</label>
                                    <select
                                        value={localFilters.sport}
                                        onChange={(e) => handleFilterChange('sport', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">All Sports</option>
                                        {sports.map(sport => <option key={sport} value={sport}>{sport}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                                    <select
                                        value={localFilters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price Range: ₹{localFilters.priceRange[0]} - ₹{localFilters.priceRange[1]}
                                    </label>
                                    <input
                                        type="range"
                                        min="0" max="5000" step="100"
                                        value={localFilters.priceRange[1]}
                                        onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</label>
                                    <select
                                        value={localFilters.rating}
                                        onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="0">Any Rating</option>
                                        <option value="3">3+ Stars</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Clear filters button in panel */}
                            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Use filters to narrow down your search results
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Results */}
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        {loading ? 'Searching...' : `${sortedBoxes.length} boxes found`}
                    </p>
                    {sortedBoxes.length > 0 && (
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                            Sorted by {sortBy === 'rating' ? 'Rating' : sortBy === 'price-low' ? 'Price (Low to High)' : sortBy === 'price-high' ? 'Price (High to Low)' : 'Name'}
                        </p>
                    )}
                </div>

                {loading && (
                    <div className="flex justify-center py-12"><Loader text="Loading boxes..." /></div>
                )}
                {error && (
                    <div className="text-center py-12 text-red-600"><p>{error}</p></div>
                )}

                {/* Boxes Grid/List */}
                {!loading && !error && sortedBoxes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                                : 'space-y-4 sm:space-y-6'
                        }
                    >
                        {sortedBoxes.map((box, index) => (
                            <motion.div
                                key={box.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`card hover:shadow-xl transition-all duration-300 ${
                                    viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                                }`}
                            >
                                <div className={`relative ${viewMode === 'list' ? 'sm:w-1/3' : ''}`}>
                                    <img src={box.image} alt={box.name} className={`w-full object-cover ${viewMode === 'list' ? 'h-48 sm:h-full' : 'h-40 sm:h-48'}`} />
                                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                                        <Star size={14} className="text-yellow-500 fill-current" />
                                        <span className="text-xs sm:text-sm font-medium">{box.rating ? parseFloat(box.rating).toFixed(1) : 'N/A'}</span>
                                    </div>
                                </div>
                                <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'sm:w-2/3 flex flex-col justify-between' : ''}`}>
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{box.name}</h3>
                                            <span className="text-primary-600 dark:text-primary-400 font-bold text-sm sm:text-base whitespace-nowrap">₹{box.price}/hr</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                                            <MapPin size={14} className="mr-1 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm truncate">{box.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                                            <Users size={14} className="mr-1 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm">Up to {box.capacity} players</span>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Sport:</p>
                                            <div className="flex flex-wrap gap-1">
                                                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full font-medium">{box.sport}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{box.description}</p>
                                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                                            {(box.amenities || []).slice(0, viewMode === 'grid' ? 2 : 3).map((amenity, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full truncate">{amenity}</span>
                                            ))}
                                            {(box.amenities || []).length > (viewMode === 'grid' ? 2 : 3) && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                                    +{(box.amenities || []).length - (viewMode === 'grid' ? 2 : 3)} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Link to={`/boxes/${box.id}`} className="btn-primary text-center block text-sm sm:text-base py-2 sm:py-3">
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* No Results */}
                {!loading && !error && sortedBoxes.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-600 mb-4"><Search size={64} className="mx-auto" /></div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No boxes found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search criteria or filters</p>
                        <button
                            onClick={clearAllFilters}
                            className="btn-primary"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Nearby Boxes Map */}
            <NearbyBoxesMap
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                boxes={boxes}
            />
        </div>
    );
};

export default BoxListings;