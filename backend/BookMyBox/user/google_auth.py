# user/google_auth.py

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
import secrets
import string

User = get_user_model()


class GoogleAuthSerializer(serializers.Serializer):
    """
    Handles Google OAuth authentication and user creation/login
    """
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    google_id = serializers.CharField(max_length=255)
    profile_picture = serializers.URLField(required=False, allow_null=True)

    def validate_email(self, value):
        return value.lower()

    def create_or_get_user(self, validated_data):
        """
        Create user if doesn't exist, or return existing user
        """
        email = validated_data['email']
        
        try:
            # Try to get existing user
            user = User.objects.get(email=email)
            
            # If user exists but was created normally (not via Google)
            # we can still log them in if emails match
            is_new_user = False
            
        except User.objects.DoesNotExist:
            # Create new user with Google data
            # Generate random password since Google users don't need it
            random_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
            
            user = User.objects.create_user(
                email=email,
                username=email,  # Use email as username
                first_name=validated_data['first_name'],
                last_name=validated_data.get('last_name', ''),
                password=random_password,
                is_verified=True,  # Google accounts are pre-verified
                # Set default values for required fields
                role='user',  # Default role, can be changed later
                phone='',  # Will be collected in onboarding
                location='',  # Will be collected in onboarding
            )
            
            is_new_user = True

        return user, is_new_user

    def get_tokens(self, user):
        """Generate JWT tokens for the user"""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def to_representation(self, instance):
        user, is_new_user = self.create_or_get_user(self.validated_data)
        tokens = self.get_tokens(user)
        
        return {
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'is_new_user': is_new_user,
            'needs_onboarding': self.needs_onboarding(user),
        }

    def needs_onboarding(self, user):
        """
        Check if user needs to complete onboarding
        Missing: phone, location, role (if still default), business_name (for owners)
        """
        missing_fields = []
        
        if not user.phone:
            missing_fields.append('phone')
        if not user.location:
            missing_fields.append('location')
        if user.role == 'user':
            # Ask if they want to be owner instead
            missing_fields.append('role_confirmation')
        if user.role == 'owner' and not user.business_name:
            missing_fields.append('business_name')
            
        return len(missing_fields) > 0
