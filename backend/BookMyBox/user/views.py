# user/views.py

from django.conf import settings
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate

from .models import User
from .serializers import (
    UserRegistrationSerializer,
    # UserLoginSerializer,  # <--- CONFIRMED: This line should be commented out or removed
    UserSerializer,
    UserUpdateSerializer,
    PasswordChangeSerializer,
    CustomTokenObtainPairSerializer, # <--- CORRECTED: This now matches the name in serializers.py
)
from .google_auth import GoogleAuthSerializer

# --- Simple JWT Custom Login View ---
# This is the PRIMARY view for user login and token generation.
# It uses CustomTokenObtainPairSerializer to handle email-based authentication
# and return user data along with tokens.
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Takes a set of user credentials (email and password) and returns the
    access and refresh JWTs, along with serialized user data (including role).
    """
    serializer_class = CustomTokenObtainPairSerializer # Use your custom serializer


# --- Google OAuth Login/Signup Endpoint ---
@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Handles Google OAuth authentication.
    Creates new user or logs in existing user.
    """
    serializer = GoogleAuthSerializer(data=request.data)
    if serializer.is_valid():
        result = serializer.to_representation(serializer.validated_data)
        
        if result.get('is_new_user'):
            return Response({
                'success': True,
                'message': 'Account created successfully with Google',
                'user': result['user'],
                'tokens': result['tokens'],
                'is_new_user': True,
                'needs_onboarding': result['needs_onboarding']
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': True,
                'message': 'Logged in successfully with Google',
                'user': result['user'],
                'tokens': result['tokens'],
                'is_new_user': False,
                'needs_onboarding': result['needs_onboarding']
            }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# --- Onboarding Completion Endpoint ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_onboarding(request):
    """
    Completes user onboarding by collecting missing required fields
    """
    user = request.user
    data = request.data
    
    # Validate required fields based on role
    errors = {}
    
    if 'phone' in data:
        phone = data['phone']
        if phone:
            digits_only = ''.join(filter(str.isdigit, phone))
            if len(digits_only) != 10:
                errors['phone'] = 'Phone number must be 10 digits'
            else:
                user.phone = phone
    
    if 'location' in data and data['location']:
        user.location = data['location']
    else:
        errors['location'] = 'Location is required'
    
    if 'role' in data:
        if data['role'] in ['user', 'owner']:
            user.role = data['role']
        else:
            errors['role'] = 'Invalid role'
    
    if user.role == 'owner':
        if 'business_name' in data and data['business_name']:
            user.business_name = data['business_name']
        else:
            errors['business_name'] = 'Business name is required for owners'
    
    if errors:
        return Response({
            'success': False,
            'errors': errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user.save()
    
    return Response({
        'success': True,
        'message': 'Onboarding completed successfully',
        'user': UserSerializer(user).data
    }, status=status.HTTP_200_OK)


# --- User Registration Endpoint ---
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Handles new user registration.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Generate tokens for the newly registered user
        refresh = RefreshToken.for_user(user)

        return Response({
            'success': True,
            'message': 'User registered successfully',
            'user': UserSerializer(user).data, # Full user data, including role
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# --- User Logout Endpoint ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Blacklists the provided refresh token, effectively logging the user out.
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist() # Blacklist the refresh token to invalidate it

        return Response({
            'success': True,
            'message': 'Successfully logged out'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        # Catch exceptions (e.g., malformed token) and return an error
        return Response({
            'success': False,
            'error': f'Invalid token or logout failed: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


# --- Get Current User Profile ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    Retrieves the authenticated user's profile data.
    """
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'user': serializer.data
    })


# --- Update Current User Profile ---
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Updates the authenticated user's profile information.
    """
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': UserSerializer(request.user).data # Return updated user data
        })

    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# --- Change User Password ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Allows an authenticated user to change their password.
    """
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        })

    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# --- Get Demo Credentials (Optional) ---
@api_view(['GET'])
@permission_classes([AllowAny])
def demo_credentials(request):
    """
    Provides demo user credentials for testing purposes (if configured in settings).
    """
    return Response({
        'success': True,
        'demo_credentials': getattr(settings, 'DEMO_CREDENTIALS', {})
    })


# --- User Dashboard Data Endpoint ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard_data(request):
    """
    Retrieves dashboard-specific data based on the authenticated user's role.
    Placeholders for actual data are included.
    """
    user = request.user

    dashboard_data = {
        'user': UserSerializer(user).data, # User data including role
        'stats': {},
        'recent_activity': [],
        'permissions': []
    }

    # Role-based dashboard data logic (add your actual data retrieval here)
    if user.role == 'admin':
        dashboard_data['stats'] = {
            'total_users': User.objects.count(),
            'total_owners': User.objects.filter(role='owner').count(),
            'total_facilities': 0, # Example placeholder
            'total_bookings': 0,  # Example placeholder
        }
        dashboard_data['permissions'] = ['manage_users', 'manage_facilities', 'view_analytics']

    elif user.role == 'owner':
        dashboard_data['stats'] = {
            'my_facilities': 0,  # Example placeholder
            'total_bookings': 0,  # Example placeholder
            'revenue': 0,         # Example placeholder
            'active_bookings': 0, # Example placeholder
        }
        dashboard_data['permissions'] = ['manage_own_facilities', 'view_bookings']

    else:  # 'user' role or any other default
        dashboard_data['stats'] = {
            'my_bookings': 0,     # Example placeholder
            'upcoming_bookings': 0, # Example placeholder
            'favorite_facilities': 0, # Example placeholder
            'total_spent': 0,       # Example placeholder
        }
        dashboard_data['permissions'] = ['book_facilities', 'view_own_bookings']

    return Response({
        'success': True,
        'dashboard': dashboard_data
    })


# --- Class-Based Views for User Listing and Detail ---
class UserListView(generics.ListAPIView):
    """
    Lists all users (for admins) or only the authenticated user (for non-admins).
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admins can see all users, others can only see their own profile in a list context
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id) # Non-admins retrieve only themselves


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates, or deletes a specific user by ID.
    Access is restricted to admins or the user owning the profile.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk' # Assumes primary key is used for lookup

    def get_queryset(self):
        # Admins can interact with any user profile.
        # Non-admins can only interact with their own profile.
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)