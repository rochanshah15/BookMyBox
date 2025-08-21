import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'// Ensure correct path
import { AuthProvider } from './api.jsx'
import { BoxProvider } from './context/BoxContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import 'leaflet/dist/leaflet.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Don't render GoogleOAuthProvider if no valid client ID
const isGoogleConfigured = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "your_actual_client_id_here";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isGoogleConfigured ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <AuthProvider>
            <BoxProvider>
              <BookingProvider>
                <App />
              </BookingProvider>
            </BoxProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    ) : (
      <BrowserRouter>
        <AuthProvider>
          <BoxProvider>
            <BookingProvider>
              <App />
            </BookingProvider>
          </BoxProvider>
        </AuthProvider>
      </BrowserRouter>
    )}
  </StrictMode>,
)