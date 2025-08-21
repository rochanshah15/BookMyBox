import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
from .models import ChatConversation, ChatMessage
import json
import os
import uuid

# Configure Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY', 'your_gemini_api_key_here'))

# Project context for BookMyBox
PROJECT_CONTEXT = """
You are a helpful AI assistant for BookMyBox, a sports facility booking platform. Here's the key information about our platform:

ABOUT BOOKMYBOX:
- BookMyBox is a comprehensive sports facility booking platform
- Users can book sports boxes/facilities for various sports like cricket, football, badminton, etc.
- Platform serves both facility owners and users who want to book sports facilities

KEY FEATURES:
1. Box Browsing & Booking:
   - Users can browse available sports boxes with filters (location, price, capacity, sport type)
   - Real-time availability checking with time slot booking
   - Interactive map view with radius-based search (5-100km)
   - Grid and list view options for browsing boxes

2. User Management:
   - User registration and authentication
   - User profiles and dashboard
   - Favorites system for saving preferred boxes
   - Booking history and management

3. Owner Dashboard:
   - Facility owners can list their sports boxes
   - Manage bookings, pricing, and availability
   - Upload images and manage amenities
   - View analytics and earnings

4. Payment & Booking:
   - Secure booking system with time slot management
   - Pricing per hour with duration selection
   - Free cancellation up to 2 hours before booking
   - Real-time slot availability updates

5. Location Services:
   - GPS-based location detection
   - Distance calculations using Haversine formula
   - Nearby boxes feature with radius control
   - Interactive maps with custom markers

TECHNICAL DETAILS:
- Frontend: React with modern UI, animations using Framer Motion
- Backend: Django REST API
- Database: SQLite with proper models for users, boxes, bookings
- Maps: OpenStreetMap integration with react-leaflet
- Authentication: JWT-based user authentication

TYPICAL USER WORKFLOWS:
1. Browse boxes → Filter by location/sport → View details → Check availability → Book
2. Register/Login → Browse nearby boxes → Add to favorites → Book preferred slots
3. Owner registration → Add facility → Manage bookings → View earnings

PRICING & POLICIES:
- Hourly booking system
- Prices vary by facility and location
- Free cancellation policy (up to 2 hours before)
- Secure payment processing

When answering user questions:
- Be helpful and specific to BookMyBox features
- Provide step-by-step guidance for booking processes
- Mention relevant features like favorites, map view, time slots
- Always maintain a friendly, professional tone
- If asked about technical issues, suggest contacting support
- For booking questions, explain the real-time availability system
"""

@csrf_exempt
@require_http_methods(["POST"])
def chatbot_response(request):
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        conversation_history = data.get('conversation_history', [])
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        print(f"DEBUG: Received message: {user_message}")
        print(f"DEBUG: Session ID: {session_id}")
        
        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # Check if API key is configured
        api_key = os.getenv('GEMINI_API_KEY')
        print(f"DEBUG: API key configured: {bool(api_key and api_key != 'your_gemini_api_key_here')}")
        
        if not api_key or api_key == 'your_gemini_api_key_here':
            return JsonResponse({
                'response': "I'm sorry, the AI service is not properly configured. Please contact the administrator.",
                'status': 'error'
            }, status=500)

        # Get or create conversation
        conversation, created = ChatConversation.objects.get_or_create(
            session_id=session_id,
            defaults={'user': request.user if request.user.is_authenticated else None}
        )

        # Save user message
        user_chat_message = ChatMessage.objects.create(
            conversation=conversation,
            message_type='user',
            content=user_message
        )

        # Create the model
        print("DEBUG: Creating Gemini model...")
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Build conversation context
        conversation_context = ""
        for msg in conversation_history[-5:]:  # Last 5 messages for context
            role = "User" if msg['type'] == 'user' else "Assistant"
            conversation_context += f"{role}: {msg['content']}\n"

        # Create the prompt with project context
        prompt = f"""
{PROJECT_CONTEXT}

CONVERSATION HISTORY:
{conversation_context}

Current User Question: {user_message}

Please provide a helpful, accurate response based on the BookMyBox platform context above. Be specific to our features and guide users appropriately. Keep responses concise but informative.
"""

        # Generate response
        print("DEBUG: Generating response with Gemini...")
        response = model.generate_content(prompt)
        bot_response = response.text
        print(f"DEBUG: Generated response: {bot_response[:100]}...")
        
        # Save bot response
        bot_chat_message = ChatMessage.objects.create(
            conversation=conversation,
            message_type='bot',
            content=bot_response
        )
        
        return JsonResponse({
            'response': bot_response,
            'session_id': session_id,
            'status': 'success'
        })

    except Exception as e:
        print(f"Chatbot error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'response': "I'm sorry, I'm experiencing some technical difficulties. Please try again later or contact our support team for assistance.",
            'status': 'error'
        }, status=500)
