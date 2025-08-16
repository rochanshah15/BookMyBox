// src/context/BoxContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api.jsx'; // Make sure this path is correct for your project

const BoxContext = createContext();

export const useBox = () => {
    const context = useContext(BoxContext);
    if (context === undefined) {
        throw new Error('useBox must be used within a BoxProvider');
    }
    return context;
};

export const BoxProvider = ({ children }) => {
    const [boxes, setBoxes] = useState([]);
    const [featuredBoxes, setFeaturedBoxes] = useState([]);
    const [popularBoxes, setPopularBoxes] = useState([]);
    const [nearbyBoxes, setNearbyBoxes] = useState([]);
    const [ownerBoxes, setOwnerBoxes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    const processBoxData = useCallback((boxesArray) => {
        if (!Array.isArray(boxesArray)) return [];
        return boxesArray.map(box => ({
            ...box,
            rating: box.rating !== null ? parseFloat(box.rating) : null,
            coordinates: (box.latitude && box.longitude) ? [parseFloat(box.latitude), parseFloat(box.longitude)] : null
        })).filter(box => box.coordinates !== null);
    }, []);
    
    const addBox = useCallback(async (boxData) => {
        setLoading(true);
        setError(null);
        const formData = new FormData();
        // Always send 'sport' as first selected sport for backend compatibility
        if (boxData.sports && boxData.sports.length > 0) {
            formData.append('sport', boxData.sports[0]);
        }
        Object.keys(boxData).forEach(key => {
            if (key === 'images' || key === 'sport') return;
            let value = boxData[key];
            // For amenities, sports, rules: always send as JSON string
            if (["amenities", "sports", "rules"].includes(key)) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        // Add all images (multi-upload)
        if (boxData.images && boxData.images.length > 0) {
            boxData.images.forEach((file, idx) => {
                formData.append('images', file); // backend should handle images as a list
                if (idx === 0) formData.append('image', file); // first image as main
            });
        }
        try {
            await api.post('/boxes/owner/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchOwnerBoxes();
            return { success: true };
        } catch (err) {
            console.error('Error adding box:', err.response?.data);
            const errorMessage = err.response?.data?.detail || Object.values(err.response?.data || {})[0]?.[0] || 'Failed to add the box.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []); // fetchOwnerBoxes is defined below

    const fetchOwnerBoxes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/boxes/owner/');
            console.log('Owner boxes fetched:', response.data);
            setOwnerBoxes(processBoxData(response.data.results || response.data));
        } catch (err) {
            console.error('Error fetching owner boxes:', err);
            setError('Could not load your boxes.');
        } finally {
            setLoading(false);
        }
    }, [processBoxData]);

    const fetchNearbyBoxes = useCallback(async (latitude, longitude, radius = 10) => {
        // Add validation
        if (!latitude || !longitude) {
            console.error('fetchNearbyBoxes: Missing latitude or longitude', { latitude, longitude });
            setError('Invalid location data for nearby search.');
            return;
        }
        
        setLoading(true);
        try {
            console.log('fetchNearbyBoxes: Making API call with params:', { lat: latitude, lng: longitude, radius });
            const response = await api.get('/boxes/public/nearby/', { 
                params: { lat: latitude, lng: longitude, radius: radius || 10 }
            });
            setNearbyBoxes(processBoxData(response.data));
        } catch (err) {
            console.error('Error fetching nearby boxes:', err);
            setError('Could not load nearby boxes.');
        } finally {
            setLoading(false);
        }
    }, [processBoxData]);

    const fetchBoxes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('BoxContext: Making API call with params:', filters);
            
            // Single API call - no pagination needed since API returns all results
            const response = await api.get('/boxes/public/', { params: filters });
            const data = response.data;
            
            console.log('BoxContext: API Response - Count:', data.count, 'Results:', data.results?.length || 0);
            console.log('BoxContext: First 5 Box IDs:', data.results?.slice(0, 5)?.map(box => box.id) || []);
            
            // Handle response
            const boxesArray = data.results || data;
            if (!Array.isArray(boxesArray)) {
                console.error('BoxContext: Invalid response format - not an array:', boxesArray);
                setError('Invalid response format from server');
                return;
            }
            
            const processedBoxes = processBoxData(boxesArray);
            console.log('BoxContext: Processed boxes:', processedBoxes.length);
            setBoxes(processedBoxes);
            
        } catch (err) {
            console.error('BoxContext: Error fetching boxes:', err);
            if (err.response) {
                console.error('BoxContext: Response status:', err.response.status);
                console.error('BoxContext: Response data:', err.response.data);
            }
            setError('Could not load boxes. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [filters, processBoxData]);

    const fetchFeaturedBoxes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/boxes/public/featured/');
            setFeaturedBoxes(processBoxData(response.data));
        } catch (err) {
            console.error('Error fetching featured boxes:', err);
            setError('Could not load featured boxes.');
        } finally {
            setLoading(false);
        }
    }, [processBoxData]);

    const fetchPopularBoxes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/boxes/public/popular/');
            setPopularBoxes(processBoxData(response.data));
        } catch (err) {
            console.error('Error fetching popular boxes:', err);
            setError('Could not load popular boxes.');
        } finally {
            setLoading(false);
        }
    }, [processBoxData]);

    // Fetch boxes when filters change
    useEffect(() => {
        console.log('BoxContext: Filters changed, fetching boxes with filters:', filters);
        fetchBoxes();
    }, [fetchBoxes]);

    const contextValue = {
        boxes,
        featuredBoxes,
        popularBoxes,
        nearbyBoxes,
        ownerBoxes,
        loading,
        error,
        fetchBoxes,
        fetchFeaturedBoxes,
        fetchPopularBoxes,
        fetchNearbyBoxes,
        fetchOwnerBoxes,
        addBox,
        filters,
        setFilters,
        clearFiltersAndRefresh: () => {
            console.log('BoxContext: Clearing filters and refreshing...');
            // Reset filters to empty state
            setFilters({});
            // Force immediate refresh
            setLoading(true);
            setError(null);
        },
        refreshAll: () => {
            fetchBoxes();
            fetchFeaturedBoxes();
            fetchPopularBoxes();
            fetchOwnerBoxes();
        }
    };

    return (
        <BoxContext.Provider value={contextValue}>
            {children}
        </BoxContext.Provider>
    );
};