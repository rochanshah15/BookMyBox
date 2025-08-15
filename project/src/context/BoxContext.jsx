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
            await api.post('/boxes/owner/boxes/', formData, {
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
            const response = await api.get('/boxes/owner/boxes/');
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
        setLoading(true);
        try {
            const response = await api.get('/boxes/boxes/nearby/', { 
                params: { lat: latitude, lng: longitude, radius } 
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
            const response = await api.get('/boxes/boxes/', { params: filters });
            const boxesData = processBoxData(response.data.results || response.data);
            setBoxes(boxesData);
        } catch (err) {
            console.error('Error fetching boxes:', err);
            setError('Could not load boxes.');
        } finally {
            setLoading(false);
        }
    }, [filters, processBoxData]);

    const fetchFeaturedBoxes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/boxes/boxes/featured/');
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
            const response = await api.get('/boxes/boxes/popular/');
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
        fetchBoxes();
    }, [filters, fetchBoxes]);

    // Initial fetch on component mount (for when no filters are set initially)
    useEffect(() => {
        if (Object.keys(filters).length === 0) {
            fetchBoxes();
        }
    }, []); // Run once on mount

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