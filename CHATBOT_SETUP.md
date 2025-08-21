# ChatBot Setup Instructions

## 🤖 BookMyBox AI Chatbot Feature

The chatbot has been successfully integrated into your BookMyBox platform! Here's how to complete the setup:

### 📋 Setup Steps

1. **Get Your Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Configure the API Key:**
   - Open the file: `backend/BookMyBox/.env`
   - Replace `your_actual_gemini_api_key_here` with your actual Gemini API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Restart the Backend Server:**
   - Stop the Django server (Ctrl+C)
   - Start it again: `python manage.py runserver`

### ✨ Features

- **Contextual Responses:** The chatbot understands your BookMyBox platform
- **Project-Specific Knowledge:** Knows about booking, facilities, pricing, etc.
- **Modern UI:** Floating chat icon with smooth animations
- **Conversation Memory:** Maintains context across messages
- **Responsive Design:** Works on all screen sizes

### 🎯 What the Chatbot Can Help With

- **Booking Process:** How to book sports facilities
- **Platform Features:** Favorites, maps, filters, time slots
- **Pricing Information:** Hourly rates, cancellation policies
- **Technical Support:** Navigation and feature explanations
- **General Queries:** About your sports booking platform

### 🔧 Technical Details

- **Frontend:** React component with Framer Motion animations
- **Backend:** Django REST API with Gemini AI integration
- **Location:** Chat icon appears on Home page (bottom-right)
- **Context:** Includes comprehensive platform knowledge

### 🚀 Usage

1. Visit your Home page
2. Look for the floating chat icon in the bottom-right corner
3. Click to open the chat window
4. Ask any questions about BookMyBox!

### 🔒 Security

- API key is stored securely in environment variables
- .env file should be added to .gitignore
- No sensitive data is logged or stored

Enjoy your new AI-powered customer support! 🎉
