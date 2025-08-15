import React, { useState, useEffect } from 'react';
import { api } from '../api.jsx';

const TestAPI = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testFetch = async () => {
      console.log('TestAPI: Starting fetch...');
      try {
        const response = await api.get('/boxes/boxes/');
        console.log('TestAPI: Response received:', response.data);
        setBoxes(response.data.results || []);
      } catch (err) {
        console.error('TestAPI: Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testFetch();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test API - Boxes Count: {boxes.length}</h1>
      {boxes.slice(0, 3).map(box => (
        <div key={box.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{box.name}</h3>
          <p>Sport: {box.sport}</p>
          <p>Location: {box.location}</p>
          <p>Price: ₹{box.price}/hr</p>
        </div>
      ))}
    </div>
  );
};

export default TestAPI;
