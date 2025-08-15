import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Star, MapPin, Users, Map } from 'lucide-react';
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

    // --- FIX 1: Simplified price filter state for clarity ---
    const [localFilters, setLocalFilters] = useState({
        sport: '',
        location: '',
        maxPrice: 1000, // Now a single value, not an array
        rating: 0
    });

    const { boxes, loading, error, setFilters } = useBox();
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // --- FIX 2: Stabilized useEffect to prevent infinite loops ---
    // By converting the filters object to a string, we create a stable primitive
    // value for the dependency array. This prevents re-renders.
    const filtersString = JSON.stringify(localFilters);

    useEffect(() => {
        const apiFilters = {
            search: debouncedSearchTerm,
            sport: localFilters.sport,
            location: localFilters.location,
            min_price: 0,
            max_price: localFilters.maxPrice, // Use the simplified state
            min_rating: localFilters.rating
        };
        
        console.log("Filters sent to context:", apiFilters);
        setFilters(apiFilters);
        // The setFilters function from context is stable and does not need to be a dependency.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, filtersString]);

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };
    
    // Client-side sorting is efficient for smaller, filtered datasets
    const sortedBoxes = [...boxes].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return (a.price || 0) - (b.price || 0);
            case 'price-high':
                return (b.price || 0) - (a.price || 0);
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const sports = ['Cricket', 'Football', 'Badminton', 'Padel', 'Squash', 'Basketball', 'Multisport', 'Skating', 'Cycling', 'Futsal', 'Watersports', 'Yoga', 'Archery'];
    const locations = ['Ahmedabad', 'Kolkata', 'Goa', 'Jaipur', 'Lucknow', 'Bhopal', 'Indore', 'Chandigarh', 'Hyderabad', 'Chennai', 'Bengaluru', 'Pune', 'Delhi', 'Mumbai'];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-max section-padding">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Sports Boxes</h1>
                    <p className="text-gray-600">Find the perfect sports facility for your game</p>
                </motion.div>

                {/* Search and Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search boxes, sports, or locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowMap(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Map size={20} />
                                <span>View on Map</span>
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                                    showFilters
                                        ? 'bg-primary-500 text-white border-primary-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <Filter size={20} />
                                <span>Filters</span>
                            </button>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="rating">Sort by Rating</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
                                    <select
                                        value={localFilters.sport}
                                        onChange={(e) => handleFilterChange('sport', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">All Sports</option>
                                        {sports.map(sport => <option key={sport} value={sport}>{sport}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <select
                                        value={localFilters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Price: ₹{localFilters.maxPrice}
                                    </label>
                                    <input
                                        type="range"
                                        min="0" max="1000" step="50"
                                        value={localFilters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value, 10))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                                    <select
                                        value={localFilters.rating}
                                        onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="0">Any Rating</option>
                                        <option value="3">3+ Stars</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Results */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-600">
                        {loading ? 'Searching...' : `${sortedBoxes.length} boxes found`}
                    </p>
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
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-6'
                        }
                    >
                        {sortedBoxes.map((box, index) => (
                            <motion.div
                                key={box.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`card hover:shadow-xl transition-all duration-300 ${
                                    viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                                }`}
                            >
                                <div className={`relative ${viewMode === 'list' ? 'md:w-1/3' : ''}`}>
                                    <img src={box.image} alt={box.name} className={`w-full object-cover ${viewMode === 'list' ? 'h-48 md:h-full' : 'h-48'}`} />
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg flex items-center space-x-1">
                                        <Star size={16} className="text-yellow-500 fill-current" />
                                        <span className="text-sm font-medium">{box.rating ? parseFloat(box.rating).toFixed(1) : 'N/A'}</span>
                                    </div>
                                </div>
                                <div className={`p-6 ${viewMode === 'list' ? 'md:w-2/3 flex flex-col justify-between' : ''}`}>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{box.name}</h3>
                                            <span className="text-primary-600 font-bold">₹{box.price}/hr</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <MapPin size={16} className="mr-1" />
                                            <span className="text-sm">{box.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-3">
                                            <Users size={16} className="mr-1" />
                                            <span className="text-sm">Up to {box.capacity} players</span>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-sm text-gray-600 mb-1">Sport:</p>
                                            <div className="flex flex-wrap gap-1">
                                                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">{box.sport}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{box.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {(box.amenities || []).slice(0, 3).map((amenity, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{amenity}</span>
                                            ))}
                                            {(box.amenities || []).length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                    +{(box.amenities || []).length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Link to={`/boxes/${box.id}`} className="btn-primary text-center block">
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
                        <div className="text-gray-400 mb-4"><Search size={64} className="mx-auto" /></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No boxes found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setLocalFilters({ sport: '', location: '', maxPrice: 1000, rating: 0 });
                                setShowFilters(false);
                            }}
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