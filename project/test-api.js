// Test API connection
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testBoxesAPI() {
  try {
    console.log('Testing API connection...');
    const response = await api.get('/boxes/boxes/');
    console.log('API Response Status:', response.status);
    console.log('API Response Data Length:', response.data.results?.length || 0);
    console.log('First Box:', response.data.results?.[0]?.name || 'No boxes found');
    return true;
  } catch (error) {
    console.error('API Test Failed:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    return false;
  }
}

testBoxesAPI();
