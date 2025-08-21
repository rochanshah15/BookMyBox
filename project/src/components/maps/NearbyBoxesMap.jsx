import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, DollarSign, AlertCircle, Search } from 'lucide-react';
import { useBox } from '../../context/BoxContext';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color = 'blue', isSelected = false) => {
    return L.divIcon({
        className: `custom-marker ${isSelected ? 'selected-marker' : ''}`,
        html: `
            <div style="
                background-color: ${color}; 
                width: ${isSelected ? '30px' : '20px'}; 
                height: ${isSelected ? '30px' : '20px'}; 
                border-radius: 50%; 
                border: 3px solid white; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease-in-out;
            ">
                ${isSelected ? '<span style="color: white; font-size: 16px;">📍</span>' : ''}
            </div>
        `,
        iconSize: isSelected ? [30, 30] : [20, 20],
        iconAnchor: isSelected ? [15, 15] : [10, 10]
    });
};

const LocationMarker = ({ userLocation, onLocationFound }) => {
    const map = useMap();

    useEffect(() => {
        if (!userLocation) {
            map.locate({ setView: true, maxZoom: 13, enableHighAccuracy: true }) // Request high accuracy
                .on('locationfound', (e) => {
                    onLocationFound({ lat: e.latlng.lat, lng: e.latlng.lng });
                    map.flyTo(e.latlng, map.getZoom()); // Smoothly fly to user location
                })
                .on('locationerror', (e) => {
                    console.error("Location error:", e.message);
                    let userFriendlyMessage = "We couldn't retrieve your exact location. ";
                    
                    switch (e.code) {
                        case e.PERMISSION_DENIED:
                            userFriendlyMessage += "You denied permission to access your location. To see boxes near you, please allow location access for this site in your browser settings.";
                            break;
                        case e.POSITION_UNAVAILABLE:
                            userFriendlyMessage += "Your location information is currently unavailable. This might be due to network issues or your device settings.";
                            break;
                        case e.TIMEOUT:
                            userFriendlyMessage += "The request to get your location timed out. Please ensure you have a stable internet connection or try again.";
                            break;
                        default:
                            userFriendlyMessage += "An unexpected error occurred while trying to find your location.";
                    }
                    userFriendlyMessage += " Defaulting to Mumbai for search results.";
                    
                    // Display an alert for the user
                    alert(userFriendlyMessage);

                    // Default to Mumbai if location access denied or fails
                    const defaultLocation = { lat: 19.0760, lng: 72.8777 }; // Mumbai coordinates
                    map.setView([defaultLocation.lat, defaultLocation.lng], 13);
                    onLocationFound(defaultLocation);
                });
        } else {
            // If userLocation is already set, ensure map is centered on it
            map.setView([userLocation.lat, userLocation.lng], map.getZoom());
        }
    }, [map, userLocation, onLocationFound]);

    if (!userLocation) return null;

    return (
        <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={createCustomIcon('#ef4444')} // Red for user location
        >
            <Popup>
                <div className="text-center font-semibold">
                    Your Location 📍
                </div>
            </Popup>
        </Marker>
    );
};

const NearbyBoxesMap = ({ isOpen, onClose }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [selectedBox, setSelectedBox] = useState(null);
    const [searchRadius, setSearchRadius] = useState(20); // Default search radius in km
    
    // Destructure from BoxContext
    const { nearbyBoxes, fetchNearbyBoxes, loading, error } = useBox();

    const mapRef = useRef(); // Ref for the MapContainer instance

    // Use useCallback for handleLocationFound to make it stable across renders
    const handleLocationFound = useCallback((location) => {
        console.log('NearbyBoxesMap: Location found:', location);
        setUserLocation(location);
    }, []);

    useEffect(() => {
        if (userLocation) {
            // Fetch nearby boxes whenever userLocation or searchRadius changes
            console.log('NearbyBoxesMap: Fetching nearby boxes with location:', userLocation, 'radius:', searchRadius);
            fetchNearbyBoxes(userLocation.lat, userLocation.lng, searchRadius); 
        }
    }, [userLocation, searchRadius, fetchNearbyBoxes]);

    // Function to re-center map on a specific box
    const handleSelectBox = (box) => {
        setSelectedBox(box);
        if (mapRef.current && box.coordinates) {
            mapRef.current.flyTo(box.coordinates, 15); // Fly to the box location with a zoom level of 15
        }
    };

    // Haversine formula to calculate distance between two lat/lng points in kilometers
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} // Added for exit animation if you implement it
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col shadow-xl" // Increased height
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                            <MapPin size={28} className="text-primary-600" /> Nearby Sports Boxes
                        </h2>
                        <p className="text-gray-600 mt-1">Discover and book sports facilities near you.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Map */}
                    <div className="flex-1 relative">
                        <MapContainer
                            ref={mapRef} // Assign ref here
                            center={userLocation ? [userLocation.lat, userLocation.lng] : [19.0760, 72.8777]} // Default to Mumbai
                            zoom={13}
                            scrollWheelZoom={true} // Enable scroll zoom
                            style={{ height: '100%', width: '100%' }}
                            whenCreated={mapInstance => { mapRef.current = mapInstance; }} // Alternative way to set ref for MapContainer
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            <LocationMarker 
                                userLocation={userLocation} 
                                onLocationFound={handleLocationFound} 
                            />
                            
                            {/* Render nearby boxes as markers */}
                            {nearbyBoxes.map((box) => (
                                <Marker
                                    key={box.id}
                                    position={box.coordinates} // Assuming box.coordinates is [latitude, longitude]
                                    icon={createCustomIcon('#10b981', selectedBox?.id === box.id)} // Green for sports boxes, highlighted if selected
                                    eventHandlers={{
                                        click: () => handleSelectBox(box)
                                    }}
                                >
                                    <Popup>
                                        <div className="min-w-56 p-2">
                                            <h3 className="font-bold text-lg text-gray-900 mb-2">{box.name}</h3>
                                            <div className="space-y-1 text-sm text-gray-700">
                                                <div className="flex items-center">
                                                    <Star size={16} className="text-yellow-500 fill-current mr-2" />
                                                    <span>{box.rating ? box.rating.toFixed(1) : 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <DollarSign size={16} className="text-green-600 mr-2" />
                                                    <span>₹{box.price}/hr</span>
                                                </div>
                                                <p className="text-gray-600 font-medium">{box.sports.join(', ')}</p>
                                                {userLocation && box.coordinates && ( 
                                                    <p className="text-primary-600 font-semibold flex items-center">
                                                        <Navigation size={16} className="mr-2 transform rotate-90 text-primary-500" />
                                                        {calculateDistance(
                                                            userLocation.lat, userLocation.lng,
                                                            box.coordinates[0], box.coordinates[1]
                                                        ).toFixed(1)} km away
                                                    </p>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => {/* Implement navigation to box details page */ alert(`Navigating to ${box.name} details!`)}}
                                                className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-semibold"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Legend and Search Radius Control */}
                        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] flex flex-col gap-3">
                            <h4 className="font-bold text-gray-900 border-b pb-2 mb-2">Map Controls</h4>
                            <div className="space-y-2 text-sm">
                                <p className="font-medium text-gray-800">Legend:</p>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2 shadow-sm"></div>
                                    <span>Your Location</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2 shadow-sm"></div>
                                    <span>Sports Boxes</span>
                                </div>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <label htmlFor="search-radius" className="font-medium text-gray-800 flex items-center gap-1 mb-2">
                                    <Search size={16} /> Search Radius: <span className="font-semibold text-primary-600">{searchRadius} km</span>
                                </label>
                                <input
                                    id="search-radius"
                                    type="range"
                                    min="5"
                                    max="100"
                                    step="5"
                                    value={searchRadius}
                                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-primary-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
                        <div className="p-6 flex-shrink-0 border-b border-gray-200">
                            <h3 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                                <MapPin size={24} className="text-gray-700" />
                                Nearby Boxes ({loading ? '...' : nearbyBoxes.length})
                            </h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {loading ? (
                                <div className="text-center py-12 flex flex-col items-center justify-center">
                                    <svg className="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-lg text-gray-700 font-medium">Finding nearby boxes...</p>
                                    <p className="text-sm text-gray-500 mt-1">This might take a moment.</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12 flex flex-col items-center justify-center">
                                    <AlertCircle size={60} className="text-red-500 mb-5" />
                                    <p className="text-xl text-red-600 font-bold mb-2">Error Loading Boxes</p>
                                    <p className="text-gray-700 text-base">{error}</p>
                                    <p className="text-sm text-gray-500 mt-2">Please check your internet connection or try again later.</p>
                                </div>
                            ) : nearbyBoxes.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center justify-center">
                                    <MapPin size={60} className="text-gray-400 mb-5" />
                                    <p className="text-xl text-gray-700 font-bold mb-2">No Sports Boxes Found</p>
                                    <p className="text-base text-gray-600">Try increasing the search radius or adjusting your location.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {nearbyBoxes.map((box) => (
                                        <motion.div
                                            key={box.id}
                                            whileHover={{ translateY: -3, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
                                            transition={{ duration: 0.2 }}
                                            className={`p-5 bg-white rounded-xl border cursor-pointer transition-all duration-200 ease-in-out ${
                                                selectedBox?.id === box.id ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => handleSelectBox(box)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-bold text-lg text-gray-900">{box.name}</h4>
                                                <div className="flex items-center text-sm font-semibold text-gray-800">
                                                    <Star size={16} className="text-yellow-500 fill-current mr-1" />
                                                    <span>{box.rating ? box.rating.toFixed(1) : 'N/A'}</span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 mb-3 leading-snug">{box.sports.join(', ')}</p>
                                            
                                            <div className="flex items-center justify-between text-base mb-3">
                                                <span className="text-primary-700 font-bold">₹{box.price}/hr</span>
                                                {userLocation && box.coordinates && ( 
                                                    <span className="text-gray-600 flex items-center gap-1">
                                                        <Navigation size={14} className="transform rotate-90" />
                                                        {calculateDistance(
                                                            userLocation.lat, userLocation.lng,
                                                            box.coordinates[0], box.coordinates[1]
                                                        ).toFixed(1)} km
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                                {box.amenities.slice(0, 3).map((amenity) => (
                                                    <span
                                                        key={amenity}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full shadow-sm"
                                                    >
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {box.amenities.length > 3 && (
                                                    <span className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full shadow-sm">
                                                        +{box.amenities.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NearbyBoxesMap;